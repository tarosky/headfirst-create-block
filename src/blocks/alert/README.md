# Alert Block

Bootstrapのアラートスタイルを切り替えられるブロックです。

## このブロックで学べること

### 1. 別でregister_styleしたもの（Bootstrap）を利用できる

ブロック専用のCSSを書かなくても、PHPで事前に登録した外部スタイルを利用できます。

**block.json での指定:**
```json
{
  "style": "bootstrap"
}
```

この `"bootstrap"` は、PHPで `wp_register_style('bootstrap', ...)` として登録されたスタイルハンドル名です。
これにより、以下のような利点があります：

- **再利用性**: 複数のブロックで同じスタイルライブラリを共有できる
- **メンテナンス性**: CSSのバージョン管理を一箇所で行える
- **パフォーマンス**: 同じスタイルを複数回読み込まない

### 2. 「スタイル」という基本的なプロパティを切り替えると見た目が変わる

WordPressのブロックスタイル機能を使うと、エディターのUIで簡単にスタイルを切り替えられます。

**block.json での定義:**
```json
{
  "styles": [
    {
      "name": "primary",
      "label": "Primary（青）",
      "isDefault": true
    },
    {
      "name": "danger",
      "label": "Danger（赤）"
    }
  ]
}
```

この定義だけで、WordPressが自動的に以下を行います：

1. **エディターUI**: スタイル切り替えボタンを表示
2. **クラス付与**: 選択したスタイルに応じて `is-style-{name}` クラスを自動付与
3. **保存**: 選択したスタイルをpost_contentに保存

## 技術的な仕組み

### クラス名の自動付与と変換

WordPressは選択されたスタイルに応じて `is-style-{name}` クラスを自動的に追加します：

```
Primary選択 → is-style-primary
Danger選択 → is-style-danger
```

このクラスをBootstrapの `alert-{type}` クラスに変換する必要があります。

**変換関数（index.js より）:**
```javascript
function getAlertClass( className ) {
  // is-style-primary → alert-primary に変換
  const match = className?.match( /is-style-(\w+)/ );
  return match ? `alert-${ match[ 1 ] }` : 'alert-primary';
}
```

### 最終的な出力

スタイルで「Danger（赤）」を選択した場合の出力HTML：

```html
<div class="wp-block-tarosky-alert is-style-danger alert alert-danger">
  アラートメッセージ
</div>
```

- `wp-block-tarosky-alert`: ブロック識別用（WordPress自動付与）
- `is-style-danger`: スタイル識別用（WordPress自動付与）
- `alert alert-danger`: Bootstrap用（コードで実装）

## 実装のポイント

### editとsaveを1ファイルに統合

このブロックでは、学習のシンプルさを優先して `edit` と `save` を別ファイルに分けず、`index.js` 内に直接記述しています。

```javascript
registerBlockType( metadata.name, {
  edit( { attributes, setAttributes } ) {
    // エディター内の表示
  },
  save( { attributes } ) {
    // 保存時のHTML
  },
} );
```

小規模なブロックではこの方式で十分です。複雑になったら分離を検討しましょう。

### RichTextでコンテンツを編集可能に

`RichText` コンポーネントを使うことで、ユーザーがブロック内のテキストを直接編集できます。

```javascript
<RichText
  tagName="div"
  value={ attributes.content }
  onChange={ ( content ) => setAttributes( { content } ) }
  placeholder="アラートメッセージを入力..."
/>
```

## 参考リンク

- [Block Styles API](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/)
- [Block Metadata: style property](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#style)
- [Bootstrap Alerts](https://getbootstrap.com/docs/5.3/components/alerts/)
