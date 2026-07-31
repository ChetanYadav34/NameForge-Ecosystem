import test from "node:test";
import assert from "node:assert";
import { FrequencyEnricher } from "../src/enrichers/frequency.enricher.js";
import { MorphologyWord } from "../src/types/index.js";
import { ResourceRegistry } from "../src/registry/resource.registry.js";
import { PipelineRegistry } from "../src/registry/pipeline.registry.js";
import { WordNetEnricher } from "../src/enrichers/wordnet.enricher.js";
import { HunspellEnricher } from "../src/enrichers/hunspell.enricher.js";

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Minimal setup required by resource validations
const mockCsvPath = path.join(os.tmpdir(), "mock_wordfreq.csv");

test.beforeEach(() => {
  // Create mock CSV
  fs.writeFileSync(mockCsvPath, "word,zipf\nthe,8.0\nand,7.5\nrun,5.5\nabecedarian,1.5\nzyzzyva,1.0\n");

  // Clear registries for clean slate
  // We can't really clear them safely if they are singletons without a reset method,
  // but we can register resources safely.
  if (!ResourceRegistry.getAll().some(r => r.id === "resource.wordfreq")) {
    ResourceRegistry.register({
      id: "resource.wordfreq",
      name: "wordfreq",
      version: "3.1.1",
      description: "Zipf scale frequencies for English",
      provider: "wordfreq",
      language: "en",
      format: "csv",
      resourceType: "frequency",
      path: mockCsvPath,
      consumedBy: ["enricher.frequency"],
      provides: ["feature.frequency"],
    });
  }

  // Set the state to LOADED so the enricher picks it up
  try {
    ResourceRegistry.markLoaded("resource.wordfreq");
  } catch (e) {
    // Ignore if already loaded
  }
});

test("FrequencyEnricher - adds frequency data, ranks, and percentiles", async () => {
  const enricher = new FrequencyEnricher();
  
  const input: MorphologyWord[] = [
    { word: "the" } as unknown as MorphologyWord,
    { word: "run" } as unknown as MorphologyWord,
    { word: "and" } as unknown as MorphologyWord,
    { word: "abecedarian" } as unknown as MorphologyWord,
    { word: "unknownword" } as unknown as MorphologyWord,
    { word: "zyzzyva" } as unknown as MorphologyWord,
  ];

  const result = await enricher.enrich(input);
  
  assert.strictEqual(result.transformedCount, 5); // 5 words out of 6 have frequencies
  assert.strictEqual(result.records.length, 6);

  // 'the' should be rank 1
  const theWord = result.records.find(r => r.word === "the");
  assert.ok(theWord?.frequency);
  assert.strictEqual(theWord.frequency.zipf, 8.0);
  assert.strictEqual(theWord.frequency.lexforgeRank, 1);
  assert.strictEqual(theWord.frequency.band, "very-common");
  assert.strictEqual(theWord.frequency.lexforgePercentile, 100);

  // 'and' should be rank 2
  const andWord = result.records.find(r => r.word === "and");
  assert.ok(andWord?.frequency);
  assert.strictEqual(andWord.frequency.zipf, 7.5);
  assert.strictEqual(andWord.frequency.lexforgeRank, 2);

  // 'run' rank 3
  const runWord = result.records.find(r => r.word === "run");
  assert.ok(runWord?.frequency);
  assert.strictEqual(runWord.frequency.zipf, 5.5);
  assert.strictEqual(runWord.frequency.lexforgeRank, 3);
  assert.strictEqual(runWord.frequency.band, "common");

  // 'abecedarian' rank 4
  const abecWord = result.records.find(r => r.word === "abecedarian");
  assert.ok(abecWord?.frequency);
  assert.strictEqual(abecWord.frequency.zipf, 1.5);
  assert.strictEqual(abecWord.frequency.lexforgeRank, 4);
  assert.strictEqual(abecWord.frequency.band, "rare");

  // 'zyzzyva' rank 5
  const zyzzyvaWord = result.records.find(r => r.word === "zyzzyva");
  assert.ok(zyzzyvaWord?.frequency);
  assert.strictEqual(zyzzyvaWord.frequency.zipf, 1.0);
  assert.strictEqual(zyzzyvaWord.frequency.lexforgeRank, 5);
  assert.strictEqual(zyzzyvaWord.frequency.lexforgePercentile, 0); // last rank is 0 percentile
  assert.strictEqual(zyzzyvaWord.frequency.band, "very-rare");

  // 'unknownword' shouldn't have frequency
  const unknownWord = result.records.find(r => r.word === "unknownword");
  assert.strictEqual(unknownWord?.frequency, undefined);
});
