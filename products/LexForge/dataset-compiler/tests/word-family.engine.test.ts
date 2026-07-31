import test from "node:test";
import assert from "node:assert";
import { WordFamilyEngine } from "../src/engines/word-family.engine.js";
import { MorphologyWord } from "../src/types/index.js";

test("WordFamilyEngine - deterministic family clustering", async () => {
  const engine = new WordFamilyEngine();
  
  const input: MorphologyWord[] = [
    {
      word: "run",
      inflections: ["running", "runs", "ran"],
      derivations: ["runner"],
    } as unknown as MorphologyWord,
    {
      word: "running",
      lemma: "run",
      stem: "run",
      inflections: [],
      derivations: [],
    } as unknown as MorphologyWord,
    {
      word: "runs",
      lemma: "run",
      stem: "run",
      inflections: [],
      derivations: [],
    } as unknown as MorphologyWord,
    {
      word: "runner",
      lemma: "run",
      stem: "run",
      inflections: ["runners"],
      derivations: [],
    } as unknown as MorphologyWord,
    {
      word: "runners",
      lemma: "runner",
      stem: "run",
      inflections: [],
      derivations: [],
    } as unknown as MorphologyWord,
    {
      word: "apple",
      inflections: ["apples"],
      derivations: [],
    } as unknown as MorphologyWord,
  ];

  const result = await engine.execute(input);
  assert.strictEqual(result.records.length, 6);
  assert.strictEqual(result.transformedCount, 6);

  // Find the 'run' family words
  const runFamily = result.records.filter(r => r.familyId === "family.run");
  assert.strictEqual(runFamily.length, 5);
  assert.strictEqual(runFamily[0].headword, "run");
  assert.strictEqual(runFamily[0].familySize, 5);
  assert.deepStrictEqual(runFamily[0].wordFamily, ["run", "runner", "runners", "running", "runs"]);

  // Find the 'apple' family words
  const appleFamily = result.records.filter(r => r.familyId === "family.apple");
  assert.strictEqual(appleFamily.length, 1); // Note: "apples" is not in input, so family size is 1!
  assert.strictEqual(appleFamily[0].headword, "apple");
  assert.strictEqual(appleFamily[0].familySize, 1);
});
