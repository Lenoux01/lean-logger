// Path: src/loggers/websocketLogger.ts
import * as pc from "picocolors";
import { writeToFile } from "./fileLogger";

export const logWebSocket = (message: string | object) => {
  let logMessage = `(${pc.green("WS")}) |`;
  if (typeof message === "object") {
    logMessage += ` ${JSON.stringify(message, null, 2)}`;
  }
  if (typeof message === "string") {
    logMessage += ` ${message}`;
  }
  console.log(logMessage);
  writeToFile(logMessage);
};
