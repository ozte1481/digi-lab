# コマンドライン便利コマンド集（厳選版）

## 📂 ファイル・ディレクトリ操作
```bash
pwd              # 現在のディレクトリを表示
ls -al           # ファイル一覧（詳細＋隠しファイルも表示）
cd <dir>         # ディレクトリ移動
mkdir <dir>      # ディレクトリ作成
rm -r <dir>      # ディレクトリを削除（中身ごと）
cp <src> <dst>   # ファイルやディレクトリをコピー
mv <src> <dst>   # 移動 or 名前変更
```

---

## 📄 ファイル確認
```bash
cat <file>       # 中身を一気に表示
less <file>      # ページ送りで表示（qで終了）
head <file>      # 先頭10行を表示
tail -f <file>   # ファイル末尾を監視（ログ確認に便利）
```

---

## 🔍 検索・探索
```bash
find . -name "*.txt"     # txtファイルを探す
grep "keyword" <file>    # ファイル内の文字列を検索
grep -r "keyword" .      # ディレクトリ以下を再帰的に検索
tree -L 2                # ディレクトリ構造を2階層まで表示
```

---

## ⚙️ システム関連
```bash
clear            # 画面をクリア
history          # コマンド履歴
!!               # 直前のコマンドを再実行
top              # CPUやメモリ使用状況を確認
ps aux           # 実行中のプロセスを表示
kill <PID>       # プロセス終了
```

---

## 📦 圧縮・解凍
```bash
tar -czf a.tar.gz <dir>   # ディレクトリを圧縮
tar -xzf a.tar.gz         # 解凍
zip -r a.zip <dir>        # zip形式で圧縮
unzip a.zip               # zipを解凍
```

---

## 🌱 Git（最低限）
```bash
git status         # 状況を確認
git add .          # 変更をステージ
git commit -m "msg" # コミット
git push           # リモートに反映
git pull           # 最新を取得
```
