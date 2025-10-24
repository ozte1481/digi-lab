import React, { useEffect, useMemo, useState } from 'react';
import type { GameOptions, Language, QuestionLength, ThemeDefinition } from '../types';
import './ModeSelector.css';

interface ModeSelectorProps {
  onStart: (options: GameOptions) => void;
  themes: ThemeDefinition[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const languageOptions: { value: Language; label: string }[] = [
  { value: 'japanese', label: '日本語' },
  { value: 'english', label: 'English' },
  { value: 'copy', label: '写経' },
];

const lengthLabels: Record<QuestionLength, string> = {
  short: '短文（約30字・短い処理）',
  long: '長文（約300字・腰を据えて挑戦）',
};

const ModeSelector: React.FC<ModeSelectorProps> = ({ onStart, themes, loading, error, onRetry }) => {
  const [language, setLanguage] = useState<Language>('japanese');
  const [length, setLength] = useState<QuestionLength>('short');
  const [themeId, setThemeId] = useState<string>('');

  const availableThemes = useMemo(
    () => themes.filter((theme) => theme.availableLanguages.includes(language)),
    [themes, language],
  );

  const selectedTheme = useMemo(
    () => availableThemes.find((theme) => theme.id === themeId) ?? null,
    [availableThemes, themeId],
  );

  useEffect(() => {
    if (availableThemes.length === 0) {
      setThemeId('');
      return;
    }

    const exists = availableThemes.some((theme) => theme.id === themeId);
    if (!exists) {
      setThemeId(availableThemes[0].id);
    }
  }, [availableThemes, themeId]);

  const themeOptions = useMemo(
    () =>
      availableThemes.map((theme) => {
        const label = theme.label[language] ?? theme.label.japanese ?? theme.label.english ?? theme.id;
        return {
          value: theme.id,
          label,
        };
      }),
    [availableThemes, language],
  );

  const handleStart = () => {
    if (!themeId || loading || error) {
      return;
    }
    onStart({ language, length, themeId });
  };

  return (
    <div className="card mode-selector-card">
      <div className="card-body p-4 p-md-5">
        <h2 className="card-title text-center fw-bold mb-4 mode-selector-title">モード選択</h2>

        {loading && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            <p className="mb-2">データの読み込みに失敗しました。</p>
            <p className="small mb-3">{error}</p>
            <button onClick={onRetry} className="btn btn-sm btn-danger">
              再読み込み
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="formLanguage" className="form-label">言語・モード</label>
                <select
                  id="formLanguage"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className="form-select form-select-lg"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="formLength" className="form-label">問題の長さ</label>
                <select
                  id="formLength"
                  value={length}
                  onChange={(event) => setLength(event.target.value as QuestionLength)}
                  className="form-select form-select-lg"
                >
                  {(['short', 'long'] as QuestionLength[]).map((option) => (
                    <option key={option} value={option}>
                      {lengthLabels[option]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="formTheme" className="form-label">テーマ</label>
              <select
                id="formTheme"
                value={themeId}
                onChange={(event) => setThemeId(event.target.value)}
                className="form-select form-select-lg"
                disabled={themeOptions.length === 0}
              >
                {themeOptions.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
              {selectedTheme?.description && (
                <p className="form-text mt-2">{selectedTheme.description}</p>
              )}
              {themeOptions.length === 0 && (
                <p className="form-text text-muted mt-2">選択できるテーマがありません。</p>
              )}
            </div>

            {language === 'copy' && (
              <div className="alert alert-info mt-4 small">
                <i className="bi bi-info-circle-fill me-2"></i>
                写経モードではコードやコマンドを正確に書き写し、処理内容の説明も確認できます。
              </div>
            )}

            <div className="d-grid mt-4">
              <button
                onClick={handleStart}
                className="btn btn-lg fw-bold btn-gradient"
                disabled={!themeId}
              >
                スタート
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModeSelector;
