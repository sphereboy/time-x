/* eslint-disable no-console */
type LogLevel = "debug" | "info" | "warn" | "error";

const isDevelopment = process.env.NODE_ENV === "development";

function formatMessage(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!isDevelopment) {
    return;
  }

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case "debug":
      console.debug(prefix, message, ...args);
      break;
    case "info":
      console.info(prefix, message, ...args);
      break;
    case "warn":
      console.warn(prefix, message, ...args);
      break;
    case "error":
      console.error(prefix, message, ...args);
      break;
  }
}

export const logger = {
  debug: (message: string, ...args: unknown[]): void => {
    formatMessage("debug", message, ...args);
  },
  info: (message: string, ...args: unknown[]): void => {
    formatMessage("info", message, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    formatMessage("warn", message, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    formatMessage("error", message, ...args);
  },
};
