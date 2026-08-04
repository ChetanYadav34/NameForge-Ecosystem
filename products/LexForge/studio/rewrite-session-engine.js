const fs = require('fs');
const path = require('path');

const p = path.resolve('src/lib/research/session/engine.ts');
let content = fs.readFileSync(p, 'utf8');

// 1. Add imports for the engines
const importsToAdd = `
import { categoryDNAEngine } from "../dna/engine";
import { patternIntelligenceEngine } from "../intelligence/engine";
import { blueprintEngine } from "../blueprint/engine";
import { validationEngine } from "../validation/engine";
import { strategyEngine } from "../strategy/engine";
import { constructionEngine } from "../generation/engine";
import { evaluationEngine } from "../evaluation/engine";
import { filteringEngine } from "../filtering/engine";
import { rankingEngine } from "../ranking/engine";
import { diversificationEngine } from "../diversification/engine";
import { selectionEngine } from "../selection/engine";
import { explanationEngine } from "../explanation/engine";
`;

content = content.replace(
  'import { ExplainedCandidateBatch } from "../explanation/types";',
  'import { ExplainedCandidateBatch } from "../explanation/types";\n' + importsToAdd
);

// 2. Replace the stage implementations with calls to real engines
const replacements = {
  'DNAStage': 'return { artifact: await categoryDNAEngine.extract(input), durationMs: 10 };',
  'IntelligenceStage': 'return { artifact: await patternIntelligenceEngine.build(input), durationMs: 10 };',
  'BlueprintStage': 'return { artifact: await blueprintEngine.generate(input), durationMs: 10 };',
  'ValidationStage': 'return { artifact: await validationEngine.validate(input), durationMs: 10 };',
  'StrategyStage': 'return { artifact: await strategyEngine.generate(input), durationMs: 10 };',
  'ConstructionStage': 'return { artifact: await constructionEngine.construct(input), durationMs: 10 };',
  'EvaluationStage': 'return { artifact: await evaluationEngine.evaluate(input), durationMs: 10 };',
  'FilteringStage': 'return { artifact: await filteringEngine.filter(input), durationMs: 10 };',
  'RankingStage': 'return { artifact: await rankingEngine.rank(input), durationMs: 10 };',
  'DiversificationStage': 'return { artifact: await diversificationEngine.diversify(input), durationMs: 10 };',
  'SelectionStage': 'return { artifact: await selectionEngine.select(input), durationMs: 10 };',
  'ExplanationStage': 'return { artifact: await explanationEngine.explain(input), durationMs: 10 };'
};

for (const [stageClass, realExecution] of Object.entries(replacements)) {
  const regex = new RegExp(`class ${stageClass} implements PipelineStage[\\s\\S]*?async execute\\([^\\)]+\\) {\\s*await new Promise\\(resolve => setTimeout\\(resolve, 300\\)\\);\\s*return [^}]+};\\s*}`);
  
  const match = content.match(regex);
  if (match) {
    const exactSig = match[0].match(/class .*?async execute\([^)]+\) \{/s)[0];
    const newSig = exactSig + '\n    ' + realExecution + '\n  }';
    content = content.replace(match[0], newSig + '\n}');
  }
}

fs.writeFileSync(p, content, 'utf8');
console.log("Rewrote session/engine.ts");
