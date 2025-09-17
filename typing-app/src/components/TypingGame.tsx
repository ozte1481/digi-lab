import React, { useState, useEffect, useRef } from 'react';

const TypingGame: React.FC<any> = ({ options, onFinish, onReset }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  const GAME_DURATION = 180; // 3 minutes in seconds
  const [timer, setTimer] = useState(GAME_DURATION);
  const [isGameRunning, setIsGameRunning] = useState(false);

  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        const shuffledQuestions = data[options.language][options.length].sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      });
  }, [options]);

  useEffect(() => {
    if (isGameRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && isGameRunning) {
      setIsGameRunning(false);
      const elapsedTimeInMinutes = GAME_DURATION / 60;
      const wpm = (totalTyped / 5) / elapsedTimeInMinutes || 0;
      onFinish({ correctCount: correctTyped, totalTyped, wpm });
    }
  }, [isGameRunning, timer, onFinish, totalTyped, correctTyped]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!isGameRunning && value.length > 0) {
      setIsGameRunning(true);
    }

    const currentQuestion = questions[currentQuestionIndex] || '';
    
    if (isGameRunning || value.length > 0) {
        setTypedText(value);
        setTotalTyped(prev => prev + 1);

        if (value === currentQuestion) {
          setCorrectTyped(prev => prev + currentQuestion.length);
          setCurrentQuestionIndex(prev => prev + 1);
          setTypedText('');
        }
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex] || '';
    return currentQuestion.split('').map((char, index) => {
      let color = '#6c757d';
      if (index < typedText.length) {
        color = char === typedText[index] ? '#198754' : '#dc3545';
      }
      return <span key={index} style={{ color, backgroundColor: index < typedText.length ? (char === typedText[index] ? '#d1e7dd' : '#f8d7da') : 'transparent' }}>{char}</span>;
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  const currentQuestion = questions[currentQuestionIndex] || '';
  const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
  const elapsedTime = GAME_DURATION - timer;
  const wpm = elapsedTime > 0 ? Math.round(((totalTyped / 5) / (elapsedTime / 60))) : 0;

  if (questions.length === 0) {
    return <p style={{textAlign: 'center'}}>Loading questions...</p>;
  }

  if (!currentQuestion && questions.length > 0) {
    return (
        <div style={{textAlign: 'center'}}>
            <h2>Congratulations!</h2>
            <p>You have completed all the questions.</p>
            <button onClick={onReset}>Play Again</button>
        </div>
    );
  }

  return (
    <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '16px'}}>
      <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '1rem'}}>
        <h4>Time: {formatTime(timer)}</h4>
        <h4>WPM: {wpm}</h4>
        <h4>Accuracy: {accuracy}%</h4>
      </div>

      <div style={{fontSize: '1.5rem', userSelect: 'none', letterSpacing: '0.1em', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
        {renderQuestion()}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={handleTyping}
        placeholder={isGameRunning ? '' : "Start typing here..."}
        autoFocus
        disabled={timer === 0 || !currentQuestion}
        onPaste={(e) => e.preventDefault()}
        style={{width: '100%', marginTop: '1rem', padding: '0.5rem'}}
      />

      <div style={{textAlign: 'center', marginTop: '1rem'}}>
        <button onClick={onReset}>Reset</button>
      </div>
    </div>
  );
};

export default TypingGame;