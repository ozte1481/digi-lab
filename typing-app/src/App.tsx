import { useCallback, useEffect, useState } from 'react';
import ModeSelector from './components/ModeSelector';
import TypingGame from './components/TypingGame';
import Result from './components/Result';
import type { GameOptions, GameResult, GameState, QuestionBank } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setIsLoadingQuestions(true);
      setQuestionError(null);
      const response = await fetch('/questions.json');
      if (!response.ok) {
        throw new Error(`Failed to load questions. Status: ${response.status}`);
      }
      const data = (await response.json()) as QuestionBank;
      setQuestionBank(data);
    } catch (error) {
      setQuestionBank(null);
      const message = error instanceof Error ? error.message : '不明なエラーが発生しました。';
      setQuestionError(message);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleGameStart = (options: GameOptions) => {
    setGameOptions(options);
    setGameResult(null);
    setGameState('playing');
  };

  const handleGameFinish = (result: GameResult) => {
    setGameResult(result);
    setGameState('finished');
  };

  const handleRestart = () => {
    setGameState('selecting');
    setGameOptions(null);
    setGameResult(null);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'playing':
        if (!questionBank || !gameOptions) {
          return (
            <p style={{ textAlign: 'center' }}>
              問題データを読み込めませんでした。もう一度お試しください。
            </p>
          );
        }
        return (
          <TypingGame
            options={gameOptions}
            questionBank={questionBank}
            onFinish={handleGameFinish}
            onReset={handleRestart}
          />
        );
      case 'finished':
        return <Result result={gameResult!} onRestart={handleRestart} />;
      case 'selecting':
      default:
        return (
          <ModeSelector
            onStart={handleGameStart}
            themes={questionBank?.themes ?? []}
            loading={isLoadingQuestions}
            error={questionError}
            onRetry={loadQuestions}
          />
        );
    }
  };

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      translate="no"
    >
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>タイピングアプリ</h1>
        {renderGameState()}
      </div>
    </div>
  );
}

export default App;

