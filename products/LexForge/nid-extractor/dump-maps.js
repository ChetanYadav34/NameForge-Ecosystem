const db = require('better-sqlite3')('data/nid.sqlite');
const fs = require('fs');

let sql = '';
let cim = db.prepare('SELECT * FROM concept_industry_map').all();
for (const row of cim) {
  const keys = Object.keys(row);
  const values = keys.map(k => {
    if (row[k] === null) return 'NULL';
    if (typeof row[k] === 'string') return `'${row[k].replace(/'/g, "''")}'`;
    return row[k];
  });
  sql += `INSERT OR IGNORE INTO concept_industry_map (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
}

let cmm = db.prepare('SELECT * FROM concept_morpheme_map').all();
let remaining = cmm.slice(20000);
for (const row of remaining) {
  const keys = Object.keys(row);
  const values = keys.map(k => {
    if (row[k] === null) return 'NULL';
    if (typeof row[k] === 'string') return `'${row[k].replace(/'/g, "''")}'`;
    return row[k];
  });
  sql += `INSERT OR IGNORE INTO concept_morpheme_map (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
}

fs.writeFileSync('dump-maps.sql', sql);
console.log('Created dump-maps.sql with ' + (cim.length + remaining.length) + ' rows');
