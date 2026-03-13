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
exports.ScorecardService = void 0;
var common_1 = require("@nestjs/common");
var MAX_SCORECARD_ENTRIES = 10;
var ScorecardService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ScorecardService = _classThis = /** @class */ (function () {
        function ScorecardService_1(prisma) {
            this.prisma = prisma;
        }
        /**
         * GET /scorecard
         * Returns all scorecard entries for the user, grouped by classification.
         * Used on the Awareness screen before goal creation.
         */
        ScorecardService_1.prototype.getScorecard = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var entries, grouped;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.habitScorecard.findMany({
                                where: { userId: userId },
                                include: { convertedHabit: { select: { id: true, title: true } } },
                                orderBy: { createdAt: 'asc' },
                            })];
                        case 1:
                            entries = _a.sent();
                            grouped = {
                                reinforcing: entries.filter(function (e) { return e.classification === 'reinforcing'; }),
                                neutral: entries.filter(function (e) { return e.classification === 'neutral'; }),
                                conflicting: entries.filter(function (e) { return e.classification === 'conflicting'; }),
                            };
                            return [2 /*return*/, {
                                    entries: entries,
                                    summary: {
                                        total: entries.length,
                                        reinforcing: grouped.reinforcing.length,
                                        neutral: grouped.neutral.length,
                                        conflicting: grouped.conflicting.length,
                                        // The identity this scorecard suggests based on what's reinforcing
                                        identitySignal: grouped.reinforcing.length > 0
                                            ? "You are already reinforcing ".concat(grouped.reinforcing.length, " positive behavior").concat(grouped.reinforcing.length > 1 ? 's' : '', ".")
                                            : null,
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * POST /scorecard
         * Add a behavior to the scorecard. Max 10 entries.
         */
        ScorecardService_1.prototype.addEntry = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var count, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.habitScorecard.count({ where: { userId: userId } })];
                        case 1:
                            count = _a.sent();
                            if (count >= MAX_SCORECARD_ENTRIES) {
                                throw new common_1.BadRequestException("Scorecard is limited to ".concat(MAX_SCORECARD_ENTRIES, " behaviors. ") +
                                    "Review and remove existing entries before adding more.");
                            }
                            return [4 /*yield*/, this.prisma.habitScorecard.create({
                                    data: { userId: userId, behavior: dto.behavior, classification: dto.classification },
                                })];
                        case 2:
                            entry = _a.sent();
                            return [2 /*return*/, entry];
                    }
                });
            });
        };
        /**
         * PATCH /scorecard/:entryId
         * Update the classification of an existing entry.
         */
        ScorecardService_1.prototype.updateEntry = function (userId, entryId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertOwnership(userId, entryId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.prisma.habitScorecard.update({
                                    where: { id: entryId },
                                    data: dto,
                                })];
                    }
                });
            });
        };
        /**
         * DELETE /scorecard/:entryId
         */
        ScorecardService_1.prototype.deleteEntry = function (userId, entryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertOwnership(userId, entryId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.habitScorecard.delete({ where: { id: entryId } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * POST /scorecard/:entryId/convert
         *
         * Epic 2.2 — Promote a reinforcing scorecard entry into a tracked habit.
         * Links the scorecard entry to the new habit so the UI can show the connection.
         */
        ScorecardService_1.prototype.convertToHabit = function (userId, entryId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var entry, goal, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.habitScorecard.findUnique({ where: { id: entryId } })];
                        case 1:
                            entry = _a.sent();
                            if (!entry)
                                throw new common_1.NotFoundException('Scorecard entry not found');
                            if (entry.userId !== userId)
                                throw new common_1.ForbiddenException('Access denied');
                            if (entry.convertedHabitId) {
                                throw new common_1.BadRequestException('This behavior has already been converted to a habit.');
                            }
                            if (entry.classification === 'conflicting') {
                                throw new common_1.BadRequestException('Conflicting behaviors cannot be directly converted to habits. ' +
                                    'Reclassify as reinforcing first if your intent has changed.');
                            }
                            return [4 /*yield*/, this.prisma.goal.findUnique({
                                    where: { id: dto.goalId }, select: { userId: true },
                                })];
                        case 2:
                            goal = _a.sent();
                            if (!goal)
                                throw new common_1.NotFoundException('Goal not found');
                            if (goal.userId !== userId)
                                throw new common_1.ForbiddenException('Access denied');
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var habit, updated;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, tx.habit.create({
                                                    data: {
                                                        userId: userId,
                                                        goalId: dto.goalId,
                                                        title: (_a = dto.title) !== null && _a !== void 0 ? _a : entry.behavior,
                                                        frequency: 'daily',
                                                    },
                                                })];
                                            case 1:
                                                habit = _b.sent();
                                                return [4 /*yield*/, tx.streak.create({
                                                        data: { habitId: habit.id, currentStreak: 0, longestStreak: 0 },
                                                    })];
                                            case 2:
                                                _b.sent();
                                                return [4 /*yield*/, tx.habitScorecard.update({
                                                        where: { id: entryId },
                                                        data: { convertedHabitId: habit.id },
                                                    })];
                                            case 3:
                                                updated = _b.sent();
                                                return [2 /*return*/, { habit: habit, scorecardEntry: updated }];
                                        }
                                    });
                                }); })];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        ScorecardService_1.prototype.assertOwnership = function (userId, entryId) {
            return __awaiter(this, void 0, void 0, function () {
                var entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.habitScorecard.findUnique({
                                where: { id: entryId }, select: { userId: true },
                            })];
                        case 1:
                            entry = _a.sent();
                            if (!entry)
                                throw new common_1.NotFoundException('Scorecard entry not found');
                            if (entry.userId !== userId)
                                throw new common_1.ForbiddenException('Access denied');
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ScorecardService_1;
    }());
    __setFunctionName(_classThis, "ScorecardService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScorecardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScorecardService = _classThis;
}();
exports.ScorecardService = ScorecardService;
