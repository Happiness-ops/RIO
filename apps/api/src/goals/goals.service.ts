import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateGoalDto, UpdateGoalDto, GoalsQueryDto } from './dto/goals.dto';
import { paginationMeta } from '@/common/types/response.helper';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateGoalDto) {
    const goal = await this.prisma.goal.create({
      data: {
        userId,
        title:       dto.title,
        description: dto.description,
        type:        dto.type,
        startDate:   dto.startDate ? new Date(dto.startDate) : null,
        endDate:     dto.endDate   ? new Date(dto.endDate)   : null,
      },
    });
    return this.format(goal);
  }

  async findAll(userId: string, query: GoalsQueryDto) {
    const where = {
      userId,
      ...(!query.includeArchived && { isArchived: false }),
    };

    const [goals, total] = await Promise.all([
      this.prisma.goal.findMany({
        where,
        include: { _count: { select: { habits: true } } },
        orderBy: { createdAt: 'desc' },
        take:    query.limit,
        skip:    query.offset,
      }),
      this.prisma.goal.count({ where }),
    ]);

    return {
      goals: goals.map(this.format),
      pagination: paginationMeta(total, query.limit, query.offset),
    };
  }

  async findOne(userId: string, goalId: string) {
    const goal = await this.prisma.goal.findUnique({
      where:   { id: goalId },
      include: { habits: { where: { isArchived: false } } },
    });

    if (!goal)            throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');

    return this.format(goal);
  }

  async update(userId: string, goalId: string, dto: UpdateGoalDto) {
    await this.assertOwnership(userId, goalId);

    const goal = await this.prisma.goal.update({
      where: { id: goalId },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate:   dto.endDate   ? new Date(dto.endDate)   : undefined,
      },
    });
    return this.format(goal);
  }

  async remove(userId: string, goalId: string) {
    await this.assertOwnership(userId, goalId);
    // Prisma cascade handles deleting habits, checkins, streaks, tasks(SET NULL)
    await this.prisma.goal.delete({ where: { id: goalId } });
  }

  private async assertOwnership(userId: string, goalId: string) {
    const goal = await this.prisma.goal.findUnique({
      where:  { id: goalId },
      select: { userId: true },
    });
    if (!goal)            throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');
  }

  private format(goal: any) {
    return {
      id:          goal.id,
      title:       goal.title,
      description: goal.description,
      type:        goal.type,
      startDate:   goal.startDate,
      endDate:     goal.endDate,
      isArchived:  goal.isArchived,
      habitCount:  goal._count?.habits ?? goal.habits?.length ?? undefined,
      habits:      goal.habits ?? undefined,
      createdAt:   goal.createdAt,
      updatedAt:   goal.updatedAt,
    };
  }
}