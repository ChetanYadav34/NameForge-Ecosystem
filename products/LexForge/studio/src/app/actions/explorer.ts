"use server";

import { ExplorerService } from "@/lib/explorer/service";
import { FilterState, SortMode } from "@/lib/explorer/types";

export async function searchAction(
  query: string, 
  mode: "exact" | "prefix" | "substring", 
  filters: FilterState, 
  sort: SortMode, 
  page: number, 
  pageSize: number
) {
  return await ExplorerService.search(query, mode, filters, sort, page, pageSize);
}

export async function getWordAction(id: number) {
  return await ExplorerService.getWord(id);
}
