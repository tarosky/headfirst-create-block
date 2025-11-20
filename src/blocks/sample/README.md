# Sample Block

`@wordpress/create-block` で生成される基本的なブロックのテンプレートです。
各ファイルのコメントを日本語訳しており、ブロック開発の基礎を学べます。

## このブロックで学べること

### 1. ブロックの基本構造

WordPressブロックは以下のファイルで構成されます：

```
sample/
├── block.json      # ブロックの設定ファイル（核心）
├── index.js        # エントリーポイント（ブロック登録）
├── edit.js         # エディター内での表示
├── save.js         # 保存時のHTML出力
├── editor.scss     # エディター専用スタイル
├── style.scss      # 共通スタイル（フロントエンド＋エディター）
└── view.js         # フロントエンド用JavaScript（オプション）
```

### 2. block.json の重要性

`block.json` はブロックのメタデータを定義する核心的なファイルです。
以前はJavaScriptとPHPで二重に設定していましたが、JSONファイルで一元管理できるようになりました。

**主要なプロパティ:**
```json
{
  "name": "tarosky/sample",
  "title": "Sample Block",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": "file:./view.js"
}
```

- `editorScript`: エディター内で実行されるJavaScript（必須）
- `editorStyle`: エディター専用のCSS
- `style`: フロントエンド＋エディター共通のCSS
- `viewScript`: フロントエンドで実行されるJavaScript

### 3. edit.js と save.js の分離

このブロックでは、エディター表示と保存HTML出力を別ファイルに分けています。

**edit.js（エディター内の表示）:**
```javascript
export default function Edit() {
  return (
    <p { ...useBlockProps() }>
      { __( 'Sample Block – hello from the editor!', 'tarosky' ) }
    </p>
  );
}
```

**save.js（保存時のHTML）:**
```javascript
export default function save() {
  return (
    <p { ...useBlockProps.save() }>
      { 'Sample Block – hello from the saved content!' }
    </p>
  );
}
```

**メリット:**
- **関心の分離**: それぞれの役割が明確
- **メンテナンス性**: 修正箇所を見つけやすい
- **スケーラビリティ**: 複雑なブロックでも管理しやすい

**デメリット:**
- **ファイル数増加**: 小規模なブロックでは過剰になることも

→ 小規模なブロックでは1ファイルにまとめてもOK（alertブロック参照）

### 4. スタイルの使い分け

2つのSCSSファイルで、適用範囲を使い分けます。

**editor.scss（エディター専用）:**
```scss
.wp-block-tarosky-sample {
  border: 1px dotted #f00;  // 赤い点線で編集範囲を明示
}
```
- エディター内で編集中だとわかりやすくする
- フロントエンドには表示されない

**style.scss（共通）:**
```scss
.wp-block-tarosky-sample {
  background-color: #21759b;  // 青背景
  color: #fff;
  padding: 2px;
}
```
- フロントエンド＋エディター両方に適用
- ブロックの基本的な見た目

### 5. ビルドプロセスとwebpackの役割

**開発時の記述（src/）:**
```javascript
// edit.js
import './editor.scss';  // ← webpackへの指示
```

**webpackの処理:**
1. `import './editor.scss'` を発見
2. SCSSをCSSにコンパイル
3. `index.css` として出力

**ビルド後（build/）:**
```
sample/
├── index.js         # edit.js, save.js, index.js がバンドルされたもの
├── index.css        # editor.scss がコンパイルされたもの
├── style-index.css  # style.scss がコンパイルされたもの
└── block.json       # コピーされたもの
```

**重要なポイント:**
`import './editor.scss'` は**ブラウザではなくwebpackへの指示**です。
ビルド後は消えて、代わりにコンパイルされたCSSファイルが生成されます。

### 6. WordPress APIの基本

**useBlockProps():**
ブロックのラッパー要素に必要なprops（クラス名など）を提供します。

```javascript
// エディター内
<div { ...useBlockProps() }>

// 保存時
<div { ...useBlockProps.save() }>
```

**__() 関数:**
テキストを翻訳可能にする国際化（i18n）関数です。

```javascript
import { __ } from '@wordpress/i18n';

__( 'Sample Block – hello from the editor!', 'tarosky' )
```

## ファイルごとの詳細

### block.json
ブロックのメタデータを定義。WordPressとビルドツールの両方が参照します。

### index.js
エントリーポイント。`registerBlockType()` でブロックを登録し、edit/saveをインポートします。

### edit.js
エディター内でのブロックの見た目と振る舞いを定義します。ユーザーがブロックを編集するときの表示です。

### save.js
保存時のHTML出力を定義します。`post_content` に保存される最終的なマークアップです。

### editor.scss
エディター専用スタイル。編集範囲を明示するボーダーなど、エディターでのみ必要なスタイルを記述します。

### style.scss
共通スタイル。フロントエンドとエディターの両方に適用される、ブロックの基本的な見た目を記述します。

### view.js
フロントエンドで実行されるJavaScript。タブ切り替えなど、動的な機能が必要な場合に使用します。不要なら削除してOKです。

## WordPress への登録

PHPで `register_block_type()` を呼び出すだけで登録できます：

```php
register_block_type( __DIR__ . '/build/blocks/sample/block.json' );
```

WordPressが `block.json` を読み込み、必要なアセット（JS/CSS）を自動的にエンキューします。

## 参考リンク

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block Metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [@wordpress/create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/)
- [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
