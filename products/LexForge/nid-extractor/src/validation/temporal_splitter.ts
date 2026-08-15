import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

export const TEMPORAL_SPLIT_YEAR = 2022;

export function createTemporalViews() {
    console.log(`=== Creating Temporal Split Views (Split Year: ${TEMPORAL_SPLIT_YEAR}) ===`);
    
    // Create view for training corpus (Everything older than TEMPORAL_SPLIT_YEAR)
    // We also include records where founding_year IS NULL into training, to maximize graph data
    db.exec(`
        DROP VIEW IF EXISTS v_training_corpus;
        CREATE VIEW v_training_corpus AS 
        SELECT * FROM company_raw_data 
        WHERE founding_year < ${TEMPORAL_SPLIT_YEAR} OR founding_year IS NULL;
    `);

    // Create view for holdout corpus (Everything TEMPORAL_SPLIT_YEAR or newer)
    db.exec(`
        DROP VIEW IF EXISTS v_holdout_corpus;
        CREATE VIEW v_holdout_corpus AS 
        SELECT * FROM company_raw_data 
        WHERE founding_year >= ${TEMPORAL_SPLIT_YEAR};
    `);

    const trainCount = db.prepare('SELECT COUNT(*) as c FROM v_training_corpus').get() as {c: number};
    const testCount = db.prepare('SELECT COUNT(*) as c FROM v_holdout_corpus').get() as {c: number};

    console.log(`Training Corpus Size: ${trainCount.c}`);
    console.log(`Holdout Corpus Size: ${testCount.c}`);
    
    return { trainCount: trainCount.c, testCount: testCount.c };
}

if (require.main === module) {
    createTemporalViews();
}
