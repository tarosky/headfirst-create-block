# Annotation Block

補足情報や注釈を表示するブロックです。**InnerBlocks**を使って、ブロック内に他のブロックをネストできます。

## このブロックで学べること

### 1. InnerBlocksの基本的な使い方

InnerBlocksは、ブロック内に他のブロックをネストできる強力な機能です。カラムブロックやグループブロックなど、WordPressコアの多くのブロックで使用されています。

**edit.js での使用:**
```javascript
import { InnerBlocks } from '@wordpress/block-editor';

export default function Edit() {
  return (
    <aside { ...useBlockProps() }>
      <InnerBlocks />
    </aside>
  );
}
```

**save.js での使用:**
```javascript
export default function save() {
  return (
    <aside { ...useBlockProps.save() }>
      <InnerBlocks.Content />
    </aside>
  );
}
```

**重要なポイント:**
- エディター内では `<InnerBlocks />` を使用
- 保存時は `<InnerBlocks.Content />` を使用（`.Content`を忘れずに！）

### 2. allowedBlocks で許可するブロックを制限

`allowedBlocks` プロパティを使うと、InnerBlocks内に追加できるブロックを制限できます。

```javascript
<InnerBlocks
  allowedBlocks={ [
    'core/heading',
    'core/paragraph',
    'core/list',
    'core/quote',
  ] }
/>
```

**メリット:**
- **ユーザー体験の向上**: 適切なブロックだけを選択肢として表示
- **コンテンツの一貫性**: 意図しないブロックの追加を防ぐ
- **デザインの保持**: レイアウトが崩れにくい

**指定しない場合:** すべてのブロックが追加可能になります

### 3. template で初期レイアウトを定義

`template` プロパティを使うと、ブロック挿入時の初期状態を定義できます。

```javascript
<InnerBlocks
  template={ [
    [ 'core/heading', { level: 4, placeholder: '注釈タイトル' } ],
    [ 'core/paragraph', { placeholder: '注釈の内容を入力...' } ],
  ] }
/>
```

**配列の構造:**
```javascript
[
  [ 'ブロック名', { 属性 }, [ ネストされたブロック ] ],
]
```

**使用例:**
- ヒーローセクション: 見出し＋段落＋ボタンを自動配置
- FAQ: 質問(見出し)＋回答(段落)のペアを配置
- カード: 画像＋見出し＋段落の構造を配置

### 4. templateLock でレイアウトを固定（オプション）

`templateLock` プロパティで、ユーザーがブロックを追加・削除・移動できるかを制御できます。

```javascript
<InnerBlocks
  template={ [...] }
  templateLock="all"  // すべての操作を禁止
/>
```

**オプション:**
- `false`: 制限なし（デフォルト）
- `"all"`: 追加・削除・移動すべて禁止
- `"insert"`: 追加のみ禁止（削除・移動は可能）

**使用例:**
- 固定レイアウトのセクション
- フォーマットが決まったコンテンツ

## InnerBlocksを使った他のブロック例

### カラムブロック
```javascript
// 2カラムのレイアウト
<InnerBlocks
  allowedBlocks={ [ 'core/column' ] }
  template={ [
    [ 'core/column' ],
    [ 'core/column' ],
  ] }
  templateLock="all"
/>
```

### ヒーローセクション
```javascript
<InnerBlocks
  template={ [
    [ 'core/heading', { level: 1, placeholder: 'ヒーロータイトル' } ],
    [ 'core/paragraph', { placeholder: 'サブタイトル' } ],
    [ 'core/buttons' ],
  ] }
  templateLock="insert"
/>
```

## 技術的な仕組み

### editとsaveの対応関係

**エディター内（edit.js）:**
```javascript
<aside>
  <InnerBlocks />  {/* ユーザーが編集可能な領域 */}
</aside>
```

**保存時のHTML（save.js）:**
```javascript
<aside>
  <InnerBlocks.Content />  {/* ネストされたブロックのHTML */}
</aside>
```

**最終的な出力:**
```html
<aside class="wp-block-tarosky-annotation">
  <h4>注釈タイトル</h4>
  <p>注釈の内容がここに表示されます。</p>
</aside>
```

### InnerBlocksの保存メカニズム

InnerBlocksを使用すると、ネストされたブロックのHTMLは自動的にシリアライズされ、`post_content`に保存されます。

```html
<!-- wp:tarosky/annotation -->
<aside class="wp-block-tarosky-annotation">
  <!-- wp:heading {"level":4} -->
  <h4>注釈タイトル</h4>
  <!-- /wp:heading -->

  <!-- wp:paragraph -->
  <p>注釈の内容</p>
  <!-- /wp:paragraph -->
</aside>
<!-- /wp:tarosky/annotation -->
```

コメント形式（`<!-- wp:... -->`）で各ブロックの情報が保存され、再編集時に復元できます。

## よくある間違い

### ❌ save.jsで`.Content`を忘れる
```javascript
// 間違い
<InnerBlocks />

// 正しい
<InnerBlocks.Content />
```

### ❌ edit.jsで`.Content`を使ってしまう
```javascript
// 間違い
<InnerBlocks.Content />

// 正しい
<InnerBlocks />
```

### ❌ templateの構造が間違っている
```javascript
// 間違い: オブジェクトで指定
{ 'core/heading': { level: 4 } }

// 正しい: 配列で指定
[ 'core/heading', { level: 4 } ]
```

## 参考リンク

- [InnerBlocks Reference](https://developer.wordpress.org/block-editor/reference-guides/components/inner-blocks/)
- [Nested Blocks](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/)
- [Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
