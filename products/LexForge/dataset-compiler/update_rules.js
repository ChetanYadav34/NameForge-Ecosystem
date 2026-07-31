const fs = require('fs');
const path = require('path');

const rulesDir = path.join('src', 'validator', 'rules');
const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.rule.ts') && f !== 'base.rule.ts');

files.forEach(file => {
    const fullPath = path.join(rulesDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes('readonly metadata: PipelineModuleMetadata')) {
        return;
    }
    
    // Add import
    if (content.includes('PipelineModuleMetadata')) {
        // already imported
    } else {
        content = content.replace('import { SemanticWord, ValidationWarning } from "../../types/index.js";', 'import { SemanticWord, ValidationWarning, PipelineModuleMetadata } from "../../types/index.js";');
    }
    
    // Extract class name
    const classMatch = content.match(/export class (\w+) implements ValidationRule/);
    if (!classMatch) return;
    const className = classMatch[1];
    
    const ruleId = 'validator.rule.' + file.replace('.rule.ts', '');
    const priority = 60;
    
    const metadataProp = '\n  readonly metadata: PipelineModuleMetadata = {\n    id: "' + ruleId + '",\n    name: "' + className + '",\n    version: "1.0.0",\n    stage: "validate",\n    priority: ' + priority + ',\n    requiresModules: [],\n    requiresFeatures: [],\n    producesFeatures: [],\n    author: "LexForge",\n  };\n';

    content = content.replace(/readonly name = "(.*?)";/, 'readonly name = "";' + metadataProp);
    fs.writeFileSync(fullPath, content);
    console.log('Updated ' + file);
});
