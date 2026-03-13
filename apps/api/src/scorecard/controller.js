"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.ScorecardController = void 0;
// ── scorecard.controller.ts ───────────────────────────────────────────────────
var common_1 = require("@nestjs/common");
var response_helper_1 = require("@/common/types/response.helper");
var ScorecardController = function () {
    var _classDecorators = [(0, common_1.Controller)('scorecard')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getScorecard_decorators;
    var _addEntry_decorators;
    var _updateEntry_decorators;
    var _deleteEntry_decorators;
    var _convertToHabit_decorators;
    var ScorecardController = _classThis = /** @class */ (function () {
        function ScorecardController_1(scorecardService) {
            this.scorecardService = (__runInitializers(this, _instanceExtraInitializers), scorecardService);
        }
        /** GET /v1/scorecard */
        ScorecardController_1.prototype.getScorecard = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.scorecardService.getScorecard(user.dbUserId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, (0, response_helper_1.ok)('Scorecard retrieved', data)];
                    }
                });
            });
        };
        /** POST /v1/scorecard */
        ScorecardController_1.prototype.addEntry = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.scorecardService.addEntry(user.dbUserId, dto)];
                        case 1:
                            entry = _a.sent();
                            return [2 /*return*/, (0, response_helper_1.ok)('Behavior added to scorecard', entry)];
                    }
                });
            });
        };
        /** PATCH /v1/scorecard/:entryId */
        ScorecardController_1.prototype.updateEntry = function (user, entryId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.scorecardService.updateEntry(user.dbUserId, entryId, dto)];
                        case 1:
                            entry = _a.sent();
                            return [2 /*return*/, (0, response_helper_1.ok)('Scorecard entry updated', entry)];
                    }
                });
            });
        };
        /** DELETE /v1/scorecard/:entryId */
        ScorecardController_1.prototype.deleteEntry = function (user, entryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.scorecardService.deleteEntry(user.dbUserId, entryId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, (0, response_helper_1.ok)('Scorecard entry deleted', null)];
                    }
                });
            });
        };
        /** POST /v1/scorecard/:entryId/convert */
        ScorecardController_1.prototype.convertToHabit = function (user, entryId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.scorecardService.convertToHabit(user.dbUserId, entryId, dto)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, (0, response_helper_1.ok)('Behavior converted to tracked habit', result)];
                    }
                });
            });
        };
        return ScorecardController_1;
    }());
    __setFunctionName(_classThis, "ScorecardController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getScorecard_decorators = [(0, common_1.Get)()];
        _addEntry_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _updateEntry_decorators = [(0, common_1.Patch)(':entryId')];
        _deleteEntry_decorators = [(0, common_1.Delete)(':entryId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _convertToHabit_decorators = [(0, common_1.Post)(':entryId/convert'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        __esDecorate(_classThis, null, _getScorecard_decorators, { kind: "method", name: "getScorecard", static: false, private: false, access: { has: function (obj) { return "getScorecard" in obj; }, get: function (obj) { return obj.getScorecard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addEntry_decorators, { kind: "method", name: "addEntry", static: false, private: false, access: { has: function (obj) { return "addEntry" in obj; }, get: function (obj) { return obj.addEntry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateEntry_decorators, { kind: "method", name: "updateEntry", static: false, private: false, access: { has: function (obj) { return "updateEntry" in obj; }, get: function (obj) { return obj.updateEntry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteEntry_decorators, { kind: "method", name: "deleteEntry", static: false, private: false, access: { has: function (obj) { return "deleteEntry" in obj; }, get: function (obj) { return obj.deleteEntry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _convertToHabit_decorators, { kind: "method", name: "convertToHabit", static: false, private: false, access: { has: function (obj) { return "convertToHabit" in obj; }, get: function (obj) { return obj.convertToHabit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScorecardController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScorecardController = _classThis;
}();
exports.ScorecardController = ScorecardController;
