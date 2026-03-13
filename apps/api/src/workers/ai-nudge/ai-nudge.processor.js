"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiNudgeProcessor = exports.AI_NUDGE_QUEUE = void 0;
var bullmq_1 = require("@nestjs/bullmq");
var common_1 = require("@nestjs/common");
var date_fns_1 = require("date-fns");
exports.AI_NUDGE_QUEUE = 'ai-nudge';
var AiNudgeProcessor = function () {
    var _classDecorators = [(0, bullmq_1.Processor)(exports.AI_NUDGE_QUEUE)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = bullmq_1.WorkerHost;
    var AiNudgeProcessor = _classThis = /** @class */ (function (_super) {
        __extends(AiNudgeProcessor_1, _super);
        function AiNudgeProcessor_1(prisma, gemini, webPush) {
            var _this = _super.call(this) || this;
            _this.prisma = prisma;
            _this.gemini = gemini;
            _this.webPush = webPush;
            _this.logger = new common_1.Logger(AiNudgeProcessor.name);
            return _this;
        }
        AiNudgeProcessor_1.prototype.process = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var users, _i, users_1, user, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('Running AI Nudge sweep...');
                            return [4 /*yield*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT u.id, u.timezone, u.email\n      FROM users u\n      JOIN user_profiles p ON p.\"userId\" = u.id\n      WHERE u.\"isVerified\" = true\n        AND p.\"onboardingCompleted\" = true\n        AND EXTRACT(HOUR FROM NOW() AT TIME ZONE u.timezone) = 6\n        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE u.timezone) < 30\n    "], ["\n      SELECT u.id, u.timezone, u.email\n      FROM users u\n      JOIN user_profiles p ON p.\"userId\" = u.id\n      WHERE u.\"isVerified\" = true\n        AND p.\"onboardingCompleted\" = true\n        AND EXTRACT(HOUR FROM NOW() AT TIME ZONE u.timezone) = 6\n        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE u.timezone) < 30\n    "])))];
                        case 1:
                            users = _a.sent();
                            this.logger.log("Processing AI nudges for ".concat(users.length, " users"));
                            _i = 0, users_1 = users;
                            _a.label = 2;
                        case 2:
                            if (!(_i < users_1.length)) return [3 /*break*/, 7];
                            user = users_1[_i];
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.processUser(user.id)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_1 = _a.sent();
                            this.logger.error("AI nudge failed for user ".concat(user.id, ": ").concat(err_1.message));
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        AiNudgeProcessor_1.prototype.processUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, habits, triggerType, topHabit, completed7d, total7d, completionRate, content, subscriptions;
                var _this = this;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.prisma.userProfile.findUnique({
                                where: { userId: userId }, select: { fullName: true },
                            })];
                        case 1:
                            profile = _g.sent();
                            return [4 /*yield*/, this.prisma.habit.findMany({
                                    where: { userId: userId, isArchived: false },
                                    include: {
                                        streak: true,
                                        checkins: {
                                            where: { logDate: { gte: (0, date_fns_1.subDays)(new Date(), 7) } },
                                            orderBy: { logDate: 'desc' },
                                        },
                                    },
                                })];
                        case 2:
                            habits = _g.sent();
                            if (habits.length === 0)
                                return [2 /*return*/]; // Nothing to nudge about
                            triggerType = this.evaluateTrigger(habits);
                            topHabit = habits
                                .sort(function (a, b) { var _a, _b, _c, _d; return ((_b = (_a = b.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = a.streak) === null || _c === void 0 ? void 0 : _c.currentStreak) !== null && _d !== void 0 ? _d : 0); })[0];
                            completed7d = habits.flatMap(function (h) { return h.checkins; }).filter(function (c) { return c.status === 'completed'; }).length;
                            total7d = habits.flatMap(function (h) { return h.checkins; }).length;
                            completionRate = total7d ? Math.round((completed7d / total7d) * 100) : 0;
                            return [4 /*yield*/, this.gemini.generateInsight({
                                    userName: (_b = (_a = profile === null || profile === void 0 ? void 0 : profile.fullName) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) !== null && _b !== void 0 ? _b : 'there',
                                    triggerType: triggerType,
                                    topHabit: topHabit.title,
                                    currentStreak: (_d = (_c = topHabit.streak) === null || _c === void 0 ? void 0 : _c.currentStreak) !== null && _d !== void 0 ? _d : 0,
                                    longestStreak: (_f = (_e = topHabit.streak) === null || _e === void 0 ? void 0 : _e.longestStreak) !== null && _f !== void 0 ? _f : 0,
                                    completionRateLast7Days: completionRate,
                                })];
                        case 3:
                            content = _g.sent();
                            // ── Save insight to database ─────────────────────────────────────────────
                            return [4 /*yield*/, this.prisma.aiInsight.create({
                                    data: {
                                        userId: userId,
                                        triggerType: triggerType,
                                        headline: content.headline,
                                        message: content.message,
                                        cta: content.cta,
                                        isRead: false,
                                        generatedAt: new Date(),
                                    },
                                })];
                        case 4:
                            // ── Save insight to database ─────────────────────────────────────────────
                            _g.sent();
                            return [4 /*yield*/, this.prisma.userPushSubscription.findMany({
                                    where: { userId: userId },
                                })];
                        case 5:
                            subscriptions = _g.sent();
                            if (!(subscriptions.length > 0)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.webPush.sendToUser(subscriptions.map(function (s) { return ({ id: s.id, endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }); }), {
                                    title: content.headline,
                                    body: content.message,
                                    tag: 'daily-insight',
                                    data: { type: 'insight', url: '/insights' },
                                }, function (staleId) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.prisma.userPushSubscription.delete({ where: { id: staleId } })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 6:
                            _g.sent();
                            _g.label = 7;
                        case 7:
                            this.logger.log("Insight generated for user ".concat(userId, ": ").concat(triggerType));
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ── 5 Trigger Rules ────────────────────────────────────────────────────────
        AiNudgeProcessor_1.prototype.evaluateTrigger = function (habits) {
            var yesterday = (0, date_fns_1.subDays)(new Date(), 1);
            yesterday.setHours(0, 0, 0, 0);
            // Rule 1: Momentum — 5+ consecutive days on any habit
            var onRoll = habits.some(function (h) { var _a, _b; return ((_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) >= 5; });
            if (onRoll)
                return 'momentum';
            // Rule 2: Streak at risk — had a streak, missed yesterday
            var streakAtRisk = habits.some(function (h) {
                var _a, _b, _c;
                var streak = (_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0;
                var last = (_c = h.streak) === null || _c === void 0 ? void 0 : _c.lastCheckinDate;
                if (streak === 0 || !last)
                    return false;
                var lastDate = new Date(last);
                lastDate.setHours(0, 0, 0, 0);
                return lastDate < yesterday;
            });
            if (streakAtRisk)
                return 'streak_risk';
            // Rule 3: Streak recovery — streak reset within last 48 hours (currentStreak=0, lastCheckin was yesterday)
            var recovering = habits.some(function (h) {
                var _a, _b, _c;
                var streak = (_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0;
                var last = (_c = h.streak) === null || _c === void 0 ? void 0 : _c.lastCheckinDate;
                if (streak !== 0 || !last)
                    return false;
                var lastDate = new Date(last);
                var twoDaysAgo = (0, date_fns_1.subDays)(new Date(), 2);
                return lastDate >= twoDaysAgo;
            });
            if (recovering)
                return 'streak_recovery';
            // Rule 4: Completion dropoff — last 7 days rate below 50%
            var recentCheckins = habits.flatMap(function (h) { return h.checkins; });
            var completed = recentCheckins.filter(function (c) { return c.status === 'completed'; }).length;
            var rate = recentCheckins.length ? completed / recentCheckins.length : 0;
            if (rate < 0.5 && recentCheckins.length >= 3)
                return 'completion_dropoff';
            // Rule 5: Fallback
            return 'fallback';
        };
        return AiNudgeProcessor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "AiNudgeProcessor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiNudgeProcessor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiNudgeProcessor = _classThis;
}();
exports.AiNudgeProcessor = AiNudgeProcessor;
var templateObject_1;
