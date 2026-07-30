// ============================================================================
// LexForge Dataset Compiler — Logger
// ============================================================================
// Structured, colored console output with step timing.
// Zero dependencies — uses ANSI escape codes directly.
// ============================================================================

/**
 * ANSI color codes for terminal output.
 */
const Colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  // Foreground
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
} as const;

/**
 * Format a duration in milliseconds to a human-readable string.
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(2)}s`;
  const minutes = Math.floor(ms / 60_000);
  const seconds = ((ms % 60_000) / 1000).toFixed(1);
  return `${minutes}m ${seconds}s`;
}

/**
 * Get a formatted timestamp string.
 */
function timestamp(): string {
  return new Date().toISOString().replace("T", " ").replace("Z", "");
}

export const logger = {
  /**
   * Log an informational message.
   */
  info(message: string): void {
    console.log(
      `${Colors.gray}[${timestamp()}]${Colors.reset} ${Colors.cyan}ℹ${Colors.reset} ${message}`
    );
  },

  /**
   * Log a success message.
   */
  success(message: string): void {
    console.log(
      `${Colors.gray}[${timestamp()}]${Colors.reset} ${Colors.green}✓${Colors.reset} ${message}`
    );
  },

  /**
   * Log a warning message.
   */
  warn(message: string): void {
    console.log(
      `${Colors.gray}[${timestamp()}]${Colors.reset} ${Colors.yellow}⚠${Colors.reset} ${Colors.yellow}${message}${Colors.reset}`
    );
  },

  /**
   * Log an error message.
   */
  error(message: string): void {
    console.error(
      `${Colors.gray}[${timestamp()}]${Colors.reset} ${Colors.red}✗${Colors.reset} ${Colors.red}${message}${Colors.reset}`
    );
  },

  /**
   * Log a step header (pipeline phase).
   */
  step(stepNumber: number, message: string): void {
    console.log(
      `\n${Colors.bold}${Colors.magenta}[Step ${stepNumber}]${Colors.reset} ${Colors.bold}${message}${Colors.reset}`
    );
  },

  /**
   * Log a statistic (key-value pair).
   */
  stat(label: string, value: string | number): void {
    console.log(
      `  ${Colors.dim}→${Colors.reset} ${label}: ${Colors.bold}${value}${Colors.reset}`
    );
  },

  /**
   * Print a visual divider.
   */
  divider(): void {
    console.log(
      `${Colors.dim}${"─".repeat(60)}${Colors.reset}`
    );
  },

  /**
   * Print the compiler banner.
   */
  banner(version: string): void {
    console.log("");
    console.log(
      `${Colors.bold}${Colors.cyan}╔══════════════════════════════════════════╗${Colors.reset}`
    );
    console.log(
      `${Colors.bold}${Colors.cyan}║   LexForge Dataset Compiler v${version}      ║${Colors.reset}`
    );
    console.log(
      `${Colors.bold}${Colors.cyan}╚══════════════════════════════════════════╝${Colors.reset}`
    );
    console.log("");
  },

  /**
   * Time a function and log how long it took.
   * Returns the result of the function.
   */
  async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const elapsed = Math.round(performance.now() - start);
    this.info(`${label} completed in ${Colors.bold}${formatDuration(elapsed)}${Colors.reset}`);
    return result;
  },
};
