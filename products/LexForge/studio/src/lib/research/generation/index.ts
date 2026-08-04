// Types
export * from "./types";

// Engine
export * from "./engine";

// Registry
import { builderRegistry } from "./registry";
export { builderRegistry };

// Builders
import { SkeletonBuilder } from "./builders/skeleton";
import { ClusterBuilder } from "./builders/cluster";
import { MorphologyBuilder } from "./builders/morphology";
import { TransitionBuilder } from "./builders/transition";
import { PhoneticBuilder } from "./builders/phonetic";

// Register default builders
builderRegistry.register(new SkeletonBuilder());
builderRegistry.register(new ClusterBuilder());
builderRegistry.register(new MorphologyBuilder());
builderRegistry.register(new TransitionBuilder());
builderRegistry.register(new PhoneticBuilder());
