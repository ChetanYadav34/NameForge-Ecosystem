const fs = require('fs');
const path = require('path');

const tokensRaw = fs.readFileSync(path.join(__dirname, 'tokens.json'), 'utf-8');
const tokens = JSON.parse(tokensRaw);

// 1. Generate CSS Variables
let cssContent = `:root {\n`;
for (const [group, values] of Object.entries(tokens.colors)) {
  for (const [name, hex] of Object.entries(values)) {
    cssContent += `  --color-${group}-${name}: ${hex};\n`;
  }
}
cssContent += `}\n`;
fs.writeFileSync(path.join(__dirname, 'variables.css'), cssContent);

// 2. Generate Tailwind Theme Object
const tailwindColors = {};
for (const [group, values] of Object.entries(tokens.colors)) {
  tailwindColors[group] = values;
}
const tailwindContent = `module.exports = { colors: ${JSON.stringify(tailwindColors, null, 2)} };\n`;
fs.writeFileSync(path.join(__dirname, 'tailwind-theme.js'), tailwindContent);

// 3. Generate Motion Constants
let motionContent = ``;
for (const [name, config] of Object.entries(tokens.motion.springs)) {
  motionContent += `export const spring_${name} = ${JSON.stringify(config)};\n`;
}
fs.writeFileSync(path.join(__dirname, 'motion.ts'), motionContent);

// 4. Generate Three.js Constants
let threeContent = `import * as THREE from 'three';\n\n`;
for (const [group, values] of Object.entries(tokens.colors)) {
  for (const [name, hex] of Object.entries(values)) {
    threeContent += `export const color_${group}_${name} = new THREE.Color("${hex}");\n`;
  }
}
fs.writeFileSync(path.join(__dirname, 'materials.ts'), threeContent);

// 5. Generate TS Definitions
let tsContent = `export interface LexForgeTokens {\n`;
tsContent += `  colors: ${JSON.stringify(tokens.colors)};\n`;
tsContent += `}\n`;
fs.writeFileSync(path.join(__dirname, 'index.d.ts'), tsContent);

// 6. Generate Index
const indexContent = `
export * from './motion';
export * from './materials';
`;
fs.writeFileSync(path.join(__dirname, 'index.js'), indexContent);

console.log('Design tokens compiled successfully.');
