import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../data/nid.sqlite');
const db = new Database(DB_PATH);

console.log('Starting Autonomous Hebbian Learner...');

const signals = db.prepare('SELECT id, unknown_word, selected_candidate FROM user_preference_signals WHERE unknown_word IS NOT NULL AND unknown_word != \'\'').all() as any[];

if (signals.length === 0) {
    console.log('No new preference signals to process.');
    process.exit(0);
}

const allMorphemes = db.prepare('SELECT id, morpheme FROM morpheme_catalog WHERE length(morpheme) > 2').all() as {id: number, morpheme: string}[];

const insertConcept = db.prepare('INSERT OR IGNORE INTO concept_catalog (canonical_name, global_frequency) VALUES (?, ?)');
const getConceptId = db.prepare('SELECT id FROM concept_catalog WHERE canonical_name = ?');
const insertMap = db.prepare('INSERT OR IGNORE INTO concept_morpheme_map (concept_id, morpheme_id, co_occurrence_count, semantic_relevance, semantic_confidence) VALUES (?, ?, ?, ?, ?)');
const deleteSignal = db.prepare('DELETE FROM user_preference_signals WHERE id = ?');

db.transaction(() => {
    let conceptsLearned = 0;
    let mappingsCreated = 0;

    for (const signal of signals) {
        // Find unknown words in the intent
        const intentWords = signal.unknown_word.toLowerCase().split(/\s+/);
        
        // Find which morphemes were used in the candidate the user clicked
        const candidateStr = signal.selected_candidate.toLowerCase();
        const matchedMorphemes = allMorphemes.filter(m => candidateStr.includes(m.morpheme.toLowerCase()));

        for (const word of intentWords) {
            if (word.length < 3) continue;

            // Check if word is already a known concept, if not, create it
            insertConcept.run(word, 500);
            const conceptRow = getConceptId.get(word) as { id: number };
            if (!conceptRow) continue;
            
            // Wire the concept to the morphemes found in the selected candidate
            for (const m of matchedMorphemes) {
                const res = insertMap.run(conceptRow.id, m.id, 1, 0.6, 0.5);
                if (res.changes > 0) mappingsCreated++;
            }
            conceptsLearned++;
        }
        
        // Remove processed signal
        deleteSignal.run(signal.id);
    }

    console.log(`Autonomous Learner finished.`);
    console.log(`Concepts Learned/Updated: ${conceptsLearned}`);
    console.log(`Synaptic Mappings Created: ${mappingsCreated}`);
})();
