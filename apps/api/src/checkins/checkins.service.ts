import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';
import { StreakService } from './streak.service';
import { CreateCheckinDto, CheckinsQueryDto } from './dto/checkins.dto';
import { paginationMeta } from '@/common/types/response.helper';

@Injectable()
export class CheckinsService {
  constructor(
    private readonly prisma:  PrismaService,
    private readonly redis:   RedisService,
    private readonly streaks: StreakService,
  ) {}

  async create(userId: string, habitId: string, dto: CreateCheckinDto) {
    // Verify habit ownership
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId }, select: { userId: true },
    });
    if (!habit)             throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException('Access denied');

    // Run checkin + streak update in a single transaction for atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Check for existing checkin (unique constraint also handles this at DB level)
      const existing = await tx.checkin.findUnique({
        where: { habitId_logDate: { habitId, logDate: new Date(dto.logDate) } },
      });
      if (existing) {
        throw new ConflictException('A check-in already exists for this habit on this date');
      }

      const checkin = await tx.checkin.create({
        data: {
          habitId,
          status:  dto.status,
          logDate: new Date(dto.logDate),
          note:    dto.note,
        },
      });

      // Only update streak for completed check-ins, not missed/skipped
      let streak = null;
      if (dto.status === 'completed') {
        streak = await this.streaks.updateStreak(habitId, dto.logDate, tx as any);
      }

      return { checkin, streak };
    });

    // Invalidate dashboard cache — a new check-in affects the dashboard metrics
    await this.redis.del(`dashboard:${userId}`);
    await this.redis.delPattern(`analytics:overview:${userId}:*`);

    return {
      id:      result.checkin.id,
      habitId: result.checkin.habitId,
      status:  result.checkin.status,
      logDate: result.checkin.logDate,
      note:    result.checkin.note,
      streak:  result.streak
        ? {
            currentStreak: result.streak.currentStreak,
            longestStreak: result.streak.longestStreak,
          }
        : null,
      createdAt: result.checkin.createdAt,
    };
  }

  async findHistory(userId: string, habitId: string, query: CheckinsQueryDto) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId }, select: { userId: true },
    });
    if (!habit)             throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException('Access denied');

    const where: any = { habitId };
    if (query.from || query.to) {
      where.logDate = {
        ...(query.from && { gte: new Date(query.from) }),
        ...(query.to   && { lte: new Date(query.to) }),
      };
    }

    const [checkins, total] = await Promise.all([
      this.prisma.checkin.findMany({
        where,
        orderBy: { logDate: 'desc' },
        take:    query.limit,
        skip:    query.offset,
      }),
      this.prisma.checkin.count({ where }),
    ]);

    return {
      checkins,
      pagination: paginationMeta(total, query.limit, query.offset),
    };
  }
}