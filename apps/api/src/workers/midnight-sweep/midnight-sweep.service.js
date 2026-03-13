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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidnightSweepService = void 0;
var common_1 = require("@nestjs/common");
var date_fns_1 = require("date-fns");
/**
 * MidnightSweepService
 * Contains the core logic for the midnight sweep worker.
 * Extracted from the processor so it can be unit-tested independently
 * without needing a BullMQ context.
 */
var MidnightSweepService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MidnightSweepService = _classThis = /** @class */ (function () {
        function MidnightSweepService_1(prisma, webPush) {
            this.prisma = prisma;
            this.webPush = webPush;
            this.logger = new common_1.Logger(MidnightSweepService.name);
        }
        /**
         * Returns all users for whom it is currently midnight (00:00–00:30)
         * in their local timezone.
         */
        MidnightSweepService_1.prototype.getUsersAtMidnight = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT id, timezone FROM users\n      WHERE \"isVerified\" = true\n        AND EXTRACT(HOUR   FROM NOW() AT TIME ZONE timezone) = 0\n        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE timezone) < 30\n    "], ["\n      SELECT id, timezone FROM users\n      WHERE \"isVerified\" = true\n        AND EXTRACT(HOUR   FROM NOW() AT TIME ZONE timezone) = 0\n        AND EXTRACT(MINUTE FROM NOW() AT TIME ZONE timezone) < 30\n    "])))];
                });
            });
        };
        /**
         * For a single user:
         *  - Finds all habits that had no check-in yesterday
         *  - Inserts a 'missed' check-in record for each
         *  - Resets the streak to 0 for each affected habit
         *  - Sends a push notification if any streaks were reset
         */
        MidnightSweepService_1.prototype.sweepUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var yesterday, habits, resetCount, _i, habits_1, habit, hadCheckinYesterday, hasActiveStreak, subscriptions;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            yesterday = (0, date_fns_1.subDays)(new Date(), 1);
                            yesterday.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.prisma.habit.findMany({
                                    where: { userId: userId, isArchived: false },
                                    include: {
                                        streak: true,
                                        checkins: {
                                            where: { logDate: { gte: yesterday, lte: yesterday } },
                                        },
                                    },
                                })];
                        case 1:
                            habits = _c.sent();
                            resetCount = 0;
                            _i = 0, habits_1 = habits;
                            _c.label = 2;
                        case 2:
                            if (!(_i < habits_1.length)) return [3 /*break*/, 6];
                            habit = habits_1[_i];
                            hadCheckinYesterday = habit.checkins.length > 0;
                            hasActiveStreak = ((_b = (_a = habit.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0) > 0;
                            if (!(!hadCheckinYesterday && hasActiveStreak)) return [3 /*break*/, 5];
                            // Insert missed record — upsert in case the record was already created
                            return [4 /*yield*/, this.prisma.checkin.upsert({
                                    where: { habitId_logDate: { habitId: habit.id, logDate: yesterday } },
                                    create: { habitId: habit.id, status: 'missed', logDate: yesterday },
                                    update: {},
                                })];
                        case 3:
                            // Insert missed record — upsert in case the record was already created
                            _c.sent();
                            // Reset streak
                            return [4 /*yield*/, this.prisma.streak.update({
                                    where: { habitId: habit.id },
                                    data: { currentStreak: 0 },
                                })];
                        case 4:
                            // Reset streak
                            _c.sent();
                            resetCount++;
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6:
                            if (!(resetCount > 0)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.prisma.userPushSubscription.findMany({
                                    where: { userId: userId },
                                })];
                        case 7:
                            subscriptions = _c.sent();
                            if (!(subscriptions.length > 0)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.webPush.sendToUser(subscriptions.map(function (s) { return ({
                                    id: s.id, endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth,
                                }); }), {
                                    title: 'Streak Reset',
                                    body: "You missed ".concat(resetCount, " habit").concat(resetCount > 1 ? 's' : '', " yesterday. Start fresh today!"),
                                    tag: 'streak-reset',
                                    data: { type: 'streak-reset', url: '/dashboard' },
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
                        case 8:
                            _c.sent();
                            _c.label = 9;
                        case 9: return [2 /*return*/, { resetCount: resetCount }];
                    }
                });
            });
        };
        return MidnightSweepService_1;
    }());
    __setFunctionName(_classThis, "MidnightSweepService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MidnightSweepService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MidnightSweepService = _classThis;
}();
exports.MidnightSweepService = MidnightSweepService;
var templateObject_1;
