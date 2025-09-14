import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { GameOptions, GameResult } from '../App';

interface TypingGameProps {
  options: GameOptions;
  onFinish: (result: GameResult) => void;
  onReset: () => void;
}

const GAME_DURATION = 180; // 3 minutes in seconds

const TypingGame: React.FC<TypingGameProps> = ({ options, onFinish, onReset }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  const [timer, setTimer] = useState(GAME_DURATION);
  const [isGameRunning, setIsGameRunning] = useState(false);

  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data[options.language][options.length]);
      });
  }, [options]);

  useEffect(() => {
    if (isGameRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsGameRunning(false);
      const wpm = (totalTyped / (GAME_DURATION / 60)) || 0;
      onFinish({ correctCount: correctTyped, totalTyped, wpm });
    }
  }, [isGameRunning, timer, onFinish, totalTyped, correctTyped]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!isGameRunning && value.length > 0) {
      setIsGameRunning(true);
    }
    setTypedText(value);
    setTotalTyped(totalTyped + 1);

    if (value === currentQuestion) {
      setCorrectTyped(correctTyped + value.length);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTypedText('');
    }
  };

  const renderQuestion = () => {
    return currentQuestion.split('').map((char, index) => {
      let color = 'black';
      if (index < typedText.length) {
        color = char === typedText[index] ? 'green' : 'red';
      }
      return <span key={index} style={{ color }}>{char}</span>;
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
  const elapsedTime = GAME_DURATION - timer;
  const wpm = elapsedTime > 0 ? Math.round((totalTyped / (elapsedTime / 60))) : 0;

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex] || '';

  return (
    <Card>
      <Card.Body>
        <Row className="mb-3 text-center">
          <Col><h4>Time: {formatTime(timer)}</h4></Col>
          <Col><h4>WPM: {wpm}</h4></Col>
          <Col><h4>Accuracy: {accuracy}%</h4></Col>
        </Row>

        <Alert variant="secondary" style={{ fontSize: '1.5rem', userSelect: 'none' }}>
          {renderQuestion()}
        </Alert>

        <Form.Control
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleTyping}
          placeholder="Start typing here..."
          autoFocus
          disabled={timer === 0}
        />

        <div className="text-center mt-3">
          <Button variant="danger" onClick={onReset}>Reset</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TypingGame;