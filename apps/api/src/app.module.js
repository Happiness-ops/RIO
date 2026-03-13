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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var core_1 = require("@nestjs/core");
var throttler_1 = require("@nestjs/throttler");
var bullmq_1 = require("@nestjs/bullmq");
var logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
var app_config_1 = require("./app.config");
var shared_module_1 = require("./shared/shared.module");
var http_exception_filter_1 = require("./common/filters/http-exception.filter");
var jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
// Auth strategies — provided here so JwtAuthGuard can inject them
var firebase_strategy_1 = require("./auth/strategies/firebase.strategy");
var auth0_strategy_1 = require("./auth/strategies/auth0.strategy");
var auth_module_1 = require("./auth/auth.module");
var users_module_1 = require("./users/users.module");
var goals_module_1 = require("./goals/goals.module");
var habits_module_1 = require("./habits/habits.module");
var tasks_module_1 = require("./tasks/tasks.module");
var checkins_module_1 = require("./checkins/checkins.module");
var dashboard_module_1 = require("./dashboard/dashboard.module");
var insights_module_1 = require("./insights/insights.module");
var analytics_module_1 = require("./analytics/analytics.module");
var notifications_module_1 = require("./notifications/notifications.module");
var sessions_module_1 = require("./sessions/sessions.module");
var workers_module_1 = require("./workers/workers.module");
var scorecard_module_1 = require("./scorecard/scorecard.module");
var streak_recovery_module_1 = require("./streak-recovery/streak-recovery.module");
var health_controller_1 = require("./health.controller");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                // Config — loaded first, validates all env vars on startup
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    validate: app_config_1.validate,
                }),
                // Rate limiting — per-route limits configured in each controller
                throttler_1.ThrottlerModule.forRoot([
                    { name: 'default', ttl: 60000, limit: 60 }, // 60 req/min global default
                ]),
                // BullMQ — Redis-backed job queue
                bullmq_1.BullModule.forRoot({
                    connection: { url: process.env.REDIS_URL },
                }),
                // Global services (Prisma + Redis)
                shared_module_1.SharedModule,
                // Domain modules
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                goals_module_1.GoalsModule,
                habits_module_1.HabitsModule,
                tasks_module_1.TasksModule,
                checkins_module_1.CheckinsModule,
                dashboard_module_1.DashboardModule,
                insights_module_1.InsightsModule,
                analytics_module_1.AnalyticsModule,
                notifications_module_1.NotificationsModule,
                sessions_module_1.SessionsModule,
                workers_module_1.WorkersModule,
                scorecard_module_1.ScorecardModule,
                streak_recovery_module_1.StreakRecoveryModule,
            ],
            controllers: [health_controller_1.HealthController],
            providers: [
                // Auth strategies — injected into JwtAuthGuard
                firebase_strategy_1.FirebaseStrategy,
                auth0_strategy_1.Auth0Strategy,
                // Global exception filter — maps all errors to standard envelope
                { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
                // Global rate limiting
                { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
                // Global JWT auth — skipped on @Public() routes
                { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
                { provide: core_1.APP_INTERCEPTOR, useClass: logging_interceptor_1.LoggingInterceptor },
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
