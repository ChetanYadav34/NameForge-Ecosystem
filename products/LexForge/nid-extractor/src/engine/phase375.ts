import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

// Minimal Porter-like Stemmer to group concepts
function stem(word: string): string {
    if (word.length <= 3) return word;
    return word.replace(/(ing|ly|ed|ious|ies|ive|es|s|ment)$/, '');
}

const STOPWORDS = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'all', 'have', 'new', 'more', 'an', 'was', 'we', 'will', 'home', 'can', 'us', 'about', 'if', 'page', 'my', 'has', 'search', 'free', 'but', 'our', 'one', 'other', 'do', 'no', 'information', 'time', 'they', 'site', 'he', 'up', 'may', 'what', 'which', 'their', 'news', 'out', 'use', 'any', 'there', 'see', 'only', 'so', 'his', 'when', 'contact', 'here', 'business', 'who', 'web', 'also', 'now', 'help', 'get', 'pm', 'view', 'online', 'first', 'am', 'been', 'would', 'how', 'were', 'me', 's', 'services', 'some', 'these', 'click', 'its', 'like', 'service', 'x', 'than', 'find', 'price', 'date', 'back', 'top', 'people', 'had', 'list', 'name', 'just', 'over', 'state', 'year', 'day', 'into', 'email', 'two', 'health', 'n', 'world', 're', 'next', 'used', 'go', 'b', 'work', 'last', 'most', 'products', 'music', 'buy', 'data', 'make', 'them', 'should', 'product', 'system', 'post', 'her', 'city', 't', 'add', 'policy', 'number', 'such', 'please', 'available', 'copyright', 'support', 'message', 'after', 'best', 'software', 'then', 'jan', 'good', 'video', 'well', 'd', 'where', 'info', 'rights', 'public', 'books', 'high', 'school', 'through', 'm', 'each', 'links', 'she', 'review', 'years', 'order', 'very', 'privacy', 'book', 'items', 'company', 'read', 'group', 'sex', 'need', 'many', 'user', 'said', 'de', 'does', 'set', 'under', 'general', 'research', 'university', 'january', 'mail', 'full', 'map', 'reviews', 'program', 'life']);

export function runPhase375() {
    console.log("=== Phase 3.75: Concept Mapping & Morpheme Graph ===");
    
    // Seed Industry Taxonomy
    console.log("Seeding Industry Ontology...");
    const canonicals = [
        'Financial Services', 'Healthcare', 'E-Commerce', 'Social Media', 
        'Data & Analytics', 'Travel & Hospitality', 'Education', 
        'Human Resources', 'Design', 'Productivity', 'Software'
    ];
    
    const insertCanonical = db.prepare(`INSERT OR IGNORE INTO industry_ontology (canonical_name) VALUES (?)`);
    for (const c of canonicals) {
        insertCanonical.run(c);
    }
    
    const aliases = [
        { a: 'Fintech', c: 'Financial Services' },
        { a: 'Finance', c: 'Financial Services' },
        { a: 'Healthtech', c: 'Healthcare' },
        { a: 'Ecommerce', c: 'E-Commerce' },
        { a: 'Social', c: 'Social Media' },
        { a: 'Data', c: 'Data & Analytics' },
        { a: 'Travel', c: 'Travel & Hospitality' },
        { a: 'Edtech', c: 'Education' },
        { a: 'HR', c: 'Human Resources' },
        { a: 'HR Tech', c: 'Human Resources' },
        { a: 'Design', c: 'Design' },
        { a: 'Productivity', c: 'Productivity' },
        { a: 'SaaS', c: 'Software' }
    ];
    
    const insertAlias = db.prepare(`
        INSERT OR IGNORE INTO industry_alias (alias_name, canonical_id)
        SELECT ?, id FROM industry_ontology WHERE canonical_name = ?
    `);
    
    for (const al of aliases) {
        insertAlias.run(al.a, al.c);
    }
    
    // Build an in-memory mapper
    const getIndustryId = db.prepare(`
        SELECT canonical_id FROM industry_alias WHERE alias_name = ? COLLATE NOCASE
        UNION
        SELECT id FROM industry_ontology WHERE canonical_name = ? COLLATE NOCASE
    `);
    
    const mapIndustry = (raw: string) => {
        const row = getIndustryId.get(raw, raw) as any;
        return row ? row.canonical_id || row.id : null;
    };
    
    // Process training corpus
    const companies = db.prepare(`SELECT id, industry_raw FROM v_training_corpus`).all() as any[];
    const companyMorphemes = db.prepare(`SELECT company_id, morpheme_id FROM company_morpheme_map`).all() as any[];
    
    // Map company to its morpheme IDs
    const c2m = new Map<number, Set<number>>();
    for (const cm of companyMorphemes) {
        if (!c2m.has(cm.company_id)) c2m.set(cm.company_id, new Set());
        c2m.get(cm.company_id)!.add(cm.morpheme_id);
    }
    
    console.log(`Processing TF-IDF for ${companies.length} companies...`);
    
    // We will extract concepts
    const docFrequency = new Map<string, number>();
    const companyConcepts = new Map<number, Set<string>>();
    
    let totalDocsWithWords = 0;
    
    for (const comp of companies) {
        const text = (comp.industry_raw || '');
        const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
        const uniqueStems = new Set<string>();
        
        for (const w of words) {
            if (w.length < 3) continue;
            if (STOPWORDS.has(w)) continue;
            const s = stem(w);
            uniqueStems.add(s);
        }
        
        if (uniqueStems.size > 0) totalDocsWithWords++;
        
        companyConcepts.set(comp.id, uniqueStems);
        for (const s of uniqueStems) {
            docFrequency.set(s, (docFrequency.get(s) || 0) + 1);
        }
    }
    
    console.log(`Extracted ${docFrequency.size} unique concepts. Pruning...`);
    
    // Prune concepts that appear in less than 5 companies to avoid noise
    const validConcepts = Array.from(docFrequency.entries()).filter(e => e[1] >= 5);
    console.log(`Retained ${validConcepts.length} valid concepts.`);
    
    db.exec('BEGIN TRANSACTION');
    
    const insertConcept = db.prepare(`INSERT INTO concept_catalog (canonical_name, global_frequency) VALUES (?, ?)`);
    const conceptIds = new Map<string, number>();
    
    let cInserted = 0;
    for (const [concept, freq] of validConcepts) {
        const info = insertConcept.run(concept, freq);
        conceptIds.set(concept, info.lastInsertRowid as number);
        cInserted++;
    }
    
    // Build Concept-Morpheme Map & Concept-Industry Map
    console.log("Building Concept-Morpheme and Concept-Industry graphs...");
    
    const conceptMorphemeCounts = new Map<string, number>(); // key: conceptId_morphemeId
    const conceptIndustryCounts = new Map<string, number>(); // key: conceptId_industry
    
    for (const comp of companies) {
        const concepts = companyConcepts.get(comp.id);
        const morphemes = c2m.get(comp.id);
        const rawIndustry = comp.industry_raw || 'Unknown';
        
        // Use our canonical taxonomy!
        let industryId = mapIndustry(rawIndustry);
        if (!industryId) {
            // Unmapped industry fallback (insert a generic unmapped node, or just use ID=0 for now)
            // Ideally we'd insert dynamically, but we'll drop unmapped for concept_industry_map
            // Wait, we can just insert it to track it
            const ins = db.prepare(`INSERT OR IGNORE INTO industry_ontology (canonical_name) VALUES (?)`).run(rawIndustry);
            industryId = mapIndustry(rawIndustry);
            if (!industryId) industryId = ins.lastInsertRowid;
        }
        
        if (!concepts || !morphemes) continue;
        
        for (const c of concepts) {
            const cid = conceptIds.get(c);
            if (!cid) continue;
            
            const ciKey = `${cid}_${industryId}`;
            conceptIndustryCounts.set(ciKey, (conceptIndustryCounts.get(ciKey) || 0) + 1);
            
            for (const mid of morphemes) {
                const cmKey = `${cid}_${mid}`;
                conceptMorphemeCounts.set(cmKey, (conceptMorphemeCounts.get(cmKey) || 0) + 1);
            }
        }
    }
    
    const insertCM = db.prepare(`INSERT INTO concept_morpheme_map (concept_id, morpheme_id, co_occurrence_count, semantic_relevance, semantic_confidence) VALUES (?, ?, ?, ?, ?)`);
    for (const [key, count] of conceptMorphemeCounts) {
        if (count < 2) continue; // Noise filter
        const [cid, mid] = key.split('_').map(Number);
        
        // TF-IDF inspired weighting
        const df = docFrequency.get(Array.from(conceptIds.entries()).find(x => x[1] === cid)![0])!;
        const relevance = count / df;
        
        insertCM.run(cid, mid, count, relevance, relevance * count);
    }
    
    const insertCI = db.prepare(`INSERT INTO concept_industry_map (concept_id, industry_id, affinity_score) VALUES (?, ?, ?)`);
    for (const [key, count] of conceptIndustryCounts) {
        if (count < 2) continue;
        const [cidStr, indStr] = key.split('_');
        const cid = Number(cidStr);
        const iid = Number(indStr);
        insertCI.run(cid, iid, count);
    }

    // Build Morpheme Co-occurrence (PMI Graph)
    console.log("Building Morpheme PMI Co-occurrence Graph...");
    const morphemePairs = new Map<string, number>();
    const morphemeFreq = new Map<number, number>();
    
    for (const [_, mSet] of c2m) {
        const mArr = Array.from(mSet);
        for (const m of mArr) {
            morphemeFreq.set(m, (morphemeFreq.get(m) || 0) + 1);
        }
        for (let i = 0; i < mArr.length; i++) {
            for (let j = i + 1; j < mArr.length; j++) {
                const a = Math.min(mArr[i], mArr[j]);
                const b = Math.max(mArr[i], mArr[j]);
                const pair = `${a}_${b}`;
                morphemePairs.set(pair, (morphemePairs.get(pair) || 0) + 1);
            }
        }
    }
    
    const insertPMI = db.prepare(`INSERT INTO morpheme_cooccurrence (morpheme_a_id, morpheme_b_id, co_occurrence_count, pmi_score, transition_probability) VALUES (?, ?, ?, ?, ?)`);
    let pmiCount = 0;
    for (const [pair, count] of morphemePairs) {
        if (count < 2) continue; // Must appear together at least twice
        const [a, b] = pair.split('_').map(Number);
        
        const freqA = morphemeFreq.get(a) || 1;
        const freqB = morphemeFreq.get(b) || 1;
        const n = companies.length;
        
        const pa = freqA / n;
        const pb = freqB / n;
        const pab = count / n;
        
        const pmi = Math.log(pab / (pa * pb));
        insertPMI.run(a, b, count, pmi, count / freqA);
        pmiCount++;
    }
    
    db.exec('COMMIT');
    console.log(`Phase 3.75 Complete. Inserted ${cInserted} concepts and ${pmiCount} PMI pairs.`);
}

if (require.main === module) {
    runPhase375();
}
