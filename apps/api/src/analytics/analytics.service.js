"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var date_fns_1 = require("date-fns");
var AnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalyticsService = _classThis = /** @class */ (function () {
        function AnalyticsService_1(prisma, redis) {
            this.prisma = prisma;
            this.redis = redis;
        }
        // ── GET /analytics/overview?days=30 ─────────────────────────────────────────
        AnalyticsService_1.prototype.getOverview = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, days) {
                var _this = this;
                if (days === void 0) { days = 30; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.redis.getOrSet("analytics:overview:".concat(userId, ":").concat(days), 5 * 60, function () { return __awaiter(_this, void 0, void 0, function () {
                            var since, _a, habits, checkins, tasks, completed, rate, streaks, avgStreak, completedTasks, pillarMap, _i, habits_1, h, _loop_1, _b, checkins_1, c, pillarBreakdown;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        since = (0, date_fns_1.subDays)(new Date(), days);
                                        return [4 /*yield*/, Promise.all([
                                                this.prisma.habit.findMany({ where: { userId: userId, isArchived: false }, include: { streak: true } }),
                                                this.prisma.checkin.findMany({ where: { habit: { userId: userId }, logDate: { gte: since } } }),
                                                this.prisma.task.findMany({ where: { userId: userId, isArchived: false } }),
                                            ])];
                                    case 1:
                                        _a = _c.sent(), habits = _a[0], checkins = _a[1], tasks = _a[2];
                                        completed = checkins.filter(function (c) { return c.status === 'completed'; }).length;
                                        rate = checkins.length ? Math.round((completed / checkins.length) * 100) : 0;
                                        streaks = habits.map(function (h) { var _a, _b; return (_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0; });
                                        avgStreak = streaks.length
                                            ? Math.round(streaks.reduce(function (a, b) { return a + b; }, 0) / streaks.length) : 0;
                                        completedTasks = tasks.filter(function (t) { return t.status === 'completed'; }).length;
                                        pillarMap = {};
                                        for (_i = 0, habits_1 = habits; _i < habits_1.length; _i++) {
                                            h = habits_1[_i];
                                            if (!h.pillar)
                                                continue;
                                            if (!pillarMap[h.pillar])
                                                pillarMap[h.pillar] = { total: 0, completed: 0 };
                                        }
                                        _loop_1 = function (c) {
                                            var habit = habits.find(function (h) { return h.id === c.habitId; });
                                            if (!(habit === null || habit === void 0 ? void 0 : habit.pillar))
                                                return "continue";
                                            pillarMap[habit.pillar].total++;
                                            if (c.status === 'completed')
                                                pillarMap[habit.pillar].completed++;
                                        };
                                        for (_b = 0, checkins_1 = checkins; _b < checkins_1.length; _b++) {
                                            c = checkins_1[_b];
                                            _loop_1(c);
                                        }
                                        pillarBreakdown = Object.entries(pillarMap).map(function (_a) {
                                            var pillar = _a[0], d = _a[1];
                                            return ({
                                                pillar: pillar,
                                                completionRate: d.total ? Math.round((d.completed / d.total) * 100) : 0,
                                            });
                                        });
                                        return [2 /*return*/, {
                                                period: { days: days, since: since.toISOString() },
                                                habits: {
                                                    total: habits.length,
                                                    completionRate: rate,
                                                    checkinsLogged: checkins.length,
                                                    avgStreak: avgStreak,
                                                },
                                                tasks: {
                                                    total: tasks.length,
                                                    completed: completedTasks,
                                                    completionRate: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
                                                },
                                                pillarBreakdown: pillarBreakdown,
                                                topHabits: __spreadArray([], habits, true).sort(function (a, b) { var _a, _b, _c, _d; return ((_b = (_a = b.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = a.streak) === null || _c === void 0 ? void 0 : _c.currentStreak) !== null && _d !== void 0 ? _d : 0); })
                                                    .slice(0, 3)
                                                    .map(function (h) {
                                                    var _a, _b, _c, _d;
                                                    return ({
                                                        id: h.id, title: h.title, pillar: h.pillar,
                                                        currentStreak: (_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0,
                                                        longestStreak: (_d = (_c = h.streak) === null || _c === void 0 ? void 0 : _c.longestStreak) !== null && _d !== void 0 ? _d : 0,
                                                    });
                                                }),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        // ── GET /analytics/goals/:goalId?days=30 ────────────────────────────────────
        AnalyticsService_1.prototype.getGoalAnalytics = function (userId_1, goalId_1) {
            return __awaiter(this, arguments, void 0, function (userId, goalId, days) {
                var _this = this;
                if (days === void 0) { days = 30; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.redis.getOrSet("analytics:goal:".concat(goalId, ":").concat(days), 10 * 60, function () { return __awaiter(_this, void 0, void 0, function () {
                            var since, goal;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        since = (0, date_fns_1.subDays)(new Date(), days);
                                        return [4 /*yield*/, this.prisma.goal.findFirst({
                                                where: { id: goalId, userId: userId },
                                                include: {
                                                    habits: {
                                                        where: { isArchived: false },
                                                        include: {
                                                            streak: true,
                                                            checkins: { where: { logDate: { gte: since } } },
                                                        },
                                                    },
                                                },
                                            })];
                                    case 1:
                                        goal = _a.sent();
                                        if (!goal)
                                            return [2 /*return*/, null];
                                        return [2 /*return*/, {
                                                goalId: goal.id,
                                                title: goal.title,
                                                type: goal.type,
                                                period: { days: days },
                                                habits: goal.habits.map(function (h) {
                                                    var _a, _b, _c, _d;
                                                    var total = h.checkins.length;
                                                    var completed = h.checkins.filter(function (c) { return c.status === 'completed'; }).length;
                                                    return {
                                                        id: h.id, title: h.title, pillar: h.pillar,
                                                        isKeystone: h.isKeystone,
                                                        frequency: h.frequency,
                                                        scheduledTime: h.scheduledTime,
                                                        currentStreak: (_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0,
                                                        longestStreak: (_d = (_c = h.streak) === null || _c === void 0 ? void 0 : _c.longestStreak) !== null && _d !== void 0 ? _d : 0,
                                                        completionRate: total ? Math.round((completed / total) * 100) : 0,
                                                        checkinsLogged: total,
                                                    };
                                                }),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        // ── GET /analytics/habits/:habitId/trend?from=&to= ───────────────────────────
        AnalyticsService_1.prototype.getHabitTrend = function (userId, habitId, from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var fromDate, toDate, daysDiff;
                var _this = this;
                return __generator(this, function (_a) {
                    fromDate = new Date(from);
                    toDate = new Date(to);
                    daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / 86400000);
                    if (daysDiff > 365)
                        throw new common_1.BadRequestException('Date range cannot exceed 365 days');
                    return [2 /*return*/, this.redis.getOrSet("analytics:habit:".concat(habitId, ":").concat(from, ":").concat(to), 10 * 60, function () { return __awaiter(_this, void 0, void 0, function () {
                            var habit, checkinMap, trend, cursor, key;
                            var _a, _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0: return [4 /*yield*/, this.prisma.habit.findFirst({
                                            where: { id: habitId, userId: userId },
                                            include: {
                                                streak: true,
                                                checkins: { where: { logDate: { gte: fromDate, lte: toDate } }, orderBy: { logDate: 'asc' } },
                                            },
                                        })];
                                    case 1:
                                        habit = _f.sent();
                                        if (!habit)
                                            return [2 /*return*/, null];
                                        checkinMap = new Map(habit.checkins.map(function (c) { return [(0, date_fns_1.format)(new Date(c.logDate), 'yyyy-MM-dd'), c.status]; }));
                                        trend = [];
                                        cursor = new Date(fromDate);
                                        while (cursor <= toDate) {
                                            key = (0, date_fns_1.format)(cursor, 'yyyy-MM-dd');
                                            trend.push({ date: key, status: (_a = checkinMap.get(key)) !== null && _a !== void 0 ? _a : 'not_scheduled' });
                                            cursor.setDate(cursor.getDate() + 1);
                                        }
                                        return [2 /*return*/, {
                                                habitId: habit.id, title: habit.title, pillar: habit.pillar,
                                                currentStreak: (_c = (_b = habit.streak) === null || _b === void 0 ? void 0 : _b.currentStreak) !== null && _c !== void 0 ? _c : 0,
                                                longestStreak: (_e = (_d = habit.streak) === null || _d === void 0 ? void 0 : _d.longestStreak) !== null && _e !== void 0 ? _e : 0,
                                                trend: trend,
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        // ── GET /analytics/tasks/summary ────────────────────────────────────────────
        AnalyticsService_1.prototype.getTaskSummary = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, days) {
                var _this = this;
                if (days === void 0) { days = 30; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.redis.getOrSet("analytics:tasks:".concat(userId, ":").concat(days), 5 * 60, function () { return __awaiter(_this, void 0, void 0, function () {
                            var since, tasks, tiers;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        since = (0, date_fns_1.subDays)(new Date(), days);
                                        return [4 /*yield*/, this.prisma.task.findMany({
                                                where: { userId: userId, isArchived: false, createdAt: { gte: since } },
                                                select: { priority: true, status: true },
                                            })];
                                    case 1:
                                        tasks = _a.sent();
                                        tiers = ['critical', 'essential', 'important', 'nice_to_have', 'someday'];
                                        return [2 /*return*/, {
                                                period: { days: days },
                                                summary: tiers.map(function (tier) {
                                                    var t = tasks.filter(function (x) { return x.priority === tier; });
                                                    var c = t.filter(function (x) { return x.status === 'completed'; }).length;
                                                    return { priority: tier, total: t.length, completed: c,
                                                        completionRate: t.length ? Math.round((c / t.length) * 100) : 0 };
                                                }),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        // ── GET /analytics/weekly-review (Epic 5.3) ──────────────────────────────────
        // Returns the most recent weekly review, or computes one on-demand if none exists.
        AnalyticsService_1.prototype.getWeeklyReview = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, stored;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redis.get("analytics:weekly-review:".concat(userId))];
                        case 1:
                            cached = _a.sent();
                            if (cached)
                                return [2 /*return*/, JSON.parse(cached)];
                            return [4 /*yield*/, this.prisma.weeklyReview.findFirst({
                                    where: { userId: userId },
                                    orderBy: { createdAt: 'desc' },
                                })];
                        case 2:
                            stored = _a.sent();
                            if (!stored) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.redis.set("analytics:weekly-review:".concat(userId), JSON.stringify(stored), 60 * 60)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, stored];
                        case 4: 
                        // Compute on-demand if no stored review exists yet
                        return [2 /*return*/, this.computeWeeklyReview(userId)];
                    }
                });
            });
        };
        // ── GET /analytics/weekly-review/history ─────────────────────────────────────
        AnalyticsService_1.prototype.getWeeklyReviewHistory = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var reviews;
                if (limit === void 0) { limit = 12; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.weeklyReview.findMany({
                                where: { userId: userId },
                                orderBy: { createdAt: 'desc' },
                                take: limit,
                            })];
                        case 1:
                            reviews = _a.sent();
                            return [2 /*return*/, reviews];
                    }
                });
            });
        };
        // ── Compute + persist a weekly review (also called by the AI worker on Sundays) ──
        AnalyticsService_1.prototype.computeWeeklyReview = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, isoWeek, year, weekLabel, weekStart, _a, habits, weekCheckins, profile, pillarMap, _i, habits_2, h, p, _b, weekCheckins_1, c, p, today, daysSoFar, pillarBreakdown, totalSlots, consistencyScore, sorted, bestPillar, worstPillar, reflectionPrompt, review;
                var _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            now = new Date();
                            isoWeek = (0, date_fns_1.getISOWeek)(now);
                            year = (0, date_fns_1.getYear)(now);
                            weekLabel = "".concat(year, "-W").concat(String(isoWeek).padStart(2, '0'));
                            weekStart = this.getMonday(now);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.habit.findMany({
                                        where: { userId: userId, isArchived: false },
                                        include: { streak: true },
                                    }),
                                    this.prisma.checkin.findMany({
                                        where: {
                                            habit: { userId: userId },
                                            logDate: { gte: weekStart },
                                            status: 'completed',
                                        },
                                        include: { habit: { select: { pillar: true } } },
                                    }),
                                    this.prisma.userProfile.findUnique({
                                        where: { userId: userId },
                                        select: { fullName: true },
                                    }),
                                ])];
                        case 1:
                            _a = _k.sent(), habits = _a[0], weekCheckins = _a[1], profile = _a[2];
                            pillarMap = {};
                            for (_i = 0, habits_2 = habits; _i < habits_2.length; _i++) {
                                h = habits_2[_i];
                                p = (_c = h.pillar) !== null && _c !== void 0 ? _c : 'uncategorised';
                                if (!pillarMap[p])
                                    pillarMap[p] = { total: 0, completed: 0 };
                                pillarMap[p].total++;
                            }
                            for (_b = 0, weekCheckins_1 = weekCheckins; _b < weekCheckins_1.length; _b++) {
                                c = weekCheckins_1[_b];
                                p = (_e = (_d = c.habit) === null || _d === void 0 ? void 0 : _d.pillar) !== null && _e !== void 0 ? _e : 'uncategorised';
                                if (!pillarMap[p])
                                    pillarMap[p] = { total: 0, completed: 0 };
                                pillarMap[p].completed++;
                            }
                            today = new Date();
                            today.setHours(0, 0, 0, 0);
                            daysSoFar = Math.max(1, Math.round((today.getTime() - weekStart.getTime()) / 86400000) + 1);
                            pillarBreakdown = Object.entries(pillarMap).map(function (_a) {
                                var pillar = _a[0], d = _a[1];
                                return ({
                                    pillar: pillar,
                                    total: d.total * daysSoFar,
                                    completed: d.completed,
                                    rate: d.total > 0 ? Math.round((d.completed / (d.total * daysSoFar)) * 100) : 0,
                                });
                            });
                            totalSlots = habits.length * daysSoFar;
                            consistencyScore = totalSlots > 0
                                ? Math.round((weekCheckins.length / totalSlots) * 100)
                                : 0;
                            sorted = __spreadArray([], pillarBreakdown, true).filter(function (p) { return p.pillar !== 'uncategorised'; });
                            bestPillar = (_g = (_f = sorted.sort(function (a, b) { return b.rate - a.rate; })[0]) === null || _f === void 0 ? void 0 : _f.pillar) !== null && _g !== void 0 ? _g : null;
                            worstPillar = (_j = (_h = sorted.sort(function (a, b) { return a.rate - b.rate; })[0]) === null || _h === void 0 ? void 0 : _h.pillar) !== null && _j !== void 0 ? _j : null;
                            reflectionPrompt = this.buildReflectionPrompt(consistencyScore, bestPillar, worstPillar);
                            return [4 /*yield*/, this.prisma.weeklyReview.upsert({
                                    where: { userId_weekLabel: { userId: userId, weekLabel: weekLabel } },
                                    create: {
                                        userId: userId,
                                        weekLabel: weekLabel,
                                        consistencyScore: consistencyScore,
                                        bestPillar: bestPillar,
                                        weakestPillar: worstPillar,
                                        reflectionPrompt: reflectionPrompt,
                                        pillarBreakdown: pillarBreakdown,
                                    },
                                    update: {
                                        consistencyScore: consistencyScore,
                                        bestPillar: bestPillar,
                                        weakestPillar: worstPillar,
                                        reflectionPrompt: reflectionPrompt,
                                        pillarBreakdown: pillarBreakdown,
                                    },
                                })];
                        case 2:
                            review = _k.sent();
                            return [4 /*yield*/, this.redis.set("analytics:weekly-review:".concat(userId), JSON.stringify(review), 60 * 60)];
                        case 3:
                            _k.sent();
                            return [2 /*return*/, review];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.buildReflectionPrompt = function (score, best, worst) {
            if (score >= 80)
                return "Strong week! You hit ".concat(score, "% consistency. What made this week work?");
            if (score >= 50)
                return "Solid effort at ".concat(score, "%. What one habit would have pushed this week higher?");
            if (worst)
                return "".concat(score, "% this week. Your ").concat(worst.replace('_', ' '), " habits need attention \u2014 what got in the way?");
            return "".concat(score, "% this week. What's one thing you'd do differently next week?");
        };
        AnalyticsService_1.prototype.getMonday = function (date) {
            var d = new Date(date);
            var day = d.getDay();
            var diff = d.getDate() - day + (day === 0 ? -6 : 1);
            d.setDate(diff);
            d.setHours(0, 0, 0, 0);
            return d;
        };
        return AnalyticsService_1;
    }());
    __setFunctionName(_classThis, "AnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsService = _classThis;
}();
exports.AnalyticsService = AnalyticsService;
