const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
  bright: "\x1b[1m",
};

/**
 * Gets formatted timestamp for logging
 * @returns Current timestamp in format: YYYY-MM-DD HH:MM:SS
 */
const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().replace("T", " ").substring(0, 19);
};

/**
 * Custom logger utility for Hono Context.
 * Supports info, warn, and error logs with consistent structure and colored output.
 */
export const customLog = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(
      `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.green}[INFO]${colors.reset} ${message}` +
        (meta ? ` | ${JSON.stringify(meta)}` : ""),
    );
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.log(
      `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.yellow}[WARN]${colors.reset} ${message}` +
        (meta ? ` | ${JSON.stringify(meta)}` : ""),
    );
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    console.log(
      `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.red}[ERROR]${colors.reset} ${message}` +
        (meta ? ` | ${JSON.stringify(meta)}` : ""),
    );
  },
};
