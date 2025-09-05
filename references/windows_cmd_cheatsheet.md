# Windows コマンドプロンプト便利コマンド集（完全版）

## 📂 ファイル・ディレクトリ操作
```cmd
cd                # 現在のディレクトリを表示
cd <dir>          # ディレクトリ移動
cd ..             # 一つ上のディレクトリへ移動
dir               # ファイル・ディレクトリ一覧を表示
mkdir <dir>       # ディレクトリ作成
rmdir <dir>       # ディレクトリ削除（空のみ）
rmdir /s <dir>    # ディレクトリ削除（中身ごと）
copy <src> <dst>  # ファイルをコピー
move <src> <dst>  # ファイルやディレクトリを移動/名前変更
del <file>        # ファイル削除
```

---

## 📄 ファイル内容確認
```cmd
type <file>       # ファイル内容を表示
more <file>       # ページ送りで表示
fc <file1> <file2> # 2つのファイルの内容を比較
```

---

## 🔍 検索・探索
```cmd
dir /s <file>         # カレント以下からファイルを検索
find "keyword" <file> # ファイル内から文字列検索
findstr "keyword" <file> # より高機能な文字列検索
tree /f               # ディレクトリ構造をツリー表示（ファイルも表示）
```

---

## ⚙️ システム関連
```cmd
cls               # 画面をクリア
echo %cd%         # 現在のディレクトリを表示
echo %username%   # ユーザー名を表示
echo %path%       # PATH 環境変数を表示
exit              # コマンドプロンプトを終了
```

---

## 🖥️ システム情報・ネットワーク
```cmd
systeminfo         # OSやメモリなどPC情報を表示
hostname           # コンピュータ名を表示
ipconfig           # ネットワーク設定を表示
ipconfig /all      # 詳細情報を表示
ipconfig /release  # IPアドレスを解放
ipconfig /renew    # IPアドレスを再取得
ping <host>        # ネットワーク接続確認
tracert <host>     # 通信経路を調べる
netstat -an        # ポートの使用状況を表示
```

---

## ⏳ バッチ処理やスクリプトで便利
```cmd
echo Hello World   # メッセージ表示
echo off           # コマンドの表示を抑制（バッチでよく使う）
pause              # 「続行するには何かキーを押してください...」で停止
timeout 10         # 10秒待つ（Ctrl+Cでキャンセル可能）
```

---

## 📂 ナビゲーション・ショートカット
```cmd
start .            # 現在のフォルダをエクスプローラで開く
start <file>       # 既定アプリでファイルを開く
explorer .         # エクスプローラを開く
```

---

## 🛠️ 管理系
```cmd
tasklist           # 実行中のプロセス一覧
taskkill /PID 1234 /F   # プロセスを強制終了
chkdsk             # ディスクのエラーチェック
sfc /scannow       # システムファイルの整合性チェック
attrib <file>      # ファイル属性を確認
attrib +r <file>   # 読み取り専用にする
attrib -r <file>   # 読み取り専用を解除
```

---

## 📦 圧縮・解凍（PowerShell）
cmd単体には zip/unzip 機能がないため、PowerShell コマンドを利用：
```powershell
Compress-Archive -Path <dir> -DestinationPath a.zip   # zip圧縮
Expand-Archive -Path a.zip -DestinationPath <dir>     # zip解凍
```

---

## 🌱 Git（別途インストール必須）
```cmd
git status         # 状況を確認
git add .          # 変更をステージ
git commit -m "msg" # コミット
git push           # リモートに反映
git pull           # 最新を取得
```
