import { LexEntry } from "./types";

export function parseJsonlRecord(line: string): LexEntry {
  try {
    return JSON.parse(line.trim()) as LexEntry;
  } catch (error) {
    throw new Error(`Failed to parse JSONL record: ${(error as Error).message}`);
  }
}
