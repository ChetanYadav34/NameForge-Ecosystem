const fs = require('fs');
const path = require('path');

const p = path.resolve('src/lib/research/session/engine.ts');
let content = fs.readFileSync(p, 'utf8');

const replacements = [
  [/await blueprintEngine\.generate/g, 'blueprintEngine.build'],
  [/await categoryDNAEngine\.extract/g, 'categoryDNAEngine.build'],
  [/categoryDNAEngine\.build/g, 'categoryDNAEngine.build'], // just in case
  [/await patternIntelligenceEngine\.build/g, 'patternIntelligenceEngine.build'],
  [/await validationEngine\.validate/g, 'validationEngine.validate'],
  [/await constructionEngine\.construct/g, 'constructionEngine.construct'],
  [/await evaluationEngine\.evaluate/g, 'evaluationEngine.evaluate'],
  [/await filteringEngine\.filter/g, 'filteringEngine.filter'],
  [/await rankingEngine\.rank/g, 'rankingEngine.rank'],
  [/await diversificationEngine\.diversify/g, 'diversificationEngine.diversify'],
  [/await selectionEngine\.select/g, 'selectionEngine.select'],
  [/await explanationEngine\.explain/g, 'explanationEngine.explain']
];

for (const [regex, replacement] of replacements) {
  content = content.replace(regex, replacement);
}

fs.writeFileSync(p, content, 'utf8');
console.log("Fixed method names and removed awaits");
