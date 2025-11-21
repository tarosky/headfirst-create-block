# グラフブロック（Chart Block）

CSVデータから棒グラフを生成するブロックです。Chart.jsを使用して、フロントエンドでインタラクティブなグラフを表示します。

## 学習のポイント

このブロックでは以下のWordPressブロック開発の重要な概念を学ぶことができます：

### 1. Static Block + view.js パターン

**Dynamic Block（天気ブロック）との違い：**

| 項目 | Static Block（このブロック） | Dynamic Block（天気ブロック） |
|------|---------------------------|---------------------------|
| **save関数** | 必要（HTMLを`post_content`に保存） | 不要 |
| **レンダリング** | 保存したHTMLを表示 | 毎回PHPで動的に生成 |
| **view.js** | フロントエンドのJSを実行 | 使用しない |
| **適している場面** | ユーザー入力データを保存 | 外部APIやDBから最新データ取得 |

**このブロックがStatic Blockである理由：**

- CSVデータはユーザーが入力する「コンテンツ」なので、投稿内容として保存すべき
- グラフの描画はJavaScriptで行うため、HTMLは最小限（`<canvas>`要素のみ）で良い
- 毎回サーバーでレンダリングする必要がない

### 2. view.js（フロントエンドJavaScript）

**view.jsの役割：**

```javascript
// block.json
{
  "viewScript": "file:./view.js"
}
```

このブロックを含むページで`view.js`が自動的に読み込まれ、以下を実行します：

1. ページ内のすべてのグラフブロックを検索（`.wp-block-tarosky-chart__canvas`）
2. 各`<canvas>`要素の`data-csv`属性からCSVデータを取得
3. CSVをパースしてChart.jsでグラフを描画

**重要な設計パターン：**

- **グローバルスコープの汚染を避ける**: 関数をすべてローカルに定義
- **複数ブロックに対応**: `querySelectorAll()`ですべてのブロックを取得
- **読み込みタイミングを制御**: `DOMContentLoaded`や`load`イベントを使用

### 3. 外部JavaScriptライブラリの読み込み

**Chart.jsの登録方法：**

```php
// headfirst-create-block.php
add_action( 'init', function() {
    wp_register_script(
        'chart-js',
        'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
        [],
        '4.4.0',
        true
    );
} );
```

**block.jsonでの依存関係指定：**

`viewScript`プロパティは**配列**で複数のスクリプトを指定できます：

```json
{
  "viewScript": [ "chart-js", "file:./view.js" ]
}
```

この設定により：

1. 最初に`chart-js`（`wp_register_script()`で登録したChart.js）が読み込まれる
2. 次に`view.js`が読み込まれる
3. 依存関係が自動的に解決される

**メリット：**

- ✅ 依存関係がblock.jsonで宣言的に記述される
- ✅ PHPでの`wp_enqueue_script()`が不要
- ✅ ブロックの設定が一箇所に集約される
- ✅ グラフブロックが存在するページでのみChart.jsが読み込まれる

**重要な注意点：**

- `wp_register_script()`で登録したハンドル名（`chart-js`）を使用する
- 配列の順序が重要（依存関係の順に記述）
- 文字列で指定するとそのスクリプトのみ読み込まれる

### 4. データ属性を使ったデータの受け渡し

**save.jsでデータを保存：**

```javascript
<canvas data-csv={ csvData }></canvas>
```

**view.jsでデータを取得：**

```javascript
const csvData = canvas.getAttribute( 'data-csv' );
```

**メリット：**

- HTMLとして保存されるため、JavaScriptがなくても（SEO的に）意味がある
- データの流れが明確（save.js → HTML → view.js）
- JSONなど複雑なデータ構造も文字列化して渡せる

### 5. 編集モードと表示モードの違い

**エディター内（edit.js）:**

- CSVを入力するTextarea
- パースしたデータを**表形式**で簡易プレビュー
- Chart.jsは使用しない（エディター内でグラフを描画しない）

**フロントエンド（view.js）:**

- 保存された`<canvas>`要素
- Chart.jsで実際のグラフを描画

**なぜエディター内でグラフを表示しないのか？**

- Chart.jsの読み込みが遅くなる可能性がある
- エディターのパフォーマンスに影響を与える
- 表形式プレビューでデータの確認は十分できる
- シンプルな設計を保つ

### 6. CSVパース処理

**基本的なCSVパース：**

```javascript
function parseCSV( csvData ) {
    const lines = csvData.trim().split( '\n' );
    const labels = lines[ 0 ].split( ',' ).map( label => label.trim() );
    const values = lines[ 1 ].split( ',' ).map( value => parseFloat( value.trim() ) );
    return { labels, values };
}
```

**注意点：**

- このブロックは2行限定（1行目：ラベル、2行目：値）
- カンマ区切り固定（タブやセミコロンには非対応）
- 引用符やエスケープには非対応
- 実用的にはCSVパースライブラリの使用を推奨

## ファイル構成

```
chart/
├── block.json       # ブロックのメタデータ（attributes, viewScript配列で依存関係指定）
├── index.js         # ブロックの登録（edit + save）
├── edit.js          # エディター表示（CSV入力 + 表プレビュー）
├── save.js          # 保存するHTML（<canvas data-csv="...">）
├── view.js          # フロントエンドJS（Chart.js初期化）
├── style.scss       # フロントエンド + エディター共通スタイル
├── editor.scss      # エディター専用スタイル
└── README.md        # このファイル
```

**重要**:
- Static Blockなので`save.js`が**あります**（Dynamic Blockとの違い）
- `viewScript`を配列で指定することで、Chart.jsへの依存関係を明示的に宣言

## ブロックの動作フロー

### エディター内

1. ユーザーがブロックを挿入
2. `edit.js`がCSV入力用のTextareaを表示
3. ユーザーがCSVデータを入力・編集
4. `parseCSV()`でデータをパース
5. パース成功 → 表形式でプレビュー表示
6. パース失敗 → エラーメッセージを表示

### 保存時

1. ユーザーが投稿を保存
2. `save.js`が実行される
3. `<canvas data-csv="...">` HTMLが生成される
4. このHTMLが`post_content`にシリアライズされる

### フロントエンド

1. 投稿が表示される
2. WordPressが保存されたHTMLを出力
3. `viewScript`配列の順に従って、Chart.jsが読み込まれる
4. 次に`view.js`が実行される
5. すべての`.wp-block-tarosky-chart__canvas`を検索
6. 各canvasの`data-csv`属性からCSVデータを取得
7. CSVをパース
8. Chart.jsでグラフを描画

**重要**: `viewScript: ["chart-js", "file:./view.js"]`の配列順序により、Chart.jsが先に読み込まれることが保証されます。

## 技術仕様

### Chart.js

- **バージョン**: 4.4.0
- **CDN**: https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
- **グラフタイプ**: 棒グラフ（bar）固定
- **読み込み方法**:
  1. PHPで`wp_register_script('chart-js', ...)`により登録
  2. block.jsonの`viewScript: ["chart-js", "file:./view.js"]`で依存関係を宣言
  3. グラフブロックが存在するページでのみ自動的に読み込まれる

### CSVフォーマット

```
ラベル1,ラベル2,ラベル3
10,20,15
```

- 1行目：ラベル（カンマ区切り）
- 2行目：値（カンマ区切りの数値）
- ラベルと値の数は一致する必要がある

### グラフオプション

- レスポンシブ対応
- Y軸は0から開始
- 凡例は非表示
- 6色のカラーパレット（循環使用）

## Static Block vs Dynamic Block まとめ

### Static Block（このブロック）を使うべき場面

✅ ユーザーが入力したデータを保存したい
✅ 投稿の一部としてコンテンツを扱いたい
✅ フロントエンドでJavaScriptを実行したい
✅ サーバーの負荷を減らしたい

### Dynamic Block（天気ブロック）を使うべき場面

✅ 外部APIから最新データを取得したい
✅ データベースから動的にデータを取得したい
✅ ユーザーの状態によって表示を変えたい
✅ サーバーサイドの処理が必要

## 参考リンク

- [Block Editor Handbook - Block Registration](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/)
- [view.js - viewScript](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [wp_register_script() - WordPress Developer Resources](https://developer.wordpress.org/reference/functions/wp_register_script/)
