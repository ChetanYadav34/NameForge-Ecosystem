"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFilteringService = void 0;
var CandidateFilteringService = /** @class */ (function () {
    function CandidateFilteringService() {
    }
    CandidateFilteringService.prototype.filter = function (candidates) {
        var seen = new Set();
        var filtered = [];
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var c = candidates_1[_i];
            var lower = c.word.toLowerCase();
            // Duplicates
            if (seen.has(lower))
                continue;
            // Length validation
            if (lower.length < 3 || lower.length > 15)
                continue;
            // Invalid characters
            if (/[^a-z]/i.test(lower))
                continue;
            seen.add(lower);
            filtered.push(c);
        }
        return filtered;
    };
    return CandidateFilteringService;
}());
exports.CandidateFilteringService = CandidateFilteringService;
