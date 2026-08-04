const fs = require('fs');
const path = require('path');

const p = path.resolve('src/lib/research/session/engine.ts');
let content = fs.readFileSync(p, 'utf8');

// The exact lines to replace
content = content.replace('await categoryDNAEngine.extract(input)', 'categoryDNAEngine.build(input)');
content = content.replace('await strategyEngine.generate(input)', 'strategyEngine.plan(input, { domain: "brand", styleTarget: "modern", primaryFocus: "safety" })');

fs.writeFileSync(p, content, 'utf8');
console.log("Fixed method names");
