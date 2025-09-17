import React from 'react';

const Result: React.FC<any> = ({ result, onRestart }) => {
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
    <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '16px'}}>
      <h2 style={{textAlign: 'center', borderBottom: '1px solid #ccc', paddingBottom: '1rem'}}>結果</h2>
      <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center', margin: '1.5rem 0'}}>
        <div>
          <h5>WPM</h5>
          <p style={{ fontSize: '2rem' }}>{Math.round(wpm)}</p>
        </div>
        <div>
          <h5>正答率</h5>
          <p style={{ fontSize: '2rem' }}>{accuracy}%</p>
        </div>
        <div>
          <h5>正答文字数</h5>
          <p style={{ fontSize: '2rem' }}>{correctCount}</p>
        </div>
      </div>
      <div style={{textAlign: 'center', padding: '1rem', marginBottom: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
        <h3>評価: <span style={{color: 'red'}}>{evaluation.rank}</span></h3>
        <p>{evaluation.message}</p>
      </div>
      <div style={{display: 'grid'}}>
        <button onClick={onRestart} style={{padding: '0.75rem', fontSize: '1.25rem'}}>
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
};

export default Result;