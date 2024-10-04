// Path: src/index.ts
import { Elysia } from "elysia";
import { LoggerOptions } from "./types";
import { logError, logRequest } from "./loggers";

export const logger = (options: LoggerOptions = {}) => {
  return new Elysia({ name: "logger" })
    .onRequest((ctx) => {
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })
    .onBeforeHandle({ as: "global" }, (ctx) => {
      ctx.store = { ...ctx.store, beforeTime: process.hrtime.bigint() };
    })
    .onAfterHandle({ as: "global" }, (ctx) => logRequest(ctx, options))
    .onError({ as: "global" }, (ctx) => logError(ctx, options));
};

export { logWebSocket } from "./loggers/websocketLogger";
