import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { UpdateProfileDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where:   { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.format(user);
  }

  // Epic 8 — behavioral snapshot for profile screen
  async getBehavioralSnapshot(userId: string) {
    const [habits, recentCheckins, weeklyReviews] = await Promise.all([
      this.prisma.habit.findMany({
        where:   { userId, isArchived: false },
        include: { streak: true },
      }),
      this.prisma.checkin.findMany({
        where: {
          habit:   { userId },
          logDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.weeklyReview.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' },
        take:    4,
      }),
    ]);
 
    const keystoneHabit = habits.find((h) => h.isKeystone) ?? null;
 
    const pillarMap: Record<string, { total: number; completed: number }> = {};
    for (const habit of habits) {
      if (!habit.pillar) continue;
      if (!pillarMap[habit.pillar]) pillarMap[habit.pillar] = { total: 0, completed: 0 };
      const hCheckins = recentCheckins.filter((c) => c.habitId === habit.id);
      pillarMap[habit.pillar].total     += hCheckins.length;
      pillarMap[habit.pillar].completed += hCheckins.filter((c) => c.status === 'completed').length;
    }
 
    const pillarRates = Object.entries(pillarMap).map(([pillar, d]) => ({
      pillar,
      rate: d.total ? Math.round((d.completed / d.total) * 100) : 0,
    }));
 
    const byRateDesc = [...pillarRates].sort((a, b) => b.rate - a.rate);
    const byRateAsc  = [...pillarRates].sort((a, b) => a.rate - b.rate);
 
    const recentCompleted = recentCheckins.filter((c) => c.status === 'completed').length;
    const recentTotal     = recentCheckins.length;
    const riskScore       = recentTotal
      ? Math.round((1 - recentCompleted / recentTotal) * 100)
      : 0;
 
    return {
      activeHabits: habits.length,
      keystoneHabit: keystoneHabit ? { id: keystoneHabit.id, title: keystoneHabit.title } : null,
      strongestPillar: byRateDesc[0]?.pillar ?? null,
      weakestPillar:   byRateAsc[0]?.pillar  ?? null,
      weeklyConsistencyAverage: weeklyReviews.length
        ? Math.round(weeklyReviews.reduce((s, r) => s + r.consistencyScore, 0) / weeklyReviews.length)
        : null,
      streakAverage: habits.length
        ? Math.round(habits.reduce((s, h) => s + (h.streak?.currentStreak ?? 0), 0) / habits.length)
        : 0,
      riskScore,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const { timezone, ...profileFields } = dto;

    // Update user timezone if provided
    if (timezone) {
      await this.prisma.user.update({
        where: { id: userId },
        data:  { timezone },
      });
    }
    const profileData: any = { ...profileFields };
    if (identityStatement !== undefined) profileData.identityStatement = identityStatement;
    if (growthIntention    !== undefined) profileData.growthIntention   = growthIntention;
    if (selectedPillars    !== undefined) profileData.selectedPillars   = selectedPillars;
    // Upsert profile (handles edge case where profile row doesn't exist yet)
  
    await this.prisma.userProfile.upsert({
      where:  { userId },
      create: { userId, ...profileData },
      update: profileData,
    });
 
    return this.getProfile(userId);
  }

  async deleteAccount(userId: string) {
    // Soft-delete: mark user as unverified immediately so they cannot log in.
    // The DataErasure worker will hard-delete all data after 30 days.
    await this.prisma.user.update({
      where: { id: userId },
      data:  { isVerified: false },
    });

    // TODO Phase 4: queue DataErasure job with 30-day delay
    // await this.dataErasureQueue.add('erase', { userId }, { delay: 30 * 24 * 60 * 60 * 1000 });
  }

  private formatProfile(user: any) {
    return {
      id:                  user.id,
      email:               user.email,
      authProvider:        user.authProvider,
      timezone:            user.timezone,
      isVerified:          user.isVerified,
      fullName:            user.profile?.fullName ?? null,
      avatarUrl:           user.profile?.avatarUrl ?? null,
      bio:                 user.profile?.bio ?? null,
      identityStatement:   user.profile?.identityStatement  ?? null,
      growthIntention:     user.profile?.growthIntention    ?? null,
      selectedPillars:     user.profile?.selectedPillars    ?? [],
      onboardingCompleted: user.profile?.onboardingCompleted ?? false,
      preferences:         user.profile?.preferences ?? {},
      createdAt:           user.createdAt,
      updatedAt:           user.updatedAt,
    };
  }
}