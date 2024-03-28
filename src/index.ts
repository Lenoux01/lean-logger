import Elysia from "elysia";
import * as pc from "picocolors";
import process from "process";
import { getMethodStringColor } from "./getMethodStringColor";
import { getConvertedDuration } from "./getConvertedDuration";
import { ApiResponse } from "./apiResponse";

interface Writer {
  write: (message: string) => void;
}

const consoleWriter: Writer = {
  write(message: string) {
    console.log(message);
  },
};

interface Options {
  logIP?: boolean;
  writer?: Writer;
}

export const logger = (options?: Options) => {
  const { write } = options?.writer || consoleWriter;
  return new Elysia({
    name: "lean-logs",
  })
    .onRequest((ctx) => {
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })

    .onBeforeHandle({ as: "global" }, (ctx) => {
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })
    .onAfterHandle({ as: "global" }, ({ request, store, response }) => {
      const logStr: string[] = [];
      if (options !== undefined && options.logIP) {
        if (request.headers.get("X-Forwarded-For")) {
          logStr.push(`[${pc.cyan(request.headers.get("X-Forwarded-For"))}]`);
        }
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

      write(logStr.join(" "));
    })
    .onError({ as: "global" }, ({ request, error, store }) => {
      const logStr: string[] = [];

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

      write(logStr.join(" "));
    });
};
