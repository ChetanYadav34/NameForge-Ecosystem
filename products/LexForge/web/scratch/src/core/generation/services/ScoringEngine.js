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
exports.ScoringEngine = void 0;
var ScoringEngine = /** @class */ (function () {
    function ScoringEngine() {
    }
    ScoringEngine.prototype.score = function (candidates) {
        return candidates.map(function (c) { return (__assign(__assign({}, c), { scores: {
                semantic: Math.floor(Math.random() * 30) + 70, // 70-100
                brandability: Math.floor(Math.random() * 30) + 70,
                pronunciation: Math.floor(Math.random() * 30) + 70,
                originality: Math.floor(Math.random() * 30) + 70,
                length: c.word.length <= 6 ? 95 : 75
            } })); });
    };
    return ScoringEngine;
}());
exports.ScoringEngine = ScoringEngine;
