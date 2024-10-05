// Path: tests/logger.customPath.test.ts
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Elysia from "elysia";
import fs from "fs";
import path from "path";
import { logger } from "../src";
import { consoleLogInterceptor, stripAnsiCodes } from "./logger.test";

describe("logger middleware with custom log path", () => {
  const customLogDir = "custom_logs";
  const customLogPath = path.join(customLogDir, "custom.log");

  beforeEach(() => {
    if (fs.existsSync(customLogPath)) {
      fs.unlinkSync(customLogPath);
    }
    if (fs.existsSync(customLogDir)) {
      fs.rmdirSync(customLogDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(customLogPath)) {
      fs.unlinkSync(customLogPath);
    }
    if (fs.existsSync(customLogDir)) {
      fs.rmdirSync(customLogDir, { recursive: true });
    }
  });

  it("logs to custom file path", async () => {
    const logs = consoleLogInterceptor();

    const app = new Elysia().use(logger({ logPath: customLogPath }));

    app.get("/custom-test", () => ({
      status: 200,
      body: JSON.stringify({ message: "custom log test" }),
    }));

    await app
      .handle(new Request("http://localhost/custom-test"))
      .then((res) => res.json());

    const strippedLog = stripAnsiCodes(logs[0]);
    expect(strippedLog).toContain("GET /custom-test");
    expect(strippedLog).toContain("(200)");

    const fileContent = fs.readFileSync(customLogPath, "utf-8");
    expect(fileContent).toContain("GET /custom-test");
    expect(fileContent).toContain("(200)");
  });
});
