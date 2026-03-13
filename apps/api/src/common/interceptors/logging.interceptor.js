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
exports.LoggingInterceptor = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var uuid_1 = require("uuid");
/**
 * LoggingInterceptor — registered globally in app.module.ts.
 *
 * Per request it:
 *  - Generates a unique requestId (UUID v4)
 *  - Attaches requestId to the response header (X-Request-ID)
 *  - Logs method, url, statusCode, responseTime, userId on completion
 *  - Redacts Authorization header and sensitive body fields from logs
 */
var LoggingInterceptor = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LoggingInterceptor = _classThis = /** @class */ (function () {
        function LoggingInterceptor_1() {
            this.logger = new common_1.Logger('HTTP');
        }
        LoggingInterceptor_1.prototype.intercept = function (context, next) {
            var _this = this;
            var _a;
            var req = context.switchToHttp().getRequest();
            var res = context.switchToHttp().getResponse();
            var start = Date.now();
            // Generate or carry forward the request ID
            var requestId = (_a = req.headers['x-request-id']) !== null && _a !== void 0 ? _a : (0, uuid_1.v4)();
            res.setHeader('X-Request-ID', requestId);
            // Attach to request for downstream use (e.g. in services for correlation)
            req.requestId = requestId;
            return next.handle().pipe((0, rxjs_1.tap)({
                next: function () {
                    var _a, _b, _c;
                    var ms = Date.now() - start;
                    var userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.dbUserId) !== null && _b !== void 0 ? _b : 'anonymous';
                    var tabId = (_c = req.headers['x-tab-id']) !== null && _c !== void 0 ? _c : '-';
                    _this.logger.log({
                        requestId: requestId,
                        userId: userId,
                        tabId: tabId,
                        method: req.method,
                        url: req.url,
                        statusCode: res.statusCode,
                        responseTime: "".concat(ms, "ms"),
                    });
                },
                error: function (err) {
                    var _a, _b, _c;
                    var ms = Date.now() - start;
                    var userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.dbUserId) !== null && _b !== void 0 ? _b : 'anonymous';
                    _this.logger.warn({
                        requestId: requestId,
                        userId: userId,
                        method: req.method,
                        url: req.url,
                        statusCode: (_c = err.status) !== null && _c !== void 0 ? _c : 500,
                        responseTime: "".concat(ms, "ms"),
                        error: err.message,
                    });
                },
            }));
        };
        return LoggingInterceptor_1;
    }());
    __setFunctionName(_classThis, "LoggingInterceptor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoggingInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoggingInterceptor = _classThis;
}();
exports.LoggingInterceptor = LoggingInterceptor;
