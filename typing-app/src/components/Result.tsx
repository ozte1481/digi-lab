import React, { useMemo } from 'react';
import type { GameResult } from '../types';

interface ResultProps {
  result: GameResult;
  onRestart: () => void;
}

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return minutes + ':' + remainingSeconds;
};

const EVALUATION_BANDS = [
  {
    rank: 'S',
    minCpm: 260,
    minAccuracy: 96,
    label: 'エキスパート',
    skill: '会議中のリアルタイム入力も余裕の最上位ビジネスレベル。',
    message: 'ここまで来れば日常業務は完全に安心。集中力を保つと定着感がさらに高まります。',
  },
  {
    rank: 'A',
    minCpm: 210,
    minAccuracy: 94,
    label: '上級実務',
    skill: '資料作成や議事録もスピーディにこなせる上級タイピスト。',
    message: 'ペースを乱さず正確さを意識するとSランクが視野に入ります。',
  },
  {
    rank: 'B',
    minCpm: 170,
    minAccuracy: 90,
    label: '実務標準',
    skill: '多くのビジネスマンが目標にする快適スピード。',
    message: '入力テンポが安定してきました。短い練習でリズム作りを続けましょう。',
  },
  {
    rank: 'C',
    minCpm: 130,
    minAccuracy: 85,
    label: '基礎確立',
    skill: 'ブラインドタッチの形が整ってきた段階。',
    message: '正しい指使いとホームポジションを意識すれば自然とスピードが伸びます。',
  },
  {
    rank: 'D',
    minCpm: 0,
    minAccuracy: 0,
    label: '学習中',
    skill: '指使いに慣れるための基礎練習フェーズ。',
    message: '焦らず短い文章を繰り返し、まずはCランクを目標にしましょう。',
  },
] as const;

const Result: React.FC<ResultProps> = ({ result, onRestart }) => {
  const { correctCount, totalTyped, cpm, accuracy, elapsedSeconds, flow } = result;

  const currentBand = useMemo(() => {
    return (
      EVALUATION_BANDS.find((band) => cpm >= band.minCpm && accuracy >= band.minAccuracy) ||
      EVALUATION_BANDS[EVALUATION_BANDS.length - 1]
    );
  }, [cpm, accuracy]);

  const nextBand = useMemo(() => {
    const currentIndex = EVALUATION_BANDS.findIndex((band) => band.rank === currentBand.rank);
    if (currentIndex <= 0) {
      return null;
    }
    return EVALUATION_BANDS[currentIndex - 1];
  }, [currentBand.rank]);

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }} translate="no">
      <h2 style={{ textAlign: 'center', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>{'\u7d50\u679c'}</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '1rem', textAlign: 'center', margin: '1.5rem 0' }} className="notranslate">
        <div>
          <h5>CPM</h5>
          <p style={{ fontSize: '2rem', margin: 0 }}>{cpm}</p>
        </div>
        <div>
          <h5>{'\u6b63\u78ba\u7387'}</h5>
          <p style={{ fontSize: '2rem', margin: 0 }}>{accuracy}%</p>
        </div>
        <div>
          <h5>{'\u6b63\u3057\u304f\u6253\u3063\u305f\u6587\u5b57\u6570'}</h5>
          <p style={{ fontSize: '2rem', margin: 0 }}>{correctCount}</p>
        </div>
        <div>
          <h5>{'\u5165\u529b\u3057\u305f\u6587\u5b57\u6570'}</h5>
          <p style={{ fontSize: '2rem', margin: 0 }}>{totalTyped}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', backgroundColor: '#f1f3f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <div>
          <strong>Skill Points</strong>
          <p style={{ fontSize: '1.5rem', margin: '0.25rem 0 0' }} className="notranslate">{flow.skillPoints}</p>
          <small style={{ color: '#6c757d' }}>{'\u6d41\u308c\u306b\u4e57\u308c\u305f\u91cf\u306e\u76ee\u5b89'}</small>
        </div>
        <div>
          <strong>{'\u6700\u5927\u30d5\u30ed\u30fc'}</strong>
          <p style={{ fontSize: '1.5rem', margin: '0.25rem 0 0' }} className="notranslate">{flow.maxFlowStreak}</p>
          <small style={{ color: '#6c757d' }}>{'\u30df\u30b9\u306a\u304f\u9023\u7d9a\u3067\u7a81\u7834\u3057\u305f\u554f\u984c\u6570'}</small>
        </div>
        <div>
          <strong>{'\u30dc\u30fc\u30ca\u30b9\u6642\u9593'}</strong>
          <p style={{ fontSize: '1.5rem', margin: '0.25rem 0 0' }} className="notranslate">+{flow.bonusTimeEarned}s</p>
          <small style={{ color: '#6c757d' }}>{'\u96c6\u4e2d\u7d99\u7d9a\u3067\u5f97\u305f\u5ef6\u9577'}</small>
        </div>
        <div>
          <strong>{'\u30d7\u30ec\u30a4\u6642\u9593'}</strong>
          <p style={{ fontSize: '1.5rem', margin: '0.25rem 0 0' }}>{formatSeconds(elapsedSeconds)}</p>
          <small style={{ color: '#6c757d' }}>{'\u30bb\u30c3\u30b7\u30e7\u30f3\u5168\u4f53\u306e\u30bf\u30a4\u30e0'}</small>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3 style={{ margin: 0 }}>
          {'\u8a55\u4fa1'}: <span style={{ color: '#d6336c' }}>{currentBand.rank}</span> <small style={{ color: '#6c757d' }}>({currentBand.label})</small>
        </h3>
        <p style={{ margin: '0.75rem 0 0.5rem' }}>{currentBand.message}</p>
        <p style={{ margin: 0, color: '#6c757d' }}>{currentBand.skill}</p>
        {nextBand && (
          <p style={{ marginTop: '0.75rem', color: '#495057' }}>
            {'\u6b21\u306e\u30e9\u30f3\u30af '} + nextBand.rank + ' (' + nextBand.label + ') ' + '\u306b\u306f CPM ' + nextBand.minCpm + '+ / \u6b63\u78ba\u7387 ' + nextBand.minAccuracy + '%+ \u3092\u76ee\u6307\u3057\u307e\u3057\u3087\u3046\u3002'
          </p>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.75rem' }}>{'\u8a55\u4fa1\u30c6\u30fc\u30d6\u30eb'}</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }} className="notranslate">
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>{'\u8a55\u4fa1'}</th>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>{'\u6307\u6a19'}</th>
                <th style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>{'\u5b9f\u529b\u306e\u76ee\u5b89'}</th>
              </tr>
            </thead>
            <tbody>
              {EVALUATION_BANDS.map((band) => {
                const isActive = band.rank === currentBand.rank;
                return (
                  <tr key={band.rank} style={{ backgroundColor: isActive ? '#ffe3e9' : 'transparent' }}>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6', fontWeight: isActive ? 700 : 500 }}>
                      {band.rank} <small style={{ color: '#6c757d' }}>({band.label})</small>
                    </td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                      {'CPM ' + band.minCpm + '+ / \u6b63\u78ba\u7387 ' + band.minAccuracy + '%+'}
                    </td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>{band.skill}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid' }}>
        <button onClick={onRestart} style={{ padding: '0.75rem', fontSize: '1.25rem' }}>
          {'\u3082\u3046\u4e00\u5ea6\u6311\u6226\u3059\u308b'}
        </button>
      </div>
    </div>
  );
};

export default Result;

