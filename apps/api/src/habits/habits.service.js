"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.HabitsService = void 0;
var common_1 = require("@nestjs/common");
var response_helper_1 = require("@/common/types/response.helper");
// Epic 4.3 — friction guard thresholds
var MAX_DAILY_HABITS = 5;
var MAX_DURATION_MINS = 60;
var HabitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var HabitsService = _classThis = /** @class */ (function () {
        function HabitsService_1(prisma) {
            this.prisma = prisma;
        }
        HabitsService_1.prototype.create = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var goal, dailyCount, habit;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.prisma.goal.findUnique({
                                where: { id: dto.goalId }, select: { userId: true },
                            })];
                        case 1:
                            goal = _d.sent();
                            if (!goal)
                                throw new common_1.NotFoundException('Goal not found');
                            if (goal.userId !== userId)
                                throw new common_1.ForbiddenException('Access denied');
                            return [4 /*yield*/, this.prisma.habit.count({
                                    where: { userId: userId, frequency: 'daily', isArchived: false },
                                })];
                        case 2:
                            dailyCount = _d.sent();
                            if (dto.frequency === 'daily' && dailyCount >= MAX_DAILY_HABITS) {
                                throw new common_1.BadRequestException("Habit load warning: you already have ".concat(dailyCount, " daily habits. ") +
                                    "Research shows >5 daily habits significantly increases burnout risk. " +
                                    "Consider archiving an existing habit or making this one weekly instead.");
                            }
                            if (dto.estimatedDuration && dto.estimatedDuration > MAX_DURATION_MINS) {
                                throw new common_1.BadRequestException("Habit load warning: habits over 60 minutes are hard to sustain daily. " +
                                    "Consider breaking this into smaller habits.");
                            }
                            if (!dto.isKeystone) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.habit.updateMany({
                                    where: { userId: userId, isKeystone: true },
                                    data: { isKeystone: false },
                                })];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4: return [4 /*yield*/, this.prisma.habit.create({
                                data: {
                                    userId: userId,
                                    goalId: dto.goalId,
                                    title: dto.title,
                                    pillar: dto.pillar,
                                    isKeystone: (_a = dto.isKeystone) !== null && _a !== void 0 ? _a : false,
                                    frequency: (_b = dto.frequency) !== null && _b !== void 0 ? _b : 'daily',
                                    frequencyDetails: (_c = dto.frequencyDetails) !== null && _c !== void 0 ? _c : {},
                                    scheduledTime: dto.scheduledTime,
                                    habitStackTrigger: dto.habitStackTrigger,
                                    estimatedDuration: dto.estimatedDuration,
                                },
                            })];
                        case 5:
                            habit = _d.sent();
                            // Streak record created immediately — always exists 1:1 with habit
                            return [4 /*yield*/, this.prisma.streak.create({
                                    data: { habitId: habit.id, currentStreak: 0, longestStreak: 0 },
                                })];
                        case 6:
                            // Streak record created immediately — always exists 1:1 with habit
                            _d.sent();
                            return [2 /*return*/, this.format(habit, null)];
                    }
                });
            });
        };
        HabitsService_1.prototype.findAll = function (userId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, habits, total;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = __assign(__assign(__assign({ userId: userId }, (query.goalId && { goalId: query.goalId })), (query.pillar && { pillar: query.pillar })), (!query.includeArchived && { isArchived: false }));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.habit.findMany({
                                        where: where,
                                        include: { streak: true },
                                        orderBy: [{ isKeystone: 'desc' }, { createdAt: 'asc' }], // Keystone first
                                        take: query.limit,
                                        skip: query.offset,
                                    }),
                                    this.prisma.habit.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), habits = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    habits: habits.map(function (h) { return _this.format(h, h.streak); }),
                                    pagination: (0, response_helper_1.paginationMeta)(total, query.limit, query.offset),
                                }];
                    }
                });
            });
        };
        HabitsService_1.prototype.findOne = function (userId, habitId) {
            return __awaiter(this, void 0, void 0, function () {
                var habit;
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
                            return [2 /*return*/, this.format(habit, habit.streak)];
                    }
                });
            });
        };
        HabitsService_1.prototype.update = function (userId, habitId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var goal, habit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertOwnership(userId, habitId)];
                        case 1:
                            _a.sent();
                            // Epic 4.3 — friction guard on update
                            if (dto.estimatedDuration && dto.estimatedDuration > MAX_DURATION_MINS) {
                                throw new common_1.BadRequestException('Habit load warning: habits over 60 minutes are hard to sustain daily.');
                            }
                            if (!(dto.isKeystone === true)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.habit.updateMany({
                                    where: { userId: userId, isKeystone: true, NOT: { id: habitId } },
                                    data: { isKeystone: false },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            if (!dto.goalId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.goal.findUnique({
                                    where: { id: dto.goalId }, select: { userId: true },
                                })];
                        case 4:
                            goal = _a.sent();
                            if (!goal)
                                throw new common_1.NotFoundException('Goal not found');
                            if (goal.userId !== userId)
                                throw new common_1.UnprocessableEntityException('Goal does not belong to you');
                            _a.label = 5;
                        case 5: return [4 /*yield*/, this.prisma.habit.update({
                                where: { id: habitId },
                                data: dto,
                                include: { streak: true },
                            })];
                        case 6:
                            habit = _a.sent();
                            return [2 /*return*/, this.format(habit, habit.streak)];
                    }
                });
            });
        };
        HabitsService_1.prototype.remove = function (userId, habitId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertOwnership(userId, habitId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.habit.delete({ where: { id: habitId } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        HabitsService_1.prototype.assertOwnership = function (userId, habitId) {
            return __awaiter(this, void 0, void 0, function () {
                var habit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.habit.findUnique({
                                where: { id: habitId }, select: { userId: true },
                            })];
                        case 1:
                            habit = _a.sent();
                            if (!habit)
                                throw new common_1.NotFoundException('Habit not found');
                            if (habit.userId !== userId)
                                throw new common_1.ForbiddenException('Access denied');
                            return [2 /*return*/];
                    }
                });
            });
        };
        HabitsService_1.prototype.format = function (habit, streak) {
            return {
                id: habit.id,
                goalId: habit.goalId,
                title: habit.title,
                pillar: habit.pillar,
                isKeystone: habit.isKeystone,
                frequency: habit.frequency,
                frequencyDetails: habit.frequencyDetails,
                scheduledTime: habit.scheduledTime,
                habitStackTrigger: habit.habitStackTrigger,
                estimatedDuration: habit.estimatedDuration,
                isArchived: habit.isArchived,
                streak: streak ? {
                    currentStreak: streak.currentStreak,
                    longestStreak: streak.longestStreak,
                    lastCheckinDate: streak.lastCheckinDate,
                    weeklyRecoveryUsed: streak.weeklyRecoveryUsed,
                } : null,
                createdAt: habit.createdAt,
                updatedAt: habit.updatedAt,
            };
        };
        return HabitsService_1;
    }());
    __setFunctionName(_classThis, "HabitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HabitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HabitsService = _classThis;
}();
exports.HabitsService = HabitsService;
