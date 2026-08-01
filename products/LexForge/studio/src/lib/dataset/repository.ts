import fs from "node:fs/promises";
import path from "node:path";
import { 
  DatasetManifest, 
  DatasetStats, 
  DatasetIndexEntry, 
  DatasetLookup, 
  LexEntry 
} from "./types";
import { parseJsonlRecord } from "./parser";
import { recordCache } from "./cache";

const COMPILER_OUTPUT_DIR = path.resolve(process.cwd(), "../dataset-compiler/output");

class DatasetRepositoryImpl {
  private manifest: DatasetManifest | null = null;
  private stats: DatasetStats | null = null;
  private lookup: DatasetLookup | null = null;
  private index: DatasetIndexEntry[] | null = null;

  async loadManifest(): Promise<DatasetManifest> {
    if (this.manifest) return this.manifest;
    const content = await fs.readFile(path.join(COMPILER_OUTPUT_DIR, "dataset.manifest.json"), "utf-8");
    this.manifest = JSON.parse(content) as DatasetManifest;
    return this.manifest;
  }

  async loadStats(): Promise<DatasetStats> {
    if (this.stats) return this.stats;
    const content = await fs.readFile(path.join(COMPILER_OUTPUT_DIR, "stats.json"), "utf-8");
    this.stats = JSON.parse(content) as DatasetStats;
    return this.stats;
  }

  private async loadLookup(): Promise<DatasetLookup> {
    if (this.lookup) return this.lookup;
    const content = await fs.readFile(path.join(COMPILER_OUTPUT_DIR, "dataset.lookup.json"), "utf-8");
    this.lookup = JSON.parse(content) as DatasetLookup;
    return this.lookup;
  }

  private async loadIndex(): Promise<DatasetIndexEntry[]> {
    if (this.index) return this.index;
    const content = await fs.readFile(path.join(COMPILER_OUTPUT_DIR, "dataset.index.json"), "utf-8");
    this.index = JSON.parse(content) as DatasetIndexEntry[];
    return this.index;
  }

  async findWord(word: string): Promise<LexEntry | null> {
    const lookup = await this.loadLookup();
    const entryInfo = lookup[word];
    if (!entryInfo) return null;
    return this.loadRecord(entryInfo.id, entryInfo.offset);
  }

  private async loadRecord(id: number, offset: number): Promise<LexEntry | null> {
    const cached = recordCache.get(id);
    if (cached) return cached;

    const index = await this.loadIndex();
    const entry = index.find(e => e.id === id);
    if (!entry) return null;

    const manifest = await this.loadManifest();
    const fileHandle = await fs.open(path.join(COMPILER_OUTPUT_DIR, manifest.artifacts.dataset), "r");
    try {
      const buffer = Buffer.alloc(entry.length);
      await fileHandle.read(buffer, 0, entry.length, entry.offset);
      const record = parseJsonlRecord(buffer.toString("utf-8"));
      recordCache.set(id, record);
      return record;
    } finally {
      await fileHandle.close();
    }
  }
  
  async search(query: string, mode: "exact" | "prefix" | "substring" = "exact"): Promise<DatasetIndexEntry[]> {
    const index = await this.loadIndex();
    
    if (!query) {
      if (mode === "exact") return [];
      return [...index];
    }
    
    const lowerQuery = query.toLowerCase();
    
    if (mode === "exact") {
      const match = index.find(e => e.word.toLowerCase() === lowerQuery);
      return match ? [match] : [];
    }
    
    if (mode === "prefix") {
      return index.filter(e => e.word.toLowerCase().startsWith(lowerQuery));
    }
    
    if (mode === "substring") {
      return index.filter(e => e.word.toLowerCase().includes(lowerQuery));
    }
    
    return [];
  }
}

export const DatasetRepository = new DatasetRepositoryImpl();
