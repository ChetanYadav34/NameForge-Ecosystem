# NameForge Ecosystem Plugin SDK

The NameForge Plugin SDK is the official contract for building applications, features, and capabilities within the NameForge Ecosystem (LexForge, RootForge, NameForge, etc.).

## 1. Plugin Manifest

Every plugin must expose a `PluginManifest`. This separates metadata from runtime behavior.

```typescript
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  sdkVersion: string;
  author?: string;
  description?: string;

  dependencies?: string[];
  optionalDependencies?: string[];
  
  capabilities?: PluginCapabilities;
  permissions?: PluginPermissions;

  commands?: any[];
  navigation?: PluginNavigation[];
  workspaces?: Record<string, ReactNode>;
  intelligenceModules?: IntelligenceModule[];
  themeContributions?: Record<string, any>;
  settingsPages?: Record<string, any>;
}
```

## 2. Capabilities & Permissions

- **Capabilities**: Describe what a plugin provides (e.g., `dataset`, `graph`, `validation`, `ai`).
- **Permissions**: Explicitly declare required access to the underlying OS (e.g., `filesystem`, `network`, `telemetry`).

## 3. Lifecycle

Plugins execute via the `StudioPlugin` runtime which extends the manifest:

```typescript
export interface StudioPlugin {
  manifest: PluginManifest;

  onInstall?: () => Promise<void>;
  onLoad?: () => Promise<void>;
  onActivate?: () => Promise<void>;
  onDeactivate?: () => Promise<void>;
  onUnload?: () => Promise<void>;
  onDispose?: () => Promise<void>;
}
```

## 4. Service Resolution

Plugins should use the Dependency Injection style Service Registry:

```typescript
import { serviceRegistry } from "@/core/services";

// Example of resolving a service
const datasetRepository = serviceRegistry.resolve<DatasetRepository>("DatasetRepository");
```

## 5. Event Bus

The Event Bus uses strictly typed Event Payloads and an `EventType` enum:

```typescript
import { coreEvents, EventType } from "@/core/event";

// Subscribing
const unsubscribe = coreEvents.subscribe(EventType.EntitySelected, (event) => {
  console.log(event.payload.entityId);
});

// Publishing
coreEvents.publish(EventType.EntitySelected, {
  entityType: "word",
  entityId: "123",
  source: "explorer"
});
```

## 6. Intelligence Registration

Plugins can register context-aware Intelligence Modules that automatically render in the Intelligence Panel:

```typescript
export interface IntelligenceModule {
  id: string;
  name: string;
  priority: number;
  condition: (context: any) => boolean; // Defines when this module activates
  render: (context: any) => ReactNode; // Returns the React UI
  actions?: () => Array<{ id: string; label: string; onClick: () => void }>;
  commands?: () => string[];
}
```

## 7. Registration

Register your plugin in `corePlugins`:

```typescript
import { corePlugins } from "@/core/plugin";

corePlugins.register({
  manifest: { ... },
  onLoad: async () => { ... }
});
```