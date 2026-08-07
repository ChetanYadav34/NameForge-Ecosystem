const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function syncDataset() {
  const jsonlPath = path.join(__dirname, '../../dataset-compiler/output/lexforge-dataset-v7.jsonl');
  
  if (!fs.existsSync(jsonlPath)) {
    console.warn('Compiler output not found at', jsonlPath, '- Skipping dataset sync and using existing static data.');
    process.exit(0);
  }

  const fileStream = fs.createReadStream(jsonlPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const allRoots = [];

  for await (const line of rl) {
    // Only attempt to parse ~2% of the file to save CPU time during build
    if (Math.random() > 0.02) continue;

    try {
      const parsed = JSON.parse(line);
      if (parsed.word && parsed.definitions && parsed.definitions.length > 0) {
        allRoots.push({
          root: parsed.word,
          meaning: parsed.definitions[0],
          origin: "Dataset Compiler v7"
        });
      }
    } catch (e) {
      // ignore
    }
  }

  // Shuffle and take exactly 600 randomly to ensure a good mix across the entire alphabet
  const roots = allRoots.sort(() => 0.5 - Math.random()).slice(0, 600);

  console.log(`Extracted ${roots.length} roots from compiler output.`);

  // Write to providers
  const latinPath = path.join(__dirname, '../src/data/latin/v1/roots.json');
  const greekPath = path.join(__dirname, '../src/data/greek/v1/roots.json');
  const sanskritPath = path.join(__dirname, '../src/data/sanskrit/v1/roots.json');

  // Let's divide them up
  const chunkSize = Math.floor(roots.length / 3);
  const latin = roots.slice(0, chunkSize);
  const greek = roots.slice(chunkSize, chunkSize * 2);
  const sanskrit = roots.slice(chunkSize * 2);

  fs.writeFileSync(latinPath, JSON.stringify(latin, null, 2));
  fs.writeFileSync(greekPath, JSON.stringify(greek, null, 2));
  fs.writeFileSync(sanskritPath, JSON.stringify(sanskrit, null, 2));

  console.log('Successfully hooked compiler output into web data providers.');
}

syncDataset().catch(console.error);
