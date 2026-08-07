import { PassRegistry } from "../registry/pass.registry.js";
import { DefaultCompilerContext } from "./context.js";
import path from "node:path";
import { logger } from "../utils/logger.js";
import { BaseKnowledgePass } from "../passes/base-knowledge.pass.js";
import { KnowledgeIntegrationPass } from "../passes/knowledge-integration.pass.js";
import { RelationshipBuilderPass } from "../passes/relationship-builder.pass.js";
import { QualityScorePass } from "../passes/quality-score.pass.js";
import { ValidationPass } from "../passes/validation.pass.js";
import { ExportPass } from "../passes/export.pass.js";
import { IndexBuilderPass } from "../passes/index-builder.pass.js";
import { ReportingPass } from "../passes/reporting.pass.js";
import { ArtifactVerificationPass } from "../passes/artifact-verification.pass.js";
import { PackageRegistry } from "../registry/package.registry.js";
import { WordNetPackage } from "../packages/wordnet.package.js";
import { KaikkiPackage } from "../packages/kaikki.package.js";
import { PhoiblePackage } from "../packages/phoible.package.js";
import { WikiPronPackage } from "../packages/wikipron.package.js";
import { BrandIntelligencePackage } from "../packages/brand-intelligence.package.js";
import { config, projectRoot } from "../config/index.js";

export class LexForgeCompiler {
  /**
   * Registers all compiler passes.
   */
  static bootstrap(): void {
    // Register Knowledge Packages (V7 Pipeline)
    PackageRegistry.register(KaikkiPackage);
    PackageRegistry.register(WordNetPackage);
    PackageRegistry.register(PhoiblePackage);
    PackageRegistry.register(WikiPronPackage);
    PackageRegistry.register(BrandIntelligencePackage);

    PackageRegistry.validateAll();

    // Register Passes
    PassRegistry.register(new BaseKnowledgePass());
    PassRegistry.register(new KnowledgeIntegrationPass());
    PassRegistry.register(new RelationshipBuilderPass());
    PassRegistry.register(new QualityScorePass());
    PassRegistry.register(new ValidationPass());
    PassRegistry.register(new IndexBuilderPass());
    PassRegistry.register(new ReportingPass());
    PassRegistry.register(new ArtifactVerificationPass());
    PassRegistry.register(new ExportPass());
  }

  /**
   * Executes the full pass-based pipeline.
   */
  static async execute(): Promise<void> {
    const context = new DefaultCompilerContext();
    logger.banner(context.version);
    logger.info(`Session ID: ${context.sessionId}`);
    logger.info(`Output path: ${context.config.outputPath}`);
    logger.divider();

    try {
      const executionPlan = PassRegistry.buildExecutionPlan();
      
      logger.info(`Compiler execution plan generated with ${executionPlan.length} passes.`);

      for (let i = 0; i < executionPlan.length; i++) {
        const pass = executionPlan[i];
        logger.step(i + 1, `Executing ${pass.metadata.name}`);
        
        const metrics = await pass.execute(context);
        
        logger.success(
          `${pass.metadata.name} completed in ${(metrics.executionTimeMs / 1000).toFixed(2)}s. ` +
          `Processed: ${metrics.recordsProcessed.toLocaleString()}, Skipped: ${metrics.recordsSkipped.toLocaleString()}`
        );
      }

      logger.divider();
      logger.success("Compilation completed successfully.");
    } catch (err) {
      logger.error("Compilation failed:");
      console.error(err);
      
      context.emitDiagnostic({
        level: "error",
        passId: "compiler.core",
        message: err instanceof Error ? err.message : String(err),
      });
      
      throw err;
    } finally {
      await context.close();
    }
  }
}
