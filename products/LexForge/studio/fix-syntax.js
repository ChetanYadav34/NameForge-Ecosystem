const fs = require('fs');
const path = require('path');

const p = path.resolve('src/lib/research/session/engine.ts');
let content = fs.readFileSync(p, 'utf8');

// Fix syntax error by removing extra closing brackets caused by previous regex
content = content.replace(/}\n}\n/g, '}\n');
content = content.replace(/}\n}\n/g, '}\n');

fs.writeFileSync(p, content, 'utf8');
console.log("Fixed syntax");
