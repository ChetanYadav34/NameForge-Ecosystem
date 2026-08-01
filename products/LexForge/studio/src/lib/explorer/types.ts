import { DatasetIndexEntry, LexEntry } from "../dataset/types";

export interface ExplorerSearchResult {
  id: number;
  word: string;
  zipf?: number;
  partOfSpeech: string[];
  sources: string[];
  familyId?: string;
  score?: number;
  highlights?: Record<string, string[]>;
}

export interface PaginatedResult<T> {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export type SortMode = "alphabetical" | "frequency" | "length";

export interface FilterDefinition {
  id: string;
  label: string;
  type: "boolean" | "select" | "multi-select" | "range";
  options?: { label: string; value: string }[];
}

export type FilterState = Record<string, any>;
