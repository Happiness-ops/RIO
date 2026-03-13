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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1(prisma) {
            this.prisma = prisma;
        }
        UsersService_1.prototype.getProfile = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: userId },
                                include: { profile: true },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException('User not found');
                            return [2 /*return*/, this.format(user)];
                    }
                });
            });
        };
        // Epic 8 — behavioral snapshot for profile screen
        UsersService_1.prototype.getBehavioralSnapshot = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, habits, recentCheckins, weeklyReviews, keystoneHabit, pillarMap, _loop_1, _i, habits_1, habit, pillarRates, byRateDesc, byRateAsc, recentCompleted, recentTotal, riskScore;
                var _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.habit.findMany({
                                    where: { userId: userId, isArchived: false },
                                    include: { streak: true },
                                }),
                                this.prisma.checkin.findMany({
                                    where: {
                                        habit: { userId: userId },
                                        logDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                                    },
                                }),
                                this.prisma.weeklyReview.findMany({
                                    where: { userId: userId },
                                    orderBy: { createdAt: 'desc' },
                                    take: 4,
                                }),
                            ])];
                        case 1:
                            _a = _g.sent(), habits = _a[0], recentCheckins = _a[1], weeklyReviews = _a[2];
                            keystoneHabit = (_b = habits.find(function (h) { return h.isKeystone; })) !== null && _b !== void 0 ? _b : null;
                            pillarMap = {};
                            _loop_1 = function (habit) {
                                if (!habit.pillar)
                                    return "continue";
                                if (!pillarMap[habit.pillar])
                                    pillarMap[habit.pillar] = { total: 0, completed: 0 };
                                var hCheckins = recentCheckins.filter(function (c) { return c.habitId === habit.id; });
                                pillarMap[habit.pillar].total += hCheckins.length;
                                pillarMap[habit.pillar].completed += hCheckins.filter(function (c) { return c.status === 'completed'; }).length;
                            };
                            for (_i = 0, habits_1 = habits; _i < habits_1.length; _i++) {
                                habit = habits_1[_i];
                                _loop_1(habit);
                            }
                            pillarRates = Object.entries(pillarMap).map(function (_a) {
                                var pillar = _a[0], d = _a[1];
                                return ({
                                    pillar: pillar,
                                    rate: d.total ? Math.round((d.completed / d.total) * 100) : 0,
                                });
                            });
                            byRateDesc = __spreadArray([], pillarRates, true).sort(function (a, b) { return b.rate - a.rate; });
                            byRateAsc = __spreadArray([], pillarRates, true).sort(function (a, b) { return a.rate - b.rate; });
                            recentCompleted = recentCheckins.filter(function (c) { return c.status === 'completed'; }).length;
                            recentTotal = recentCheckins.length;
                            riskScore = recentTotal
                                ? Math.round((1 - recentCompleted / recentTotal) * 100)
                                : 0;
                            return [2 /*return*/, {
                                    activeHabits: habits.length,
                                    keystoneHabit: keystoneHabit ? { id: keystoneHabit.id, title: keystoneHabit.title } : null,
                                    strongestPillar: (_d = (_c = byRateDesc[0]) === null || _c === void 0 ? void 0 : _c.pillar) !== null && _d !== void 0 ? _d : null,
                                    weakestPillar: (_f = (_e = byRateAsc[0]) === null || _e === void 0 ? void 0 : _e.pillar) !== null && _f !== void 0 ? _f : null,
                                    weeklyConsistencyAverage: weeklyReviews.length
                                        ? Math.round(weeklyReviews.reduce(function (s, r) { return s + r.consistencyScore; }, 0) / weeklyReviews.length)
                                        : null,
                                    streakAverage: habits.length
                                        ? Math.round(habits.reduce(function (s, h) { var _a, _b; return s + ((_b = (_a = h.streak) === null || _a === void 0 ? void 0 : _a.currentStreak) !== null && _b !== void 0 ? _b : 0); }, 0) / habits.length)
                                        : 0,
                                    riskScore: riskScore,
                                }];
                    }
                });
            });
        };
        UsersService_1.prototype.updateProfile = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var timezone, profileFields, profileData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timezone = dto.timezone, profileFields = __rest(dto, ["timezone"]);
                            if (!timezone) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { timezone: timezone },
                                })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            profileData = __assign({}, profileFields);
                            if (identityStatement !== undefined)
                                profileData.identityStatement = identityStatement;
                            if (growthIntention !== undefined)
                                profileData.growthIntention = growthIntention;
                            if (selectedPillars !== undefined)
                                profileData.selectedPillars = selectedPillars;
                            // Upsert profile (handles edge case where profile row doesn't exist yet)
                            return [4 /*yield*/, this.prisma.userProfile.upsert({
                                    where: { userId: userId },
                                    create: __assign({ userId: userId }, profileData),
                                    update: profileData,
                                })];
                        case 3:
                            // Upsert profile (handles edge case where profile row doesn't exist yet)
                            _a.sent();
                            return [2 /*return*/, this.getProfile(userId)];
                    }
                });
            });
        };
        UsersService_1.prototype.deleteAccount = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Soft-delete: mark user as unverified immediately so they cannot log in.
                        // The DataErasure worker will hard-delete all data after 30 days.
                        return [4 /*yield*/, this.prisma.user.update({
                                where: { id: userId },
                                data: { isVerified: false },
                            })];
                        case 1:
                            // Soft-delete: mark user as unverified immediately so they cannot log in.
                            // The DataErasure worker will hard-delete all data after 30 days.
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        UsersService_1.prototype.formatProfile = function (user) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return {
                id: user.id,
                email: user.email,
                authProvider: user.authProvider,
                timezone: user.timezone,
                isVerified: user.isVerified,
                fullName: (_b = (_a = user.profile) === null || _a === void 0 ? void 0 : _a.fullName) !== null && _b !== void 0 ? _b : null,
                avatarUrl: (_d = (_c = user.profile) === null || _c === void 0 ? void 0 : _c.avatarUrl) !== null && _d !== void 0 ? _d : null,
                bio: (_f = (_e = user.profile) === null || _e === void 0 ? void 0 : _e.bio) !== null && _f !== void 0 ? _f : null,
                identityStatement: (_h = (_g = user.profile) === null || _g === void 0 ? void 0 : _g.identityStatement) !== null && _h !== void 0 ? _h : null,
                growthIntention: (_k = (_j = user.profile) === null || _j === void 0 ? void 0 : _j.growthIntention) !== null && _k !== void 0 ? _k : null,
                selectedPillars: (_m = (_l = user.profile) === null || _l === void 0 ? void 0 : _l.selectedPillars) !== null && _m !== void 0 ? _m : [],
                onboardingCompleted: (_p = (_o = user.profile) === null || _o === void 0 ? void 0 : _o.onboardingCompleted) !== null && _p !== void 0 ? _p : false,
                preferences: (_r = (_q = user.profile) === null || _q === void 0 ? void 0 : _q.preferences) !== null && _r !== void 0 ? _r : {},
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
