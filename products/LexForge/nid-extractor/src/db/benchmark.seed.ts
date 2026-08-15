import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

const INDUSTRIES = [
    { name: 'Fintech', concepts: ['payments','api','finance','banking','trading','credit'], roots: ['fin','pay','stripe','plaid','brex','coin','cash'] },
    { name: 'Healthcare', concepts: ['health','medical','care','clinic','doctor','patient'], roots: ['med','care','health','vita','cure','bio'] },
    { name: 'Ecommerce', concepts: ['store','ecommerce','cart','shopping','retail'], roots: ['shop','cart','buy','store','com'] },
    { name: 'Social', concepts: ['social','images','boards','networking','community'], roots: ['soc','pin','net','hub','connect'] },
    { name: 'Data', concepts: ['data','cloud','warehouse','analytics','ai'], roots: ['data','base','brick','snow','cloud'] },
    { name: 'Travel', concepts: ['travel','booking','rental','vacation','hotel'], roots: ['air','trip','fly','book','stay'] },
    { name: 'Edtech', concepts: ['education','courses','learning','school','student'], roots: ['edu','learn','course','study','skill'] },
    { name: 'HR', concepts: ['hr','payroll','benefits','recruiting','team'], roots: ['team','work','gusto','rip','hire'] },
    { name: 'Design', concepts: ['design','graphics','presentation','ui','collaboration'], roots: ['design','canv','fig','art','draw'] },
    { name: 'Productivity', concepts: ['notes','wiki','workspace','scheduling','database'], roots: ['note','work','flow','time','cal'] }
];

const ARCHETYPES = ['Dictionary', 'Compound', 'Portmanteau', 'Root + Suffix', 'Abstract Coined'];

export function seedBenchmarks() {
    console.log("=== Seeding Benchmark Companies (Expanded) ===");
    
    db.exec('BEGIN TRANSACTION');
    const insert = db.prepare(`
        INSERT OR IGNORE INTO benchmark_companies 
        (company_name, industry_raw, true_archetype, true_concept_labels, true_morpheme_segmentation)
        VALUES (?, ?, ?, ?, ?)
    `);

    // Generate 200 benchmarks (20 per industry)
    let count = 0;
    for (const ind of INDUSTRIES) {
        for (let i = 0; i < 20; i++) {
            const arch = ARCHETYPES[i % ARCHETYPES.length];
            const root1 = ind.roots[i % ind.roots.length];
            const root2 = ind.roots[(i + 1) % ind.roots.length];
            
            // Randomly combine concepts
            const c1 = ind.concepts[i % ind.concepts.length];
            const c2 = ind.concepts[(i + 1) % ind.concepts.length];
            
            let name = '';
            let seg = '';
            
            if (arch === 'Compound') {
                name = root1 + root2;
                seg = root1 + '-' + root2;
            } else if (arch === 'Root + Suffix') {
                name = root1 + 'ify';
                seg = root1 + '-ify';
            } else if (arch === 'Portmanteau') {
                name = root1.substring(0, 3) + root2.substring(0, 3);
                seg = root1.substring(0, 3) + '-' + root2.substring(0, 3);
            } else {
                name = root1;
                seg = root1;
            }
            
            // Ensure uniqueness
            name = name + i.toString();
            
            insert.run(name, ind.name, arch, `${c1},${c2}`, seg);
            count++;
        }
    }
    
    db.exec('COMMIT');
    console.log(`Seeded ${count} benchmark companies across ${INDUSTRIES.length} industries.`);
}

if (require.main === module) {
    seedBenchmarks();
}
