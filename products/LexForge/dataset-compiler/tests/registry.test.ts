import assert from "node:assert";
import { test } from "node:test";
import { FeatureRegistry } from "../src/registry/feature.registry.js";
import { PipelineRegistry } from "../src/registry/pipeline.registry.js";
import { FeatureDefinition, PipelineModule, PipelineModuleMetadata } from "../src/types/index.js";

test("FeatureRegistry", async (t) => {
  await t.test("registers a new feature successfully", () => {
    FeatureRegistry.clear();
    const feat: FeatureDefinition = {
      id: "feature.test1",
      displayName: "Test Feature",
      description: "A test feature",
      category: "base",
      stage: "normalize",
      generatedBy: "test.module",
      requiresFeatures: [],
      producesFeatures: ["feature.test1"],
      outputFields: ["testField"],
      schemaVersion: 1,
    };
    FeatureRegistry.register(feat);
    assert.strictEqual(FeatureRegistry.getById("feature.test1")?.id, "feature.test1");
  });

  await t.test("throws on duplicate feature ID", () => {
    FeatureRegistry.clear();
    const feat: FeatureDefinition = {
      id: "feature.test1",
      displayName: "Test Feature",
      description: "A test feature",
      category: "base",
      stage: "normalize",
      generatedBy: "test.module",
      requiresFeatures: [],
      producesFeatures: ["feature.test1"],
      outputFields: ["testField"],
      schemaVersion: 1,
    };
    FeatureRegistry.register(feat);
    assert.throws(() => FeatureRegistry.register(feat), /already registered/);
  });

  await t.test("throws on duplicate output fields", () => {
    FeatureRegistry.clear();
    const feat1: FeatureDefinition = {
      id: "feature.test1",
      displayName: "Test Feature",
      description: "A test feature",
      category: "base",
      stage: "normalize",
      generatedBy: "test.module",
      requiresFeatures: [],
      producesFeatures: ["feature.test1"],
      outputFields: ["testField"],
      schemaVersion: 1,
    };
    const feat2: FeatureDefinition = {
      id: "feature.test2",
      displayName: "Test Feature 2",
      description: "A test feature 2",
      category: "base",
      stage: "normalize",
      generatedBy: "test.module2",
      requiresFeatures: [],
      producesFeatures: ["feature.test2"],
      outputFields: ["testField"], // duplicate
      schemaVersion: 1,
    };
    FeatureRegistry.register(feat1);
    assert.throws(() => FeatureRegistry.register(feat2), /already owned by/);
  });
});

class MockModule implements PipelineModule {
  readonly metadata: PipelineModuleMetadata;
  constructor(metadata: PipelineModuleMetadata) {
    this.metadata = metadata;
  }
}

test("PipelineRegistry", async (t) => {
  await t.test("registers modules and sorts by priority", () => {
    PipelineRegistry.clear();
    FeatureRegistry.clear();

    const m1 = new MockModule({
      id: "module1",
      name: "Module 1",
      version: "1.0",
      stage: "transform",
      priority: 20,
      requiresModules: [],
      requiresFeatures: [],
      producesFeatures: [],
      author: "Test",
    });

    const m2 = new MockModule({
      id: "module2",
      name: "Module 2",
      version: "1.0",
      stage: "transform",
      priority: 10,
      requiresModules: [],
      requiresFeatures: [],
      producesFeatures: [],
      author: "Test",
    });

    PipelineRegistry.registerTransformer(m1);
    PipelineRegistry.registerTransformer(m2);

    const transformers = PipelineRegistry.getTransformers();
    assert.strictEqual(transformers[0].metadata.id, "module2"); // priority 10
    assert.strictEqual(transformers[1].metadata.id, "module1"); // priority 20
  });

  await t.test("throws on missing feature dependency", () => {
    PipelineRegistry.clear();
    FeatureRegistry.clear();

    const m1 = new MockModule({
      id: "module1",
      name: "Module 1",
      version: "1.0",
      stage: "transform",
      priority: 20,
      requiresModules: [],
      requiresFeatures: ["missing.feature"],
      producesFeatures: [],
      author: "Test",
    });

    assert.throws(() => PipelineRegistry.registerTransformer(m1), /not registered/);
  });

  await t.test("throws on missing module dependency", () => {
    PipelineRegistry.clear();
    FeatureRegistry.clear();

    const m1 = new MockModule({
      id: "module1",
      name: "Module 1",
      version: "1.0",
      stage: "transform",
      priority: 20,
      requiresModules: ["missing.module"],
      requiresFeatures: [],
      producesFeatures: [],
      author: "Test",
    });

    PipelineRegistry.registerTransformer(m1);
    assert.throws(() => PipelineRegistry.validateDependencies(), /not registered/);
  });

  await t.test("throws on circular module dependency", () => {
    PipelineRegistry.clear();
    FeatureRegistry.clear();

    const m1 = new MockModule({
      id: "module1",
      name: "Module 1",
      version: "1.0",
      stage: "transform",
      priority: 20,
      requiresModules: ["module2"],
      requiresFeatures: [],
      producesFeatures: [],
      author: "Test",
    });

    const m2 = new MockModule({
      id: "module2",
      name: "Module 2",
      version: "1.0",
      stage: "transform",
      priority: 10,
      requiresModules: ["module1"],
      requiresFeatures: [],
      producesFeatures: [],
      author: "Test",
    });

    PipelineRegistry.registerTransformer(m1);
    PipelineRegistry.registerTransformer(m2);

    assert.throws(() => PipelineRegistry.validateDependencies(), /Circular dependency/);
  });
});
