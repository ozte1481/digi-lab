export type Mode = "japanese" | "english" | "programming";
export type ThemeLength = "short" | "long";

export type ProblemMeta = {
  description?: string;
  language?: string;
};

export type ThemeData = {
  name: string;
  short: string[];
  long: string[];
  shortMeta?: ProblemMeta[];
  longMeta?: ProblemMeta[];
  themeLabel?: string;
  topicLabel?: string;
  categoryLabel?: string;
  detailLabel?: string;
};

export type ThemeCollection = Record<string, ThemeData>;

export type SessionResult = {
  index: number;
  mode: Mode;
  themeKey: string;
  text: string;
  cpm: number;
  accuracy: number;
  errors: number;
  elapsedMs: number;
  completed: boolean;
};
