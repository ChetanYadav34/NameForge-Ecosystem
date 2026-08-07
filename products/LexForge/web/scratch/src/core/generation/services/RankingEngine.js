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
exports.RankingEngine = void 0;
var RankingEngine = /** @class */ (function () {
    function RankingEngine() {
    }
    RankingEngine.prototype.rank = function (candidates, context) {
        var ranked = candidates.map(function (c) {
            // In a real app, apply weights based on context.industry etc.
            var finalScore = (c.scores.semantic * 1.5 + c.scores.brandability * 2.0) / 3.5;
            return __assign(__assign({}, c), { finalScore: finalScore });
        });
        ranked.sort(function (a, b) { return b.finalScore - a.finalScore; });
        return ranked;
    };
    return RankingEngine;
}());
exports.RankingEngine = RankingEngine;
