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
exports.DashboardService = void 0;
var common_1 = require("@nestjs/common");
var DashboardService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DashboardService = _classThis = /** @class */ (function () {
        function DashboardService_1(prisma, redis) {
            this.prisma = prisma;
            this.redis = redis;
        }
        DashboardService_1.prototype.getDashboard = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.redis.getOrSet("dashboard:".concat(userId), 60, function () { return __awaiter(_this, void 0, void 0, function () {
                            var today, dayOfWeek, mondayDiff, weekStart, _a, profile, habits, todayCheckins, weekCheckins, recentInsight, checkinMap, completedToday, keystoneHabit, pillarBalance, weeklyConsistencyScore, twoDayRiskHabits;
                            var _b, _c, _d, _e, _f, _g, _h, _j;
                            return __generator(this, function (_k) {
                                switch (_k.label) {
                                    case 0:
                                        today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        dayOfWeek = today.getDay();
                                        mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                                        weekStart = new Date(today);
                                        weekStart.setDate(today.getDate() + mondayDiff);
                                        return [4 /*yield*/, Promise.all([
                                                this.prisma.userProfile.findUnique({
                                                    where: { userId: userId },
                                                    select: { identityStatement: true, selectedPillars: true, fullName: true },
                                                }),
                                                this.prisma.habit.findMany({
                                                    where: { userId: userId, isArchived: false },
                                                    include: { streak: true },
                                                    orderBy: [{ isKeystone: 'desc' }, { createdAt: 'asc' }],
                                                }),
                                                this.prisma.checkin.findMany({
                                                    where: { habit: { userId: userId }, logDate: today },
                                                }),
                                                // Epic 3.2 — need this week's checkins for pillar balance
                                                this.prisma.checkin.findMany({
                                                    where: {
                                                        habit: { userId: userId },
                                                        logDate: { gte: weekStart },
                                                        status: 'completed',
                                                    },
                                                    include: { habit: { select: { pillar: true } } },
                                                }),
                                                this.prisma.aiInsight.findFirst({
                                                    where: { userId: userId, isRead: false },
                                                    orderBy: { generatedAt: 'desc' },
                                                }),
                                            ])];
                                    case 1:
                                        _a = _k.sent(), profile = _a[0], habits = _a[1], todayCheckins = _a[2], weekCheckins = _a[3], recentInsight = _a[4];
                                        checkinMap = new Map(todayCheckins.map(function (c) { return [c.habitId, c]; }));
                                        completedToday = todayCheckins.filter(function (c) { return c.status === 'completed'; }).length;
                                        keystoneHabit = (_b = habits.find(function (h) { return h.isKeystone; })) !== null && _b !== void 0 ? _b : null;
                                        pillarBalance = this.buildPillarBalance(habits, weekCheckins);
                                        weeklyConsistencyScore = this.calcWeeklyConsistency(habits, weekCheckins, weekStart);
                                        twoDayRiskHabits = habits.filter(function (h) {
                                            var streak = h.streak;
                                            if (!(streak === null || streak === void 0 ? void 0 : streak.lastCheckinDate))
                                                return false;
                                            var last = new Date(streak.lastCheckinDate);
                                            last.setHours(0, 0, 0, 0);
                                            var yesterday = new Date(today);
                                            yesterday.setDate(today.getDate() - 1);
                                            // Last checkin was 2+ days ago and they missed yesterday too
                                            return last < yesterday && !checkinMap.has(h.id);
                                        });
                                        return [2 /*return*/, {
                                                date: today.toISOString().split('T')[0],
                                                // Epic 3.1 — identity header
                                                identity: {
                                                    statement: (_c = profile === null || profile === void 0 ? void 0 : profile.identityStatement) !== null && _c !== void 0 ? _c : null,
                                                    firstName: (_e = (_d = profile === null || profile === void 0 ? void 0 : profile.fullName) === null || _d === void 0 ? void 0 : _d.split(' ')[0]) !== null && _e !== void 0 ? _e : null,
                                                    selectedPillars: (_f = profile === null || profile === void 0 ? void 0 : profile.selectedPillars) !== null && _f !== void 0 ? _f : [],
                                                },
                                                metrics: {
                                                    totalHabits: habits.length,
                                                    completedToday: completedToday,
                                                    completionRate: habits.length ? Math.round((completedToday / habits.length) * 100) : 0,
                                                    activeStreaks: habits.filter(function (h) { var _a, _b; return ((_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) > 0; }).length,
                                                    longestStreak: Math.max.apply(Math, __spreadArray([0], habits.map(function (h) { var _a, _b; return (_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.longestStreak) !== null && _b !== void 0 ? _b : 0; }), false)),
                                                    weeklyConsistencyScore: weeklyConsistencyScore,
                                                },
                                                // Epic 3.3 — keystone highlighted separately
                                                keystoneHabit: keystoneHabit ? {
                                                    id: keystoneHabit.id,
                                                    title: keystoneHabit.title,
                                                    currentStreak: (_h = (_g = keystoneHabit.streak) === null || _g === void 0 ? void 0 : _g.currentStreak) !== null && _h !== void 0 ? _h : 0,
                                                    todayCheckin: (_j = checkinMap.get(keystoneHabit.id)) !== null && _j !== void 0 ? _j : null,
                                                } : null,
                                                // Epic 3.2 — pillar balance
                                                pillarBalance: pillarBalance,
                                                // Epic 5.2 — two-day rule warning
                                                twoDayRisk: {
                                                    count: twoDayRiskHabits.length,
                                                    habits: twoDayRiskHabits.map(function (h) { return ({ id: h.id, title: h.title }); }),
                                                },
                                                todayHabits: habits.map(function (h) {
                                                    var _a, _b, _c, _d, _e, _f, _g;
                                                    return ({
                                                        id: h.id,
                                                        title: h.title,
                                                        pillar: h.pillar,
                                                        isKeystone: h.isKeystone,
                                                        frequency: h.frequency,
                                                        scheduledTime: h.scheduledTime,
                                                        currentStreak: (_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0,
                                                        longestStreak: (_d = (_c = h.streak) === null || _c === void 0 ? void 0 : _c.longestStreak) !== null && _d !== void 0 ? _d : 0,
                                                        weeklyRecoveryUsed: (_f = (_e = h.streak) === null || _e === void 0 ? void 0 : _e.weeklyRecoveryUsed) !== null && _f !== void 0 ? _f : false,
                                                        todayCheckin: (_g = checkinMap.get(h.id)) !== null && _g !== void 0 ? _g : null,
                                                    });
                                                }),
                                                insight: recentInsight ? {
                                                    id: recentInsight.id,
                                                    triggerType: recentInsight.triggerType,
                                                    headline: recentInsight.headline,
                                                    message: recentInsight.message,
                                                    cta: recentInsight.cta,
                                                    generatedAt: recentInsight.generatedAt,
                                                } : null,
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        // Epic 3.2 — build pillar completion breakdown for the week
        DashboardService_1.prototype.buildPillarBalance = function (habits, weekCheckins) {
            var _a, _b, _c;
            var pillarMap = {};
            for (var _i = 0, habits_1 = habits; _i < habits_1.length; _i++) {
                var habit = habits_1[_i];
                var pillar = (_a = habit.pillar) !== null && _a !== void 0 ? _a : 'uncategorised';
                if (!pillarMap[pillar])
                    pillarMap[pillar] = { total: 0, completed: 0 };
                pillarMap[pillar].total++;
            }
            for (var _d = 0, weekCheckins_1 = weekCheckins; _d < weekCheckins_1.length; _d++) {
                var checkin = weekCheckins_1[_d];
                var pillar = (_c = (_b = checkin.habit) === null || _b === void 0 ? void 0 : _b.pillar) !== null && _c !== void 0 ? _c : 'uncategorised';
                if (!pillarMap[pillar])
                    pillarMap[pillar] = { total: 0, completed: 0 };
                pillarMap[pillar].completed++;
            }
            var breakdown = Object.entries(pillarMap).map(function (_a) {
                var pillar = _a[0], data = _a[1];
                return ({
                    pillar: pillar,
                    habitCount: data.total,
                    completedThisWeek: data.completed,
                    rate: data.total > 0 ? Math.round((data.completed / (data.total * 7)) * 100) : 0,
                });
            });
            // Epic 3.2 — imbalance indicator: any selected pillar with 0 habits
            var pillarsWithZeroHabits = breakdown
                .filter(function (p) { return p.habitCount === 0 && p.pillar !== 'uncategorised'; })
                .map(function (p) { return p.pillar; });
            return { breakdown: breakdown, imbalanceWarning: pillarsWithZeroHabits };
        };
        // Epic 3.4 / 5.3 — weekly consistency score as a percentage
        DashboardService_1.prototype.calcWeeklyConsistency = function (habits, weekCheckins, weekStart) {
            if (habits.length === 0)
                return 0;
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var daysSoFar = Math.max(1, Math.round((today.getTime() - weekStart.getTime()) / 86400000) + 1);
            var totalSlots = habits.length * daysSoFar;
            var completed = weekCheckins.length;
            return totalSlots > 0 ? Math.round((completed / totalSlots) * 100) : 0;
        };
        return DashboardService_1;
    }());
    __setFunctionName(_classThis, "DashboardService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardService = _classThis;
}();
exports.DashboardService = DashboardService;
