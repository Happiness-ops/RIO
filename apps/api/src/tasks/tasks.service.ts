import {
  Injectable, NotFoundException, ForbiddenException, UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';
import {
  CreateTaskDto, UpdateTaskDto, ReorderTasksDto, TasksQueryDto,
} from './dto/tasks.dto';
import { paginationMeta } from '@/common/types/response.helper';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // Create
  // ─────────────────────────────────────────────────────────────────────────
  async create(userId: string, dto: CreateTaskDto) {
    // Verify goalId belongs to this user if provided
    if (dto.goalId) {
      const goal = await this.prisma.goal.findUnique({
        where: { id: dto.goalId }, select: { userId: true },
      });
      if (!goal)             throw new NotFoundException('Goal not found');
      if (goal.userId !== userId) throw new ForbiddenException('Access denied');
    }

    // New task goes to the bottom of its priority tier
    const maxPositionRecord = await this.prisma.task.findFirst({
      where:   { userId, priority: dto.priority ?? 'important', isArchived: false },
      orderBy: { position: 'desc' },
      select:  { position: true },
    });
    const position = (maxPositionRecord?.position ?? -1) + 1;

    const task = await this.prisma.task.create({
      data: {
        userId,
        title:       dto.title,
        description: dto.description,
        priority:    dto.priority ?? 'important',
        position,
        goalId:      dto.goalId ?? null,
        dueDate:     dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });

    return this.format(task);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // List — filtered, paginated
  // ─────────────────────────────────────────────────────────────────────────
  async findAll(userId: string, query: TasksQueryDto) {
    const where: any = {
      userId,
      ...(!query.includeArchived && { isArchived: false }),
      ...(query.priority  && { priority: query.priority }),
      ...(query.status    && { status:   query.status }),
      ...(query.goalId    && { goalId:   query.goalId }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy: [{ priority: 'asc' }, { position: 'asc' }],
        take:    query.limit,
        skip:    query.offset,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks:      tasks.map(this.format),
      pagination: paginationMeta(total, query.limit, query.offset),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Single task
  // ─────────────────────────────────────────────────────────────────────────
  async findOne(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task)            throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');
    return this.format(task);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Update
  // ─────────────────────────────────────────────────────────────────────────
  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    await this.assertOwnership(userId, taskId);

    const data: any = { ...dto };

    // When status is set to completed, stamp completedAt automatically
    if (dto.status === 'completed') {
      data.completedAt = new Date();
    } else if (dto.status && dto.status !== 'completed') {
      data.completedAt = null; // Clear if moving back to non-completed
    }

    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data,
    });

    // Invalidate task analytics cache
    await this.redis.delPattern(`analytics:tasks:${userId}:*`);

    return this.format(task);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────────────────────────────────────
  async remove(userId: string, taskId: string) {
    await this.assertOwnership(userId, taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Bulk reorder — single SQL CASE WHEN transaction
  //
  // The frontend sends the new desired position of every task in a priority
  // tier after the user drag-and-drops. We update all positions atomically
  // to prevent any intermediate state with duplicate positions.
  //
  // Security: every task ID in the payload must belong to this user.
  // We reject the whole request if any foreign task ID is detected.
  // ─────────────────────────────────────────────────────────────────────────
  async reorder(userId: string, dto: ReorderTasksDto) {
    if (dto.orderedIds.length === 0) return { updated: 0 };

    const ids = dto.orderedIds.map((item) => item.id);

    // Fetch all tasks being reordered — single query
    const tasks = await this.prisma.task.findMany({
      where:  { id: { in: ids } },
      select: { id: true, userId: true },
    });

    // Verify all tasks exist
    if (tasks.length !== ids.length) {
      throw new NotFoundException('One or more tasks not found');
    }

    // Verify all tasks belong to this user — 403 if any foreign task ID detected
    const foreignTask = tasks.find((t) => t.userId !== userId);
    if (foreignTask) {
      throw new ForbiddenException('One or more tasks do not belong to you');
    }

    // Build a CASE WHEN update — single round-trip, fully atomic
    const cases = dto.orderedIds
      .map((item) => `WHEN id = '${item.id}' THEN ${item.position}`)
      .join('\n    ');

    await this.prisma.$executeRawUnsafe(`
      UPDATE tasks
      SET position = CASE
        ${cases}
        ELSE position
      END,
      "updatedAt" = now()
      WHERE id IN (${ids.map((id) => `'${id}'`).join(',')})
        AND "userId" = '${userId}'
    `);

    return { updated: ids.length };
  }

  // ─────────────────────────────────────────────────────────────────────────
  private async assertOwnership(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId }, select: { userId: true },
    });
    if (!task)            throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');
  }

  private format(task: any) {
    return {
      id:          task.id,
      title:       task.title,
      description: task.description,
      priority:    task.priority,
      position:    task.position,
      status:      task.status,
      goalId:      task.goalId,
      dueDate:     task.dueDate,
      completedAt: task.completedAt,
      isArchived:  task.isArchived,
      createdAt:   task.createdAt,
      updatedAt:   task.updatedAt,
    };
  }
}