import {
  Injectable, NotFoundException, ForbiddenException,
  UnprocessableEntityException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { CreateHabitDto, UpdateHabitDto, HabitsQueryDto } from './dto/habits.dto';
import { paginationMeta } from '@/common/types/response.helper';

// Epic 4.3 — friction guard thresholds
const MAX_DAILY_HABITS   = 5;
const MAX_DURATION_MINS  = 60;

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateHabitDto) {
    // Verify goal ownership
    const goal = await this.prisma.goal.findUnique({
      where: { id: dto.goalId }, select: { userId: true },
    });
    if (!goal)             throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');

    // Epic 4.3 — friction guard: warn if user already has 5+ daily habits
    const dailyCount = await this.prisma.habit.count({
      where: { userId, frequency: 'daily', isArchived: false },
    });
    if (dto.frequency === 'daily' && dailyCount >= MAX_DAILY_HABITS) {
      throw new BadRequestException(
        `Habit load warning: you already have ${dailyCount} daily habits. ` +
        `Research shows >5 daily habits significantly increases burnout risk. ` +
        `Consider archiving an existing habit or making this one weekly instead.`,
      );
    }

    if (dto.estimatedDuration && dto.estimatedDuration > MAX_DURATION_MINS) {
      throw new BadRequestException(
        `Habit load warning: habits over 60 minutes are hard to sustain daily. ` +
        `Consider breaking this into smaller habits.`,
      );
    }

    // Epic 3.3 — if marking as keystone, clear any existing keystone for this user
    if (dto.isKeystone) {
      await this.prisma.habit.updateMany({
        where: { userId, isKeystone: true },
        data:  { isKeystone: false },
      });
    }

    const habit = await this.prisma.habit.create({
      data: {
        userId,
        goalId:            dto.goalId,
        title:             dto.title,
        pillar:            dto.pillar,
        isKeystone:        dto.isKeystone ?? false,
        frequency:         dto.frequency ?? 'daily',
        frequencyDetails:  dto.frequencyDetails ?? {},
        scheduledTime:     dto.scheduledTime,
        habitStackTrigger: dto.habitStackTrigger,
        estimatedDuration: dto.estimatedDuration,
      },
    });

    // Streak record created immediately — always exists 1:1 with habit
    await this.prisma.streak.create({
      data: { habitId: habit.id, currentStreak: 0, longestStreak: 0 },
    });

    return this.format(habit, null);
  }

  async findAll(userId: string, query: HabitsQueryDto) {
    const where: any = {
      userId,
      ...(query.goalId && { goalId: query.goalId }),
      ...(query.pillar && { pillar: query.pillar }),
      ...(!query.includeArchived && { isArchived: false }),
    };

    const [habits, total] = await Promise.all([
      this.prisma.habit.findMany({
        where,
        include: { streak: true },
        orderBy: [{ isKeystone: 'desc' }, { createdAt: 'asc' }], // Keystone first
        take:    query.limit,
        skip:    query.offset,
      }),
      this.prisma.habit.count({ where }),
    ]);

    return {
      habits:     habits.map((h) => this.format(h, h.streak)),
      pagination: paginationMeta(total, query.limit, query.offset),
    };
  }

  async findOne(userId: string, habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where:   { id: habitId },
      include: { streak: true },
    });
    if (!habit)            throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException('Access denied');
    return this.format(habit, habit.streak);
  }

  async update(userId: string, habitId: string, dto: UpdateHabitDto) {
    await this.assertOwnership(userId, habitId);

    // Epic 4.3 — friction guard on update
    if (dto.estimatedDuration && dto.estimatedDuration > MAX_DURATION_MINS) {
      throw new BadRequestException(
        'Habit load warning: habits over 60 minutes are hard to sustain daily.',
      );
    }

    // Epic 3.3 — keystone enforcement: clear existing keystone before setting new one
    if (dto.isKeystone === true) {
      await this.prisma.habit.updateMany({
        where: { userId, isKeystone: true, NOT: { id: habitId } },
        data:  { isKeystone: false },
      });
    }

    if (dto.goalId) {
      const goal = await this.prisma.goal.findUnique({
        where: { id: dto.goalId }, select: { userId: true },
      });
      if (!goal) throw new NotFoundException('Goal not found');
      if (goal.userId !== userId) throw new UnprocessableEntityException('Goal does not belong to you');
    }

    const habit = await this.prisma.habit.update({
      where:   { id: habitId },
      data:    dto,
      include: { streak: true },
    });
    return this.format(habit, habit.streak);
  }

  async remove(userId: string, habitId: string) {
    await this.assertOwnership(userId, habitId);
    await this.prisma.habit.delete({ where: { id: habitId } });
  }

  private async assertOwnership(userId: string, habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId }, select: { userId: true },
    });
    if (!habit)             throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException('Access denied');
  }

  private format(habit: any, streak: any) {
    return {
      id:                habit.id,
      goalId:            habit.goalId,
      title:             habit.title,
      pillar:            habit.pillar,
      isKeystone:        habit.isKeystone,
      frequency:         habit.frequency,
      frequencyDetails:  habit.frequencyDetails,
      scheduledTime:     habit.scheduledTime,
      habitStackTrigger: habit.habitStackTrigger,
      estimatedDuration: habit.estimatedDuration,
      isArchived:        habit.isArchived,
      streak: streak ? {
        currentStreak:   streak.currentStreak,
        longestStreak:   streak.longestStreak,
        lastCheckinDate: streak.lastCheckinDate,
        weeklyRecoveryUsed: streak.weeklyRecoveryUsed,
      } : null,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
    };
  }
}