import { useState } from 'react';
import ModeSelector from './components/ModeSelector';
import TypingGame from './components/TypingGame';
import Result from './components/Result';

// Define types directly in the file
export type GameState = 'selecting' | 'playing' | 'finished';
export interface GameOptions {
  language: 'japanese' | 'english';
  length: 'short' | 'long';
}
export interface GameResult {
  correctCount: number;
  totalTyped: number;
  wpm: number;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleGameStart = (options: GameOptions) => {
    setGameOptions(options);
    setGameState('playing');
  };

  const handleGameFinish = (result: GameResult) => {
    setGameResult(result);
    setGameState('finished');
  }

  const handleRestart = () => {
    setGameState('selecting');
    setGameOptions(null);
    setGameResult(null);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'playing':
        return <TypingGame options={gameOptions!} onFinish={handleGameFinish} onReset={handleRestart} />;
      case 'finished':
        return <Result result={gameResult!} onRestart={handleRestart} />;
      case 'selecting':
      default:
        return <ModeSelector onStart={handleGameStart} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>タイピングアプリ</h1>
        {renderGameState()}
      </div>
    </div>
  );
}

export default App;