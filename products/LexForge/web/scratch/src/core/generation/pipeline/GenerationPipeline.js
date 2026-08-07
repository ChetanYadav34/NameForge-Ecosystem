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
exports.GenerationPipeline = void 0;
var InputParserService_1 = require("../services/InputParserService");
var CandidateGenerationService_1 = require("../services/CandidateGenerationService");
var CandidateFilteringService_1 = require("../services/CandidateFilteringService");
var ScoringEngine_1 = require("../services/ScoringEngine");
var RankingEngine_1 = require("../services/RankingEngine");
var QualityGateService_1 = require("../services/QualityGateService");
var ExplanationService_1 = require("../services/ExplanationService");
var ResultFormatter_1 = require("../services/ResultFormatter");
var ResearchLogger_1 = require("../services/ResearchLogger");
var ProviderRegistry_1 = require("../providers/ProviderRegistry");
var DictionaryProvider_1 = require("../providers/DictionaryProvider");
var OtherProviders_1 = require("../providers/OtherProviders");
var EventBus_1 = require("../../events/EventBus");
var GenerationPipeline = /** @class */ (function () {
    function GenerationPipeline() {
        this.parser = new InputParserService_1.InputParserService();
        this.generator = new CandidateGenerationService_1.CandidateGenerationService();
        this.filterService = new CandidateFilteringService_1.CandidateFilteringService();
        this.scorer = new ScoringEngine_1.ScoringEngine();
        this.ranker = new RankingEngine_1.RankingEngine();
        this.gate = new QualityGateService_1.QualityGateService();
        this.explainer = new ExplanationService_1.ExplanationService();
        this.formatter = new ResultFormatter_1.ResultFormatter();
        this.logger = new ResearchLogger_1.ResearchLogger();
    }
    GenerationPipeline.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Register all providers
                        ProviderRegistry_1.Registry.register(new DictionaryProvider_1.DictionaryProvider());
                        ProviderRegistry_1.Registry.register(new OtherProviders_1.SemanticProvider());
                        ProviderRegistry_1.Registry.register(new OtherProviders_1.PsychologyProvider());
                        ProviderRegistry_1.Registry.register(new OtherProviders_1.RankingProvider());
                        // (Phonetic and Ontology are not implemented yet in the mock files, but these are the ones we have)
                        // Log registration
                        console.log('[GenerationPipeline] Registered Providers:', Array.from(((_a = ProviderRegistry_1.Registry.providers) === null || _a === void 0 ? void 0 : _a.keys()) || []));
                        return [4 /*yield*/, ProviderRegistry_1.Registry.initializeAll()];
                    case 1:
                        _b.sent();
                        console.log('[GenerationPipeline] All Providers Initialized');
                        return [2 /*return*/];
                }
            });
        });
    };
    GenerationPipeline.prototype.run = function (input, industry, tone) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, context, rawCandidates, filteredCandidates, scoredCandidates, rankedCandidates, topCandidates, explained, finalResults, _i, finalResults_1, res, executionTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        // 1. Parsing & Context
                        EventBus_1.InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'INPUT_PARSING' });
                        context = this.parser.parse(input, industry, tone);
                        return [4 /*yield*/, this.delay(300)];
                    case 1:
                        _a.sent();
                        // 2. Generation
                        EventBus_1.InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'GENERATING' });
                        return [4 /*yield*/, this.generator.generateCandidates(context, 100)];
                    case 2:
                        rawCandidates = _a.sent();
                        console.log("[GenerationPipeline] Generated Candidates:", rawCandidates.length);
                        return [4 /*yield*/, this.delay(300)];
                    case 3:
                        _a.sent();
                        // 3. Filtering
                        EventBus_1.InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'FILTERING' });
                        filteredCandidates = this.filterService.filter(rawCandidates);
                        console.log("[GenerationPipeline] Filtered Candidates:", filteredCandidates.length);
                        return [4 /*yield*/, this.delay(300)];
                    case 4:
                        _a.sent();
                        // 4. Scoring
                        EventBus_1.InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'EVALUATING' });
                        scoredCandidates = this.scorer.score(filteredCandidates);
                        return [4 /*yield*/, this.delay(300)];
                    case 5:
                        _a.sent();
                        // 5. Ranking
                        EventBus_1.InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'RANKING' });
                        rankedCandidates = this.ranker.rank(scoredCandidates, context);
                        return [4 /*yield*/, this.delay(300)];
                    case 6:
                        _a.sent();
                        topCandidates = this.gate.filter(rankedCandidates, 75).slice(0, 8);
                        // 7. Explanation
                        EventBus_1.InteractionEventBus.emit('FSM_STATE_CHANGE', { state: 'FINALIZING' });
                        explained = this.explainer.explain(topCandidates);
                        return [4 /*yield*/, this.delay(300)];
                    case 7:
                        _a.sent();
                        finalResults = this.formatter.format(explained, context);
                        // 9. Streaming to UI
                        EventBus_1.InteractionEventBus.emit('STREAM_STARTED', { timestamp: Date.now() });
                        _i = 0, finalResults_1 = finalResults;
                        _a.label = 8;
                    case 8:
                        if (!(_i < finalResults_1.length)) return [3 /*break*/, 11];
                        res = finalResults_1[_i];
                        return [4 /*yield*/, this.delay(100)];
                    case 9:
                        _a.sent();
                        EventBus_1.InteractionEventBus.emit('STREAM_CHUNK', { chunk: JSON.stringify(res), timestamp: Date.now() });
                        _a.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        EventBus_1.InteractionEventBus.emit('STREAM_FINISHED', { resultId: 'batch-complete', timestamp: Date.now() });
                        executionTime = Date.now() - startTime;
                        this.logger.logRun(context, rawCandidates.length, filteredCandidates.length, rankedCandidates.length - topCandidates.length, finalResults.length, executionTime);
                        return [2 /*return*/];
                }
            });
        });
    };
    GenerationPipeline.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return GenerationPipeline;
}());
exports.GenerationPipeline = GenerationPipeline;
