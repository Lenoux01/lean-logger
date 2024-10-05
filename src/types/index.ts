// Path: src/types/index.ts
export interface LoggerOptions {
  logIP?: boolean;
  logPath?: string;
}

export type ApiResponse<K extends string = never, T = unknown> = {
  success?: boolean;
  message: string;
  status: number;
} & {
  [P in K]?: T;
};
