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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplanationService = void 0;
var ExplanationService = /** @class */ (function () {
    function ExplanationService() {
    }
    ExplanationService.prototype.explain = function (candidates) {
        return candidates.map(function (c) {
            var _a;
            return (__assign(__assign({}, c), { explanations: {
                    meaning: "Derived from ".concat(c.roots.join(' + ')),
                    rootBreakdown: "Roots: ".concat(c.roots.join(', '), " (").concat(((_a = c.metadata) === null || _a === void 0 ? void 0 : _a.origin) || 'Unknown', ")"),
                    linguisticReasoning: 'Flows naturally with balanced consonants.',
                    psychologicalReasoning: 'Evokes a sense of trust and innovation.',
                    brandabilityExplanation: 'Highly memorable and visually balanced.'
                } }));
        });
    };
    return ExplanationService;
}());
exports.ExplanationService = ExplanationService;
