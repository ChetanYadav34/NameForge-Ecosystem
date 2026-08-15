import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const DATA_DIR = path.dirname(DB_PATH);

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const initDb = () => {
    const db = new Database(DB_PATH, { verbose: console.log });

    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Create Tables
    db.exec(`
        -- 1. Industry Ontology
        CREATE TABLE IF NOT EXISTS industry_ontology (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            standardized_name TEXT UNIQUE NOT NULL,
            parent_id INTEGER,
            FOREIGN KEY(parent_id) REFERENCES industry_ontology(id)
        );

        -- 2. Master Archetypes
        CREATE TABLE IF NOT EXISTS archetypes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
        );

        -- 3. Prefix & Suffix Statistics
        CREATE TABLE IF NOT EXISTS affix_statistics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            affix TEXT UNIQUE NOT NULL,
            type TEXT CHECK(type IN ('prefix', 'suffix', 'root')),
            global_frequency INTEGER DEFAULT 0,
            average_success_score REAL DEFAULT 0,
            peak_usage_year INTEGER,
            is_trending BOOLEAN DEFAULT 0
        );

        -- 4. Extracted Naming Patterns
        CREATE TABLE IF NOT EXISTS naming_patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            archetype_id INTEGER,
            pattern_hash TEXT UNIQUE NOT NULL,       
            syllable_count INTEGER,
            character_length INTEGER,
            vowel_consonant_ratio REAL,
            phonetic_shape TEXT,            
            FOREIGN KEY(archetype_id) REFERENCES archetypes(id)
        );

        -- 5. Evidence & Provenance Storage
        CREATE TABLE IF NOT EXISTS company_raw_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT UNIQUE NOT NULL,
            source_dataset TEXT,        
            industry_raw TEXT,
            founding_year INTEGER,
            valuation_tier REAL,        
            extracted_pattern_id INTEGER,
            archetype_id INTEGER,
            classification_confidence REAL, 
            FOREIGN KEY(extracted_pattern_id) REFERENCES naming_patterns(id),
            FOREIGN KEY(archetype_id) REFERENCES archetypes(id)
        );

        -- 6. Industry Patterns
        CREATE TABLE IF NOT EXISTS industry_patterns (
            industry_id INTEGER,
            pattern_id INTEGER,
            affix_id INTEGER,
            frequency_in_industry INTEGER DEFAULT 0,
            affinity_score REAL DEFAULT 0,
            FOREIGN KEY(industry_id) REFERENCES industry_ontology(id),
            FOREIGN KEY(pattern_id) REFERENCES naming_patterns(id),
            FOREIGN KEY(affix_id) REFERENCES affix_statistics(id)
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_company_pattern ON company_raw_data(extracted_pattern_id);
        CREATE INDEX IF NOT EXISTS idx_industry_affinity ON industry_patterns(industry_id, affinity_score DESC);
        CREATE INDEX IF NOT EXISTS idx_affix_trends ON affix_statistics(is_trending, peak_usage_year);
        CREATE INDEX IF NOT EXISTS idx_pattern_shape ON naming_patterns(phonetic_shape);
    `);

    console.log("Database initialized successfully at", DB_PATH);
    
    // Seed initial archetypes
    const seedArchetypes = db.prepare(`
        INSERT OR IGNORE INTO archetypes (name, description) VALUES 
        ('Compound', 'Two complete words combined'),
        ('Portmanteau', 'Two words blended together'),
        ('Root + Suffix', 'A core word with a modifier attached'),
        ('Prefix + Root', 'A modifier followed by a core word'),
        ('Abstract Coined', 'Completely invented words with phonetic rhythm'),
        ('Acronym', 'Formed from the first letters of words'),
        ('Founder-Based', 'Named after the creator'),
        ('Location-Based', 'Named after geography'),
        ('Hybrid', 'Combinations of the above'),
        ('Misspelled', 'Intentional misspelling of a real word')
    `);
    seedArchetypes.run();
    console.log("Archetypes seeded.");

    return db;
};

// Run if executed directly
if (require.main === module) {
    initDb();
}
