"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// RIO AI — Database Seed
// Creates realistic local development data.
// Run with: npx prisma db seed
//
// DO NOT run against production. This file is for local dev only.
// ─────────────────────────────────────────────────────────────────────────────
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var date_fns_1 = require("date-fns");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var alice, fitnessGoal, learningGoal, morningRun, eveningStretch, readingHabit, practiseHabit, runCheckins, bob, community, counts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    // ── Clean slate ─────────────────────────────────────────────────────────────
                    // Delete in reverse dependency order to avoid FK constraint errors
                    return [4 /*yield*/, prisma.communityMember.deleteMany()];
                case 1:
                    // ── Clean slate ─────────────────────────────────────────────────────────────
                    // Delete in reverse dependency order to avoid FK constraint errors
                    _a.sent();
                    return [4 /*yield*/, prisma.community.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.userPushSubscription.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.aiInsight.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.task.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.checkin.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.streak.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.habit.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.goal.deleteMany()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma.userProfile.deleteMany()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 11:
                    _a.sent();
                    console.log('  ✓ Cleared existing data');
                    return [4 /*yield*/, prisma.user.create({
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
                        })];
                case 12:
                    alice = _a.sent();
                    console.log("  \u2713 Created user: ".concat(alice.email));
                    return [4 /*yield*/, prisma.goal.create({
                            data: {
                                userId: alice.id,
                                title: 'Improve Physical Health',
                                description: 'Build consistent exercise and recovery habits',
                                type: client_1.GoalType.long_term,
                                startDate: (0, date_fns_1.subDays)(new Date(), 30),
                            },
                        })];
                case 13:
                    fitnessGoal = _a.sent();
                    return [4 /*yield*/, prisma.goal.create({
                            data: {
                                userId: alice.id,
                                title: 'Learn TypeScript Deeply',
                                description: 'Read, build, and practise every week',
                                type: client_1.GoalType.short_term,
                                startDate: (0, date_fns_1.subDays)(new Date(), 14),
                                endDate: (0, date_fns_1.subDays)(new Date(), -60), // 60 days from now
                            },
                        })];
                case 14:
                    learningGoal = _a.sent();
                    console.log('  ✓ Created goals');
                    return [4 /*yield*/, prisma.habit.create({
                            data: {
                                userId: alice.id,
                                goalId: fitnessGoal.id,
                                title: 'Morning Run',
                                frequency: client_1.FrequencyType.daily,
                                frequencyDetails: {},
                            },
                        })];
                case 15:
                    morningRun = _a.sent();
                    return [4 /*yield*/, prisma.habit.create({
                            data: {
                                userId: alice.id,
                                goalId: fitnessGoal.id,
                                title: 'Evening Stretch',
                                frequency: client_1.FrequencyType.daily,
                                frequencyDetails: {},
                            },
                        })];
                case 16:
                    eveningStretch = _a.sent();
                    return [4 /*yield*/, prisma.habit.create({
                            data: {
                                userId: alice.id,
                                goalId: learningGoal.id,
                                title: 'Read 10 Pages',
                                frequency: client_1.FrequencyType.daily,
                                frequencyDetails: {},
                            },
                        })];
                case 17:
                    readingHabit = _a.sent();
                    return [4 /*yield*/, prisma.habit.create({
                            data: {
                                userId: alice.id,
                                goalId: learningGoal.id,
                                title: 'Code Practice (30 min)',
                                frequency: client_1.FrequencyType.weekly,
                                frequencyDetails: { daysOfWeek: [1, 3, 5] }, // Mon, Wed, Fri
                            },
                        })];
                case 18:
                    practiseHabit = _a.sent();
                    console.log('  ✓ Created habits');
                    runCheckins = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12].map(function (daysAgo) { return ({
                        habitId: morningRun.id,
                        status: client_1.CheckinStatus.completed,
                        logDate: (0, date_fns_1.subDays)(new Date(), daysAgo),
                    }); });
                    // Day 5 ago was missed
                    runCheckins.push({
                        habitId: morningRun.id,
                        status: client_1.CheckinStatus.missed,
                        logDate: (0, date_fns_1.subDays)(new Date(), 5),
                    });
                    return [4 /*yield*/, prisma.checkin.createMany({ data: runCheckins })];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, prisma.streak.create({
                            data: {
                                habitId: morningRun.id,
                                currentStreak: 5,
                                longestStreak: 7,
                                lastCheckinDate: new Date(),
                            },
                        })];
                case 20:
                    _a.sent();
                    // Evening Stretch — modest streak (last 3 days)
                    return [4 /*yield*/, prisma.checkin.createMany({
                            data: [0, 1, 2].map(function (daysAgo) { return ({
                                habitId: eveningStretch.id,
                                status: client_1.CheckinStatus.completed,
                                logDate: (0, date_fns_1.subDays)(new Date(), daysAgo),
                            }); }),
                        })];
                case 21:
                    // Evening Stretch — modest streak (last 3 days)
                    _a.sent();
                    return [4 /*yield*/, prisma.streak.create({
                            data: {
                                habitId: eveningStretch.id,
                                currentStreak: 3,
                                longestStreak: 3,
                                lastCheckinDate: new Date(),
                            },
                        })];
                case 22:
                    _a.sent();
                    // Reading — completed every day for 14 days
                    return [4 /*yield*/, prisma.checkin.createMany({
                            data: Array.from({ length: 14 }, function (_, i) { return ({
                                habitId: readingHabit.id,
                                status: client_1.CheckinStatus.completed,
                                logDate: (0, date_fns_1.subDays)(new Date(), i),
                            }); }),
                        })];
                case 23:
                    // Reading — completed every day for 14 days
                    _a.sent();
                    return [4 /*yield*/, prisma.streak.create({
                            data: {
                                habitId: readingHabit.id,
                                currentStreak: 14,
                                longestStreak: 14,
                                lastCheckinDate: new Date(),
                            },
                        })];
                case 24:
                    _a.sent();
                    // Code Practice — missed yesterday (streak at risk)
                    return [4 /*yield*/, prisma.checkin.createMany({
                            data: [2, 3, 5, 7].map(function (daysAgo) { return ({
                                habitId: practiseHabit.id,
                                status: client_1.CheckinStatus.completed,
                                logDate: (0, date_fns_1.subDays)(new Date(), daysAgo),
                            }); }),
                        })];
                case 25:
                    // Code Practice — missed yesterday (streak at risk)
                    _a.sent();
                    return [4 /*yield*/, prisma.streak.create({
                            data: {
                                habitId: practiseHabit.id,
                                currentStreak: 1,
                                longestStreak: 3,
                                lastCheckinDate: (0, date_fns_1.subDays)(new Date(), 2),
                            },
                        })];
                case 26:
                    _a.sent();
                    console.log('  ✓ Created check-ins and streaks');
                    // ── Tasks ───────────────────────────────────────────────────────────────────
                    return [4 /*yield*/, prisma.task.createMany({
                            data: [
                                {
                                    userId: alice.id,
                                    goalId: learningGoal.id,
                                    title: 'Finish TypeScript Generics chapter',
                                    priority: client_1.PriorityType.critical,
                                    position: 0,
                                    status: client_1.TaskStatus.in_progress,
                                    dueDate: (0, date_fns_1.subDays)(new Date(), -1), // tomorrow
                                },
                                {
                                    userId: alice.id,
                                    goalId: fitnessGoal.id,
                                    title: 'Book physio appointment',
                                    priority: client_1.PriorityType.essential,
                                    position: 0,
                                    status: client_1.TaskStatus.todo,
                                    dueDate: (0, date_fns_1.subDays)(new Date(), -3),
                                },
                                {
                                    userId: alice.id,
                                    goalId: null,
                                    title: 'Review team pull requests',
                                    priority: client_1.PriorityType.important,
                                    position: 0,
                                    status: client_1.TaskStatus.todo,
                                },
                                {
                                    userId: alice.id,
                                    goalId: null,
                                    title: 'Organise desktop files',
                                    priority: client_1.PriorityType.nice_to_have,
                                    position: 0,
                                    status: client_1.TaskStatus.todo,
                                },
                                {
                                    userId: alice.id,
                                    goalId: null,
                                    title: 'Learn Rust someday',
                                    priority: client_1.PriorityType.someday,
                                    position: 0,
                                    status: client_1.TaskStatus.todo,
                                },
                                {
                                    userId: alice.id,
                                    goalId: learningGoal.id,
                                    title: 'Complete NestJS Fundamentals course',
                                    priority: client_1.PriorityType.essential,
                                    position: 1,
                                    status: client_1.TaskStatus.completed,
                                    completedAt: (0, date_fns_1.subDays)(new Date(), 2),
                                },
                            ],
                        })];
                case 27:
                    // ── Tasks ───────────────────────────────────────────────────────────────────
                    _a.sent();
                    console.log('  ✓ Created tasks');
                    // ── AI Insights ─────────────────────────────────────────────────────────────
                    return [4 /*yield*/, prisma.aiInsight.createMany({
                            data: [
                                {
                                    userId: alice.id,
                                    triggerType: client_1.TriggerType.momentum,
                                    headline: 'You Are On A Roll!',
                                    message: 'You have read 10 pages every single day for 14 days. That is exceptional consistency — keep the momentum going today.',
                                    cta: 'Log Today\'s Read',
                                    isRead: false,
                                    generatedAt: new Date(),
                                },
                                {
                                    userId: alice.id,
                                    triggerType: client_1.TriggerType.streak_risk,
                                    headline: 'Your Streak Is At Risk',
                                    message: 'Your Code Practice streak is counting on you. You missed yesterday — do not let two days become a habit.',
                                    cta: 'Code For 30 Min',
                                    isRead: true,
                                    generatedAt: (0, date_fns_1.subDays)(new Date(), 1),
                                },
                                {
                                    userId: alice.id,
                                    triggerType: client_1.TriggerType.fallback,
                                    headline: 'Small Steps, Big Results',
                                    message: 'Progress is not always visible day to day. Trust the system you have built. Show up today.',
                                    cta: 'Check In Now',
                                    isRead: true,
                                    generatedAt: (0, date_fns_1.subDays)(new Date(), 2),
                                },
                            ],
                        })];
                case 28:
                    // ── AI Insights ─────────────────────────────────────────────────────────────
                    _a.sent();
                    console.log('  ✓ Created AI insights');
                    return [4 /*yield*/, prisma.user.create({
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
                        })];
                case 29:
                    bob = _a.sent();
                    console.log("  \u2713 Created user: ".concat(bob.email, " (new \u2014 onboarding not complete)"));
                    return [4 /*yield*/, prisma.community.create({
                            data: {
                                name: 'RIO Early Adopters',
                                description: 'First users of the RIO AI platform',
                                isPublic: false,
                            },
                        })];
                case 30:
                    community = _a.sent();
                    return [4 /*yield*/, prisma.communityMember.create({
                            data: {
                                userId: alice.id,
                                communityId: community.id,
                                role: 'admin',
                            },
                        })];
                case 31:
                    _a.sent();
                    console.log('  ✓ Created community (v2 placeholder)');
                    return [4 /*yield*/, Promise.all([
                            prisma.user.count(),
                            prisma.goal.count(),
                            prisma.habit.count(),
                            prisma.checkin.count(),
                            prisma.task.count(),
                            prisma.aiInsight.count(),
                        ])];
                case 32:
                    counts = _a.sent();
                    console.log('\n📊 Seed complete:');
                    console.log("   Users:    ".concat(counts[0]));
                    console.log("   Goals:    ".concat(counts[1]));
                    console.log("   Habits:   ".concat(counts[2]));
                    console.log("   Checkins: ".concat(counts[3]));
                    console.log("   Tasks:    ".concat(counts[4]));
                    console.log("   Insights: ".concat(counts[5]));
                    console.log('\n🔑 Test credentials:');
                    console.log('   alice@rioapp.io  — full data, Africa/Lagos timezone');
                    console.log('   bob@rioapp.io    — new user, onboarding incomplete');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
