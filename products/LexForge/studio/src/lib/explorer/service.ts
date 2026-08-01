import { DatasetRepository } from "../dataset/repository";
import { DatasetIndexEntry, LexEntry } from "../dataset/types";
import { ExplorerSearchResult, FilterState, PaginatedResult, SortMode } from "./types";

class ExplorerServiceImpl {
  async search(
    query: string,
    mode: "exact" | "prefix" | "substring",
    filters: FilterState,
    sort: SortMode,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<ExplorerSearchResult>> {
    const rawResults = await DatasetRepository.search(query, mode);
    
    // Apply Filters
    let filtered = rawResults;
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(entry => this.applyFilters(entry, filters));
    }

    // Apply Sorting
    const sorted = this.applySort(filtered, sort);

    // Apply Pagination
    const total = sorted.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = sorted.slice(startIndex, endIndex);

    // Map to ExplorerSearchResult
    const results = paginated.map(entry => this.mapToSearchResult(entry));

    return {
      results,
      total,
      page,
      pageSize,
      hasNext: endIndex < total,
    };
  }

  async getWord(id: number): Promise<LexEntry | null> {
    const index = await DatasetRepository.search("", "prefix"); // get all
    const entry = index.find(e => e.id === id);
    if (!entry) return null;
    return DatasetRepository.findWord(entry.word);
  }

  private applyFilters(entry: DatasetIndexEntry, filters: FilterState): boolean {
    if (filters.hasIpa && !entry.hasIpa) return false;
    if (filters.hasMorphology && !entry.hasMorphology) return false;
    if (filters.hasFrequency && !entry.hasFrequency) return false;
    if (filters.hasWordNet && !entry.hasWordNet) return false;
    if (filters.hasFamily && !entry.hasFamily) return false;
    if (filters.hasDefinitions && !entry.hasDefinitions) return false;
    
    if (filters.pos && filters.pos.length > 0) {
      const match = entry.partOfSpeech.some(pos => filters.pos.includes(pos));
      if (!match) return false;
    }

    if (filters.minLength !== undefined && entry.word.length < filters.minLength) return false;
    if (filters.maxLength !== undefined && entry.word.length > filters.maxLength) return false;

    if (filters.frequencyBand && filters.frequencyBand.length > 0) {
      if (!entry.zipf) return false;
      const band = this.getFrequencyBand(entry.zipf);
      if (!filters.frequencyBand.includes(band)) return false;
    }

    return true;
  }

  private applySort(entries: DatasetIndexEntry[], sort: SortMode): DatasetIndexEntry[] {
    const arr = [...entries];
    
    switch (sort) {
      case "alphabetical":
        arr.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case "frequency":
        arr.sort((a, b) => (b.zipf || 0) - (a.zipf || 0));
        break;
      case "length":
        arr.sort((a, b) => a.word.length - b.word.length);
        break;
    }
    
    return arr;
  }

  private getFrequencyBand(zipf: number): string {
    if (zipf >= 5.0) return "very-common";
    if (zipf >= 4.0) return "common";
    if (zipf >= 3.0) return "uncommon";
    if (zipf >= 2.0) return "rare";
    return "very-rare";
  }

  private mapToSearchResult(entry: DatasetIndexEntry): ExplorerSearchResult {
    return {
      id: entry.id,
      word: entry.word,
      zipf: entry.zipf,
      partOfSpeech: entry.partOfSpeech,
      sources: entry.sources,
      familyId: entry.familyId,
    };
  }
}

export const ExplorerService = new ExplorerServiceImpl();
