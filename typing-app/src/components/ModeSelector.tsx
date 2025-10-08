import React, { useEffect, useMemo, useState } from 'react';
import type { GameOptions, Language, QuestionLength, ThemeDefinition } from '../types';

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
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }} translate="no">
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>モード選択</h2>

      {loading && (
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>問題を読み込み中です...</p>
      )}

      {error && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#dc3545', marginBottom: '0.5rem' }}>{error}</p>
          <button onClick={onRetry} style={{ width: '100%', padding: '8px' }}>
            再読み込み
          </button>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="formLanguage" style={{ display: 'block', marginBottom: '8px' }}>言語・モード</label>
        <select
          id="formLanguage"
          value={language}
          onChange={(event) => setLanguage(event.target.value as Language)}
          style={{ width: '100%', padding: '8px' }}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {language === 'copy' && (
          <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#495057' }}>
            写経モードではコードやコマンドを正確に書き写し、処理内容の説明も確認できます。
          </p>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="formTheme" style={{ display: 'block', marginBottom: '8px' }}>テーマ</label>
        <select
          id="formTheme"
          value={themeId}
          onChange={(event) => setThemeId(event.target.value)}
          style={{ width: '100%', padding: '8px' }}
          disabled={loading || !!error || themeOptions.length === 0}
        >
          {themeOptions.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
        {selectedTheme?.description && (
          <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#495057' }}>{selectedTheme.description}</p>
        )}
        {themeOptions.length === 0 && (
          <p style={{ marginTop: '8px', color: '#6c757d' }}>選択できるテーマがありません。</p>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="formLength" style={{ display: 'block', marginBottom: '8px' }}>問題の長さ</label>
        <select
          id="formLength"
          value={length}
          onChange={(event) => setLength(event.target.value as QuestionLength)}
          style={{ width: '100%', padding: '8px' }}
        >
          {(['short', 'long'] as QuestionLength[]).map((option) => (
            <option key={option} value={option}>
              {lengthLabels[option]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid' }}>
        <button
          onClick={handleStart}
          style={{ padding: '12px 16px', fontSize: '1.25rem', cursor: loading || !!error ? 'not-allowed' : 'pointer' }}
          disabled={loading || !!error || !themeId}
        >
          スタート
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;
