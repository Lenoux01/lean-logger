// Path: src/utils/getCallerIP.ts
export const getCallerIP = (request: Request): string => {
  const forwardedFor = request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return new URL(request.url).hostname;
};
