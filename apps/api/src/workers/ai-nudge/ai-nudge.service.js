"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.AiNudgeService = void 0;
var common_1 = require("@nestjs/common");
var date_fns_1 = require("date-fns");
var client_1 = require("@prisma/client");
// Epic 7 — eligibility thresholds before personalised AI insights begin
var MIN_CHECKINS_FOR_AI = 5;
var MIN_ACTIVE_DAYS_FOR_AI = 3;
var AiNudgeService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AiNudgeService = _classThis = /** @class */ (function () {
        function AiNudgeService_1(prisma, redis, gemini, webPush) {
            this.prisma = prisma;
            this.redis = redis;
            this.gemini = gemini;
            this.webPush = webPush;
            this.logger = new common_1.Logger(AiNudgeService.name);
        }
        // ── Users at 6 AM local time (unchanged) ─────────────────────────────────
        AiNudgeService_1.prototype.getUsersAt6AM = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT u.id, u.timezone\n      FROM users u\n      JOIN user_profiles p ON p.\"userId\" = u.id\n      WHERE u.\"isVerified\" = true\n        AND p.\"onboardingCompleted\" = true\n        AND EXTRACT(HOUR   FROM NOW() AT TIME ZONE u.timezone) = 6\n        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE u.timezone) < 30\n    "], ["\n      SELECT u.id, u.timezone\n      FROM users u\n      JOIN user_profiles p ON p.\"userId\" = u.id\n      WHERE u.\"isVerified\" = true\n        AND p.\"onboardingCompleted\" = true\n        AND EXTRACT(HOUR   FROM NOW() AT TIME ZONE u.timezone) = 6\n        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE u.timezone) < 30\n    "])))];
                });
            });
        };
        // ── Main entry: generate insight for a single user ────────────────────────
        AiNudgeService_1.prototype.generateInsightForUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, profile, habits, isEligible, triggerType, topHabit, allCheckins7d, completed7d, completionRate, keystoneHabit, content, subs, today;
                var _this = this;
                var _b, _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.userProfile.findUnique({
                                    where: { userId: userId },
                                    select: { fullName: true, identityStatement: true, selectedPillars: true },
                                }),
                                this.prisma.habit.findMany({
                                    where: { userId: userId, isArchived: false },
                                    include: {
                                        streak: true,
                                        checkins: {
                                            where: { logDate: { gte: (0, date_fns_1.subDays)(new Date(), 14) } },
                                            orderBy: { logDate: 'desc' },
                                        },
                                    },
                                }),
                            ])];
                        case 1:
                            _a = _k.sent(), profile = _a[0], habits = _a[1];
                            if (habits.length === 0)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.checkEligibility(userId, habits)];
                        case 2:
                            isEligible = _k.sent();
                            triggerType = isEligible
                                ? this.evaluateTrigger(habits)
                                : client_1.TriggerType.educational;
                            topHabit = this.getTopHabit(habits);
                            allCheckins7d = habits.flatMap(function (h) { return h.checkins.filter(function (c) { return new Date(c.logDate) >= (0, date_fns_1.subDays)(new Date(), 7); }); });
                            completed7d = allCheckins7d.filter(function (c) { return c.status === 'completed'; }).length;
                            completionRate = allCheckins7d.length
                                ? Math.round((completed7d / allCheckins7d.length) * 100) : 0;
                            keystoneHabit = habits.find(function (h) { return h.isKeystone; });
                            return [4 /*yield*/, this.gemini.generateInsight({
                                    userName: (_c = (_b = profile === null || profile === void 0 ? void 0 : profile.fullName) === null || _b === void 0 ? void 0 : _b.split(' ')[0]) !== null && _c !== void 0 ? _c : 'there',
                                    identityStatement: (_d = profile === null || profile === void 0 ? void 0 : profile.identityStatement) !== null && _d !== void 0 ? _d : null,
                                    triggerType: triggerType,
                                    topHabit: topHabit.title,
                                    keystoneHabit: (_e = keystoneHabit === null || keystoneHabit === void 0 ? void 0 : keystoneHabit.title) !== null && _e !== void 0 ? _e : null,
                                    currentStreak: (_g = (_f = topHabit.streak) === null || _f === void 0 ? void 0 : _f.currentStreak) !== null && _g !== void 0 ? _g : 0,
                                    longestStreak: (_j = (_h = topHabit.streak) === null || _h === void 0 ? void 0 : _h.longestStreak) !== null && _j !== void 0 ? _j : 0,
                                    completionRateLast7Days: completionRate,
                                    isEligible: isEligible,
                                })];
                        case 3:
                            content = _k.sent();
                            return [4 /*yield*/, this.prisma.aiInsight.create({
                                    data: { userId: userId, triggerType: triggerType, headline: content.headline, message: content.message, cta: content.cta },
                                })];
                        case 4:
                            _k.sent();
                            return [4 /*yield*/, this.prisma.userPushSubscription.findMany({ where: { userId: userId } })];
                        case 5:
                            subs = _k.sent();
                            if (!(subs.length > 0)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.webPush.sendToUser(subs.map(function (s) { return ({ id: s.id, endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }); }), { title: content.headline, body: content.message, tag: 'daily-insight', data: { type: 'insight', url: '/insights' } }, function (staleId) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.prisma.userPushSubscription.delete({ where: { id: staleId } })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                }); }); })];
                        case 6:
                            _k.sent();
                            _k.label = 7;
                        case 7:
                            today = new Date();
                            if (!(today.getDay() === 0)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.writeWeeklyReview(userId, habits)];
                        case 8:
                            _k.sent();
                            _k.label = 9;
                        case 9: return [2 /*return*/, triggerType];
                    }
                });
            });
        };
        // ── Epic 7: Eligibility check — ≥5 checkins AND ≥3 active days ───────────
        AiNudgeService_1.prototype.checkEligibility = function (userId, habits) {
            return __awaiter(this, void 0, void 0, function () {
                var allCheckins, completedCheckins, activeDays;
                return __generator(this, function (_a) {
                    allCheckins = habits.flatMap(function (h) { return h.checkins; });
                    completedCheckins = allCheckins.filter(function (c) { return c.status === 'completed'; });
                    if (completedCheckins.length < MIN_CHECKINS_FOR_AI)
                        return [2 /*return*/, false];
                    activeDays = new Set(completedCheckins.map(function (c) { return new Date(c.logDate).toISOString().split('T')[0]; }));
                    return [2 /*return*/, activeDays.size >= MIN_ACTIVE_DAYS_FOR_AI];
                });
            });
        };
        // ── Epic 7: Full trigger evaluation — priority order ─────────────────────
        AiNudgeService_1.prototype.evaluateTrigger = function (habits) {
            var _a;
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var yesterday = (0, date_fns_1.subDays)(today, 1);
            var twoDaysAgo = (0, date_fns_1.subDays)(today, 2);
            // Rule 1 (HIGHEST): Two-day risk — missed yesterday AND today not yet checked in
            // This is the most urgent — prevent the two-miss pattern that kills streaks
            var hasTwoDayRisk = habits.some(function (h) {
                var streak = h.streak;
                if (!(streak === null || streak === void 0 ? void 0 : streak.lastCheckinDate))
                    return false;
                var lastDate = new Date(streak.lastCheckinDate);
                lastDate.setHours(0, 0, 0, 0);
                var checkedToday = h.checkins.some(function (c) {
                    var d = new Date(c.logDate);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() === today.getTime() && c.status === 'completed';
                });
                // Missed yesterday and not yet checked in today
                return lastDate.getTime() <= twoDaysAgo.getTime() && !checkedToday;
            });
            if (hasTwoDayRisk)
                return client_1.TriggerType.two_day_risk;
            // Rule 2: Streak at risk — has streak but missed yesterday
            var hasStreakAtRisk = habits.some(function (h) {
                var _a, _b, _c;
                if (((_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) === 0)
                    return false;
                var last = ((_c = h.streak) === null || _c === void 0 ? void 0 : _c.lastCheckinDate) ? new Date(h.streak.lastCheckinDate) : null;
                if (!last)
                    return false;
                last.setHours(0, 0, 0, 0);
                return last.getTime() < yesterday.getTime();
            });
            if (hasStreakAtRisk)
                return client_1.TriggerType.streak_risk;
            // Rule 3: Streak recovery — streak just reset within 48hrs
            var isRecovering = habits.some(function (h) {
                var _a, _b, _c;
                if (((_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) !== 0)
                    return false;
                var last = ((_c = h.streak) === null || _c === void 0 ? void 0 : _c.lastCheckinDate) ? new Date(h.streak.lastCheckinDate) : null;
                if (!last)
                    return false;
                last.setHours(0, 0, 0, 0);
                return last.getTime() >= twoDaysAgo.getTime();
            });
            if (isRecovering)
                return client_1.TriggerType.streak_recovery;
            // Rule 4: Completion drop-off — 7-day rate < 50%
            var recent7d = habits.flatMap(function (h) { return h.checkins.filter(function (c) { return new Date(c.logDate) >= (0, date_fns_1.subDays)(today, 7); }); });
            var rate = recent7d.length ? recent7d.filter(function (c) { return c.status === 'completed'; }).length / recent7d.length : 1;
            if (rate < 0.5 && recent7d.length >= 3)
                return client_1.TriggerType.completion_dropoff;
            // Rule 5: Pillar imbalance — any pillar with habits but 0 completions this week
            var weekStart = this.getMonday(today);
            var pillarMap = new Map();
            for (var _i = 0, habits_1 = habits; _i < habits_1.length; _i++) {
                var h = habits_1[_i];
                if (!h.pillar)
                    continue;
                var weekCompletions = h.checkins.filter(function (c) {
                    var d = new Date(c.logDate);
                    d.setHours(0, 0, 0, 0);
                    return d >= weekStart && c.status === 'completed';
                }).length;
                pillarMap.set(h.pillar, ((_a = pillarMap.get(h.pillar)) !== null && _a !== void 0 ? _a : 0) + weekCompletions);
            }
            var hasPillarImbalance = __spreadArray([], pillarMap.values(), true).some(function (count) { return count === 0; });
            if (hasPillarImbalance)
                return client_1.TriggerType.pillar_imbalance;
            // Rule 6: Momentum — any habit has 5+ consecutive days
            var hasMomentum = habits.some(function (h) { var _a, _b; return ((_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) >= 5; });
            if (hasMomentum)
                return client_1.TriggerType.momentum;
            // Rule 7: Weekly reflection — Sundays only
            if (new Date().getDay() === 0)
                return client_1.TriggerType.weekly_reflection;
            return client_1.TriggerType.fallback;
        };
        // ── Epic 5.3: Write weekly review to DB (called every Sunday at 6AM) ─────
        AiNudgeService_1.prototype.writeWeeklyReview = function (userId, habits) {
            return __awaiter(this, void 0, void 0, function () {
                var now, weekLabel, weekStart, allCheckins, pillarMap, _i, habits_2, h, p, _loop_1, _a, allCheckins_1, c, today, daysSoFar, totalSlots, completedAll, score, breakdown, sorted, best, weakest;
                var _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            now = new Date();
                            weekLabel = "".concat((0, date_fns_1.getYear)(now), "-W").concat(String((0, date_fns_1.getISOWeek)(now)).padStart(2, '0'));
                            weekStart = this.getMonday(now);
                            allCheckins = habits.flatMap(function (h) { return h.checkins.filter(function (c) {
                                var d = new Date(c.logDate);
                                d.setHours(0, 0, 0, 0);
                                return d >= weekStart;
                            }); });
                            pillarMap = {};
                            for (_i = 0, habits_2 = habits; _i < habits_2.length; _i++) {
                                h = habits_2[_i];
                                p = (_b = h.pillar) !== null && _b !== void 0 ? _b : 'uncategorised';
                                if (!pillarMap[p])
                                    pillarMap[p] = { total: 0, completed: 0 };
                            }
                            _loop_1 = function (c) {
                                var habit = habits.find(function (h) { return h.id === c.habitId; });
                                var p = (_c = habit === null || habit === void 0 ? void 0 : habit.pillar) !== null && _c !== void 0 ? _c : 'uncategorised';
                                if (!pillarMap[p])
                                    pillarMap[p] = { total: 0, completed: 0 };
                                pillarMap[p].total++;
                                if (c.status === 'completed')
                                    pillarMap[p].completed++;
                            };
                            for (_a = 0, allCheckins_1 = allCheckins; _a < allCheckins_1.length; _a++) {
                                c = allCheckins_1[_a];
                                _loop_1(c);
                            }
                            today = new Date();
                            today.setHours(0, 0, 0, 0);
                            daysSoFar = Math.max(1, Math.round((today.getTime() - weekStart.getTime()) / 86400000) + 1);
                            totalSlots = habits.length * daysSoFar;
                            completedAll = allCheckins.filter(function (c) { return c.status === 'completed'; }).length;
                            score = totalSlots > 0 ? Math.round((completedAll / totalSlots) * 100) : 0;
                            breakdown = Object.entries(pillarMap).map(function (_a) {
                                var pillar = _a[0], d = _a[1];
                                return ({
                                    pillar: pillar,
                                    total: d.total, completed: d.completed,
                                    rate: d.total ? Math.round((d.completed / d.total) * 100) : 0,
                                });
                            }).filter(function (p) { return p.pillar !== 'uncategorised'; });
                            sorted = __spreadArray([], breakdown, true).sort(function (a, b) { return b.rate - a.rate; });
                            best = (_e = (_d = sorted[0]) === null || _d === void 0 ? void 0 : _d.pillar) !== null && _e !== void 0 ? _e : null;
                            weakest = (_g = (_f = sorted[sorted.length - 1]) === null || _f === void 0 ? void 0 : _f.pillar) !== null && _g !== void 0 ? _g : null;
                            return [4 /*yield*/, this.prisma.weeklyReview.upsert({
                                    where: { userId_weekLabel: { userId: userId, weekLabel: weekLabel } },
                                    create: { userId: userId, weekLabel: weekLabel, consistencyScore: score, bestPillar: best, weakestPillar: weakest, pillarBreakdown: breakdown },
                                    update: { consistencyScore: score, bestPillar: best, weakestPillar: weakest, pillarBreakdown: breakdown },
                                })];
                        case 1:
                            _h.sent();
                            return [4 /*yield*/, this.redis.del("analytics:weekly-review:".concat(userId))];
                        case 2:
                            _h.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AiNudgeService_1.prototype.getTopHabit = function (habits) {
            return __spreadArray([], habits, true).sort(function (a, b) { var _a, _b, _c, _d; return ((_b = (_a = b.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = a.streak) === null || _c === void 0 ? void 0 : _c.currentStreak) !== null && _d !== void 0 ? _d : 0); })[0];
        };
        AiNudgeService_1.prototype.getMonday = function (date) {
            var d = new Date(date);
            var day = d.getDay();
            d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
            d.setHours(0, 0, 0, 0);
            return d;
        };
        return AiNudgeService_1;
    }());
    __setFunctionName(_classThis, "AiNudgeService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiNudgeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiNudgeService = _classThis;
}();
exports.AiNudgeService = AiNudgeService;
var templateObject_1;
