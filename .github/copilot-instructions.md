# Copilot / AI エージェント向け指示

このリポジトリは Vite + React (TypeScript) を使った小さな SPA です。目的は ISBN を入力して openBD などから書誌情報を取得し、印刷用の注文票を作成することです（README.md を参照）。

目的

- すばやくローカルで起動して UI を編集・確認する。
- 重要なファイルやパターンを侵さずに、機能追加やバグ修正を行う。

重要な構成要素（大局）

- ビルドツール: Vite（`vite.config.ts`）
- エントリ: `src/main.tsx`（React のルートマウント）
- UI: `src/App.tsx`（主なコンポーネントがここにある）
- 静的アセット: `public/` と `src/assets/`（`/vite.svg` のようなルート相対インポートに注意）
- Lint: ESLint 設定は `eslint.config.js` にあり、`npm run lint` を通してチェックする。
- パッケージスクリプトは `package.json`（`dev`, `build`, `preview`, `lint`）

開発ワークフロー（すぐ使えるコマンド）

```bash
# 依存インストール
npm install

# 開発サーバー（HMR）
npm run dev

# ビルド（TypeScript のビルド + Vite ビルド）
npm run build

# Lint
npm run lint

# 生成物プレビュー
npm run preview
```

コードベースの発見済みパターン（このプロジェクトに固有）

- Vite のルート相対インポートが混在している点に注意（例: `import viteLogo from '/vite.svg'` と `import reactLogo from './assets/react.svg'` が共存）。ルート相対は `public/` または Vite のルート解決に依存します。
- TypeScript は `tsc -b` を使うスクリプトがあるため、`tsconfig.json` の挙動（プロジェクト参照やビルドオプション）を壊さないこと。
- ESLint の設定は `eslint.config.js` にまとめられている。ルール追加・変更を行う際はこのファイルを更新し、`npm run lint` を必ず通す。

データフローの簡単な説明（読み取り可能な範囲）

- README.md に「ISBN を入力して openBD API を用いて情報取得」とある。現状、プロジェクト内に専用の `services/` ディレクトリや API 呼び出し実装は見つかっていない（追加する場合は `src/` 以下に `services/openbd.ts` 等を作成するのが分かりやすい）。

編集時の具体的注意点と例

- 画面ロジックや UI を編集する場合は `src/App.tsx` を起点に変更する。HMR により `npm run dev` 実行中に即時反映される。
- ルート相対パス（`/vite.svg`）を相対パスに置き換えるときは、ファイルが `public/` にあるか `src/assets/` にあるかを確認する。
- TypeScript 型を追加するときは `tsconfig.json` と依存の `@types/*` を確認し、必要であれば `package.json` に追加する。

テスト関連

- このリポジトリにはテストフレームワークやテストスクリプトは含まれていません。ユニット/統合テストを追加する場合は `vitest` や `jest` の導入を検討してください。

変更を反映する際の手順（推奨）

1. `npm install` を実行
2. `npm run dev` で動作確認
3. 変更を加えたら `npm run lint` を実行してスタイル違反を検出
4. `npm run build` でビルドが通ることを確認

参照すべきファイル

- `package.json`（スクリプトと依存）
- `vite.config.ts`（Viteプラグイン、解決設定）
- `src/main.tsx`, `src/App.tsx`（エントリと主UI）
- `eslint.config.js`（ESLint ポリシー）
- `README.md`（プロジェクトの目的・ユーザ向け説明）

もしこのファイルでカバーが不足している箇所があれば、どの観点（例: API 実装の場所、テスト導入方針、CI 設定）を追加するか教えてください。更新のためのフィードバックをお願いします。
