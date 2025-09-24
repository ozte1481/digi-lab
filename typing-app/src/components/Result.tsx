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
    minWpm: 300,
    minAccuracy: 98,
    label: '\u795e\u901f',
    skill: '\u7af6\u6280\u5927\u4f1a\u4e0a\u4f4d\u30ec\u30d9\u30eb\u3002\u6975\u3081\u3066\u9ad8\u3044\u96c6\u4e2d\u529b\u3068\u6b63\u78ba\u3055\u3092\u4e21\u7acb\u3057\u3066\u3044\u307e\u3059\u3002',
    message: '\u3053\u306e\u30b9\u30d4\u30fc\u30c9\u306a\u3089\u30d7\u30ed\u30d5\u30a7\u30c3\u30b7\u30e7\u30ca\u30eb\u9818\u57df\u3067\u3059\u3002\u7d99\u7d9a\u3057\u3066\u4e16\u754c\u30c8\u30c3\u30d7\u6c34\u6e96\u3092\u72d9\u3044\u307e\u3057\u3087\u3046\u3002',
  },
  {
    rank: 'A',
    minWpm: 220,
    minAccuracy: 95,
    label: '\u4e0a\u7d1a',
    skill: '\u5b9f\u52d9\u3067\u56f0\u3089\u306a\u3044\u9ad8\u901f\u30bf\u30a4\u30d4\u30f3\u30b0\u3002\u9ad8\u96e3\u5ea6\u306e\u30e9\u30a4\u30c6\u30a3\u30f3\u30b0\u3084\u30b3\u30fc\u30c7\u30a3\u30f3\u30b0\u3082\u5feb\u9069\u3067\u3059\u3002',
    message: '\u96c6\u4e2d\u304c\u4e57\u3063\u305f\u6642\u306e\u4f38\u3073\u3057\u308d\u304c\u5927\u304d\u3044\u72b6\u614b\u3067\u3059\u3002\u6b21\u306f\u5b89\u5b9a\u611f\u3092\u78e8\u304d\u307e\u3057\u3087\u3046\u3002',
  },
  {
    rank: 'B',
    minWpm: 150,
    minAccuracy: 90,
    label: '\u4e2d\u7d1a',
    skill: '\u60c5\u5831\u51e6\u7406\u306b\u5341\u5206\u306a\u30b9\u30d4\u30fc\u30c9\u3002\u696d\u52d9\u30bf\u30a4\u30d4\u30f3\u30b0\u306e\u5e73\u5747\u3092\u8d85\u3048\u3066\u3044\u307e\u3059\u3002',
    message: '\u57fa\u790e\u304c\u56fa\u307e\u3063\u3066\u3044\u307e\u3059\u3002\u7cbe\u5ea6\u3068\u30da\u30fc\u30b9\u306e\u4e21\u7acb\u306b\u30d5\u30a9\u30fc\u30ab\u30b9\u3059\u308b\u3068\u4e0a\u7d1a\u304c\u898b\u3048\u3066\u304d\u307e\u3059\u3002',
  },
  {
    rank: 'C',
    minWpm: 100,
    minAccuracy: 80,
    label: '\u57fa\u790e\u7fd2\u5f97',
    skill: '\u65e5\u5e38\u5229\u7528\u3067\u652f\u969c\u304c\u306a\u3044\u901f\u5ea6\u3002\u30db\u30fc\u30e0\u30dd\u30b8\u30b7\u30e7\u30f3\u304c\u8eab\u306b\u3064\u3044\u3066\u304d\u3066\u3044\u307e\u3059\u3002',
    message: '\u6b63\u78ba\u3055\u3092\u610f\u8b58\u3057\u306a\u304c\u3089\u5f90\u3005\u306b\u30ea\u30ba\u30e0\u3092\u4e0a\u3052\u3066\u3044\u304d\u307e\u3057\u3087\u3046\u3002',
  },
  {
    rank: 'D',
    minWpm: 0,
    minAccuracy: 0,
    label: '\u521d\u7d1a',
    skill: '\u6307\u306e\u904b\u3073\u306b\u6163\u308c\u308b\u30b9\u30c6\u30fc\u30b8\u3002\u6b63\u3057\u3044\u59ff\u52e2\u3068\u53cd\u5fa9\u7df4\u7fd2\u304c\u4e0a\u9054\u3078\u306e\u8fd1\u9053\u3067\u3059\u3002',
    message: '\u307e\u305a\u306f\u843d\u3061\u7740\u3044\u3066\u30db\u30fc\u30e0\u30dd\u30b8\u30b7\u30e7\u30f3\u306b\u6307\u3092\u7f6e\u304d\u3001\u77ed\u3044\u6587\u7ae0\u3067\u7cbe\u5ea6\u3092\u9ad8\u3081\u307e\u3057\u3087\u3046\u3002',
  },
] as const;

const Result: React.FC<ResultProps> = ({ result, onRestart }) => {
  const { correctCount, totalTyped, wpm, accuracy, elapsedSeconds, flow } = result;

  const currentBand = useMemo(() => {
    return (
      EVALUATION_BANDS.find((band) => wpm >= band.minWpm && accuracy >= band.minAccuracy) ||
      EVALUATION_BANDS[EVALUATION_BANDS.length - 1]
    );
  }, [wpm, accuracy]);

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
          <h5>WPM</h5>
          <p style={{ fontSize: '2rem', margin: 0 }}>{wpm}</p>
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
            {'\u6b21\u306e\u30e9\u30f3\u30af '} + nextBand.rank + ' (' + nextBand.label + ') ' + '\u306b\u306f WPM ' + nextBand.minWpm + '+ / \u6b63\u78ba\u7387 ' + nextBand.minAccuracy + '%+ \u3092\u76ee\u6307\u3057\u307e\u3057\u3087\u3046\u3002'
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
                      {'WPM ' + band.minWpm + '+ / \u6b63\u78ba\u7387 ' + band.minAccuracy + '%+'}
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

