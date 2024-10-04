// Path: src/loggers/errorLogger.ts
import * as pc from "picocolors";
import { getCallerIP } from "../utils/getCallerIP";
import { getMethodStringColor } from "../utils/getMethodStringColor";
import { getConvertedDuration } from "../utils/getConvertedDuration";
import { writeToFile } from "./fileLogger";
import { LoggerOptions } from "../types";

export const logError = (ctx: any, options: LoggerOptions) => {
  const { request, error, store } = ctx;
  const logStr: string[] = [];

  if (options.logIP) {
    const callerIP = getCallerIP(request);
    logStr.push(`[${pc.cyan(callerIP)}]`);
  }

  logStr.push(pc.red(getMethodStringColor(request.method)));

  logStr.push(new URL(request.url).pathname);

  logStr.push(pc.red("Error"));

  if ("status" in error) {
    logStr.push(String(error.status));
  }

  const statusCode =
    "status" in error ? `| Status: ${pc.red(error.status.toString())}` : "";
  logStr.push(statusCode);

  logStr.push(error.message);
  const beforeTime: bigint = store.beforeTime;

  logStr.push(getConvertedDuration(beforeTime));

  const logMessage = logStr.join(" ");
  console.log(logMessage);
  writeToFile(logMessage);
};
