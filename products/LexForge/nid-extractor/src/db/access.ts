import fs from 'fs';
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const DATA_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
const db = new Database(DB_PATH);

// Prepared statements for Phase 2
const insertCompany = db.prepare(`
    INSERT OR IGNORE INTO company_raw_data (
        company_name, source_dataset, industry_raw, founding_year, valuation_tier
    ) VALUES (?, ?, ?, ?, ?)
`);

export function ingestRecord(
    companyName: string, 
    sourceDataset: string, 
    industryRaw: string, 
    foundingYear: number | null, 
    valuationTier: number | null
) {
    if (!companyName) return;
    
    // Clean name
    const cleanedName = companyName.trim().replace(/"/g, '');
    if (cleanedName.length === 0) return;

    try {
        insertCompany.run(
            cleanedName,
            sourceDataset,
            industryRaw?.trim() || null,
            foundingYear || null,
            valuationTier || null
        );
    } catch (err) {
        // Ignore unique constraint failures silently if they occur
    }
}

export function beginTransaction() {
    db.exec('BEGIN TRANSACTION');
}

export function commitTransaction() {
    db.exec('COMMIT');
}
