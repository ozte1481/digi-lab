import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { GameResult } from '../App';

interface ResultProps {
  result: GameResult;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ result, onRestart }) => {
  const { correctCount, totalTyped, wpm } = result;
  const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 0;

  const getEvaluation = () => {
    if (wpm > 300 && accuracy > 98) {
      return { rank: 'S', message: '素晴らしい！神のようなタイピング速度と正確性です！' };
    } else if (wpm > 250 && accuracy > 95) {
      return { rank: 'A', message: '非常に優秀です。タイピング上級者と言えるでしょう。' };
    } else if (wpm > 150 && accuracy > 90) {
      return { rank: 'B', message: '良い成績です。日常的な入力は問題ないレベルです。' };
    } else if (wpm > 100) {
      return { rank: 'C', message: 'まずまずの成績です。もっと練習すれば上達します。' };
    } else {
      return { rank: 'D', message: 'もう少し頑張りましょう。練習あるのみです！' };
    }
  };

  const evaluation = getEvaluation();

  return (
    <Card>
      <Card.Header as="h2" className="text-center">結果</Card.Header>
      <Card.Body>
        <Row className="text-center mb-4">
          <Col>
            <Card.Title>WPM</Card.Title>
            <Card.Text style={{ fontSize: '2rem' }}>{Math.round(wpm)}</Card.Text>
          </Col>
          <Col>
            <Card.Title>正答率</Card.Title>
            <Card.Text style={{ fontSize: '2rem' }}>{accuracy}%</Card.Text>
          </Col>
          <Col>
            <Card.Title>正答文字数</Card.Title>
            <Card.Text style={{ fontSize: '2rem' }}>{correctCount}</Card.Text>
          </Col>
        </Row>
        <div className="text-center p-3 mb-3 bg-light rounded">
          <h3>評価: <span style={{color: 'red'}}>{evaluation.rank}</span></h3>
          <p>{evaluation.message}</p>
        </div>
        <div className="d-grid">
          <Button variant="primary" size="lg" onClick={onRestart}>
            もう一度挑戦する
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Result;