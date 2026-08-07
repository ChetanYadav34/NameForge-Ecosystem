"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityGateService = void 0;
var QualityGateService = /** @class */ (function () {
    function QualityGateService() {
    }
    QualityGateService.prototype.filter = function (candidates, minScore) {
        if (minScore === void 0) { minScore = 70; }
        // Reject anything that doesn't meet minimum brandability/semantic score thresholds
        return candidates.filter(function (c) { return c.finalScore >= minScore; });
    };
    return QualityGateService;
}());
exports.QualityGateService = QualityGateService;
