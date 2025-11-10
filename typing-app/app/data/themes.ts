import type { ThemeCollection } from "../types";
import japaneseData from "./japanese.json";

type ThemeJsonEntry = {
  name: string;
  short: string[];
  long: string[];
  theme?: string;
  topic?: string;
  category?: string;
};

type ThemeJsonRecord = Record<string, ThemeJsonEntry>;

const fromJson = (source: ThemeJsonRecord): ThemeCollection =>
  Object.entries(source).reduce<ThemeCollection>((acc, [key, value]) => {
    const themeLabel = value.theme ?? value.name;
    const detailLabel = value.topic ? `${themeLabel} / ${value.topic}` : themeLabel;
    acc[key] = {
      name: themeLabel,
      short: value.short,
      long: value.long,
      themeLabel,
      topicLabel: value.topic,
      categoryLabel: value.category,
      detailLabel,
    };
    return acc;
  }, {} as ThemeCollection);

export const japaneseThemes: ThemeCollection = fromJson(japaneseData as ThemeJsonRecord);

export const englishThemes: ThemeCollection = {
  communication: {
    name: "Communication",
    short: [
      "Active listening builds trust in any conversation.",
      "Summarizing action items keeps meetings productive.",
      "Clear subject lines invite faster email responses.",
      "Visual aids reinforce complex explanations.",
      "Documenting decisions prevents scope creep later.",
      "Empathy de-escalates tense discussions before they grow.",
      "Public speaking improves with deliberate practice.",
      "Open questions encourage diverse perspectives.",
      "Preparing examples adds credibility to a presentation.",
      "Concise messages respect the reader's time.",
    ],
    long: [
      "Effective communication balances clarity with empathy. Understanding the audience helps tailor vocabulary, tone, and pacing.",
      "Distributed teams rely on written updates to stay aligned. Templates and shared glossaries reduce ambiguity across time zones.",
      "Constructive feedback highlights observations and suggestions. Combining praise with growth points encourages continuous improvement.",
    ],
  },
  business: {
    name: "Business",
    short: [
      "A mission statement explains the organization's purpose.",
      "Cash flow metrics reveal operational resilience.",
      "Customer interviews inform product roadmaps.",
      "Key results translate strategy into daily actions.",
      "Portfolio diversification cushions external shocks.",
      "Negotiations thrive when long-term value is shared.",
      "Ethical governance builds stakeholder confidence.",
      "Transparent reporting improves accountability.",
      "Experiments uncover new business opportunities.",
      "Continuous learning keeps teams adaptable.",
    ],
    long: [
      "Business strategy is a living process that reacts to data and feedback. Scenario planning helps teams test assumptions before committing resources.",
      "Sustainable management integrates environmental and social indicators into performance reviews. Stakeholders expect visibility into progress.",
      "Innovation programs flourish when experimentation is rewarded and lessons learned are shared openly across departments.",
    ],
  },
  wellbeing: {
    name: "Well-being",
    short: [
      "Regular breaks reset concentration during deep work.",
      "Quality sleep supports immune response and memory.",
      "Balanced nutrition stabilizes energy throughout the day.",
      "Mindfulness practices reduce stress hormones.",
      "Exercise improves mood through endorphin release.",
      "Gratitude journals reinforce a growth mindset.",
      "Healthy boundaries keep workloads sustainable.",
      "Support networks make challenges easier to navigate.",
      "Creative hobbies unlock fresh perspectives.",
      "Digital detox routines protect long-term focus.",
    ],
    long: [
      "Well-being rests on the balance of body, mind, and relationships. Small daily habits compound into long-term resilience.",
      "Organizations that respect downtime see higher engagement and retention. Flexible schedules acknowledge modern lifestyles.",
      "Community support programs normalize conversations about mental health and encourage early intervention.",
    ],
  },
};

export const programmingThemes: ThemeCollection = {
  python: {
    name: "Python",
    short: [
      "numbers = [n * 2 for n in range(5)]",
      `with open("logs.txt", "a", encoding="utf-8") as fh:\n    fh.write(line)`,
      `from pathlib import Path\nPath("reports").mkdir(parents=True, exist_ok=True)`,
      "totals = sum(float(value) for value in row.values())",
      "sorted_users = sorted(users, key=lambda u: u.last_login, reverse=True)",
    ],
    shortMeta: [
      { description: "リスト内包表記で 0〜4 の値を 2 倍した配列を作ります。", language: "Python" },
      { description: "コンテキストマネージャでログファイルに追記し、クローズ漏れを防ぎます。", language: "Python" },
      { description: "Pathlib を使って階層をまとめて作成し、既存でもエラーにしません。", language: "Python" },
      { description: "辞書の値を float に変換しながら合計を計算します。", language: "Python" },
      { description: "sorted の key 引数で最終ログイン順にユーザーを並べ替えます。", language: "Python" },
    ],
    long: [
      `from collections import deque\n\n\ndef chunked(iterable, size):\n    chunk = []\n    for item in iterable:\n        chunk.append(item)\n        if len(chunk) == size:\n            yield chunk\n            chunk = []\n    if chunk:\n        yield chunk`,
      `import httpx\n\n\nasync def fetch_json(url: str) -> dict:\n    async with httpx.AsyncClient(timeout=10) as client:\n        response = await client.get(url)\n        response.raise_for_status()\n        return response.json()`,
      `from dataclasses import dataclass\n\n\n@dataclass\nclass Settings:\n    debug: bool = False\n    database_url: str = "sqlite:///app.db"\n\n    @classmethod\n    def from_env(cls, env: dict[str, str]):\n        return cls(\n            debug=env.get("DEBUG", "0") == "1",\n            database_url=env.get("DATABASE_URL", cls.database_url),\n        )`,
    ],
    longMeta: [
      { description: "任意のイテラブルを指定サイズの塊に分割するジェネレーターです。", language: "Python" },
      { description: "httpx.AsyncClient で JSON API を非同期取得し、レスポンスを検証します。", language: "Python" },
      { description: "dataclass で設定値をまとめ、環境変数から上書きできるようにしています。", language: "Python" },
    ],
  },
  html: {
    name: "HTML",
    short: [
      '<meta name="viewport" content="width=device-width,initial-scale=1">',
      '<button type="submit" aria-busy="true">送信中...</button>',
      '<img src="/hero.jpg" alt="製品の外観" loading="lazy" />',
      '<label for="email" class="sr-only">メールアドレス</label>',
      '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />',
    ],
    shortMeta: [
      { description: "レスポンシブ表示の基本となる viewport メタタグです。", language: "HTML" },
      { description: "aria-busy を付けて送信中であることを支援技術へ伝えます。", language: "HTML" },
      { description: "意味のある代替テキストと遅延読み込みでアクセシビリティを確保します。", language: "HTML" },
      { description: "スクリーンリーダー向けのラベルを sr-only クラスで隠します。", language: "HTML" },
      { description: "Google Fonts への接続を事前確立し、初回描画を高速化します。", language: "HTML" },
    ],
    long: [
      `<header class="sticky top-0 bg-white/90 backdrop-blur">\n  <nav class="mx-auto flex max-w-6xl items-center justify-between p-4">\n    <a class="font-semibold">Acme Docs</a>\n    <ul class="flex gap-4 text-sm">\n      <li><a href="#features">Features</a></li>\n      <li><a href="#pricing">Pricing</a></li>\n      <li><a href="#support">Support</a></li>\n    </ul>\n  </nav>\n</header>`,
      `<form class="space-y-4" aria-label="ニュースレター登録">\n  <label class="block">\n    <span class="text-sm">メールアドレス</span>\n    <input type="email" name="email" required class="mt-1 w-full rounded border px-3 py-2" />\n  </label>\n  <button type="submit" class="w-full rounded bg-indigo-600 py-2 text-white">登録する</button>\n</form>`,
      `<table class="w-full text-left text-sm">\n  <caption class="pb-2 text-xs text-muted-foreground">サーバー監視の最新値</caption>\n  <thead>\n    <tr>\n      <th>リージョン</th>\n      <th>稼働率</th>\n      <th>遅延</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>東京</td>\n      <td>99.98%</td>\n      <td>32ms</td>\n    </tr>\n    <tr>\n      <td>シンガポール</td>\n      <td>99.95%</td>\n      <td>54ms</td>\n    </tr>\n  </tbody>\n</table>`,
    ],
    longMeta: [
      { description: "スクロールしても常に見える粘着ヘッダーで主要リンクを保持します。", language: "HTML" },
      { description: "フォームラベルと aria 属性でアクセシブルな入力フォームを構成しています。", language: "HTML" },
      { description: "caption と thead を付けた表でモニタリングデータを整理しています。", language: "HTML" },
    ],
  },
  yaml: {
    name: "YAML",
    short: [
      'version: "3.9"',
      "services:\n  app:\n    build: .\n    restart: unless-stopped",
      "secrets:\n  jwt_key:\n    file: ./secrets/jwt.pem",
      "volumes:\n  cache:\n    driver: local",
      "env:\n  DATABASE_URL: postgres://user:pass@db:5432/app",
    ],
    shortMeta: [
      { description: "Docker Compose v3.9 と明示するヘッダーです。", language: "YAML" },
      { description: "コンテナのビルド設定と restart ポリシーをまとめています。", language: "YAML" },
      { description: "シークレットファイルを参照する設定でキーを安全に渡します。", language: "YAML" },
      { description: "ローカルドライバの名前付きボリュームを宣言します。", language: "YAML" },
      { description: "アプリが参照する環境変数を一元管理します。", language: "YAML" },
    ],
    long: [
      `apiVersion: batch/v1\nkind: CronJob\nmetadata:\n  name: nightly-backup\nspec:\n  schedule: "0 2 * * *"\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          containers:\n            - name: backup\n              image: alpine:3\n              args: ["sh", "-c", "pg_dump ..."]\n          restartPolicy: OnFailure`,
      `name: deploy\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npm run build`,
      `all:\n  children:\n    web:\n      hosts:\n        app-01:\n          ansible_host: 10.0.0.5\n        app-02:\n          ansible_host: 10.0.0.6\n    db:\n      hosts:\n        primary:\n          ansible_host: 10.0.1.10\n`,
    ],
    longMeta: [
      { description: "Kubernetes CronJob で夜間バックアップを定期実行します。", language: "YAML" },
      { description: "GitHub Actions で main ブランチに push されたらビルドします。", language: "YAML" },
      { description: "Ansible のインベントリをグループ単位で定義しています。", language: "YAML" },
    ],
  },
  cmd: {
    name: "cmd.exe",
    short: [
      "dir /b /ad C:\\Projects",
      "set PATH=%PATH%;C:\\tools\\bin",
      "for %%F in (*.log) do type \"%%F\" >> merged.log",
      "timeout /t 10 /nobreak",
      "where /r C:\\logs *.txt",
    ],
    shortMeta: [
      { description: "ディレクトリのみをベア形式で表示します。", language: "cmd" },
      { description: "一時的に PATH にツールディレクトリを追加します。", language: "cmd" },
      { description: "カレントフォルダのログをまとめて 1 つに連結します。", language: "cmd" },
      { description: "強制的に 10 秒待機し、キー入力でも中断させません。", language: "cmd" },
      { description: "指定フォルダ配下のテキストファイルを再帰検索します。", language: "cmd" },
    ],
    long: [
      `@echo off\nsetlocal enabledelayedexpansion\n\nfor %%F in (*.patch) do (\n  echo Applying %%F\n  git apply "%%F" || goto :error\n)\n\necho Completed\ngoto :eof\n\n:error\necho Failed on %%F\nexit /b 1`,
      `@echo off\nset TARGET=%1\nif "%TARGET%"=="" set TARGET=build\n\nif exist "%TARGET%" (\n  rmdir /s /q "%TARGET%"\n)\n\nmkdir "%TARGET%"\nrobocopy dist "%TARGET%" /e`,
      `@echo off\nfor /f "tokens=1 delims=," %%A in (users.csv) do (\n  net user %%A /add\n)\n`,
    ],
    longMeta: [
      { description: "複数の patch ファイルを順に適用し、失敗時に中断します。", language: "cmd" },
      { description: "成果物フォルダを作り直し、dist の内容を同期します。", language: "cmd" },
      { description: "CSV の 1 列目を読み取り、ユーザーアカウントを追加します。", language: "cmd" },
    ],
  },
  powershell: {
    name: "PowerShell",
    short: [
      "Get-ChildItem -Recurse | Where-Object { $_.Length -gt 5MB }",
      "Set-ExecutionPolicy -Scope Process RemoteSigned",
      "Test-Connection -ComputerName fileserver -Count 2",
      "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5",
      "Get-Content .\\appsettings.json | ConvertFrom-Json",
    ],
    shortMeta: [
      { description: "サブフォルダを含めて 5MB 以上のファイルを抽出します。", language: "PowerShell" },
      { description: "現在のセッションのみスクリプト実行ポリシーを緩和します。", language: "PowerShell" },
      { description: "ファイルサーバーに ICMP を 2 回送って疎通確認します。", language: "PowerShell" },
      { description: "CPU 使用率の高いプロセス上位 5 件を表示します。", language: "PowerShell" },
      { description: "JSON 設定ファイルを読み込み、オブジェクトに変換します。", language: "PowerShell" },
    ],
    long: [
      `param(\n  [Parameter(Mandatory)]\n  [string]$ResourceGroup\n)\n\n$sites = Get-AzWebApp -ResourceGroupName $ResourceGroup\n$sites | ForEach-Object {\n  [PSCustomObject]@{\n    Name = $_.Name\n    Url  = $_.DefaultHostName\n    Stack = $_.SiteConfig.NetFrameworkVersion\n  }\n} | Format-Table`,
      `$source = ".\\logs"\n$archive = ".\\archive"\n\nif (!(Test-Path $archive)) {\n  New-Item -ItemType Directory -Path $archive | Out-Null\n}\n\nGet-ChildItem $source -Filter "*.log" |\n  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |\n  ForEach-Object {\n    $destination = Join-Path $archive "$($_.BaseName).zip"\n    Compress-Archive -Path $_.FullName -DestinationPath $destination -Update\n    Remove-Item $_.FullName\n  }`,
      `Import-Module SqlServer\n\nInvoke-Sqlcmd -InputFile ".\\scripts\\seed.sql" \\\n              -ServerInstance "localhost\\SQLEXPRESS" \\\n              -Database "AppDb"`,
    ],
    longMeta: [
      { description: "指定リソースグループ内の Web Apps 情報を一覧表示します。", language: "PowerShell" },
      { description: "7 日以上前のログを Zip 圧縮し、アーカイブへ退避します。", language: "PowerShell" },
      { description: "SQL Server へ接続し、初期データ投入スクリプトを実行します。", language: "PowerShell" },
    ],
  },
};

