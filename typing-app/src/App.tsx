import { useState } from 'react';
import { Container } from 'react-bootstrap';
import ModeSelector from './components/ModeSelector';
import TypingGame from './components/TypingGame';
import Result from './components/Result';

// Define types for game state and options
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
        // @ts-ignore
        return <TypingGame options={gameOptions!} onFinish={handleGameFinish} onReset={handleRestart} />;
      case 'finished':
        // @ts-ignore
        return <Result result={gameResult!} onRestart={handleRestart} />;
      case 'selecting':
      default:
        return <ModeSelector onStart={handleGameStart} />;
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '800px' }}>
        <h1 className="text-center mb-4">タイピングアプリ</h1>
        {renderGameState()}
      </div>
    </Container>
  );
}

export default App;