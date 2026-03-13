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
exports.validate = validate;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Production"] = "production";
    Environment["Test"] = "test";
})(Environment || (Environment = {}));
var EnvironmentVariables = function () {
    var _a;
    var _NODE_ENV_decorators;
    var _NODE_ENV_initializers = [];
    var _NODE_ENV_extraInitializers = [];
    var _DATABASE_URL_decorators;
    var _DATABASE_URL_initializers = [];
    var _DATABASE_URL_extraInitializers = [];
    var _REDIS_URL_decorators;
    var _REDIS_URL_initializers = [];
    var _REDIS_URL_extraInitializers = [];
    var _AUTH_PROVIDER_decorators;
    var _AUTH_PROVIDER_initializers = [];
    var _AUTH_PROVIDER_extraInitializers = [];
    var _FIREBASE_PROJECT_ID_decorators;
    var _FIREBASE_PROJECT_ID_initializers = [];
    var _FIREBASE_PROJECT_ID_extraInitializers = [];
    var _FIREBASE_PRIVATE_KEY_decorators;
    var _FIREBASE_PRIVATE_KEY_initializers = [];
    var _FIREBASE_PRIVATE_KEY_extraInitializers = [];
    var _FIREBASE_CLIENT_EMAIL_decorators;
    var _FIREBASE_CLIENT_EMAIL_initializers = [];
    var _FIREBASE_CLIENT_EMAIL_extraInitializers = [];
    var _AUTH0_DOMAIN_decorators;
    var _AUTH0_DOMAIN_initializers = [];
    var _AUTH0_DOMAIN_extraInitializers = [];
    var _AUTH0_AUDIENCE_decorators;
    var _AUTH0_AUDIENCE_initializers = [];
    var _AUTH0_AUDIENCE_extraInitializers = [];
    var _GEMINI_API_KEY_decorators;
    var _GEMINI_API_KEY_initializers = [];
    var _GEMINI_API_KEY_extraInitializers = [];
    var _VAPID_PUBLIC_KEY_decorators;
    var _VAPID_PUBLIC_KEY_initializers = [];
    var _VAPID_PUBLIC_KEY_extraInitializers = [];
    var _VAPID_PRIVATE_KEY_decorators;
    var _VAPID_PRIVATE_KEY_initializers = [];
    var _VAPID_PRIVATE_KEY_extraInitializers = [];
    var _VAPID_EMAIL_decorators;
    var _VAPID_EMAIL_initializers = [];
    var _VAPID_EMAIL_extraInitializers = [];
    var _CORS_ORIGINS_decorators;
    var _CORS_ORIGINS_initializers = [];
    var _CORS_ORIGINS_extraInitializers = [];
    var _SENTRY_DSN_decorators;
    var _SENTRY_DSN_initializers = [];
    var _SENTRY_DSN_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EnvironmentVariables() {
                this.NODE_ENV = __runInitializers(this, _NODE_ENV_initializers, Environment.Development);
                this.DATABASE_URL = (__runInitializers(this, _NODE_ENV_extraInitializers), __runInitializers(this, _DATABASE_URL_initializers, void 0));
                this.REDIS_URL = (__runInitializers(this, _DATABASE_URL_extraInitializers), __runInitializers(this, _REDIS_URL_initializers, void 0));
                this.AUTH_PROVIDER = (__runInitializers(this, _REDIS_URL_extraInitializers), __runInitializers(this, _AUTH_PROVIDER_initializers, void 0));
                this.FIREBASE_PROJECT_ID = (__runInitializers(this, _AUTH_PROVIDER_extraInitializers), __runInitializers(this, _FIREBASE_PROJECT_ID_initializers, void 0));
                this.FIREBASE_PRIVATE_KEY = (__runInitializers(this, _FIREBASE_PROJECT_ID_extraInitializers), __runInitializers(this, _FIREBASE_PRIVATE_KEY_initializers, void 0));
                this.FIREBASE_CLIENT_EMAIL = (__runInitializers(this, _FIREBASE_PRIVATE_KEY_extraInitializers), __runInitializers(this, _FIREBASE_CLIENT_EMAIL_initializers, void 0));
                this.AUTH0_DOMAIN = (__runInitializers(this, _FIREBASE_CLIENT_EMAIL_extraInitializers), __runInitializers(this, _AUTH0_DOMAIN_initializers, void 0));
                this.AUTH0_AUDIENCE = (__runInitializers(this, _AUTH0_DOMAIN_extraInitializers), __runInitializers(this, _AUTH0_AUDIENCE_initializers, void 0));
                this.GEMINI_API_KEY = (__runInitializers(this, _AUTH0_AUDIENCE_extraInitializers), __runInitializers(this, _GEMINI_API_KEY_initializers, void 0));
                this.VAPID_PUBLIC_KEY = (__runInitializers(this, _GEMINI_API_KEY_extraInitializers), __runInitializers(this, _VAPID_PUBLIC_KEY_initializers, void 0));
                this.VAPID_PRIVATE_KEY = (__runInitializers(this, _VAPID_PUBLIC_KEY_extraInitializers), __runInitializers(this, _VAPID_PRIVATE_KEY_initializers, void 0));
                this.VAPID_EMAIL = (__runInitializers(this, _VAPID_PRIVATE_KEY_extraInitializers), __runInitializers(this, _VAPID_EMAIL_initializers, void 0));
                this.CORS_ORIGINS = (__runInitializers(this, _VAPID_EMAIL_extraInitializers), __runInitializers(this, _CORS_ORIGINS_initializers, void 0));
                this.SENTRY_DSN = (__runInitializers(this, _CORS_ORIGINS_extraInitializers), __runInitializers(this, _SENTRY_DSN_initializers, void 0));
                __runInitializers(this, _SENTRY_DSN_extraInitializers);
            }
            return EnvironmentVariables;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _NODE_ENV_decorators = [(0, class_validator_1.IsEnum)(Environment)];
            _DATABASE_URL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _REDIS_URL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _AUTH_PROVIDER_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _FIREBASE_PROJECT_ID_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _FIREBASE_PRIVATE_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _FIREBASE_CLIENT_EMAIL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _AUTH0_DOMAIN_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _AUTH0_AUDIENCE_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _GEMINI_API_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _VAPID_PUBLIC_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _VAPID_PRIVATE_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _VAPID_EMAIL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _CORS_ORIGINS_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _SENTRY_DSN_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _NODE_ENV_decorators, { kind: "field", name: "NODE_ENV", static: false, private: false, access: { has: function (obj) { return "NODE_ENV" in obj; }, get: function (obj) { return obj.NODE_ENV; }, set: function (obj, value) { obj.NODE_ENV = value; } }, metadata: _metadata }, _NODE_ENV_initializers, _NODE_ENV_extraInitializers);
            __esDecorate(null, null, _DATABASE_URL_decorators, { kind: "field", name: "DATABASE_URL", static: false, private: false, access: { has: function (obj) { return "DATABASE_URL" in obj; }, get: function (obj) { return obj.DATABASE_URL; }, set: function (obj, value) { obj.DATABASE_URL = value; } }, metadata: _metadata }, _DATABASE_URL_initializers, _DATABASE_URL_extraInitializers);
            __esDecorate(null, null, _REDIS_URL_decorators, { kind: "field", name: "REDIS_URL", static: false, private: false, access: { has: function (obj) { return "REDIS_URL" in obj; }, get: function (obj) { return obj.REDIS_URL; }, set: function (obj, value) { obj.REDIS_URL = value; } }, metadata: _metadata }, _REDIS_URL_initializers, _REDIS_URL_extraInitializers);
            __esDecorate(null, null, _AUTH_PROVIDER_decorators, { kind: "field", name: "AUTH_PROVIDER", static: false, private: false, access: { has: function (obj) { return "AUTH_PROVIDER" in obj; }, get: function (obj) { return obj.AUTH_PROVIDER; }, set: function (obj, value) { obj.AUTH_PROVIDER = value; } }, metadata: _metadata }, _AUTH_PROVIDER_initializers, _AUTH_PROVIDER_extraInitializers);
            __esDecorate(null, null, _FIREBASE_PROJECT_ID_decorators, { kind: "field", name: "FIREBASE_PROJECT_ID", static: false, private: false, access: { has: function (obj) { return "FIREBASE_PROJECT_ID" in obj; }, get: function (obj) { return obj.FIREBASE_PROJECT_ID; }, set: function (obj, value) { obj.FIREBASE_PROJECT_ID = value; } }, metadata: _metadata }, _FIREBASE_PROJECT_ID_initializers, _FIREBASE_PROJECT_ID_extraInitializers);
            __esDecorate(null, null, _FIREBASE_PRIVATE_KEY_decorators, { kind: "field", name: "FIREBASE_PRIVATE_KEY", static: false, private: false, access: { has: function (obj) { return "FIREBASE_PRIVATE_KEY" in obj; }, get: function (obj) { return obj.FIREBASE_PRIVATE_KEY; }, set: function (obj, value) { obj.FIREBASE_PRIVATE_KEY = value; } }, metadata: _metadata }, _FIREBASE_PRIVATE_KEY_initializers, _FIREBASE_PRIVATE_KEY_extraInitializers);
            __esDecorate(null, null, _FIREBASE_CLIENT_EMAIL_decorators, { kind: "field", name: "FIREBASE_CLIENT_EMAIL", static: false, private: false, access: { has: function (obj) { return "FIREBASE_CLIENT_EMAIL" in obj; }, get: function (obj) { return obj.FIREBASE_CLIENT_EMAIL; }, set: function (obj, value) { obj.FIREBASE_CLIENT_EMAIL = value; } }, metadata: _metadata }, _FIREBASE_CLIENT_EMAIL_initializers, _FIREBASE_CLIENT_EMAIL_extraInitializers);
            __esDecorate(null, null, _AUTH0_DOMAIN_decorators, { kind: "field", name: "AUTH0_DOMAIN", static: false, private: false, access: { has: function (obj) { return "AUTH0_DOMAIN" in obj; }, get: function (obj) { return obj.AUTH0_DOMAIN; }, set: function (obj, value) { obj.AUTH0_DOMAIN = value; } }, metadata: _metadata }, _AUTH0_DOMAIN_initializers, _AUTH0_DOMAIN_extraInitializers);
            __esDecorate(null, null, _AUTH0_AUDIENCE_decorators, { kind: "field", name: "AUTH0_AUDIENCE", static: false, private: false, access: { has: function (obj) { return "AUTH0_AUDIENCE" in obj; }, get: function (obj) { return obj.AUTH0_AUDIENCE; }, set: function (obj, value) { obj.AUTH0_AUDIENCE = value; } }, metadata: _metadata }, _AUTH0_AUDIENCE_initializers, _AUTH0_AUDIENCE_extraInitializers);
            __esDecorate(null, null, _GEMINI_API_KEY_decorators, { kind: "field", name: "GEMINI_API_KEY", static: false, private: false, access: { has: function (obj) { return "GEMINI_API_KEY" in obj; }, get: function (obj) { return obj.GEMINI_API_KEY; }, set: function (obj, value) { obj.GEMINI_API_KEY = value; } }, metadata: _metadata }, _GEMINI_API_KEY_initializers, _GEMINI_API_KEY_extraInitializers);
            __esDecorate(null, null, _VAPID_PUBLIC_KEY_decorators, { kind: "field", name: "VAPID_PUBLIC_KEY", static: false, private: false, access: { has: function (obj) { return "VAPID_PUBLIC_KEY" in obj; }, get: function (obj) { return obj.VAPID_PUBLIC_KEY; }, set: function (obj, value) { obj.VAPID_PUBLIC_KEY = value; } }, metadata: _metadata }, _VAPID_PUBLIC_KEY_initializers, _VAPID_PUBLIC_KEY_extraInitializers);
            __esDecorate(null, null, _VAPID_PRIVATE_KEY_decorators, { kind: "field", name: "VAPID_PRIVATE_KEY", static: false, private: false, access: { has: function (obj) { return "VAPID_PRIVATE_KEY" in obj; }, get: function (obj) { return obj.VAPID_PRIVATE_KEY; }, set: function (obj, value) { obj.VAPID_PRIVATE_KEY = value; } }, metadata: _metadata }, _VAPID_PRIVATE_KEY_initializers, _VAPID_PRIVATE_KEY_extraInitializers);
            __esDecorate(null, null, _VAPID_EMAIL_decorators, { kind: "field", name: "VAPID_EMAIL", static: false, private: false, access: { has: function (obj) { return "VAPID_EMAIL" in obj; }, get: function (obj) { return obj.VAPID_EMAIL; }, set: function (obj, value) { obj.VAPID_EMAIL = value; } }, metadata: _metadata }, _VAPID_EMAIL_initializers, _VAPID_EMAIL_extraInitializers);
            __esDecorate(null, null, _CORS_ORIGINS_decorators, { kind: "field", name: "CORS_ORIGINS", static: false, private: false, access: { has: function (obj) { return "CORS_ORIGINS" in obj; }, get: function (obj) { return obj.CORS_ORIGINS; }, set: function (obj, value) { obj.CORS_ORIGINS = value; } }, metadata: _metadata }, _CORS_ORIGINS_initializers, _CORS_ORIGINS_extraInitializers);
            __esDecorate(null, null, _SENTRY_DSN_decorators, { kind: "field", name: "SENTRY_DSN", static: false, private: false, access: { has: function (obj) { return "SENTRY_DSN" in obj; }, get: function (obj) { return obj.SENTRY_DSN; }, set: function (obj, value) { obj.SENTRY_DSN = value; } }, metadata: _metadata }, _SENTRY_DSN_initializers, _SENTRY_DSN_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
function validate(config) {
    var validated = (0, class_transformer_1.plainToInstance)(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    var errors = (0, class_validator_1.validateSync)(validated, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error("Config validation failed:\n".concat(errors.toString()));
    }
    return validated;
}
