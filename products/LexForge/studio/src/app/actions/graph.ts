"use server";

import { GraphService } from "@/lib/graph/service";
import { ExpandRequest } from "@/lib/graph/types";
import { getRelationshipDefinitions } from "@/lib/graph/providers/registry";

export async function expandNodeAction(request: ExpandRequest) {
  try {
    const view = await GraphService.expandNode(request);
    return { success: true, view };
  } catch (error: any) {
    console.error("Expand node error:", error);
    return { success: false, error: error.message };
  }
}

export async function getRelationshipDefinitionsAction() {
  // Return plain array to cross the server boundary
  return getRelationshipDefinitions().map(def => ({...def}));
}
