import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { GameOptions } from '../App';

interface ModeSelectorProps {
  onStart: (options: GameOptions) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onStart }) => {
  const [language, setLanguage] = useState<GameOptions['language']>('japanese');
  const [length, setLength] = useState<GameOptions['length']>('short');

  const handleStart = () => {
    onStart({ language, length });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center">モード選択</Card.Title>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formLanguage">
            <Form.Label column sm={4}>言語 (Language)</Form.Label>
            <Col sm={8}>
              <Form.Select value={language} onChange={(e) => setLanguage(e.target.value as GameOptions['language'])}>
                <option value="japanese">日本語</option>
                <option value="english">English</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formLength">
            <Form.Label column sm={4}>問題構成 (Length)</Form.Label>
            <Col sm={8}>
              <Form.Select value={length} onChange={(e) => setLength(e.target.value as GameOptions['length'])}>
                <option value="short">30字</option>
                <option value="long">300字</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" size="lg" onClick={handleStart}>
              スタート
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ModeSelector;
