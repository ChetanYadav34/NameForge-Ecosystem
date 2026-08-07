import { LexEntry, KnowledgeQualityScore, RelationshipProvenance } from "../types/index.js";
import { KnowledgePackageManifest, MergePolicy } from "../types/knowledge-package.js";
import { logger } from "../utils/logger.js";

export class MergeEngine {
  /**
   * Merges an incoming patch into the base canonical entity using the policies defined in the manifest.
   */
  static applyPatch(
    base: LexEntry,
    patch: Partial<LexEntry>,
    manifest: KnowledgePackageManifest
  ): LexEntry {
    const result = { ...base }; // Clone base

    // Process each field in the patch
    for (const key of Object.keys(patch) as Array<keyof LexEntry>) {
      // Must be authoritative or enrichable
      if (!manifest.authoritativeFields.includes(key) && !manifest.enrichableFields.includes(key)) {
        if (!manifest.prohibitedFields.includes(key)) {
           // Not explicitly prohibited, but not allowed either
           continue;
        }
        logger.warn(`Package ${manifest.id} attempted to modify prohibited field: ${key}`);
        continue;
      }

      const policy = manifest.mergePolicy[key] || "overwrite"; // fallback
      
      const baseVal = base[key];
      const patchVal = patch[key];

      if (patchVal === undefined) continue;

      switch (policy) {
        case "highest-confidence":
          // E.g., IPA. For this simple engine, we assume incoming is higher if it's authoritative,
          // otherwise we'd need field-level confidence tracking which we don't have yet.
          // Since it's V7 and the new packages are higher confidence, we overwrite.
          (result as any)[key] = patchVal;
          break;

        case "union-deduplicate":
          if (Array.isArray(baseVal) && Array.isArray(patchVal)) {
            (result as any)[key] = Array.from(new Set([...baseVal, ...patchVal]));
          } else {
            (result as any)[key] = patchVal;
          }
          break;

        case "append-only":
          if (Array.isArray(baseVal) && Array.isArray(patchVal)) {
            (result as any)[key] = [...baseVal, ...patchVal];
          }
          break;

        case "preserve-provenance":
        case "preserve-all":
          if (Array.isArray(baseVal) && Array.isArray(patchVal)) {
            // Keep both, perhaps they are objects with provenance
            (result as any)[key] = [...baseVal, ...patchVal];
          } else {
            (result as any)[key] = patchVal;
          }
          break;
          
        case "weighted-confidence":
          // Frequency - for now just overwrite if we don't have a complex merging struct
          (result as any)[key] = patchVal;
          break;

        case "fail-on-conflict":
          if (baseVal !== undefined && baseVal !== null && Array.isArray(baseVal) ? baseVal.length > 0 : true) {
            throw new Error(`Merge conflict on field ${key} for entity ${base.id} by package ${manifest.id}`);
          }
          (result as any)[key] = patchVal;
          break;

        case "overwrite":
        default:
          (result as any)[key] = patchVal;
          break;
      }
    }

    return result;
  }
}
