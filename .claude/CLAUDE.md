# headfirst-create-block 開発ガイド

このリポジトリで作業する前に、必ず `README.md` に目を通してください。
WordPress create-block の学習用リポジトリです。

## 環境

- **Docker**: wp-env を使用してWordPress環境を構築 http://localhost:8888
- **Node.js**: Voltaで管理（package.jsonでバージョン指定）
- **ログイン情報**: ユーザー名 `admin` / パスワード `password`

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# ブロックのビルド（本番用）
npm run build

# WordPress環境の起動
npm start

# WordPress環境の停止
npm stop

# 開発時の変更監視
npm run watch

# PHPエラーログの確認
npm run log:php

# WP-CLIコマンドの実行
# 以下は wp user list --role=administrator 相当。オプションはダブルハイフンを使う
npm run cli user list -- --role=administrator
```

## リント・フォーマット

コードの品質チェックには `@wordpress/scripts` のリントツールを使用します。

```bash
# JS と CSS 両方をチェック
npm run lint

# JavaScript のみチェック
npm run lint:js

# SCSS のみチェック
npm run lint:css

# JavaScript の自動修正
npm run format:js

# SCSS の自動修正
npm run format:css
```

**対象ファイル:**
- `src/blocks/**/*.js`, `src/js/**/*.js`
- `src/blocks/**/*.scss`, `src/scss/**/*.scss`

コードを変更したら、コミット前に `npm run lint` を実行してください。

**設定ファイル:**
- `.eslintrc` - ESLint設定（`@wordpress/eslint-plugin/recommended-with-formatting`を継承）
- `stylelint.config.js` - Stylelint設定（`@wordpress/stylelint-config/scss`を継承）

ルールをカスタマイズする場合はこれらのファイルを編集してください。

## ブロックの追加ルール

### ディレクトリ構造

ブロックは `src/blocks/` 以下に配置します。

```
src/blocks/
├── sample/          # サンプルブロック
├── hero-unit/       # ヒーローユニット
└── [新しいブロック]/
```

### 新規ブロックの作成

以下のコマンドでブロックの雛形を生成します：

```bash
npx @wordpress/create-block [ブロック名] \
  --no-plugin \
  --namespace tarosky \
  --textdomain tarosky \
  --target-dir src/blocks/[ブロック名] \
  --title "ブロックのタイトル"
```

**必須オプション:**
- `--no-plugin`: 単体プラグインではなく、既存プラグインへの追加
- `--namespace tarosky`: 名前空間は `tarosky` で統一
- `--target-dir src/blocks/[name]`: 出力先ディレクトリ

### カスタムブロックを作る前に

以下の軽量な方法で要件を満たせないか、先に検討してください：

1. **ブロックスタイル**: 既存ブロックにCSSクラスを追加するだけ → `src/js/styles.js`
2. **ブロックバリエーション**: プリセット設定済みのブロック → `src/js/cta-button.js`
3. **ブロックパターン**: 複数ブロックの組み合わせテンプレート

カスタムブロックが必要なケース：
- 独自の attributes を持つUIが必要
- サーバーサイドでの動的レンダリングが必要
- InnerBlocks を使った複雑な構造が必要
