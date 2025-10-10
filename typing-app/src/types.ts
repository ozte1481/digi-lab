export type Language = 'japanese' | 'english' | 'copy';

export type QuestionLength = 'short' | 'long';

export interface ThemeLabel {
  japanese: string;
  english: string;
  copy?: string;
}

export interface QuestionPrompt {
  text: string;
  explanation?: string;
}

export type QuestionCollection = Record<QuestionLength, QuestionPrompt[]>;

export interface ThemeQuestions {
  japanese?: QuestionCollection;
  english?: QuestionCollection;
  copy?: QuestionCollection;
}

export interface ThemeDefinition {
  id: string;
  label: ThemeLabel;
  availableLanguages: Language[];
  description?: string;
  questions: ThemeQuestions;
}

export interface QuestionBank {
  themes: ThemeDefinition[];
}

export interface GameOptions {
  language: Language;
  length: QuestionLength;
  themeId: string;
}

export type GameState = 'selecting' | 'playing' | 'finished';

export interface FlowSummary {
  skillPoints: number;
  maxFlowStreak: number;
  bonusTimeEarned: number;
}

export interface GameResult {
  correctCount: number;
  totalTyped: number;
  cpm: number;
  accuracy: number;
  elapsedSeconds: number;
  flow: FlowSummary;
}
