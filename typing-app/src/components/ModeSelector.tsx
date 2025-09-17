import React, { useState } from 'react';

// Defining types directly in the file
export interface GameOptions {
  language: 'japanese' | 'english';
  length: 'short' | 'long';
}

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
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>モード選択</h2>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="formLanguage" style={{ display: 'block', marginBottom: '8px' }}>言語 (Language)</label>
        <select
          id="formLanguage"
          value={language}
          onChange={(e) => setLanguage(e.target.value as GameOptions['language'])}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="japanese">日本語</option>
          <option value="english">English</option>
        </select>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="formLength" style={{ display: 'block', marginBottom: '8px' }}>問題構成 (Length)</label>
        <select
          id="formLength"
          value={length}
          onChange={(e) => setLength(e.target.value as GameOptions['length'])}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="short">30字</option>
          <option value="long">300字</option>
        </select>
      </div>
      <div style={{ display: 'grid' }}>
        <button
          onClick={handleStart}
          style={{ padding: '12px 16px', fontSize: '1.25rem', cursor: 'pointer' }}
        >
          スタート
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;