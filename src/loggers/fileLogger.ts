// Path: src/utils/fileLogger.ts
import fs from "fs";

const logFilePath = "server.log";

const stripAnsiCodes = (str: string) => str.replace(/\u001b\[\d+m/g, "");

export const writeToFile = (message: string) => {
  fs.appendFileSync(logFilePath, stripAnsiCodes(message) + "\n");
};
