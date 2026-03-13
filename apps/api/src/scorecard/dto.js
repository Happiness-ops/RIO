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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertToHabitDto = exports.UpdateScorecardEntryDto = exports.CreateScorecardEntryDto = void 0;
var client_1 = require("@prisma/client");
var class_validator_1 = require("class-validator");
var CreateScorecardEntryDto = function () {
    var _a;
    var _behavior_decorators;
    var _behavior_initializers = [];
    var _behavior_extraInitializers = [];
    var _classification_decorators;
    var _classification_initializers = [];
    var _classification_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateScorecardEntryDto() {
                this.behavior = __runInitializers(this, _behavior_initializers, void 0); // "I go to the gym every morning"
                this.classification = (__runInitializers(this, _behavior_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
                __runInitializers(this, _classification_extraInitializers);
            }
            return CreateScorecardEntryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _behavior_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _classification_decorators = [(0, class_validator_1.IsEnum)(client_1.ScorecardClassification)];
            __esDecorate(null, null, _behavior_decorators, { kind: "field", name: "behavior", static: false, private: false, access: { has: function (obj) { return "behavior" in obj; }, get: function (obj) { return obj.behavior; }, set: function (obj, value) { obj.behavior = value; } }, metadata: _metadata }, _behavior_initializers, _behavior_extraInitializers);
            __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: function (obj) { return "classification" in obj; }, get: function (obj) { return obj.classification; }, set: function (obj, value) { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateScorecardEntryDto = CreateScorecardEntryDto;
var UpdateScorecardEntryDto = function () {
    var _a;
    var _classification_decorators;
    var _classification_initializers = [];
    var _classification_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateScorecardEntryDto() {
                this.classification = __runInitializers(this, _classification_initializers, void 0);
                __runInitializers(this, _classification_extraInitializers);
            }
            return UpdateScorecardEntryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _classification_decorators = [(0, class_validator_1.IsEnum)(client_1.ScorecardClassification), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: function (obj) { return "classification" in obj; }, get: function (obj) { return obj.classification; }, set: function (obj, value) { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateScorecardEntryDto = UpdateScorecardEntryDto;
var ConvertToHabitDto = function () {
    var _a;
    var _goalId_decorators;
    var _goalId_initializers = [];
    var _goalId_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ConvertToHabitDto() {
                // The goalId to attach the new habit to
                this.goalId = __runInitializers(this, _goalId_initializers, void 0);
                // Optional overrides for the auto-created habit
                this.title = (__runInitializers(this, _goalId_extraInitializers), __runInitializers(this, _title_initializers, void 0)); // Defaults to the scorecard behavior text
                __runInitializers(this, _title_extraInitializers);
            }
            return ConvertToHabitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _goalId_decorators = [(0, class_validator_1.IsUUID)()];
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(255)];
            __esDecorate(null, null, _goalId_decorators, { kind: "field", name: "goalId", static: false, private: false, access: { has: function (obj) { return "goalId" in obj; }, get: function (obj) { return obj.goalId; }, set: function (obj, value) { obj.goalId = value; } }, metadata: _metadata }, _goalId_initializers, _goalId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ConvertToHabitDto = ConvertToHabitDto;
