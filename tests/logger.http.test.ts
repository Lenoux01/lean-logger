// Path: tests/logger.http.test.ts
import { describe, it, expect } from "bun:test";
import Elysia from "elysia";
import { logger } from "../src";
import {
  consoleLogInterceptor,
  stripAnsiCodes,
  readLogFile,
} from "./logger.test";

describe("logger middleware for HTTP", () => {
  it("logs method, path, and response time to console and file", async () => {
    const logs = consoleLogInterceptor();

    const app = new Elysia().use(logger());

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

    const app = new Elysia().use(logger({ logIP: true }));

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
    const app = new Elysia().use(logger());

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
