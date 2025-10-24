import React, { useMemo } from 'react';
﻿import type { GameResult } from '../types';
﻿
﻿interface ResultProps {
﻿  result: GameResult;
﻿  onRestart: () => void;
﻿}
﻿
﻿const formatSeconds = (seconds: number) => {
﻿  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
﻿  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
﻿  return minutes + ':' + remainingSeconds;
﻿};
﻿
﻿const EVALUATION_BANDS = [
﻿  {
﻿    rank: 'S',
﻿    minCpm: 260,
﻿    minAccuracy: 96,
﻿    label: 'エキスパート',
﻿    skill: '会議中のリアルタイム入力も余裕の最上位ビジネスレベル。',
﻿    message: 'ここまで来れば日常業務は完全に安心。集中力を保つと定着感がさらに高まります。',
﻿  },
﻿  {
﻿    rank: 'A',
﻿    minCpm: 210,
﻿    minAccuracy: 94,
﻿    label: '上級実務',
﻿    skill: '資料作成や議事録もスピーディにこなせる上級タイピスト。',
﻿    message: 'ペースを乱さず正確さを意識するとSランクが視野に入ります。',
﻿  },
﻿  {
﻿    rank: 'B',
﻿    minCpm: 170,
﻿    minAccuracy: 90,
﻿    label: '実務標準',
﻿    skill: '多くのビジネスマンが目標にする快適スピード。',
﻿    message: '入力テンポが安定してきました。短い練習でリズム作りを続けましょう。',
﻿  },
﻿  {
﻿    rank: 'C',
﻿    minCpm: 130,
﻿    minAccuracy: 85,
﻿    label: '基礎確立',
﻿    skill: 'ブラインドタッチの形が整ってきた段階。',
﻿    message: '正しい指使いとホームポジションを意識すれば自然とスピードが伸びます。',
﻿  },
﻿  {
﻿    rank: 'D',
﻿    minCpm: 0,
﻿    minAccuracy: 0,
﻿    label: '学習中',
﻿    skill: '指使いに慣れるための基礎練習フェーズ。',
﻿    message: '焦らず短い文章を繰り返し、まずはCランクを目標にしましょう。',
﻿  },
﻿] as const;
﻿
﻿const Result: React.FC<ResultProps> = ({ result, onRestart }) => {
﻿  const { correctCount, totalTyped, cpm, accuracy, elapsedSeconds, flow } = result;
﻿
﻿  const currentBand = useMemo(() => {
﻿    return (
﻿      EVALUATION_BANDS.find((band) => cpm >= band.minCpm && accuracy >= band.minAccuracy) ||
﻿      EVALUATION_BANDS[EVALUATION_BANDS.length - 1]
﻿    );
﻿  }, [cpm, accuracy]);
﻿
﻿  const nextBand = useMemo(() => {
﻿    const currentIndex = EVALUATION_BANDS.findIndex((band) => band.rank === currentBand.rank);
﻿    if (currentIndex <= 0) {
﻿      return null;
﻿    }
﻿    return EVALUATION_BANDS[currentIndex - 1];
﻿  }, [currentBand.rank]);
﻿
﻿  return (
﻿    <div className="card shadow-lg" translate="no">
﻿      <div className="card-header bg-dark text-white text-center py-4">
﻿        <h2 className="card-title fw-bold mb-0">Result</h2>
﻿      </div>
﻿      <div className="card-body p-4 p-md-5">
﻿        <div className="row text-center g-4 mb-5">
﻿          <div className="col-md-3 col-6">
﻿            <div className="small text-white-50">CPM</div>
﻿            <div className="display-6 fw-bold">{cpm}</div>
﻿          </div>
﻿          <div className="col-md-3 col-6">
﻿            <div className="small text-white-50">ACCURACY</div>
﻿            <div className="display-6 fw-bold">{accuracy}%</div>
﻿          </div>
﻿          <div className="col-md-3 col-6">
﻿            <div className="small text-white-50">CORRECT</div>
﻿            <div className="display-6 fw-bold">{correctCount}</div>
﻿          </div>
﻿          <div className="col-md-3 col-6">
﻿            <div className="small text-white-50">TYPED</div>
﻿            <div className="display-6 fw-bold">{totalTyped}</div>
﻿          </div>
﻿        </div>
﻿
﻿        <div className="row bg-dark-subtle rounded p-3 mb-5 text-center">
﻿          <div className="col-md-3 col-6">
﻿            <div className="small">SKILL PTS</div>
﻿            <div className="fs-4 fw-bold">{flow.skillPoints}</div>
﻿          </div>
﻿          <div className="col-md-3 col-6">
﻿            <div className="small">MAX FLOW</div>
﻿            <div className="fs-4 fw-bold">{flow.maxFlowStreak}</div>
﻿          </div>
﻿          <div className="col-md-3 col-6">
﻿            <div className="small">BONUS</div>
﻿            <div className="fs-4 fw-bold">+{flow.bonusTimeEarned}s</div>
﻿          </div>
﻿          <div className="col-md-3 col-6">
﻿            <div className="small">TIME</div>
﻿            <div className="fs-4 fw-bold">{formatSeconds(elapsedSeconds)}</div>
﻿          </div>
﻿        </div>
﻿
﻿        <div className={`alert alert-light text-center border-0 shadow-sm mb-5 alert-${currentBand.rank.toLowerCase()}`}>
﻿          <h3 className="fw-bold mb-1">
﻿            Rank: <span className="text-primary">{currentBand.rank}</span> ({currentBand.label})
﻿          </h3>
﻿          <p className="mb-2">{currentBand.message}</p>
﻿          <p className="small text-muted mb-0">{currentBand.skill}</p>
﻿          {nextBand && (
﻿            <p className="small mt-2 mb-0">
﻿              Next: <strong>{nextBand.rank}</strong> ({nextBand.label}) - CPM {nextBand.minCpm}+ / Accuracy {nextBand.minAccuracy}%+
﻿            </p>
﻿          )}
﻿        </div>
﻿
﻿        <div className="mb-4">
﻿          <h4 className="fw-bold mb-3">Evaluation Table</h4>
﻿          <div className="table-responsive">
﻿            <table className="table table-hover table-sm align-middle small">
﻿              <thead className="table-dark">
﻿                <tr>
﻿                  <th>Rank</th>
﻿                  <th>Label</th>
﻿                  <th>Target</th>
﻿                  <th>Skill Level</th>
﻿                </tr>
﻿              </thead>
﻿              <tbody>
﻿                {EVALUATION_BANDS.map((band) => {
﻿                  const isActive = band.rank === currentBand.rank;
﻿                  return (
﻿                    <tr key={band.rank} className={isActive ? 'table-primary' : ''}>
﻿                      <td className="fw-bold">{band.rank}</td>
﻿                      <td>{band.label}</td>
﻿                      <td>CPM {band.minCpm}+ / Acc {band.minAccuracy}%+</td>
﻿                      <td>{band.skill}</td>
﻿                    </tr>
﻿                  );
﻿                })}
﻿              </tbody>
﻿            </table>
﻿          </div>
﻿        </div>
﻿
﻿        <div className="d-grid">
﻿          <button onClick={onRestart} className="btn btn-primary btn-lg fw-bold">
﻿            Try Again
﻿          </button>
﻿        </div>
﻿      </div>
﻿    </div>
﻿  );
﻿};
﻿
﻿export default Result;
﻿

