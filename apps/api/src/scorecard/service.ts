import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import {
  CreateScorecardEntryDto, UpdateScorecardEntryDto, ConvertToHabitDto,
} from './dto/scorecard.dto';

const MAX_SCORECARD_ENTRIES = 10;

@Injectable()
export class ScorecardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /scorecard
   * Returns all scorecard entries for the user, grouped by classification.
   * Used on the Awareness screen before goal creation.
   */
  async getScorecard(userId: string) {
    const entries = await this.prisma.habitScorecard.findMany({
      where:   { userId },
      include: { convertedHabit: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'asc' },
    });

    // Group by classification for the summary view
    const grouped = {
      reinforcing: entries.filter((e) => e.classification === 'reinforcing'),
      neutral:     entries.filter((e) => e.classification === 'neutral'),
      conflicting: entries.filter((e) => e.classification === 'conflicting'),
    };

    return {
      entries,
      summary: {
        total:        entries.length,
        reinforcing:  grouped.reinforcing.length,
        neutral:      grouped.neutral.length,
        conflicting:  grouped.conflicting.length,
        // The identity this scorecard suggests based on what's reinforcing
        identitySignal: grouped.reinforcing.length > 0
          ? `You are already reinforcing ${grouped.reinforcing.length} positive behavior${grouped.reinforcing.length > 1 ? 's' : ''}.`
          : null,
      },
    };
  }

  /**
   * POST /scorecard
   * Add a behavior to the scorecard. Max 10 entries.
   */
  async addEntry(userId: string, dto: CreateScorecardEntryDto) {
    const count = await this.prisma.habitScorecard.count({ where: { userId } });
    if (count >= MAX_SCORECARD_ENTRIES) {
      throw new BadRequestException(
        `Scorecard is limited to ${MAX_SCORECARD_ENTRIES} behaviors. ` +
        `Review and remove existing entries before adding more.`,
      );
    }

    const entry = await this.prisma.habitScorecard.create({
      data: { userId, behavior: dto.behavior, classification: dto.classification },
    });
    return entry;
  }

  /**
   * PATCH /scorecard/:entryId
   * Update the classification of an existing entry.
   */
  async updateEntry(userId: string, entryId: string, dto: UpdateScorecardEntryDto) {
    await this.assertOwnership(userId, entryId);
    return this.prisma.habitScorecard.update({
      where: { id: entryId },
      data:  dto,
    });
  }

  /**
   * DELETE /scorecard/:entryId
   */
  async deleteEntry(userId: string, entryId: string) {
    await this.assertOwnership(userId, entryId);
    await this.prisma.habitScorecard.delete({ where: { id: entryId } });
  }

  /**
   * POST /scorecard/:entryId/convert
   *
   * Epic 2.2 — Promote a reinforcing scorecard entry into a tracked habit.
   * Links the scorecard entry to the new habit so the UI can show the connection.
   */
  async convertToHabit(userId: string, entryId: string, dto: ConvertToHabitDto) {
    const entry = await this.prisma.habitScorecard.findUnique({ where: { id: entryId } });
    if (!entry)              throw new NotFoundException('Scorecard entry not found');
    if (entry.userId !== userId) throw new ForbiddenException('Access denied');

    if (entry.convertedHabitId) {
      throw new BadRequestException('This behavior has already been converted to a habit.');
    }

    if (entry.classification === 'conflicting') {
      throw new BadRequestException(
        'Conflicting behaviors cannot be directly converted to habits. ' +
        'Reclassify as reinforcing first if your intent has changed.',
      );
    }

    // Verify goal ownership
    const goal = await this.prisma.goal.findUnique({
      where: { id: dto.goalId }, select: { userId: true },
    });
    if (!goal)             throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');

    // Create the habit and link it back to the scorecard entry in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const habit = await tx.habit.create({
        data: {
          userId,
          goalId:    dto.goalId,
          title:     dto.title ?? entry.behavior,
          frequency: 'daily',
        },
      });

      await tx.streak.create({
        data: { habitId: habit.id, currentStreak: 0, longestStreak: 0 },
      });

      const updated = await tx.habitScorecard.update({
        where: { id: entryId },
        data:  { convertedHabitId: habit.id },
      });

      return { habit, scorecardEntry: updated };
    });

    return result;
  }

  private async assertOwnership(userId: string, entryId: string) {
    const entry = await this.prisma.habitScorecard.findUnique({
      where: { id: entryId }, select: { userId: true },
    });
    if (!entry)              throw new NotFoundException('Scorecard entry not found');
    if (entry.userId !== userId) throw new ForbiddenException('Access denied');
  }
}