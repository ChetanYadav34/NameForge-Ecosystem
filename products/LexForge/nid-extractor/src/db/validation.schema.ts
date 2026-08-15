import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/nid.sqlite');
const db = new Database(DB_PATH);

export function initAdvancedSchemas() {
    console.log("=== Initializing Phase 3.5, 3.75, and 3.8 Schemas ===");
    
    // We will drop existing tables if this is a fresh validation run so we can re-train cleanly
    db.exec(`
        PRAGMA foreign_keys = OFF;
        
        DROP TABLE IF EXISTS industry_coverage_audit;
        DROP TABLE IF EXISTS validation_diagnostics;
        DROP TABLE IF EXISTS concept_audit;
        DROP TABLE IF EXISTS validation_failures;
        DROP TABLE IF EXISTS generator_validation;
        DROP TABLE IF EXISTS benchmark_results;
        DROP TABLE IF EXISTS validation_metrics;
        DROP TABLE IF EXISTS benchmark_companies;
        DROP TABLE IF EXISTS validation_runs;
        
        DROP TABLE IF EXISTS morpheme_cooccurrence;
        DROP TABLE IF EXISTS concept_industry_map;
        DROP TABLE IF EXISTS concept_morpheme_map;
        DROP TABLE IF EXISTS concept_trend_metrics;
        DROP TABLE IF EXISTS concept_catalog;
        
        DROP TABLE IF EXISTS morpheme_industry_affinity;
        DROP TABLE IF EXISTS company_morpheme_map;
        DROP TABLE IF EXISTS morpheme_catalog;
        
        DROP TABLE IF EXISTS industry_alias;
        DROP TABLE IF EXISTS industry_ontology;
    `);

    db.exec(`
        -- Phase 3.1: Industry Taxonomy
        CREATE TABLE industry_ontology (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            canonical_name TEXT UNIQUE NOT NULL,
            parent_id INTEGER,
            FOREIGN KEY(parent_id) REFERENCES industry_ontology(id)
        );

        CREATE TABLE industry_alias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alias_name TEXT UNIQUE NOT NULL,
            canonical_id INTEGER NOT NULL,
            FOREIGN KEY(canonical_id) REFERENCES industry_ontology(id)
        );

        -- Phase 3.5: Dynamic Morpheme Discovery
        CREATE TABLE morpheme_catalog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            morpheme TEXT UNIQUE NOT NULL,
            detected_type TEXT,            
            global_frequency INTEGER,      
            success_weighting REAL,        
            uniqueness_score REAL          
        );

        CREATE TABLE company_morpheme_map (
            company_id INTEGER,
            morpheme_id INTEGER,
            position TEXT,                 
            FOREIGN KEY(company_id) REFERENCES company_raw_data(id),
            FOREIGN KEY(morpheme_id) REFERENCES morpheme_catalog(id),
            PRIMARY KEY(company_id, morpheme_id)
        );

        CREATE TABLE morpheme_industry_affinity (
            morpheme_id INTEGER,
            industry_id INTEGER,
            industry_frequency INTEGER,
            affinity_score REAL,
            FOREIGN KEY(morpheme_id) REFERENCES morpheme_catalog(id),
            FOREIGN KEY(industry_id) REFERENCES industry_ontology(id),
            PRIMARY KEY(morpheme_id, industry_id)
        );

        -- Phase 3.75: Concept Mapping
        CREATE TABLE concept_catalog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            canonical_name TEXT UNIQUE NOT NULL,
            global_frequency INTEGER
        );

        CREATE TABLE concept_trend_metrics (
            concept_id INTEGER PRIMARY KEY,
            peak_usage_year INTEGER,
            velocity_score REAL,             
            longevity_score REAL,            
            FOREIGN KEY(concept_id) REFERENCES concept_catalog(id)
        );

        CREATE TABLE concept_morpheme_map (
            concept_id INTEGER,
            morpheme_id INTEGER,
            co_occurrence_count INTEGER,
            semantic_relevance REAL,         
            semantic_confidence REAL,        
            FOREIGN KEY(concept_id) REFERENCES concept_catalog(id),
            FOREIGN KEY(morpheme_id) REFERENCES morpheme_catalog(id),
            PRIMARY KEY(concept_id, morpheme_id)
        );

        CREATE TABLE concept_industry_map (
            concept_id INTEGER,
            industry_id INTEGER,
            affinity_score REAL,             
            FOREIGN KEY(concept_id) REFERENCES concept_catalog(id),
            FOREIGN KEY(industry_id) REFERENCES industry_ontology(id),
            PRIMARY KEY(concept_id, industry_id)
        );

        CREATE TABLE morpheme_cooccurrence (
            morpheme_a_id INTEGER,
            morpheme_b_id INTEGER,
            co_occurrence_count INTEGER,
            pmi_score REAL,                  
            transition_probability REAL,     
            FOREIGN KEY(morpheme_a_id) REFERENCES morpheme_catalog(id),
            FOREIGN KEY(morpheme_b_id) REFERENCES morpheme_catalog(id),
            PRIMARY KEY(morpheme_a_id, morpheme_b_id)
        );

        -- Phase 3.8: Validation
        CREATE TABLE validation_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            corpus_size INTEGER,
            holdout_size INTEGER,
            temporal_split_year INTEGER,
            overall_readiness_score REAL,
            is_go_no_go TEXT
        );

        CREATE TABLE benchmark_companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT UNIQUE,
            industry_raw TEXT,
            true_archetype TEXT,
            true_concept_labels TEXT,
            true_morpheme_segmentation TEXT
        );

        CREATE TABLE validation_metrics (
            run_id INTEGER,
            metric_name TEXT,
            metric_value REAL,
            FOREIGN KEY(run_id) REFERENCES validation_runs(id),
            PRIMARY KEY(run_id, metric_name)
        );

        CREATE TABLE benchmark_results (
            run_id INTEGER,
            benchmark_company_id INTEGER,
            predicted_morphemes TEXT,
            predicted_concepts TEXT,
            is_match BOOLEAN,
            FOREIGN KEY(run_id) REFERENCES validation_runs(id),
            FOREIGN KEY(benchmark_company_id) REFERENCES benchmark_companies(id),
            PRIMARY KEY(run_id, benchmark_company_id)
        );

        CREATE TABLE generator_validation (
            run_id INTEGER,
            benchmark_company_id INTEGER,
            generated_candidate TEXT,
            archetype_similarity_score REAL,
            structural_similarity_score REAL,
            phonetic_shape_similarity_score REAL,
            industry_affinity_score REAL,
            novelty_score REAL,               
            composite_similarity_score REAL,
            FOREIGN KEY(run_id) REFERENCES validation_runs(id),
            FOREIGN KEY(benchmark_company_id) REFERENCES benchmark_companies(id)
        );

        CREATE TABLE validation_failures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER,
            failure_type TEXT,                
            company_name TEXT,
            expected_value TEXT,
            predicted_value TEXT,
            notes TEXT,                       
            FOREIGN KEY(run_id) REFERENCES validation_runs(id)
        );

        CREATE TABLE validation_diagnostics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER,
            diagnostic_type TEXT,
            diagnostic_key TEXT,
            diagnostic_value TEXT,
            FOREIGN KEY(run_id) REFERENCES validation_runs(id)
        );

        CREATE TABLE concept_audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER,
            total_concepts INTEGER,
            average_cluster_size REAL,
            concept_entropy REAL,
            over_clustering_flag BOOLEAN,
            top_50_clusters TEXT,
            FOREIGN KEY(run_id) REFERENCES validation_runs(id)
        );

        CREATE TABLE industry_coverage_audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER,
            coverage_type TEXT,
            coverage_percentage REAL,
            severity_classification TEXT,
            unmapped_industries TEXT,
            FOREIGN KEY(run_id) REFERENCES validation_runs(id)
        );
    `);

    console.log("Schemas successfully initialized.");
}

if (require.main === module) {
    initAdvancedSchemas();
}
