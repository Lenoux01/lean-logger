// Path: src/index.ts
import Elysia from "elysia";
import * as pc from "picocolors";
import process from "process";
import fs from "fs";
import { getMethodStringColor } from "./getMethodStringColor";
import { getConvertedDuration } from "./getConvertedDuration";
import { ApiResponse } from "./apiResponse";

const logFilePath = "server.log";

const stripAnsiCodes = (str: string) => str.replace(/\u001b\[\d+m/g, "");

const writeToFile = (message: string) => {
  fs.appendFileSync(logFilePath, stripAnsiCodes(message) + "\n");
};

const getCallerIP = (request: Request): string => {
  const forwardedFor = request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return new URL(request.url).hostname;
};

export const logger = (app: Elysia, options?: { logIP?: boolean }) => {
  return app
    .onRequest((ctx) => {
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })
    .onBeforeHandle({ as: "global" }, (ctx) => {
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })
    .onAfterHandle({ as: "global" }, ({ request, store, response }) => {
      if (request.headers.get("Upgrade") === "websocket") {
        const message = `(${pc.green("WS")}) ${
          new URL(request.url).pathname
        } | Websocket connection opened`;
        console.log(message);
        writeToFile(message);
        return;
      }
      const logStr: string[] = [];

      if (options?.logIP) {
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
      const beforeTime: bigint = (store as any).beforeTime;

      logStr.push(getConvertedDuration(beforeTime));

      const responseMessage =
        apiResponse && apiResponse.message ? `|  ${apiResponse.message}` : "";
      logStr.push(responseMessage);

      const logMessage = logStr.join(" ");
      console.log(logMessage);
      writeToFile(logMessage);
    })
    .onError({ as: "global" }, ({ request, error, store }) => {
      const logStr: string[] = [];

      if (options?.logIP) {
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
      const beforeTime: bigint = (store as any).beforeTime;

      logStr.push(getConvertedDuration(beforeTime));

      const logMessage = logStr.join(" ");
      console.log(logMessage);
      writeToFile(logMessage);
    });
};

export const logWebSocketMessage = (message: string | object) => {
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
