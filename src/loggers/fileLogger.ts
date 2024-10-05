// Path: src/loggers/fileLogger.ts
import fs from "fs";
import path from "path";

const defaultLogDir = "logs";
const defaultLogFile = "server.log";
let logFilePath = path.join(defaultLogDir, defaultLogFile);

const stripAnsiCodes = (str: string) => str.replace(/\u001b\[\d+m/g, "");

export const setLogPath = (customPath?: string) => {
  if (customPath) {
    logFilePath = path.resolve(customPath);
  } else {
    // Ensure the logs directory exists
    if (!fs.existsSync(defaultLogDir)) {
      fs.mkdirSync(defaultLogDir, { recursive: true });
    }
    logFilePath = path.join(defaultLogDir, defaultLogFile);
  }
};

export const writeToFile = (message: string) => {
  // Ensure the directory exists before writing
  const dir = path.dirname(logFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.appendFileSync(logFilePath, stripAnsiCodes(message) + "\n");
};

// Initialize the default log path
setLogPath();
