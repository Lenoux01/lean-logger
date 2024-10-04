// Path: tests/logger.test.ts
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Elysia, { t } from "elysia";
import fs from "fs";
import {  logger, logWebSocket } from "../src";

const logFilePath = "server.log";

const consoleLogInterceptor = () => {
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

const stripAnsiCodes = (str: string) => str.replace(/\u001b\[\d+m/g, "");

const readLogFile = () => {
  return fs.readFileSync(logFilePath, "utf-8");
};

describe("logger middleware", () => {
  beforeEach(() => {
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
    }
  });

  it("logs method, path, and response time to console and file", async () => {
    const logs = consoleLogInterceptor();

    const app = new Elysia().use(logger);

    app.get("/test-path", () => ({
      status: 200,
      body: JSON.stringify({ message: "ok" }),
    }));

    await app
      .handle(new Request("http://localhost/test-path"))
      .then((res) => res.json());

    const strippedLog = stripAnsiCodes(logs[0]);
    expect(strippedLog).toContain("GET /test-path");
    expect(strippedLog).toContain("(200)");

    const fileContent = readLogFile();
    expect(fileContent).toContain("GET /test-path");
    expect(fileContent).toContain("(200)");
  });

  it("logs with IP to console and file", async () => {
    const logs = consoleLogInterceptor();

    const app = new Elysia();

    app.use(logger(app, { logIP: true }));

    app.get("/test-path", () => ({
      status: 200,
      body: JSON.stringify({ message: "ok" }),
    }));

    await app
      .handle(
        new Request("http://localhost/test-path", {
          headers: {
            "X-Forwarded-For": "127.0.0.1",
          },
        })
      )
      .then((res) => res.json());

    const strippedLog = stripAnsiCodes(logs[0]);
    expect(strippedLog).toContain("[127.0.0.1]");

    const fileContent = readLogFile();
    expect(fileContent).toContain("[127.0.0.1]");
  });
});

describe("logger middleware for all HTTP methods", () => {
  it("logs each method in correct color within a single test to console and file", async () => {
    const logs = consoleLogInterceptor();
    const app = new Elysia().use(logger);

    const routeHandler = () => ({
      status: 200,
      body: JSON.stringify({ message: "ok" }),
    });

    app.get("/test-path", routeHandler);
    app.post("/test-path", routeHandler);
    app.put("/test-path", routeHandler);
    app.delete("/test-path", routeHandler);
    app.patch("/test-path", routeHandler);
    app.options("/test-path", routeHandler);
    app.head("/test-path", routeHandler);

    const methods = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
      "HEAD",
    ];

    for (const method of methods) {
      await app
        .handle(new Request(`http://localhost/test-path`, { method }))
        .then((res) => res.json());
    }

    methods.forEach((method, index) => {
      const strippedLog = stripAnsiCodes(logs[index]);
      expect(strippedLog).toContain(method);
      expect(strippedLog).toContain("/test-path");
      expect(strippedLog).toContain("(200)");
    });

    const fileContent = readLogFile();
    methods.forEach((method) => {
      expect(fileContent).toContain(method);
      expect(fileContent).toContain("/test-path");
      expect(fileContent).toContain("(200)");
    });
  });
});

describe("logger middleware for websocket", () => {
  it("logs websocket connection and messages to console and file", async () => {
    const logs = consoleLogInterceptor();
    const app = new Elysia().use(logger);

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
