"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultFormatter = void 0;
var ResultFormatter = /** @class */ (function () {
    function ResultFormatter() {
    }
    ResultFormatter.prototype.format = function (candidates, context) {
        return candidates.map(function (c, index) {
            // Capitalize first letter
            var name = c.word.charAt(0).toUpperCase() + c.word.slice(1);
            return {
                id: crypto.randomUUID(),
                name: name,
                pronunciation: "/".concat(c.word.toLowerCase(), "/"), // Mocked IPA for now
                meaning: c.explanations.meaning,
                linguisticRoot: c.explanations.rootBreakdown,
                culturalContext: c.explanations.psychologicalReasoning,
                semanticScore: c.scores.semantic,
                brandScore: c.scores.brandability,
                availability: Math.random() > 0.5,
                // Future extensions as requested
                domainStatus: 'UNKNOWN',
                trademarkStatus: 'UNKNOWN',
                socialHandleStatus: 'UNKNOWN',
                collisionRisk: 'LOW',
                reasoning: c.explanations.brandabilityExplanation,
                generationStrategy: c.strategyId,
                engineVersion: '1.0.0',
                pipelineVersion: '1.0.0',
                datasetVersion: 'v1',
                emotionProfile: { trust: 80, luxury: 70 },
                brandArchetype: 'Creator',
                phoneticScore: c.scores.pronunciation,
                psychologyScore: 85,
                originalityScore: c.scores.originality,
                confidence: c.finalScore
            };
        });
    };
    return ResultFormatter;
}());
exports.ResultFormatter = ResultFormatter;
