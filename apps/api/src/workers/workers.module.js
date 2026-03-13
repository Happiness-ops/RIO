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
exports.WorkersBootstrapModule = exports.WorkersModule = void 0;
var common_1 = require("@nestjs/common");
var bullmq_1 = require("@nestjs/bullmq");
var config_1 = require("@nestjs/config");
var app_config_1 = require("@/app.config");
var shared_module_1 = require("@/shared/shared.module");
var workers_module_1 = require("./workers.module");
Object.defineProperty(exports, "WorkersModule", { enumerable: true, get: function () { return workers_module_1.WorkersModule; } });
var ai_nudge_processor_1 = require("./ai-nudge/ai-nudge.processor");
var gemini_service_1 = require("./ai-nudge/gemini.service");
var midnight_sweep_processor_1 = require("./midnight-sweep/midnight-sweep.processor");
var data_erasure_processor_1 = require("./data-erasure/data-erasure.processor");
var heartbeat_cleanup_processor_1 = require("./heartbeat-cleanup/heartbeat-cleanup.processor");
var notifications_module_1 = require("@/notifications/notifications.module");
var QUEUE_CONFIG = {
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 500 },
    },
};
var WorkersModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                notifications_module_1.NotificationsModule, // Provides WebPushService to processors
                bullmq_1.BullModule.registerQueue(__assign({ name: ai_nudge_processor_1.AI_NUDGE_QUEUE }, QUEUE_CONFIG), __assign({ name: midnight_sweep_processor_1.MIDNIGHT_SWEEP_QUEUE }, QUEUE_CONFIG), __assign({ name: data_erasure_processor_1.DATA_ERASURE_QUEUE }, QUEUE_CONFIG), __assign({ name: heartbeat_cleanup_processor_1.HEARTBEAT_CLEANUP_QUEUE }, QUEUE_CONFIG)),
            ],
            providers: [
                ai_nudge_processor_1.AiNudgeProcessor,
                gemini_service_1.GeminiService,
                midnight_sweep_processor_1.MidnightSweepProcessor,
                data_erasure_processor_1.DataErasureProcessor,
                heartbeat_cleanup_processor_1.HeartbeatCleanupProcessor,
            ],
            exports: [
                bullmq_1.BullModule, // So UsersService can inject the DataErasure queue
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkersModule = _classThis = /** @class */ (function () {
        function WorkersModule_1(aiNudgeQueue, midnightSweepQueue, heartbeatCleanupQueue) {
            this.aiNudgeQueue = aiNudgeQueue;
            this.midnightSweepQueue = midnightSweepQueue;
            this.heartbeatCleanupQueue = heartbeatCleanupQueue;
            this.logger = new common_1.Logger(workers_module_1.WorkersModule.name);
        }
        /**
         * Schedule recurring jobs on startup using upsertJobScheduler.
         * Idempotent — safe to run on every restart.
         */
        WorkersModule_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Every hour — processes users whose local time is 6AM
                        return [4 /*yield*/, this.aiNudgeQueue.upsertJobScheduler('ai-nudge-hourly', { every: 60 * 60 * 1000 }, { name: 'run', data: {} })];
                        case 1:
                            // Every hour — processes users whose local time is 6AM
                            _a.sent();
                            // Every hour — processes users whose local time is midnight
                            return [4 /*yield*/, this.midnightSweepQueue.upsertJobScheduler('midnight-sweep-hourly', { every: 60 * 60 * 1000 }, { name: 'run', data: {} })];
                        case 2:
                            // Every hour — processes users whose local time is midnight
                            _a.sent();
                            // Every 10 minutes — counts active sessions
                            return [4 /*yield*/, this.heartbeatCleanupQueue.upsertJobScheduler('heartbeat-cleanup', { every: 10 * 60 * 1000 }, { name: 'run', data: {} })];
                        case 3:
                            // Every 10 minutes — counts active sessions
                            _a.sent();
                            this.logger.log('Worker schedules registered');
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WorkersModule_1;
    }());
    __setFunctionName(_classThis, "WorkersModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkersModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkersModule = _classThis;
}();
exports.WorkersModule = WorkersModule;
/**
 * WorkersBootstrapModule
 *
 * Minimal root module for the worker process.
 * Does NOT import HTTP controllers, guards, or any web-facing infrastructure.
 * Only what BullMQ processors need: Config, SharedModule (Prisma + Redis), WorkersModule.
 */
var WorkersBootstrapModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true, validate: app_config_1.validate }),
                bullmq_1.BullModule.forRoot({
                    connection: { url: process.env.REDIS_URL },
                }),
                shared_module_1.SharedModule,
                workers_module_1.WorkersModule,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkersBootstrapModule = _classThis = /** @class */ (function () {
        function WorkersBootstrapModule_1() {
        }
        return WorkersBootstrapModule_1;
    }());
    __setFunctionName(_classThis, "WorkersBootstrapModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkersBootstrapModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkersBootstrapModule = _classThis;
}();
exports.WorkersBootstrapModule = WorkersBootstrapModule;
