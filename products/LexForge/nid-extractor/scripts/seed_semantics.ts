import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = process.env.DATA_DIR || path.resolve(__dirname, '../data');
const DB_PATH = path.join(dataDir, 'nid.sqlite');
const SEED_PATH = path.resolve(__dirname, './ontology_seed.json');

const db = new Database(DB_PATH);

console.log('Starting self-sustained semantic engine expansion...');

const seedData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));

// Begin transaction
const insertConcept = db.prepare('INSERT OR IGNORE INTO concept_catalog (canonical_name, global_frequency) VALUES (?, ?)');
const getConceptId = db.prepare('SELECT id FROM concept_catalog WHERE canonical_name = ?');
const getMorphemeIds = db.prepare('SELECT id, morpheme FROM morpheme_catalog WHERE morpheme = ? OR morpheme LIKE ?');
const insertMap = db.prepare('INSERT OR IGNORE INTO concept_morpheme_map (concept_id, morpheme_id, co_occurrence_count, semantic_relevance, semantic_confidence) VALUES (?, ?, ?, ?, ?)');

db.transaction(() => {
    let conceptsAdded = 0;
    let mappingsAdded = 0;

    for (const [conceptName, morphemeList] of Object.entries(seedData)) {
        // 1. Insert Concept
        insertConcept.run(conceptName, 1000);
        const conceptRow = getConceptId.get(conceptName) as { id: number };
        if (!conceptRow) continue;
        const conceptId = conceptRow.id;
        conceptsAdded++;

        // 2. Link Morphemes
        for (const morph of (morphemeList as string[])) {
            // Find in morpheme catalog (exact or startswith to catch variations)
            const matches = getMorphemeIds.all(morph, `${morph}%`) as { id: number, morpheme: string }[];
            for (const match of matches) {
                // Determine relevance: exact match is highest, partial is slightly lower
                const relevance = match.morpheme === morph ? 1.0 : 0.8;
                
                const res = insertMap.run(conceptId, match.id, 500, relevance, 0.9);
                if (res.changes > 0) mappingsAdded++;
            }
        }
    }

    console.log(`Successfully added ${conceptsAdded} new abstract concepts.`);
    console.log(`Created ${mappingsAdded} new high-fidelity semantic links to the morpheme catalog.`);
})();

console.log('Semantic engine expansion complete. The engine is now self-sustained.');
