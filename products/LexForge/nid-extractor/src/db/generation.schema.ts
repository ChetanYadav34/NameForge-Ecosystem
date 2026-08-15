import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

export function initGenerationSchemas() {
    console.log("=== Initializing Phase 4.1 Generation Schemas ===");
    
    db.exec(`
        PRAGMA foreign_keys = OFF;
        DROP TABLE IF EXISTS candidate_validation;
        DROP TABLE IF EXISTS phonotactic_scores;
        DROP TABLE IF EXISTS brandability_scores;
        DROP TABLE IF EXISTS generation_debug_log;
        DROP TABLE IF EXISTS generation_scores;
        DROP TABLE IF EXISTS naming_patterns;
        DROP TABLE IF EXISTS industry_archetype_preference;
    `);

    db.exec(`
        CREATE TABLE candidate_validation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            candidate_string TEXT NOT NULL,
            is_valid BOOLEAN,
            failures TEXT,
            validation_score REAL
        );

        CREATE TABLE phonotactic_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            candidate_string TEXT NOT NULL,
            pronounceability_score REAL,
            readability_score REAL,
            syllable_count INTEGER,
            phonetic_shape TEXT,
            issues TEXT
        );

        CREATE TABLE brandability_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            candidate_string TEXT NOT NULL,
            pronounceability REAL,
            length_fitness REAL,
            memorability REAL,
            visual_simplicity REAL,
            structural_harmony REAL,
            brand_similarity_penalty REAL,
            composite_score REAL
        );

        CREATE TABLE industry_archetype_preference (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            industry_id INTEGER,
            archetype TEXT NOT NULL,
            confidence_score REAL NOT NULL,
            success_weighting REAL NOT NULL,
            FOREIGN KEY(industry_id) REFERENCES industry_ontology(id),
            UNIQUE(industry_id, archetype)
        );

        CREATE TABLE naming_patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            archetype TEXT NOT NULL,
            pattern_structure TEXT NOT NULL,
            pattern_description TEXT
        );

        CREATE TABLE generation_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            candidate_string TEXT NOT NULL,
            semantic_relevance REAL,
            industry_affinity REAL,
            pmi_compatibility REAL,
            novelty REAL,
            trend_velocity REAL,
            structural_success REAL,
            composite_score REAL NOT NULL
        );

        CREATE TABLE generation_debug_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            log_level TEXT NOT NULL,
            step_name TEXT NOT NULL,
            details TEXT
        );
    `);

    // Seed some basic preferences for Archetypes
    const insertPref = db.prepare(`INSERT INTO industry_archetype_preference (industry_id, archetype, confidence_score, success_weighting) VALUES (?, ?, ?, ?)`);
    const industries = db.prepare(`SELECT id, canonical_name FROM industry_ontology`).all() as any[];
    
    for (const ind of industries) {
        if (ind.canonical_name === 'Financial Services' || ind.canonical_name === 'Healthcare') {
            insertPref.run(ind.id, 'Dictionary / Semantic', 0.8, 1.2);
            insertPref.run(ind.id, 'Root + Suffix', 0.6, 1.0);
        } else if (ind.canonical_name === 'Social Media' || ind.canonical_name === 'Design') {
            insertPref.run(ind.id, 'Abstract Coined', 0.9, 1.3);
            insertPref.run(ind.id, 'Portmanteau', 0.7, 1.1);
        } else {
            // Defaults
            insertPref.run(ind.id, 'Abstract Coined', 0.5, 1.0);
            insertPref.run(ind.id, 'Dictionary / Semantic', 0.5, 1.0);
            insertPref.run(ind.id, 'Root + Suffix', 0.5, 1.0);
            insertPref.run(ind.id, 'Portmanteau', 0.5, 1.0);
        }
    }

    // Seed patterns
    const insertPattern = db.prepare(`INSERT INTO naming_patterns (archetype, pattern_structure, pattern_description) VALUES (?, ?, ?)`);
    insertPattern.run('Abstract Coined', 'CVCCV', 'Consonant Vowel Alternation');
    insertPattern.run('Dictionary / Semantic', 'WORD', 'Single distinct concept word');
    insertPattern.run('Root + Suffix', 'ROOT+SUFFIX', 'Root morpheme + standard tech suffix');
    insertPattern.run('Portmanteau', 'ROOT1+ROOT2', 'Two root morphemes combined');

    console.log("Generation Schemas successfully initialized.");
}

if (require.main === module) {
    initGenerationSchemas();
}
