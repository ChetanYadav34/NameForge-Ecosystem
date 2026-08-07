"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResearchLogger = void 0;
var ResearchLogger = /** @class */ (function () {
    function ResearchLogger() {
    }
    ResearchLogger.prototype.logRun = function (context, generatedCount, filteredCount, rejectedCount, finalCount, executionTimeMs) {
        // In a real production system, this would write to a database or analytics pipeline.
        // For now, we simply console.log to demonstrate the architectural decoupling.
        console.group("[LexForge Engine] Run: ".concat(context.sessionId));
        console.log("Prompt: \"".concat(context.originalPrompt, "\""));
        console.log("Industry: ".concat(context.industry, " | Tone: ").concat(context.tone));
        console.log("Candidates Generated: ".concat(generatedCount));
        console.log("Candidates Post-Filtering: ".concat(filteredCount));
        console.log("Candidates Rejected by Quality Gate: ".concat(rejectedCount));
        console.log("Final Candidates Selected: ".concat(finalCount));
        console.log("Execution Time: ".concat(executionTimeMs, "ms"));
        console.groupEnd();
    };
    return ResearchLogger;
}());
exports.ResearchLogger = ResearchLogger;
