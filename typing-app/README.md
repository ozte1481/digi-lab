# タイピングアプリ (Next.js 版)

外部で作成した Next.js + TypeScript ベースのタイピングアプリを統合したプロジェクトです。Radix UI 由来のコンポーネントと Tailwind CSS を活用し、テーマ別の文章でタイピング練習ができます。

## 開発環境

- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 4

## セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# 本番ビルド
npm run build

# 本番ビルドをローカルで検証
npm run start
```

> pnpm / yarn でも動作します。利用するパッケージマネージャーに合わせて lock ファイルを更新してください。

## プロジェクト構成

- `app/` : App Router のエントリポイント（`layout.tsx` / `page.tsx`）。
- `components/` : UI コンポーネント。
- `hooks/`, `lib/` : カスタムフックとユーティリティ。
- `public/` : 静的アセット。
- `styles/` : Tailwind の追加スタイル。

## その他

- `.env` などの機密ファイルは `.gitignore` で除外しています。
- Tailwind と PostCSS の設定は `postcss.config.mjs` で管理しています。
- 日本語モードの問題文は `app/data/japanese.json` から読み込まれます。元の CSV（例: `一般教養問題文.csv`）を更新したら、`node scripts/convert-theme-csv.mjs --input path/to/source.csv --output app/data/japanese.json` を実行して JSON を再生成してください。先頭 5 文が `short`, 後半 5 文が `long` として保存されます。
- 英語モードの差し替え時も同じスクリプトを利用できます。翻訳済みの CSV を用意したら、出力先を `app/data/english.json` にしたうえで `themes.ts` に `import englishData from "./english.json";` → `export const englishThemes = fromJson(englishData as ThemeJsonRecord);` のように接続してください。

Next.js ベースの構成を土台に、タイピング体験や出題コンテンツの拡充を続けてください。
