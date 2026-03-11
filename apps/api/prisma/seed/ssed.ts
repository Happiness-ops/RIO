// ─────────────────────────────────────────────────────────────────────────────
// RIO AI — Database Seed
// Creates realistic local development data.
// Run with: npx prisma db seed
//
// DO NOT run against production. This file is for local dev only.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient, FrequencyType, GoalType, CheckinStatus, PriorityType, TaskStatus, TriggerType } from '@prisma/client';
import { subDays, format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Clean slate ─────────────────────────────────────────────────────────────
  // Delete in reverse dependency order to avoid FK constraint errors
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.userPushSubscription.deleteMany();
  await prisma.aiInsight.deleteMany();
  await prisma.task.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('  ✓ Cleared existing data');

  // ── User 1 — Demo user with full data ───────────────────────────────────────
  const alice = await prisma.user.create({
    data: {
      email: 'alice@rioapp.io',
      authProvider: 'firebase',
      timezone: 'Africa/Lagos',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Alice Okafor',
          onboardingCompleted: true,
          preferences: {
            notificationsEnabled: true,
            theme: 'light',
            weekStartsOn: 1, // Monday
          },
        },
      },
    },
  });

  console.log(`  ✓ Created user: ${alice.email}`);

  // ── Goals ───────────────────────────────────────────────────────────────────
  const fitnessGoal = await prisma.goal.create({
    data: {
      userId: alice.id,
      title: 'Improve Physical Health',
      description: 'Build consistent exercise and recovery habits',
      type: GoalType.long_term,
      startDate: subDays(new Date(), 30),
    },
  });

  const learningGoal = await prisma.goal.create({
    data: {
      userId: alice.id,
      title: 'Learn TypeScript Deeply',
      description: 'Read, build, and practise every week',
      type: GoalType.short_term,
      startDate: subDays(new Date(), 14),
      endDate: subDays(new Date(), -60), // 60 days from now
    },
  });

  console.log('  ✓ Created goals');

  // ── Habits ──────────────────────────────────────────────────────────────────
  const morningRun = await prisma.habit.create({
    data: {
      userId: alice.id,
      goalId: fitnessGoal.id,
      title: 'Morning Run',
      frequency: FrequencyType.daily,
      frequencyDetails: {},
    },
  });

  const eveningStretch = await prisma.habit.create({
    data: {
      userId: alice.id,
      goalId: fitnessGoal.id,
      title: 'Evening Stretch',
      frequency: FrequencyType.daily,
      frequencyDetails: {},
    },
  });

  const readingHabit = await prisma.habit.create({
    data: {
      userId: alice.id,
      goalId: learningGoal.id,
      title: 'Read 10 Pages',
      frequency: FrequencyType.daily,
      frequencyDetails: {},
    },
  });

  const practiseHabit = await prisma.habit.create({
    data: {
      userId: alice.id,
      goalId: learningGoal.id,
      title: 'Code Practice (30 min)',
      frequency: FrequencyType.weekly,
      frequencyDetails: { daysOfWeek: [1, 3, 5] }, // Mon, Wed, Fri
    },
  });

  console.log('  ✓ Created habits');

  // ── Check-ins and Streaks ───────────────────────────────────────────────────
  // Morning Run — strong streak (last 12 days, missed day 5 ago)
  const runCheckins = [0,1,2,3,4,6,7,8,9,10,11,12].map(daysAgo => ({
    habitId: morningRun.id,
    status: CheckinStatus.completed,
    logDate: subDays(new Date(), daysAgo),
  }));
  // Day 5 ago was missed
  runCheckins.push({
    habitId: morningRun.id,
    status: CheckinStatus.missed,
    logDate: subDays(new Date(), 5),
  });

  await prisma.checkin.createMany({ data: runCheckins });
  await prisma.streak.create({
    data: {
      habitId: morningRun.id,
      currentStreak: 5,
      longestStreak: 7,
      lastCheckinDate: new Date(),
    },
  });

  // Evening Stretch — modest streak (last 3 days)
  await prisma.checkin.createMany({
    data: [0,1,2].map(daysAgo => ({
      habitId: eveningStretch.id,
      status: CheckinStatus.completed,
      logDate: subDays(new Date(), daysAgo),
    })),
  });
  await prisma.streak.create({
    data: {
      habitId: eveningStretch.id,
      currentStreak: 3,
      longestStreak: 3,
      lastCheckinDate: new Date(),
    },
  });

  // Reading — completed every day for 14 days
  await prisma.checkin.createMany({
    data: Array.from({ length: 14 }, (_, i) => ({
      habitId: readingHabit.id,
      status: CheckinStatus.completed,
      logDate: subDays(new Date(), i),
    })),
  });
  await prisma.streak.create({
    data: {
      habitId: readingHabit.id,
      currentStreak: 14,
      longestStreak: 14,
      lastCheckinDate: new Date(),
    },
  });

  // Code Practice — missed yesterday (streak at risk)
  await prisma.checkin.createMany({
    data: [2,3,5,7].map(daysAgo => ({
      habitId: practiseHabit.id,
      status: CheckinStatus.completed,
      logDate: subDays(new Date(), daysAgo),
    })),
  });
  await prisma.streak.create({
    data: {
      habitId: practiseHabit.id,
      currentStreak: 1,
      longestStreak: 3,
      lastCheckinDate: subDays(new Date(), 2),
    },
  });

  console.log('  ✓ Created check-ins and streaks');

  // ── Tasks ───────────────────────────────────────────────────────────────────
  await prisma.task.createMany({
    data: [
      {
        userId: alice.id,
        goalId: learningGoal.id,
        title: 'Finish TypeScript Generics chapter',
        priority: PriorityType.critical,
        position: 0,
        status: TaskStatus.in_progress,
        dueDate: subDays(new Date(), -1), // tomorrow
      },
      {
        userId: alice.id,
        goalId: fitnessGoal.id,
        title: 'Book physio appointment',
        priority: PriorityType.essential,
        position: 0,
        status: TaskStatus.todo,
        dueDate: subDays(new Date(), -3),
      },
      {
        userId: alice.id,
        goalId: null,
        title: 'Review team pull requests',
        priority: PriorityType.important,
        position: 0,
        status: TaskStatus.todo,
      },
      {
        userId: alice.id,
        goalId: null,
        title: 'Organise desktop files',
        priority: PriorityType.nice_to_have,
        position: 0,
        status: TaskStatus.todo,
      },
      {
        userId: alice.id,
        goalId: null,
        title: 'Learn Rust someday',
        priority: PriorityType.someday,
        position: 0,
        status: TaskStatus.todo,
      },
      {
        userId: alice.id,
        goalId: learningGoal.id,
        title: 'Complete NestJS Fundamentals course',
        priority: PriorityType.essential,
        position: 1,
        status: TaskStatus.completed,
        completedAt: subDays(new Date(), 2),
      },
    ],
  });

  console.log('  ✓ Created tasks');

  // ── AI Insights ─────────────────────────────────────────────────────────────
  await prisma.aiInsight.createMany({
    data: [
      {
        userId: alice.id,
        triggerType: TriggerType.momentum,
        headline: 'You Are On A Roll!',
        message: 'You have read 10 pages every single day for 14 days. That is exceptional consistency — keep the momentum going today.',
        cta: 'Log Today\'s Read',
        isRead: false,
        generatedAt: new Date(),
      },
      {
        userId: alice.id,
        triggerType: TriggerType.streak_risk,
        headline: 'Your Streak Is At Risk',
        message: 'Your Code Practice streak is counting on you. You missed yesterday — do not let two days become a habit.',
        cta: 'Code For 30 Min',
        isRead: true,
        generatedAt: subDays(new Date(), 1),
      },
      {
        userId: alice.id,
        triggerType: TriggerType.fallback,
        headline: 'Small Steps, Big Results',
        message: 'Progress is not always visible day to day. Trust the system you have built. Show up today.',
        cta: 'Check In Now',
        isRead: true,
        generatedAt: subDays(new Date(), 2),
      },
    ],
  });

  console.log('  ✓ Created AI insights');

  // ── User 2 — Fresh user (no data, testing onboarding flow) ──────────────────
  const bob = await prisma.user.create({
    data: {
      email: 'bob@rioapp.io',
      authProvider: 'auth0',
      timezone: 'Europe/London',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Bob Chen',
          onboardingCompleted: false,
          preferences: {},
        },
      },
    },
  });

  console.log(`  ✓ Created user: ${bob.email} (new — onboarding not complete)`);

  // ── Community (v2 placeholder) ───────────────────────────────────────────────
  const community = await prisma.community.create({
    data: {
      name: 'RIO Early Adopters',
      description: 'First users of the RIO AI platform',
      isPublic: false,
    },
  });

  await prisma.communityMember.create({
    data: {
      userId: alice.id,
      communityId: community.id,
      role: 'admin',
    },
  });

  console.log('  ✓ Created community (v2 placeholder)');

  // ── Summary ─────────────────────────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.goal.count(),
    prisma.habit.count(),
    prisma.checkin.count(),
    prisma.task.count(),
    prisma.aiInsight.count(),
  ]);

  console.log('\n📊 Seed complete:');
  console.log(`   Users:    ${counts[0]}`);
  console.log(`   Goals:    ${counts[1]}`);
  console.log(`   Habits:   ${counts[2]}`);
  console.log(`   Checkins: ${counts[3]}`);
  console.log(`   Tasks:    ${counts[4]}`);
  console.log(`   Insights: ${counts[5]}`);
  console.log('\n🔑 Test credentials:');
  console.log('   alice@rioapp.io  — full data, Africa/Lagos timezone');
  console.log('   bob@rioapp.io    — new user, onboarding incomplete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });