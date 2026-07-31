const fs = require('fs');
const path = require('path');

const rulesDir = path.join('src', 'validator', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.rule.ts') && f !== 'base.rule.ts');

files.forEach(file => {
    const fullPath = path.join(rulesDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Extract class name
    const classMatch = content.match(/export class (\w+) implements ValidationRule/);
    if (!classMatch) return;
    const className = classMatch[1];
    
    // convert class name to human readable, e.g. HasVowelRule -> Has Vowel
    const readable = className.replace('Rule', '').replace(/([A-Z])/g, ' $1').trim();
    
    // The previous string replacement replaced everything inside the quotes.
    // Let's replace the whole readonly name line using regex:
    content = content.replace(/readonly name = ".*?";/, 'readonly name = "' + readable + '";');
    fs.writeFileSync(fullPath, content);
    console.log('Fixed ' + file + ' to ' + readable);
});
