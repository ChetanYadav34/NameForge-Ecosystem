const fs = require('fs');
const files = ['src/availability/domain_checker.ts', 'src/availability/trademark_checker.ts', 'src/availability/company_checker.ts'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import Database from 'better-sqlite3';/g, 'export type Database = any;');
  content = content.replace(/private db: Database\.Database;/g, 'private db: Database;');
  
  // Replace constructor to take db instance instead of path
  content = content.replace(/constructor\(dbPath: string(.*?)\) {\n\s*this\.db = new Database\(dbPath\);/g, 'constructor(db: Database$1) {\n        this.db = db;');
  content = content.replace(/constructor\(dbPath: string\) {\n\s*this\.db = new Database\(dbPath\);/g, 'constructor(db: Database) {\n        this.db = db;');

  // Async get
  content = content.replace(/this\.db\.prepare\(`([^`]+)`\)\.get\(([^)]+)\)/g, 'await this.db.prepare(`$1`).bind($2).first()');
  // Async run
  content = content.replace(/this\.db\.prepare\(`([^`]+)`\)\.run\(([^)]+)\)/g, 'await this.db.prepare(`$1`).bind($2).run()');
  
  // Single quote variants
  content = content.replace(/this\.db\.prepare\('([^']+)'\)\.get\(([^)]+)\)/g, "await this.db.prepare('$1').bind($2).first()");
  content = content.replace(/this\.db\.prepare\('([^']+)'\)\.run\(([^)]+)\)/g, "await this.db.prepare('$1').bind($2).run()");

  fs.writeFileSync(file, content);
}
console.log('Fixed availability caches');
