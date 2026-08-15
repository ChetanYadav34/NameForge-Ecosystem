const db = require('better-sqlite3')('data/nid.sqlite');
const rows = db.prepare(`SELECT failures, COUNT(*) as count FROM candidate_validation WHERE request_id LIKE '%fintech%' GROUP BY failures`).all();
console.table(rows);
