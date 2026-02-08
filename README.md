# 書籍注文用紙作成用ページ

## 1. 目的

書店に提出する注文票を作るためのSPAページ.
ISBNを入力するとopenBD APIを用いて、以下情報を取得し、注文票を作成する

- ISBN
- 著者
- 書名
- 出版社

注文票は複数作成可能で、それを縦に並べ、印刷することができる

## Tailwind CSS

このプロジェクトは Tailwind CSS を使用するように設定されています。依存をインストールして開発サーバーを起動してください。

```bash
npm install
npm run dev
```

主な設定ファイル:

- `tailwind.config.cjs` — Tailwind の `content` パスは `index.html` と `src/**/*` を対象にしています。
- `postcss.config.cjs` — `tailwindcss` と `autoprefixer` を有効にしています。
- `src/index.css` — `@tailwind base; @tailwind components; @tailwind utilities;` を読み込み、従来のカスタム CSS を残しています。
