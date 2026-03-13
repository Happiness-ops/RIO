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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreakRecoveryService = void 0;
// ── streak-recovery.service.ts ────────────────────────────────────────────────
var common_1 = require("@nestjs/common");
var date_fns_1 = require("date-fns");
var StreakRecoveryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StreakRecoveryService = _classThis = /** @class */ (function () {
        function StreakRecoveryService_1(prisma, redis) {
            this.prisma = prisma;
            this.redis = redis;
        }
        /**
         * POST /habits/:habitId/streak-recovery
         *
         * Epic 6.2 — Once-per-week grace period.
         * Restores a streak that was reset in the last 24 hours.
         * Can only be used ONCE per ISO week across the user's entire account.
         *
         * Conditions for eligibility:
         *  1. The habit has currentStreak = 0 (streak was reset)
         *  2. The reset happened within the last 24 hours (lastCheckinDate = yesterday)
         *  3. The user has not used their weekly recovery this ISO week
         */
        StreakRecoveryService_1.prototype.useRecovery = function (userId, habitId) {
            return __awaiter(this, void 0, void 0, function () {
                var habit, streak, yesterday, lastCheckin, recoveryDate, sameWeek, otherRecoveredThisWeek, restoredStreak, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.habit.findUnique({
                                where: { id: habitId },
                                include: { streak: true },
                            })];
                        case 1:
                            habit = _a.sent();
                            if (!habit)
                                throw new common_1.NotFoundException('Habit not found');
                            if (habit.userId !== userId)
                                throw new common_1.ForbiddenException('Access denied');
                            streak = habit.streak;
                            if (!streak)
                                throw new common_1.NotFoundException('Streak record not found');
                            // Check 1: streak must actually be reset
                            if (streak.currentStreak > 0) {
                                throw new common_1.BadRequestException('Your streak is still active — recovery is only available after a reset.');
                            }
                            // Check 2: the reset must have happened within the last 24 hours
                            if (!streak.lastCheckinDate) {
                                throw new common_1.BadRequestException('No previous streak found to recover.');
                            }
                            yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            yesterday.setHours(0, 0, 0, 0);
                            lastCheckin = new Date(streak.lastCheckinDate);
                            lastCheckin.setHours(0, 0, 0, 0);
                            if (lastCheckin < yesterday) {
                                throw new common_1.BadRequestException('Recovery window has passed. Streak recovery is only available within 24 hours of a reset.');
                            }
                            // Check 3: once-per-week across all habits
                            if (streak.weeklyRecoveryUsed && streak.lastRecoveryDate) {
                                recoveryDate = new Date(streak.lastRecoveryDate);
                                sameWeek = (0, date_fns_1.getISOWeek)(recoveryDate) === (0, date_fns_1.getISOWeek)(new Date()) &&
                                    (0, date_fns_1.getYear)(recoveryDate) === (0, date_fns_1.getYear)(new Date());
                                if (sameWeek) {
                                    throw new common_1.BadRequestException('You have already used your streak recovery this week. It resets every Monday.');
                                }
                            }
                            return [4 /*yield*/, this.prisma.streak.findFirst({
                                    where: {
                                        habit: { userId: userId },
                                        weeklyRecoveryUsed: true,
                                        lastRecoveryDate: {
                                            gte: this.getThisWeekMonday(),
                                        },
                                    },
                                })];
                        case 2:
                            otherRecoveredThisWeek = _a.sent();
                            if (otherRecoveredThisWeek) {
                                throw new common_1.BadRequestException('You have already used your weekly streak recovery on another habit. It resets every Monday.');
                            }
                            restoredStreak = streak.longestStreak > 0 ? streak.longestStreak : 1;
                            return [4 /*yield*/, this.prisma.streak.update({
                                    where: { habitId: habitId },
                                    data: {
                                        currentStreak: restoredStreak,
                                        weeklyRecoveryUsed: true,
                                        lastRecoveryDate: new Date(),
                                    },
                                })];
                        case 3:
                            updated = _a.sent();
                            // Invalidate dashboard cache
                            return [4 /*yield*/, this.redis.del("dashboard:".concat(userId))];
                        case 4:
                            // Invalidate dashboard cache
                            _a.sent();
                            return [2 /*return*/, {
                                    habitId: habitId,
                                    restoredStreak: updated.currentStreak,
                                    longestStreak: updated.longestStreak,
                                    recoveryUsedAt: updated.lastRecoveryDate,
                                    message: "Streak recovered! You're back to ".concat(updated.currentStreak, " days. Don't break the chain."),
                                }];
                    }
                });
            });
        };
        StreakRecoveryService_1.prototype.getThisWeekMonday = function () {
            var now = new Date();
            var day = now.getDay(); // 0=Sun, 1=Mon, ...
            var diff = now.getDate() - day + (day === 0 ? -6 : 1);
            var monday = new Date(now.setDate(diff));
            monday.setHours(0, 0, 0, 0);
            return monday;
        };
        return StreakRecoveryService_1;
    }());
    __setFunctionName(_classThis, "StreakRecoveryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StreakRecoveryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StreakRecoveryService = _classThis;
}();
exports.StreakRecoveryService = StreakRecoveryService;
