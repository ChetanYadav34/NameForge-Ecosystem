import Database from 'better-sqlite3';
import path from 'path';
import { normalizeName, NormalizationType, generatePhoneticKey } from './normalization';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');

export function initAvailabilitySchema() {
    const db = new Database(DB_PATH);
    
    console.log("Initializing Availability Schema...");
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS domain_cache (
            name TEXT NOT NULL,
            tld TEXT NOT NULL,
            status TEXT NOT NULL,
            provider TEXT,
            checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            PRIMARY KEY (name, tld)
        );

        CREATE TABLE IF NOT EXISTS trademark_cache (
            name TEXT NOT NULL,
            jurisdiction TEXT NOT NULL,
            status TEXT NOT NULL,
            provider TEXT,
            raw_response JSON,
            checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            PRIMARY KEY (name, jurisdiction)
        );

        CREATE TABLE IF NOT EXISTS company_normalized (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_name TEXT NOT NULL,
            normalized_name TEXT NOT NULL,
            phonetic_key TEXT NOT NULL,
            industry TEXT,
            length INTEGER
        );
    `);

    // Check if indexes exist, if not create them
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_company_normalized ON company_normalized(normalized_name);
        CREATE INDEX IF NOT EXISTS idx_company_phonetic ON company_normalized(phonetic_key);
        CREATE INDEX IF NOT EXISTS idx_company_length ON company_normalized(length);
    `);

    // Check if we need to populate company_normalized
    const countRow = db.prepare(`SELECT count(*) as c FROM company_normalized`).get() as any;
    if (countRow.c === 0) {
        console.log("Populating company_normalized from company_raw_data...");
        
        try {
            const rawCompanies = db.prepare(`SELECT company_name, industry_raw FROM company_raw_data`).all() as any[];
            
            const insertStmt = db.prepare(`
                INSERT INTO company_normalized (original_name, normalized_name, phonetic_key, industry, length)
                VALUES (?, ?, ?, ?, ?)
            `);

            db.transaction(() => {
                for (const row of rawCompanies) {
                    if (!row.company_name) continue;
                    const canonical = normalizeName(row.company_name, NormalizationType.CANONICAL);
                    if (!canonical) continue;
                    
                    const phonetic = generatePhoneticKey(row.company_name);
                    
                    insertStmt.run(row.company_name, canonical, phonetic, row.industry_raw || null, canonical.length);
                }
            })();
            
            console.log(`Successfully populated ${rawCompanies.length} companies into company_normalized.`);
        } catch (e) {
            console.error("Error populating company_normalized (is company_raw_data present?):", e);
        }
    } else {
        console.log(`company_normalized already contains ${countRow.c} rows. Skipping population.`);
    }

    db.close();
    console.log("Availability Schema Init Complete.");
}

// Allow running directly
if (require.main === module) {
    initAvailabilitySchema();
}
