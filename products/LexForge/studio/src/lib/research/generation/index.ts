// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { builderRegistry } from "./registry";
export { builderRegistry };

// Legacy Builders (Deprecated in Phase 23)
import { SkeletonBuilder } from "./legacy/skeleton";
import { ClusterBuilder } from "./legacy/cluster";
import { MorphologyBuilder } from "./legacy/morphology";
import { TransitionBuilder } from "./legacy/transition";
import { PhoneticBuilder } from "./legacy/phonetic";

// Register default legacy builders (retained for backward compatibility if needed)
builderRegistry.register(new SkeletonBuilder());
builderRegistry.register(new ClusterBuilder());
builderRegistry.register(new MorphologyBuilder());
builderRegistry.register(new TransitionBuilder());
builderRegistry.register(new PhoneticBuilder());
