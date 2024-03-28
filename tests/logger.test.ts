import Elysia from "elysia";
import { logger } from "../src";
import { describe, it, expect } from "bun:test";

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

describe("logger middleware", () => {
  it("logs method, path, and response time", async () => {
    consoleLogInterceptor();

    const app = new Elysia().use(
      logger({
        logIP: false,
        writer: { write: console.log },
      })
    );

    app.get("/test-path", () => ({
      status: 200,
      body: JSON.stringify({ message: "ok" }),
    }));

    await app
      .handle(new Request("http://localhost/test-path"))
      .then((res) => res.json());
  });
  it("logs with IP", async () => {
    consoleLogInterceptor();

    const app = new Elysia().use(
      logger({
        logIP: true,
        writer: { write: console.log },
      })
    );

    app.get("/test-path", () => {
      return {
        status: 200,
        body: JSON.stringify({ message: "ok" }),
      };
    });

    await app
      .handle(
        new Request("http://localhost/test-path", {
          headers: {
            "X-Forwarded-For": "127.0.0.1",
          },
        })
      )
      .then((res) => res.json());
  });
});
