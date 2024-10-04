// Path: src/loggers/requestLogger.ts
import * as pc from "picocolors";
import { getCallerIP } from "../utils/getCallerIP";
import { getMethodStringColor } from "../utils/getMethodStringColor";
import { getConvertedDuration } from "../utils/getConvertedDuration";
import { writeToFile } from "./fileLogger";
import { ApiResponse, LoggerOptions } from "../types";

export const logRequest = (ctx: any, options: LoggerOptions) => {
  const { request, store, response } = ctx;

  if (request.headers.get("Upgrade") === "websocket") {
    const message = `(${pc.green("WS")}) ${
      new URL(request.url).pathname
    } | Websocket connection opened`;
    console.log(message);
    writeToFile(message);
    return;
  }

  const logStr: string[] = [];

  if (options.logIP) {
    const callerIP = getCallerIP(request);
    logStr.push(`[${pc.cyan(callerIP)}]`);
  }

  const apiResponse = response as ApiResponse<any, any>;
  const statusCode = apiResponse.status
    ? `(${pc.green(apiResponse.status.toString())})`
    : "";
  logStr.push(statusCode);

  logStr.push(getMethodStringColor(request.method));

  logStr.push(new URL(request.url).pathname);
  const beforeTime: bigint = store.beforeTime;

  logStr.push(getConvertedDuration(beforeTime));

  const responseMessage =
    apiResponse && apiResponse.message ? `|  ${apiResponse.message}` : "";
  logStr.push(responseMessage);

  const logMessage = logStr.join(" ");
  console.log(logMessage);
  writeToFile(logMessage);
};
