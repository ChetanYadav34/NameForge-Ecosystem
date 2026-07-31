import assert from "node:assert";
import { test } from "node:test";
import { ResourceRegistry } from "../src/registry/resource.registry.js";
import { ResourceDefinition, ResourceState } from "../src/types/index.js";
import path from "node:path";
import fs from "node:fs";

test("ResourceRegistry", async (t) => {
  const dummyFile = path.resolve("dummy-test-resource.txt");

  t.before(() => {
    fs.writeFileSync(dummyFile, "dummy");
  });

  t.after(() => {
    if (fs.existsSync(dummyFile)) {
      fs.unlinkSync(dummyFile);
    }
  });

  t.beforeEach(() => {
    ResourceRegistry.clear();
  });

  await t.test("registers a new resource and transitions states", () => {
    const res: ResourceDefinition = {
      id: "test.resource",
      name: "Test Resource",
      version: "1.0",
      description: "Test description",
      provider: "Test Provider",
      language: "en",
      format: "txt",
      resourceType: "dictionary",
      path: dummyFile,
      consumedBy: [],
      provides: [],
    };

    ResourceRegistry.register(res);
    assert.strictEqual(ResourceRegistry.getState("test.resource"), ResourceState.REGISTERED);

    ResourceRegistry.validateAll();
    assert.strictEqual(ResourceRegistry.getState("test.resource"), ResourceState.VALIDATED);

    ResourceRegistry.markLoaded("test.resource");
    assert.strictEqual(ResourceRegistry.getState("test.resource"), ResourceState.LOADED);

    const retrieved = ResourceRegistry.get("test.resource");
    assert.strictEqual(retrieved.id, "test.resource");
  });

  await t.test("throws on duplicate resource ID", () => {
    const res: ResourceDefinition = {
      id: "test.resource",
      name: "Test Resource",
      version: "1.0",
      description: "Test description",
      provider: "Test Provider",
      language: "en",
      format: "txt",
      resourceType: "dictionary",
      path: dummyFile,
      consumedBy: [],
      provides: [],
    };

    ResourceRegistry.register(res);
    assert.throws(() => ResourceRegistry.register(res), /already registered/);
  });

  await t.test("throws on duplicate resource path", () => {
    const res1: ResourceDefinition = {
      id: "test.resource1",
      name: "Test Resource",
      version: "1.0",
      description: "Test description",
      provider: "Test Provider",
      language: "en",
      format: "txt",
      resourceType: "dictionary",
      path: dummyFile,
      consumedBy: [],
      provides: [],
    };

    const res2: ResourceDefinition = {
      id: "test.resource2",
      name: "Test Resource",
      version: "1.0",
      description: "Test description",
      provider: "Test Provider",
      language: "en",
      format: "txt",
      resourceType: "dictionary",
      path: dummyFile,
      consumedBy: [],
      provides: [],
    };

    ResourceRegistry.register(res1);
    assert.throws(() => ResourceRegistry.register(res2), /Resource path collision/);
  });

  await t.test("sets state to FAILED and throws when validating missing path", () => {
    const res: ResourceDefinition = {
      id: "test.missing",
      name: "Missing Resource",
      version: "1.0",
      description: "Missing description",
      provider: "Test Provider",
      language: "en",
      format: "txt",
      resourceType: "dictionary",
      path: path.resolve("does-not-exist.txt"),
      consumedBy: [],
      provides: [],
    };

    ResourceRegistry.register(res);
    assert.throws(() => ResourceRegistry.validateAll(), /Path does not exist/);
    assert.strictEqual(ResourceRegistry.getState("test.missing"), ResourceState.FAILED);
  });
});
