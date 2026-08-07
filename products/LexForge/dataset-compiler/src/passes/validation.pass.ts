import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import { CompilerPass, CompilerContext, CompilerPassMetadata, PassMetrics } from "../types/compiler.js";
import crypto from "node:crypto";
import { ScoredWord } from "./confidence.pass.js";
import { FamilyWord, ValidationWarning } from "../types/index.js";
import { ValidationRule, createValidationContext } from "../validator/rules/base.rule.js";
import { EmptyWordRule } from "../validator/rules/empty-word.rule.js";
import { DuplicateWordRule } from "../validator/rules/duplicate-word.rule.js";
import { NonAlphabeticRule } from "../validator/rules/non-alphabetic.rule.js";
import { ArpabetRule } from "../validator/rules/arpabet.rule.js";
import { IpaPresenceRule } from "../validator/rules/ipa-presence.rule.js";
import { PhonologyCountsRule } from "../validator/rules/phonology-counts.rule.js";
import { HasVowelRule } from "../validator/rules/has-vowel.rule.js";
import { UnknownIpaRule } from "../validator/rules/unknown-ipa.rule.js";
import { StressPatternRule } from "../validator/rules/stress-pattern.rule.js";

function getDefaultRules(): ValidationRule[] {
  return [
    // Blocking rules
    new EmptyWordRule(),
    new DuplicateWordRule(),
    new PhonologyCountsRule(),
    new StressPatternRule(),
    // We omit semantic rules for now because we decomposed semantics into edges.
    // Non-blocking rules
    new NonAlphabeticRule(),
    new ArpabetRule(),
    new IpaPresenceRule(),
    new HasVowelRule(),
    new UnknownIpaRule(),
  ];
}

export class ValidationPass implements CompilerPass {
  readonly metadata: CompilerPassMetadata = {
    id: "pass.validation",
    name: "Validation Pass",
    version: "2.0.0",
    description: "Applies validation rules and filters out invalid records.",
    dependencies: ["pass.quality_score"],
  };

  async execute(context: CompilerContext): Promise<PassMetrics> {
    const start = performance.now();
    let recordsProcessed = 0;
    let recordsSkipped = 0;
    
    const confidenceArtifact = context.getArtifact("artifact.scored");
    
    if (!confidenceArtifact) {
      throw new Error("Missing required artifact from QualityScorePass.");
    }
    
    const tmpDir = path.join(context.config.outputPath, "tmp");
    const outPath = path.join(tmpDir, "validated.jsonl");
    const outStream = fs.createWriteStream(outPath);
    
    const rl = createInterface({
      input: fs.createReadStream(confidenceArtifact.path),
      crlfDelay: Infinity,
    });
    
    const activeRules = getDefaultRules();
    const valContext = createValidationContext();
    
    for await (const line of rl) {
      const entry: ScoredWord = JSON.parse(line);
      
      let isValid = true;
      const recordWarnings: ValidationWarning[] = [];
      
      for (const rule of activeRules) {
        // Validation rules expect FamilyWord (the old flat schema).
        // Our new streaming format maps to it closely enough for these specific rules.
        const warning = rule.validate(entry as unknown as FamilyWord, valContext);

        if (warning) {
          recordWarnings.push(warning);
          if (rule.isBlocking) {
            isValid = false;
            break; 
          }
        }
      }

      for (const warning of recordWarnings) {
        context.emitDiagnostic({
          level: isValid ? "warning" : "error", // Blocking triggers error
          passId: this.metadata.id,
          message: `[${warning.rule}] "${warning.word}": ${warning.issue}`
        });
      }

      if (isValid) {
        outStream.write(JSON.stringify(entry) + "\n");
        recordsProcessed++;
      } else {
        recordsSkipped++;
      }
    }
    
    await new Promise<void>((resolve, reject) => {
      outStream.end((err: any) => err ? reject(err) : resolve());
    });
    
    context.registerArtifact({
      id: "artifact.validated",
      type: "jsonl",
      passId: this.metadata.id,
      path: outPath,
      hash: await this.hashFile(outPath),
      dependencies: [confidenceArtifact.id]
    });
    
    const end = performance.now();

    context.emitDiagnostic({
      level: "info",
      passId: this.metadata.id,
      message: `Validated ${recordsProcessed} records. Skipped ${recordsSkipped} invalid records.`,
    });

    return {
      executionTimeMs: end - start,
      recordsProcessed,
      recordsSkipped,
      memoryUsageMb: process.memoryUsage().heapUsed / 1024 / 1024,
    };
  }
  
  private hashFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('error', err => reject(err));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }
}
