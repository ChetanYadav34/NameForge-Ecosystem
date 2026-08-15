import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

export function runValidation() {
    console.log("=== Phase 2 Validation Audit ===");

    const totalRecords = db.prepare(`SELECT COUNT(*) as c FROM company_raw_data`).get() as {c: number};
    console.log(`1. Total records loaded: ${totalRecords.c}`);

    const distinctNames = db.prepare(`SELECT COUNT(DISTINCT company_name) as c FROM company_raw_data`).get() as {c: number};
    console.log(`2. Distinct company names: ${distinctNames.c}`);

    console.log(`3. Duplicate rate: ${((1 - (distinctNames.c / totalRecords.c)) * 100).toFixed(2)}%`);

    const emptyOrMalformed = db.prepare(`
        SELECT COUNT(*) as c FROM company_raw_data 
        WHERE company_name IS NULL OR length(company_name) < 2
    `).get() as {c: number};
    console.log(`4. Empty or malformed names: ${emptyOrMalformed.c}`);

    console.log(`5. Source distribution:`);
    const sources = db.prepare(`SELECT source_dataset, COUNT(*) as c FROM company_raw_data GROUP BY source_dataset ORDER BY c DESC`).all() as any[];
    for (const s of sources) {
        console.log(`   - ${s.source_dataset}: ${s.c}`);
    }

    console.log(`6. Top 5 Industry distribution:`);
    const industries = db.prepare(`SELECT industry_raw, COUNT(*) as c FROM company_raw_data GROUP BY industry_raw ORDER BY c DESC LIMIT 5`).all() as any[];
    for (const ind of industries) {
        console.log(`   - ${ind.industry_raw || 'Unknown'}: ${ind.c}`);
    }

    console.log(`7. Top 20 most common normalized names:`);
    // SQLite UNIQUE constraint on company_name means they are unique, but let's see if there's normalization logic we should apply.
    // Wait, the table schema has `company_name TEXT UNIQUE`. So count is always 1 for exact match.
    // Let's do lower(company_name) grouping.
    const commonNames = db.prepare(`
        SELECT lower(company_name) as ln, COUNT(*) as c 
        FROM company_raw_data 
        GROUP BY ln 
        ORDER BY c DESC LIMIT 20
    `).all() as any[];
    for (const cn of commonNames) {
        if (cn.c > 1) {
            console.log(`   - ${cn.ln}: ${cn.c}`);
        }
    }
}

if (require.main === module) {
    runValidation();
}
