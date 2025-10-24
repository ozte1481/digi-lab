import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameOptions, GameResult, QuestionBank, QuestionPrompt } from '../types';
import './TypingGame.css';

interface TypingGameProps {
  options: GameOptions;
  questionBank: QuestionBank;
  onFinish: (result: GameResult) => void;
  onReset: () => void;
}

const GAME_DURATION = 180; // seconds

const FLOW_THRESHOLDS = [
  { streak: 3, bonusSeconds: 5, label: 'ウォームアップ' },
  { streak: 6, bonusSeconds: 8, label: '集中維持' },
  { streak: 10, bonusSeconds: 12, label: '没入状態' },
] as const;

const TypingGame: React.FC<TypingGameProps> = ({ options, questionBank, onFinish, onReset }) => {
  const [questions, setQuestions] = useState<QuestionPrompt[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [timer, setTimer] = useState(GAME_DURATION);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [totalTyped, setTotalTyped] = useState(0);
  const [scoringTotalTyped, setScoringTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);
  const [flowStreak, setFlowStreak] = useState(0);
  const [maxFlowStreak, setMaxFlowStreak] = useState(0);
  const [bonusTimeEarned, setBonusTimeEarned] = useState(0);
  const [skillPoints, setSkillPoints] = useState(0);
  const [keystrokeCount, setKeystrokeCount] = useState(0);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const hasFinishedRef = useRef(false);
  const startTimestampRef = useRef<number | null>(null);
  const isComposingRef = useRef(false);
  const processedValueRef = useRef('');
  const hasMistakeRef = useRef(false);
  const flowThresholdsRef = useRef(new Set<number>());

  const assignInputRef = useCallback((node: HTMLInputElement | HTMLTextAreaElement | null) => {
    inputRef.current = node;
  }, []);

  const isCopyMode = options.language === 'copy';

  const removeOptionalWhitespace = useCallback(
    (value: string) => (isCopyMode ? value.replace(/[ \t]/g, '') : value),
    [isCopyMode],
  );

  const selectedTheme = useMemo(
    () => questionBank.themes.find((theme) => theme.id === options.themeId),
    [questionBank, options.themeId],
  );

  useEffect(() => {
    const sourceQuestions = selectedTheme?.questions?.[options.language]?.[options.length] ?? [];
    const normalized: QuestionPrompt[] = sourceQuestions.map((item) =>
      typeof item === 'string' ? { text: item } : item,
    );
    const shuffled = [...normalized].sort(() => Math.random() - 0.5);

    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setTypedText('');
    setTimer(GAME_DURATION);
    setIsGameRunning(false);
    setTotalTyped(0);
    setScoringTotalTyped(0);
    setCorrectTyped(0);
    setFlowStreak(0);
    setMaxFlowStreak(0);
    setBonusTimeEarned(0);
    setSkillPoints(0);
    setKeystrokeCount(0);
    hasMistakeRef.current = false;
    flowThresholdsRef.current = new Set();
    hasFinishedRef.current = false;
    startTimestampRef.current = null;
    processedValueRef.current = '';
  }, [selectedTheme, options.language, options.length]);

  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const questionText = currentQuestion?.text ?? '';
  const scoringQuestionText = useMemo(
    () => removeOptionalWhitespace(questionText),
    [questionText, removeOptionalWhitespace],
  );
  const elapsedSeconds = Math.max(0, GAME_DURATION - timer);
  const totalForAccuracy = isCopyMode ? scoringTotalTyped : totalTyped;
  const accuracy = totalForAccuracy > 0 ? Math.round((correctTyped / totalForAccuracy) * 100) : 100;
  const effectiveTypedForSpeed =
    options.language === 'japanese'
      ? keystrokeCount
      : isCopyMode
      ? scoringTotalTyped
      : totalTyped;
  const cpm = (() => {
    if (effectiveTypedForSpeed === 0) {
      return 0;
    }
    const elapsed = Math.max(
      1,
      startTimestampRef.current ? Math.floor((Date.now() - startTimestampRef.current) / 1000) : elapsedSeconds,
    );
    return Math.round((effectiveTypedForSpeed / (elapsed / 60)) || 0);
  })();

  const finalizeGame = useCallback(() => {
    if (hasFinishedRef.current) {
      return;
    }
    hasFinishedRef.current = true;

    const endElapsedSeconds = (() => {
      if (startTimestampRef.current) {
        return Math.max(1, Math.floor((Date.now() - startTimestampRef.current) / 1000));
      }
      return Math.max(1, elapsedSeconds || GAME_DURATION);
    })();

    const minutes = endElapsedSeconds / 60;
    const typedForSpeed =
      options.language === 'japanese'
        ? keystrokeCount
        : isCopyMode
        ? scoringTotalTyped
        : totalTyped;
    const computedCpm = typedForSpeed === 0 ? 0 : typedForSpeed / minutes;
    const totalTypedForResult = isCopyMode ? scoringTotalTyped : totalTyped;
    const result: GameResult = {
      correctCount: correctTyped,
      totalTyped: totalTypedForResult,
      cpm: Math.round(computedCpm),
      accuracy,
      elapsedSeconds: endElapsedSeconds,
      flow: {
        skillPoints,
        maxFlowStreak,
        bonusTimeEarned,
      },
    };

    setIsGameRunning(false);
    onFinish(result);
  }, [accuracy, bonusTimeEarned, correctTyped, elapsedSeconds, isCopyMode, keystrokeCount, maxFlowStreak, onFinish, options.language, scoringTotalTyped, skillPoints, totalTyped]);

  useEffect(() => {
    if (!isGameRunning || hasFinishedRef.current) {
      return;
    }

    if (timer <= 0) {
      finalizeGame();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameRunning, timer, finalizeGame]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      finalizeGame();
    }
  }, [currentQuestionIndex, finalizeGame, questions.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestionIndex]);

  const handleFlowAfterQuestion = useCallback(() => {
    let addedBonusTime = 0;
    let addedSkillFromFlow = 0;

    setFlowStreak((prev) => {
      const nextStreak = hasMistakeRef.current ? 0 : prev + 1;
      if (hasMistakeRef.current) {
        flowThresholdsRef.current.clear();
      } else {
        FLOW_THRESHOLDS.forEach((threshold) => {
          if (nextStreak >= threshold.streak && !flowThresholdsRef.current.has(threshold.streak)) {
            flowThresholdsRef.current.add(threshold.streak);
            addedBonusTime += threshold.bonusSeconds;
            addedSkillFromFlow += threshold.bonusSeconds * 5;
          }
        });
      }
      setMaxFlowStreak((prevMax) => Math.max(prevMax, nextStreak));
      return nextStreak;
    });

    if (addedBonusTime > 0) {
      setTimer((prev) => prev + addedBonusTime);
      setBonusTimeEarned((prev) => prev + addedBonusTime);
    }

    if (addedSkillFromFlow > 0) {
      setSkillPoints((prev) => prev + addedSkillFromFlow);
    }
  }, []);

  const normalizeInput = useCallback((raw: string) => raw.replace(/\r\n/g, '\n'), []);

  const processInputValue = useCallback(
    (rawValue: string, { forceProcess = false }: { forceProcess?: boolean } = {}) => {
      const normalizedValue = normalizeInput(rawValue);
      setTypedText(normalizedValue);

      if (!forceProcess && isComposingRef.current) {
        return;
      }

      if (!isGameRunning && normalizedValue.length > 0) {
        setIsGameRunning(true);
        if (!startTimestampRef.current) {
          startTimestampRef.current = Date.now();
        }
      }

      if (!currentQuestion) {
        processedValueRef.current = normalizedValue;
        return;
      }

      if (hasFinishedRef.current) {
        processedValueRef.current = normalizedValue;
        return;
      }

      const previousProcessed = processedValueRef.current;
      const delta = normalizedValue.length - previousProcessed.length;
      if (delta > 0) {
        setTotalTyped((prev) => prev + delta);
      }

      const previousScoring = removeOptionalWhitespace(previousProcessed);
      const currentScoring = removeOptionalWhitespace(normalizedValue);
      const scoringDelta = currentScoring.length - previousScoring.length;
      if (scoringDelta > 0) {
        setScoringTotalTyped((prev) => prev + scoringDelta);
      }

      if (!scoringQuestionText.startsWith(currentScoring)) {
        hasMistakeRef.current = true;
      }

      processedValueRef.current = normalizedValue;

      if (currentScoring === scoringQuestionText) {
        const questionScoreLength = scoringQuestionText.length;
        setCorrectTyped((prev) => prev + questionScoreLength);

        const basePoints = questionScoreLength;
        const precisionBonus = hasMistakeRef.current ? 0 : Math.max(5, Math.round(questionScoreLength * 0.4));
        setSkillPoints((prev) => prev + basePoints + precisionBonus);

        handleFlowAfterQuestion();

        hasMistakeRef.current = false;
        processedValueRef.current = '';
        setTypedText('');
        setCurrentQuestionIndex((prev) => prev + 1);

        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    },
    [
      currentQuestion,
      handleFlowAfterQuestion,
      isGameRunning,
      normalizeInput,
      removeOptionalWhitespace,
      scoringQuestionText,
    ],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (hasFinishedRef.current) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key;

      if (isCopyMode && key === 'Tab') {
        event.preventDefault();
        const target = event.currentTarget;
        const indent = '  ';
        const selectionStart = target.selectionStart ?? target.value.length;
        const selectionEnd = target.selectionEnd ?? target.value.length;
        const newValue = `${target.value.slice(0, selectionStart)}${indent}${target.value.slice(selectionEnd)}`;
        target.value = newValue;
        if (typeof target.setSelectionRange === 'function') {
          const nextPosition = selectionStart + indent.length;
          requestAnimationFrame(() => {
            target.setSelectionRange(nextPosition, nextPosition);
          });
        }
        processInputValue(newValue, { forceProcess: true });
        setKeystrokeCount((prev) => prev + 1);
        return;
      }

      if (event.nativeEvent.isComposing || key === 'Process' || key === 'Unidentified') {
        setKeystrokeCount((prev) => prev + 1);
        return;
      }

      const isPrintableCharacter = key.length === 1 || key === ' ';
      const isEditingKey = key === 'Backspace' || key === 'Delete' || key === 'Enter' || key === 'Tab';

      if (isPrintableCharacter || isEditingKey) {
        setKeystrokeCount((prev) => prev + 1);
      }
    },
    [isCopyMode, processInputValue],
  );

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    processInputValue(event.target.value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const renderedQuestion = useMemo(() => {
    const textToRender = questionText.replace(/\\n/g, '\n');
    const nodes: React.ReactNode[] = [];
    let currentPosition = 0;

    textToRender.split('\n').forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        nodes.push(<br key={`br-${lineIndex}`} />);
      }

      for (const char of line) {
        const isTyped = currentPosition < typedText.length;
        const typedChar = isTyped ? typedText[currentPosition] : null;
        const isCorrect = isTyped && typedChar === char;

        nodes.push(
          <span
            key={`char-${currentPosition}`}
            className={`char ${isTyped ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
          >
            {char}
          </span>,
        );
        currentPosition++;
      }
    });

    return nodes;
  }, [questionText, typedText]);

  if (!selectedTheme) {
    return (
      <div className="alert alert-danger text-center">
        <p>選択されたテーマの読み込みに失敗しました。</p>
        <button onClick={onReset} className="btn btn-sm btn-danger">モード選択に戻る</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const timeRatio = (timer / GAME_DURATION) * 100;

  return (
    <div className="card shadow-lg" translate="no">
      <div className="card-header bg-dark text-white-50">
        <div className="row align-items-center text-center g-2">
          <div className="col-md-3">
            <div className="small">TIME</div>
            <div className="fs-4 fw-bold text-white">{formatTime(timer)}</div>
          </div>
          <div className="col-md-3">
            <div className="small">CPM</div>
            <div className="fs-4 fw-bold text-white">{cpm}</div>
          </div>
          <div className="col-md-3">
            <div className="small">ACCURACY</div>
            <div className="fs-4 fw-bold text-white">{accuracy}%</div>
          </div>
          <div className="col-md-3">
            <div className="small">FLOW</div>
            <div className="fs-4 fw-bold text-white">{flowStreak}</div>
          </div>
        </div>
        <div className="progress mt-2" style={{ height: '4px' }}>
          <div
            className={`progress-bar ${timeRatio < 15 ? 'bg-danger' : timeRatio < 40 ? 'bg-warning' : 'bg-success'}`}
            role="progressbar"
            style={{ width: `${timeRatio}%` }}
            aria-valuenow={timer}
            aria-valuemin={0}
            aria-valuemax={GAME_DURATION}
          ></div>
        </div>
      </div>
      <div className="card-body p-4">
        <div className="row text-center mb-4 g-3">
          <div className="col">
            <div className="small text-white-50">SKILL PTS</div>
            <div className="fs-5 fw-bold">{skillPoints}</div>
          </div>
          <div className="col">
            <div className="small text-white-50">MAX FLOW</div>
            <div className="fs-5 fw-bold">{maxFlowStreak}</div>
          </div>
          <div className="col">
            <div className="small text-white-50">BONUS</div>
            <div className="fs-5 fw-bold">+{bonusTimeEarned}s</div>
          </div>
        </div>

        <div
          className="question-area p-4 rounded user-select-none mb-4"
          lang={options.language === 'english' ? 'en' : 'ja'}
        >
          {renderedQuestion}
        </div>

        {isCopyMode && currentQuestion?.explanation && (
          <div className="alert alert-info small mt-4">
            <strong>処理の概要:</strong> {currentQuestion.explanation}
          </div>
        )}

        {isCopyMode ? (
          <textarea
            ref={assignInputRef}
            value={typedText}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={(event) => {
              isComposingRef.current = false;
              processInputValue(event.currentTarget.value, { forceProcess: true });
            }}
            placeholder={isGameRunning ? '' : 'ここにコードを書き写してください'}
            rows={Math.max(6, questionText.split('\n').length + 2)}
            disabled={timer === 0 || hasFinishedRef.current}
            onPaste={(event) => event.preventDefault()}
            className="form-control form-control-lg font-monospace"
          />
        ) : (
          <input
            ref={assignInputRef}
            type="text"
            value={typedText}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={(event) => {
              isComposingRef.current = false;
              processInputValue(event.currentTarget.value, { forceProcess: true });
            }}
            placeholder={isGameRunning ? '' : 'Start typing here...'}
            autoFocus
            disabled={timer === 0 || hasFinishedRef.current}
            onPaste={(event) => event.preventDefault()}
            className="form-control form-control-lg text-center"
            lang={options.language === 'english' ? 'en' : 'ja'}
          />
        )}

        <div className="text-center mt-4">
          <button onClick={onReset} className="btn btn-outline-secondary btn-sm">リセット</button>
        </div>
      </div>
    </div>
  );
};

export default TypingGame;