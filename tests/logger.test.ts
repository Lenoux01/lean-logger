// Path: tests/logger.test.ts
import { afterEach, beforeEach } from "bun:test";
import fs from "fs";
import path from "path";

export const logDir = "logs";
export const logFilePath = path.join(logDir, "server.log");

export const consoleLogInterceptor = () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    logs.push(
      args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" ")
    );
    originalLog.apply(console, args);
  };
  return logs;
};

export const stripAnsiCodes = (str: string) => str.replace(/\u001b\[\d+m/g, "");

export const readLogFile = () => {
  return fs.readFileSync(logFilePath, "utf-8");
};

beforeEach(() => {
  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
  }
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
});

afterEach(() => {
  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
  }
});
