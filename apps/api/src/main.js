"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var nestjs_pino_1 = require("nestjs-pino");
var admin = require("firebase-admin");
var app_module_1 = require("./app.module");
var validation_pipe_1 = require("./common/pipes/validation.pipe");
var workers_bootstrap_module_1 = require("./workers/workers-bootstrap.module");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, allowedOrigins, port;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    // ── Firebase Admin SDK init ──────────────────────────────────────────────
                    if (!admin.apps.length && process.env.AUTH_PROVIDER !== 'auth0') {
                        admin.initializeApp({
                            credential: admin.credential.cert({
                                projectId: process.env.FIREBASE_PROJECT_ID,
                                privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
                                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                            }),
                        });
                    }
                    return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, {
                            bufferLogs: true, // Buffer logs until Pino logger is ready
                        })];
                case 1:
                    app = _d.sent();
                    // Pino structured logger
                    app.useLogger(app.get(nestjs_pino_1.Logger));
                    allowedOrigins = ((_b = process.env.CORS_ORIGINS) !== null && _b !== void 0 ? _b : 'http://localhost:5173')
                        .split(',')
                        .map(function (o) { return o.trim(); });
                    app.enableCors({
                        origin: allowedOrigins,
                        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
                        allowedHeaders: ['Authorization', 'Content-Type', 'X-Request-ID', 'X-Tab-ID'],
                        exposedHeaders: ['Retry-After', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
                        credentials: true,
                        maxAge: 86400,
                    });
                    // ── Global pipes ──────────────────────────────────────────────────────────
                    app.useGlobalPipes(validation_pipe_1.validationPipe);
                    // ── Global prefix ─────────────────────────────────────────────────────────
                    app.setGlobalPrefix('v1');
                    port = (_c = process.env.PORT) !== null && _c !== void 0 ? _c : 3000;
                    return [4 /*yield*/, app.listen(port)];
                case 2:
                    _d.sent();
                    console.log("RIO AI API running on port ".concat(port));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * worker.main.ts
 *
 * Separate entry point for the BullMQ worker process.
 * Boots only the WorkersBootstrapModule — no HTTP server, no controllers.
 *
 * This file is compiled to dist/worker.main.js and run by workers.Dockerfile.
 */
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, app;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger = new nestjs_pino_1.Logger('WorkerProcess');
                    // Firebase Admin SDK — needed by processors that verify tokens or call Firebase
                    if (!admin.apps.length && process.env.AUTH_PROVIDER !== 'auth0') {
                        admin.initializeApp({
                            credential: admin.credential.cert({
                                projectId: process.env.FIREBASE_PROJECT_ID,
                                privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
                                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                            }),
                        });
                    }
                    return [4 /*yield*/, core_1.NestFactory.createApplicationContext(workers_bootstrap_module_1.WorkersBootstrapModule, {
                            bufferLogs: true,
                        })];
                case 1:
                    app = _b.sent();
                    // Graceful shutdown — wait for active BullMQ jobs to finish before exiting
                    process.on('SIGTERM', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger.log('SIGTERM received — shutting down workers gracefully...');
                                    return [4 /*yield*/, app.close()];
                                case 1:
                                    _a.sent();
                                    process.exit(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger.log('SIGINT received — shutting down workers gracefully...');
                                    return [4 /*yield*/, app.close()];
                                case 1:
                                    _a.sent();
                                    process.exit(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    logger.log('Worker process started — BullMQ processors are active');
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
