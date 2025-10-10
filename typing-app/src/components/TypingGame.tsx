import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameOptions, GameResult, QuestionBank, QuestionPrompt } from '../types';

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
    (value: string) => (isCopyMode ? value.replace(/[ 	]/g, '') : value),
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
  const elapsedSeconds = Math.min(GAME_DURATION, GAME_DURATION - timer);
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

  const scoringTypedText = useMemo(
    () => removeOptionalWhitespace(typedText),
    [removeOptionalWhitespace, typedText],
  );

  const renderedQuestion = useMemo(() => {
    if (!isCopyMode) {
      const elements: React.ReactNode[] = [];

      for (let index = 0; index < questionText.length; index += 1) {
        const char = questionText[index];

        if (char === '\\n') {
          elements.push(<br key={`${currentQuestionIndex}-break-${index}`} />);
          continue;
        }

        const isTyped = index < typedText.length;
        const typedChar = typedText[index] ?? '';
        const isCorrect = isTyped && typedChar === char;

        elements.push(
          <span
            key={`${currentQuestionIndex}-${index}`}
            style={{
              color: isTyped ? (isCorrect ? '#198754' : '#dc3545') : '#212529',
              backgroundColor: isTyped ? (isCorrect ? '#d1e7dd' : '#f8d7da') : 'transparent',
              borderBottom: char === ' ' ? '1px dotted rgba(108, 117, 125, 0.6)' : 'none',
              padding: char === ' ' ? '0 0.1em' : 0,
              display: char === ' ' ? 'inline-block' : 'inline',
              minWidth: char === ' ' ? '0.4em' : undefined,
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>,
        );
      }

      return elements;
    }


    const elements: React.ReactNode[] = [];
    let scoringCursor = 0;

    for (let index = 0; index < questionText.length; index += 1) {
      const char = questionText[index];

      if (char === '\\n') {
        const hasTypedNewline = scoringCursor < scoringTypedText.length && scoringTypedText[scoringCursor] === '\\n';
        if (hasTypedNewline) {
          scoringCursor += 1;
        }
        elements.push(<br key={`${currentQuestionIndex}-break-${index}`} />);
        continue;
      }

      if (char === ' ' || char === '	') {
        const isTyped = scoringTypedText.length > scoringCursor;
        elements.push(
          <span
            key={`${currentQuestionIndex}-${index}`}
            style={{
              color: isTyped ? '#198754' : '#212529',
              backgroundColor: isTyped ? '#d1e7dd' : 'transparent',
              borderBottom: '1px dotted rgba(108, 117, 125, 0.6)',
              padding: char === ' ' ? '0 0.1em' : '0 0.3em',
              display: 'inline-block',
              minWidth: char === ' ' ? '0.4em' : '1.2em',
            }}
          >
            {char === ' ' ? ' ' : '  '}
          </span>,
        );
        continue;
      }

      const hasTypedChar = scoringCursor < scoringTypedText.length;
      const typedChar = hasTypedChar ? scoringTypedText[scoringCursor] : '';
      const isCorrect = hasTypedChar && typedChar === char;
      if (hasTypedChar) {
        scoringCursor += 1;
      }

      elements.push(
        <span
          key={`${currentQuestionIndex}-${index}`}
          style={{
            color: hasTypedChar ? (isCorrect ? '#198754' : '#dc3545') : '#212529',
            backgroundColor: hasTypedChar ? (isCorrect ? '#d1e7dd' : '#f8d7da') : 'transparent',
            borderBottom: 'none',
            padding: 0,
            display: 'inline',
          }}
        >
          {char === ' ' ? ' ' : char}
        </span>,
      );
    }



    return elements;
  }, [currentQuestionIndex, isCopyMode, questionText, scoringTypedText, typedText]);



  if (!selectedTheme) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>選択されたテーマの読み込みに失敗しました。</p>
        <button onClick={onReset}>モード選択に戻る</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p style={{ textAlign: 'center' }}>問題を準備中です...</p>;
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }} translate="no">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '0.5rem', marginBottom: '1rem' }} className="notranslate">
        <h4 style={{ margin: 0 }}>Time: {formatTime(timer)}</h4>
        <h4 style={{ margin: 0 }}>CPM: {cpm}</h4>
        <h4 style={{ margin: 0 }}>Accuracy: {accuracy}%</h4>
        <h4 style={{ margin: 0 }}>Flow: {flowStreak}</h4>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', backgroundColor: '#f1f3f5', borderRadius: '8px', padding: '0.75rem' }}>
        <div>
          <strong>Skill Points</strong>
          <div style={{ fontSize: '1.25rem' }} className="notranslate">{skillPoints}</div>
        </div>
        <div>
          <strong>Max Flow</strong>
          <div style={{ fontSize: '1.25rem' }} className="notranslate">{maxFlowStreak}</div>
        </div>
        <div>
          <strong>Bonus Time</strong>
          <div style={{ fontSize: '1.25rem' }} className="notranslate">+{bonusTimeEarned}s</div>
        </div>
      </div>

      <div
        style={{
          fontSize: isCopyMode ? '1rem' : '1.5rem',
          fontFamily: isCopyMode ? '"Fira Code", "Menlo", "Consolas", monospace' : 'inherit',
          userSelect: 'none',
          letterSpacing: isCopyMode ? '0.05em' : '0.1em',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          lineHeight: isCopyMode ? '1.6' : '1.8',
        }}
        lang={options.language === 'english' ? 'en' : 'ja'}
        className="notranslate"
      >
        {renderedQuestion}
      </div>

      {isCopyMode && currentQuestion?.explanation && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '8px', color: '#856404' }}>
          <strong>処理の概要</strong>
          <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>{currentQuestion.explanation}</p>
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
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.75rem',
            fontSize: '1rem',
            fontFamily: '"Fira Code", "Menlo", "Consolas", monospace',
            whiteSpace: 'pre',
            boxSizing: 'border-box',
          }}
          className="notranslate"
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
          style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '1rem' }}
          lang={options.language === 'english' ? 'en' : 'ja'}
          className="notranslate"
        />
      )}

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={onReset}>リセット</button>
      </div>
    </div>
  );
};

export default TypingGame;
