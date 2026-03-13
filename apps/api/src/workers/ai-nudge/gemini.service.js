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
exports.GeminiService = void 0;
var common_1 = require("@nestjs/common");
var GeminiService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GeminiService = _classThis = /** @class */ (function () {
        function GeminiService_1() {
            this.logger = new common_1.Logger(GeminiService.name);
            this.apiKey = process.env.GEMINI_API_KEY;
            this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        }
        GeminiService_1.prototype.generateInsight = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var prompt_1, response, data, rawText, clean, parsed, err_1;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            _k.trys.push([0, 3, , 4]);
                            prompt_1 = this.buildPrompt(input);
                            return [4 /*yield*/, fetch("".concat(this.apiUrl, "?key=").concat(this.apiKey), {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        contents: [{ parts: [{ text: prompt_1 }] }],
                                        generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
                                    }),
                                })];
                        case 1:
                            response = _k.sent();
                            if (!response.ok)
                                throw new Error("Gemini API error: ".concat(response.status));
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _k.sent();
                            rawText = (_f = (_e = (_d = (_c = (_b = (_a = data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : '';
                            clean = rawText.replace(/```json|```/g, '').trim();
                            parsed = JSON.parse(clean);
                            return [2 /*return*/, {
                                    headline: String((_g = parsed.headline) !== null && _g !== void 0 ? _g : '').slice(0, 120),
                                    message: String((_h = parsed.message) !== null && _h !== void 0 ? _h : '').slice(0, 400),
                                    cta: String((_j = parsed.cta) !== null && _j !== void 0 ? _j : '').slice(0, 80),
                                }];
                        case 3:
                            err_1 = _k.sent();
                            this.logger.warn("Gemini generation failed \u2014 using fallback. Error: ".concat(err_1.message));
                            return [2 /*return*/, this.fallback(input)];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GeminiService_1.prototype.buildPrompt = function (input) {
            var identityLine = input.identityStatement
                ? "The user's identity statement is: \"".concat(input.identityStatement, "\".")
                : '';
            var keystoneLine = input.keystoneHabit
                ? "Their keystone habit is \"".concat(input.keystoneHabit, "\".")
                : '';
            // Pre-eligibility: educational nudge only — no personal data referenced
            if (!input.isEligible) {
                return "\nYou are RIO, a behavioral coaching AI. The user is new and hasn't built enough history for personalized insights yet.\n\nWrite a short, warm educational nudge to encourage them to keep going.\nFocus on: why small daily habits matter, identity-based motivation, or the science of habit formation.\nDo NOT mention their specific habits or streaks.\nTone: encouraging, warm, clear.\n\nRespond ONLY with a JSON object (no markdown, no preamble):\n{ \"headline\": \"max 10 words\", \"message\": \"max 50 words \u2014 educational tip\", \"cta\": \"max 4 words\" }\n      ".trim();
            }
            return "\nYou are RIO, a behavioral coaching AI that focuses on identity-reinforcement and system-building.\n".concat(identityLine, "\n").concat(keystoneLine, "\n\nUser: ").concat(input.userName, "\nTrigger: ").concat(input.triggerType, "\nTop habit: \"").concat(input.topHabit, "\"\nCurrent streak: ").concat(input.currentStreak, " days\nLongest streak: ").concat(input.longestStreak, " days\n7-day completion rate: ").concat(input.completionRateLast7Days, "%\n\nTrigger context:\n- two_day_risk: User is about to miss two days in a row \u2014 urgently prevent the pattern\n- streak_risk: User has an active streak but missed yesterday \u2014 nudge to protect it today\n- streak_recovery: Streak just reset \u2014 help them reframe as a restart not a failure\n- completion_dropoff: Completion rate dropped below 50% \u2014 identify the friction\n- pillar_imbalance: One life area has zero completions this week \u2014 flag the blind spot\n- momentum: User is on a strong run (5+ days) \u2014 celebrate and reinforce identity\n- weekly_reflection: End of week \u2014 prompt a brief honest reflection\n- fallback: General encouragement aligned with identity\n\nRules:\n- Reference their identity statement if available \u2014 reinforce WHO they are becoming\n- Prioritize the keystone habit if relevant\n- Be a coach, not a cheerleader \u2014 honest, specific, behavioral\n- Max 2 sentences in message. No clich\u00E9s.\n\nRespond ONLY with a JSON object (no markdown, no preamble):\n{ \"headline\": \"max 10 words\", \"message\": \"max 50 words\", \"cta\": \"max 4 words\" }\n    ").trim();
        };
        GeminiService_1.prototype.fallback = function (input) {
            var _a;
            var map = {
                two_day_risk: { headline: "Don't break the chain twice", message: "Two consecutive misses is the pattern that ends streaks. Check in for \"".concat(input.topHabit, "\" today \u2014 one minute counts."), cta: 'Check In Now' },
                streak_risk: { headline: 'Your streak needs you today', message: "You've built ".concat(input.currentStreak, " days on \"").concat(input.topHabit, "\". Yesterday slipped \u2014 don't let today follow."), cta: 'Protect My Streak' },
                streak_recovery: { headline: 'Streaks reset, systems don\'t', message: "A reset is just a restart. The identity you're building \u2014 that didn't reset. Begin again today.", cta: 'Start Again' },
                completion_dropoff: { headline: 'Your completion rate dropped', message: "Only ".concat(input.completionRateLast7Days, "% last week. Something created friction \u2014 identify it and remove one obstacle today."), cta: 'Review My Habits' },
                pillar_imbalance: { headline: 'One area of your life is silent', message: "Balanced growth requires attention across pillars. One of yours had no activity this week.", cta: 'Balance My Pillars' },
                momentum: { headline: "".concat(input.currentStreak, " days and building"), message: "\"".concat(input.topHabit, "\" is becoming who you are. This streak is evidence, not luck."), cta: 'Keep Going' },
                weekly_reflection: { headline: 'How did this week serve you?', message: "Take 60 seconds to reflect on what worked and what to adjust. That's what systems are for.", cta: 'Review My Week' },
                educational: { headline: 'Every check-in is a vote', message: "Each time you complete a habit, you cast a vote for the person you're becoming. Small actions compound.", cta: 'Check In Today' },
                fallback: { headline: 'Your system is waiting', message: "Consistency over intensity. Show up for \"".concat(input.topHabit, "\" today and let the system do its work."), cta: 'Let\'s Go' },
            };
            return (_a = map[input.triggerType]) !== null && _a !== void 0 ? _a : map.fallback;
        };
        return GeminiService_1;
    }());
    __setFunctionName(_classThis, "GeminiService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeminiService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeminiService = _classThis;
}();
exports.GeminiService = GeminiService;
