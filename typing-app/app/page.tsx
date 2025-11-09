
"use client";

import type React from "react";

import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { englishThemes, japaneseThemes, programmingThemes } from "./data/themes";
import type { Mode, SessionResult, ThemeCollection, ThemeLength } from "./types";

const MODE_OPTIONS: Array<{ value: Mode; label: string }> = [
  { value: "japanese", label: "日本語" },
  { value: "english", label: "English" },
  { value: "programming", label: "プログラミング" },
];

const MODE_THEMES: Record<Mode, ThemeCollection> = {
  japanese: japaneseThemes,
  english: englishThemes,
  programming: programmingThemes,
};

const INITIAL_THEME_BY_MODE: Record<Mode, string> = {
  japanese: Object.keys(japaneseThemes)[0] ?? "",
  english: Object.keys(englishThemes)[0] ?? "",
  programming: Object.keys(programmingThemes)[0] ?? "",
};

const TYPING_LEVELS = ["初級", "中級", "上級", "達人", "神速"] as const;

const EVALUATION_DESCRIPTIONS: Record<(typeof TYPING_LEVELS)[number], string> = {
  初級: "基本的な文章を落ち着いて入力できる段階です。姿勢とホームポジションを意識しましょう。",
  中級: "仕事や学習で不自由なく入力できるレベルです。誤字の確認を習慣にしましょう。",
  上級: "議事録やチャット対応を素早く行えるレベルです。短縮操作を組み合わせて効率を高められます。",
  達人: "同時進行のタスクにも即応できるスピードです。集中力と正確性の維持が鍵になります。",
  神速: "演習や競技で鍛えられたプロフェッショナル水準です。環境設定や指の使い方を最適化しています。",
};

const AUTO_ADVANCE_DELAY_MS = 900;

function evaluateTypingSkill(cpm: number, errorRate: number): (typeof TYPING_LEVELS)[number] {
  let score = 0;

  if (cpm >= 420) score += 4;
  else if (cpm >= 330) score += 3;
  else if (cpm >= 240) score += 2;
  else if (cpm >= 160) score += 1;

  if (errorRate < 5) score += 1;
  else if (errorRate > 18) score -= 1;

  const index = Math.min(Math.max(score, 0), TYPING_LEVELS.length - 1);
  return TYPING_LEVELS[index];
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "0秒";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}秒`;
  }
  return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
}

export default function TypingApp(): React.ReactElement {
  const [mode, setMode] = useState<Mode>("japanese");
  const [textLength, setTextLength] = useState<ThemeLength>("short");
  const [selectedTheme, setSelectedTheme] = useState<string>(INITIAL_THEME_BY_MODE.japanese);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [sessionReason, setSessionReason] = useState<"completed" | "manual" | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  const themes = useMemo(() => MODE_THEMES[mode], [mode]);
  const themeKeys = useMemo(() => Object.keys(themes), [themes]);
  const selectedThemeData = themes[selectedTheme];

  const totalProblems = useMemo(() => {
    if (!selectedThemeData) return 0;
    const list = textLength === "short" ? selectedThemeData.short : selectedThemeData.long;
    return list.length;
  }, [selectedThemeData, textLength]);

  const isProgrammingMode = mode === "programming";

  useEffect(() => {
    if (!themes[selectedTheme]) {
      setSelectedTheme(INITIAL_THEME_BY_MODE[mode]);
    }
  }, [mode, themes, selectedTheme]);

  const resetSession = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setResults([]);
    setShowSummary(false);
    setSessionReason(null);
    setUserInput("");
    setIsComplete(false);
    setCpm(0);
    setAccuracy(100);
    setStartTime(null);
    setCurrentProblemIndex(0);
    setCurrentText("");
  }, []);

  const startProblem = useCallback(
    (index: number) => {
      const data = MODE_THEMES[mode][selectedTheme];
      if (!data) return;

      const texts = textLength === "short" ? data.short : data.long;
      if (texts.length === 0) {
        setCurrentText("");
        setCurrentProblemIndex(0);
        setUserInput("");
        setIsComplete(false);
        setStartTime(null);
        return;
      }

      const nextIndex = ((index % texts.length) + texts.length) % texts.length;
      setCurrentProblemIndex(nextIndex);
      setCurrentText(texts[nextIndex]);
      setUserInput("");
      setIsComplete(false);
      setStartTime(null);
      setCpm(0);
      setAccuracy(100);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [mode, selectedTheme, textLength]
  );

  const finalizeSession = useCallback((reason: "completed" | "manual") => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setSessionReason(reason);
    setShowSummary(true);
    setIsComplete(false);
    setStartTime(null);
  }, []);

  const recordResult = useCallback(
    (entry: Omit<SessionResult, "index">) => {
      setResults((prev) => [...prev, { ...entry, index: prev.length }]);
    },
    []
  );

  const processInputValue = useCallback(
    (value: string) => {
      if (showSummary) return;
      const target = currentText;
      const now = Date.now();
      let started = startTime;

      if (!started && value.length > 0) {
        started = now;
        setStartTime(now);
      }

      setUserInput(value);

      const maxIndex = Math.min(value.length, target.length);
      let correct = 0;
      for (let i = 0; i < maxIndex; i += 1) {
        if (value[i] === target[i]) correct += 1;
      }

      const accuracyValue = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
      setAccuracy(accuracyValue);

      if (value === target && target.length > 0) {
        setIsComplete(true);
        const elapsed = started ? now - started : 0;
        const minutes = elapsed > 0 ? elapsed / 60000 : 0;
        const cpmValue = minutes > 0 ? Math.round(target.length / minutes) : target.length;
        setCpm(cpmValue);

        recordResult({
          mode,
          themeKey: selectedTheme,
          text: target,
          cpm: cpmValue,
          accuracy: accuracyValue,
          errors: target.length - correct,
          elapsedMs: elapsed,
          completed: true,
        });

        if (currentProblemIndex + 1 >= totalProblems) {
          finalizeSession("completed");
        } else {
          autoAdvanceTimerRef.current = window.setTimeout(() => {
            startTransition(() => startProblem(currentProblemIndex + 1));
          }, AUTO_ADVANCE_DELAY_MS);
        }
      }
    },
    [showSummary, currentText, startTime, recordResult, mode, selectedTheme, currentProblemIndex, totalProblems, finalizeSession, startProblem]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      processInputValue(event.target.value);
    },
    [processInputValue]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!isProgrammingMode || event.key !== "Tab") return;
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart ?? userInput.length;
      const end = textarea.selectionEnd ?? userInput.length;
      const insertion = "  ";
      const nextValue = `${userInput.slice(0, start)}${insertion}${userInput.slice(end)}`;
      processInputValue(nextValue);
      requestAnimationFrame(() => {
        const offset = start + insertion.length;
        textarea.selectionStart = offset;
        textarea.selectionEnd = offset;
      });
    },
    [isProgrammingMode, userInput, processInputValue]
  );

  const handleFinishSession = useCallback(() => {
    if (showSummary || totalProblems === 0) return;

    if (!isComplete && userInput.length > 0) {
      const target = currentText;
      const maxIndex = Math.min(userInput.length, target.length);
      let correct = 0;
      for (let i = 0; i < maxIndex; i += 1) {
        if (userInput[i] === target[i]) correct += 1;
      }
      const accuracyValue = Math.round((correct / userInput.length) * 100);
      const elapsed = startTime ? Date.now() - startTime : 0;
      const minutes = elapsed > 0 ? elapsed / 60000 : 0;
      const cpmValue = minutes > 0 ? Math.round(userInput.length / minutes) : userInput.length;

      recordResult({
        mode,
        themeKey: selectedTheme,
        text: target,
        cpm: cpmValue,
        accuracy: accuracyValue,
        errors: Math.max(0, target.length - correct),
        elapsedMs: elapsed,
        completed: false,
      });
    }

    finalizeSession("manual");
  }, [showSummary, totalProblems, isComplete, userInput, currentText, startTime, recordResult, mode, selectedTheme, finalizeSession]);

  const handleRestart = useCallback(() => {
    if (totalProblems === 0) return;
    resetSession();
    startTransition(() => startProblem(0));
  }, [resetSession, startProblem, totalProblems]);

  useEffect(() => {
    if (!selectedTheme) return;
    resetSession();
    if (totalProblems > 0) {
      startTransition(() => startProblem(0));
    }
  }, [mode, selectedTheme, textLength, totalProblems, resetSession, startProblem]);

  const errorRate = 100 - accuracy;
  const typingLevel = isComplete ? evaluateTypingSkill(cpm, errorRate) : "";
  const evaluationDescription = typingLevel ? EVALUATION_DESCRIPTIONS[typingLevel] : "";
  const currentThemeName = selectedThemeData?.name ?? "";

  const summaryStats = useMemo(() => {
    if (!showSummary || results.length === 0) return null;
    const total = results.length;
    const completedCount = results.filter((entry) => entry.completed).length;
    const avgCpm = Math.round(results.reduce((sum, entry) => sum + entry.cpm, 0) / total);
    const avgAccuracy = Math.round(results.reduce((sum, entry) => sum + entry.accuracy, 0) / total);
    const best = results.reduce((prev, entry) => (entry.cpm > prev.cpm ? entry : prev), results[0]);
    const weakest = results.reduce((prev, entry) => (entry.accuracy < prev.accuracy ? entry : prev), results[0]);
    return { total, completedCount, avgCpm, avgAccuracy, best, weakest };
  }, [showSummary, results]);

  const canInteract = totalProblems > 0 && !showSummary;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" translate="no">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">学習型タイピング</h1>
          <p className="text-muted-foreground">テーマ別の文章で練習しながら知識と入力速度を高めましょう。</p>
        </header>

        <Card className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">モード</label>
            <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
              <TabsList className="grid w-full grid-cols-3">
                {MODE_OPTIONS.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">テーマ</label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="テーマを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeKeys.map((key) => (
                      <SelectItem key={key} value={key}>
                        {themes[key]?.name ?? key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">文章の長さ</label>
                <Tabs value={textLength} onValueChange={(value) => setTextLength(value as ThemeLength)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="short">短文（10問）</TabsTrigger>
                    <TabsTrigger value="long">長文（3問）</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Button variant="secondary" onClick={handleRestart} disabled={totalProblems === 0}>
              もう一度最初から
            </Button>
          </div>
        </Card>

        {showSummary ? (
          <Card className="space-y-4 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">セッション結果</h2>
                <p className="text-sm text-muted-foreground">
                  {sessionReason === "completed" ? "すべての問題を解き終えました。" : "練習を途中で終了しました。"}
                </p>
              </div>
              <Badge variant={sessionReason === "completed" ? "default" : "outline"}>
                {sessionReason === "completed" ? "全問完了" : "手動終了"}
              </Badge>
            </div>

            {summaryStats ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">挑戦した問題</div>
                    <div className="text-2xl font-bold">{summaryStats.total}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">完了した問題</div>
                    <div className="text-2xl font-bold">{summaryStats.completedCount}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">平均CPM</div>
                    <div className="text-2xl font-bold">{summaryStats.avgCpm}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">平均正確性</div>
                    <div className="text-2xl font-bold">{summaryStats.avgAccuracy}%</div>
                  </Card>
                </div>

                <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium text-muted-foreground">結果一覧</p>
                  <div className="space-y-3">
                    {results.map((entry) => (
                      <div key={entry.index} className="rounded-md border bg-background p-3">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>
                            #{entry.index + 1} · {MODE_THEMES[entry.mode][entry.themeKey]?.name ?? entry.themeKey}
                          </span>
                          <Badge variant={entry.completed ? "default" : "secondary"}>
                            {entry.completed ? "完了" : "途中"}
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                          <span>CPM: {entry.cpm}</span>
                          <span>正確性: {entry.accuracy}%</span>
                          <span>誤打: {entry.errors}文字</span>
                          <span>時間: {formatDuration(entry.elapsedMs)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">記録がありません。</p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button onClick={handleRestart} variant="secondary">
                同じ設定でもう一度
              </Button>
              <Button onClick={() => setShowSummary(false)}>続けて練習する</Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">テーマ</div>
                <div className="text-lg font-semibold">{currentThemeName}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">問題番号</div>
                <div className="text-2xl font-bold">
                  {totalProblems === 0 ? "-" : `${currentProblemIndex + 1} / ${totalProblems}`}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">正確性</div>
                <div className="text-2xl font-bold">{accuracy}%</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">CPM</div>
                <div className="text-2xl font-bold">{cpm}</div>
              </Card>
            </div>

            <Card className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{isProgrammingMode ? "写経コード" : "問題文"}</h2>
                {isComplete && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">完了</Badge>
                    <Badge variant="outline" className="text-lg font-bold">
                      {typingLevel}
                    </Badge>
                  </div>
                )}
              </div>

              {isProgrammingMode ? (
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed text-left">
                  <code>{currentText}</code>
                </pre>
              ) : (
                <div className="rounded-lg bg-muted p-4 font-mono text-lg leading-relaxed whitespace-pre-wrap break-words">
                  {currentText.split("").map((char, index) => {
                    const status = index < userInput.length ? (userInput[index] === char ? "correct" : "incorrect") : "pending";
                    const className =
                      status === "correct"
                        ? "text-green-600 dark:text-green-400"
                        : status === "incorrect"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                          : "text-muted-foreground";
                    return (
                      <span key={`${char}-${index}`} className={className}>
                        {char === " " ? "·" : char}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">入力欄</label>
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={!canInteract}
                  className="min-h-[140px] w-full resize-none rounded-lg border border-input bg-background p-4 font-mono text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  placeholder={
                    totalProblems === 0
                      ? "利用できる文章がありません"
                      : isProgrammingMode
                        ? "コードをここに写経してください"
                        : "ここに入力してください"
                  }
                  spellCheck={false}
                />
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={handleFinishSession} disabled={!canInteract}>
                    練習を終了
                  </Button>
                </div>
              </div>

              {isComplete && (
                <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                  <p className="font-medium">
                    CPM: {cpm} / 正確性: {accuracy}% / 誤打率: {errorRate.toFixed(1)}%
                  </p>
                  <p className="text-sm">{evaluationDescription}</p>
                  {currentProblemIndex + 1 < totalProblems && (
                    <p className="text-sm">数秒後に次の問題へ自動で移動します。</p>
                  )}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
