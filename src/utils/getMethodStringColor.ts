import * as pc from "picocolors";

export function getMethodStringColor(method: string): string {
  switch (method) {
    case "GET":
      return pc.white("GET");
    case "POST":
      return pc.yellow("POST");
    case "PUT":
      return pc.blue("PUT");
    case "DELETE":
      return pc.red("DELETE");
    case "PATCH":
      return pc.green("PATCH");
    case "OPTIONS":
      return pc.gray("OPTIONS");
    case "HEAD":
      return pc.magenta("HEAD");
    default:
      return method;
  }
}
