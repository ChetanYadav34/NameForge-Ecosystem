const db = require('better-sqlite3')('data/nid.sqlite');
console.log("--- Naming Patterns ---");
const patterns = db.prepare(`SELECT * FROM naming_patterns LIMIT 20`).all();
console.table(patterns);
