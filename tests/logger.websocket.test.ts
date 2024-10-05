// Path: tests/logger.websocket.test.ts
import { describe, it, expect } from "bun:test";
import Elysia, { t } from "elysia";
import { logger, logWebSocket } from "../src";
import { consoleLogInterceptor, stripAnsiCodes, readLogFile } from "./logger.test";

describe("logger middleware for websocket", () => {
  it("logs websocket connection and messages to console and file", async () => {
    const logs = consoleLogInterceptor();
    const app = new Elysia().use(logger());

    app.ws("/test-path", {
      body: t.Object({
        message: t.String(),
        number: t.Number(),
      }),
      open: () => {
        console.log("ws opened");
      },
      message: (ws, message) => {
        logWebSocket(message);
      },
      close: () => {
        console.log("ws closed");
      },
    });

    await app.handle(
      new Request("http://localhost/test-path", {
        headers: { Upgrade: "websocket" },
      })
    );

    const strippedLog = stripAnsiCodes(logs[0]);
    expect(strippedLog).toContain(
      "(WS) /test-path | Websocket connection opened"
    );

    // Simulate a WebSocket message
    const sampleMessage = { message: "Hello, WebSocket!", number: 42 };
    logWebSocket(sampleMessage);

    const strippedMessageLog = stripAnsiCodes(logs[1]);
    expect(strippedMessageLog).toContain("(WS) |");
    expect(strippedMessageLog).toContain(
      JSON.stringify(sampleMessage, null, 2)
    );

    const fileContent = readLogFile();
    expect(fileContent).toContain(
      "(WS) /test-path | Websocket connection opened"
    );
    expect(fileContent).toContain("(WS) |");
    expect(fileContent).toContain(JSON.stringify(sampleMessage, null, 2));
  });
});
