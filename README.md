# headfirst-create-block

[wp create block](https://ja.wordpress.org/team/handbook/block-editor/reference-guides/packages/packages-create-block/) の学習用リポジトリです。

## 学習する理由

タロスカイではこのツールをブロック作成の基本としています。理由は以下の通りです。

- WordPress公式でサポートされているブロック作成方法である。
- gutenbergプロジェクトがこのツールを元に開発されており、構成などが似ている（この手法に慣れる＝コアの開発チームの手法に慣れる）
- ドキュメント化されており、生成AIなどのツールもその利用方法を理解するのが早い。

## このリポジトリで学べること

1. create blockとは何か
2. ブロックの作り方と典型的なパターン
3. **ブロックを作らずにカスタマイズする方法**
4. 関連するエコシステム

npmパッケージで配布されているので、プロジェクトで依存関係に含めます。
また、ビルドのためには [@wordpress/scripts](https://ja.wordpress.org/team/handbook/block-editor/getting-started/devenv/get-started-with-wp-scripts/) も必要なので、あわせてインストールします。

### インストール方法

まず、このリポジトリをクローンします。Git, Docker, node（できれば [Volta](https://volta.sh/) ）が必要です。

```bash
git clone git@github.com:tarosky/headfirst-create-block.git
```

つづいて、npmパッケージをインストールします。
必要なnodeのバージョンはpackage.jsonに書いてあります。

```bash
npm install
```

つづいて、ブロックをビルドしてみましょう。

```bash
npm run build
```
`build` ディレクトリが作成され、jsやCSSが生成されていることを確認します。

ビルドが完了したら、WordPressを立ち上げます。

```bash
npm start
```

Dockerが立ち上がり、URLが表示されます。

**ログイン情報（wp-envのデフォルト）:**
- ユーザー名: `admin`
- パスワード: `password`

### 動作を確認する

実際にブロックがあるのでブロックエディターから登録してみましょう。

このリポジトリの `blocks` 以下にブロックが登録されています。
これらはそれぞれ `README.md` に特徴が書いてあります。
まずは `sample` ブロックから見てみてください。

### 自分のブロックを作ってみる

以下のセクションを読み、`src/blocks` に自分のブロックを追加してみましょう。

## ブロックを作る以外の方法

カスタムブロックを作成する前に、以下の3つの方法で要件を満たせないか検討しましょう。
これらの方法は、カスタムブロックを作るよりも軽量で、メンテナンスコストも低くなります。

### 1. ブロックスタイル（Block Styles）

既存のコアブロックに**CSSクラスを追加するだけ**のカスタマイズ。

```js
// セパレーターブロックに「グラデーション」スタイルを追加
registerBlockStyle( 'core/separator', {
    name: 'gradient',
    label: 'グラデーション',
} );
```

- **用途**: 見た目のバリエーションを増やしたいとき
- **実装**: `registerBlockStyle()` でスタイル登録 + CSSで見た目を定義
- **例**: このリポジトリの `src/js/styles.js` と `src/scss/styles.scss`

### 2. ブロックバリエーション（Block Variations）

既存のコアブロックを**プリセット設定済みの「別のブロック」**として挿入パネルに表示する。

```js
// ボタンブロックに「CTAボタン」バリエーションを追加
registerBlockVariation( 'core/button', {
    name: 'cta-arrow',
    title: 'CTAボタン（矢印付き）',
    attributes: {
        className: 'is-cta-arrow',
    },
} );
```

- **用途**: 特定の設定を持つブロックを簡単に挿入できるようにしたいとき
- **実装**: `registerBlockVariation()` でバリエーション登録
- **例**: このリポジトリの `src/js/cta-button.js`

### 3. ブロックパターン（Block Patterns）

複数のブロックを組み合わせた**テンプレート**を登録する。

```php
register_block_pattern( 'my-plugin/hero-section', [
    'title'      => 'ヒーローセクション',
    'categories' => [ 'featured' ],
    'content'    => '<!-- wp:group -->...<!-- /wp:group -->',
] );
```

- **用途**: よく使うブロックの組み合わせを再利用したいとき
- **実装**: `register_block_pattern()` でパターン登録
- **注意**: コンテンツがHTMLで長くなるため、コードでの管理は難しい。管理画面の「パターン」機能で作成・管理する方が実用的

### カスタムブロックを作るべきとき

上記3つの方法で対応できない場合にのみ、カスタムブロックを作成しましょう。

| カスタムブロックが必要なケース |
|------------------------------|
| 独自の属性（attributes）を持つUI が必要 |
| サーバーサイドでの動的なレンダリングが必要（例: APIからデータ取得） |
| InnerBlocks を使った複雑な構造が必要 |
| 既存ブロックでは実現できない編集体験が必要 |

## ブロックの動作原理

ブロックが動作する原理は以下の通りです。

### ブロックの作成

`create-block` はブロックを作るのに必要な雛形を一気に出力してくれるコマンドです。
このリポジトリはプラグインとして管理しているので、「このプラグインにブロックを1つ追加する」場合を考えてみましょう。
ここでは、`src/blocks/*` にブロックを追加していきます。
`tarosky/alert` というブロックを作る場合は以下の通り。

```bash
npx @wordpress/create-block alert --no-plugin --namespace tarosky --textdomain tarrosky --target-dir src/blocks/alert --title "アラート"
```

- `--no-plugin` このオプションを指定しない場合、通常は1つのブロックを持つプラグイン作成しようとします。タロスカイでは「既存のテーマやプラグインにブロックを追加する」というユースケースがほとんどだと思われるので、このオプションを指定します。
- `--namespace` ブロックの名前空間を指定します。プラグインやテーマなどで統一のものになると思います。
- `--target-dir` ブロックを書き出すディレクトリを指定します。既存のアセットが入っているディレクトリがよいでしょう。ただし、JSなどとは分けるべきです（`src/js`, `src/scss` があるなら、`src/blocks`にするなど）

上記のコマンドでは、`src/blocks/alert` というディレクトリに次のようなファイルが生成されます。

```
src/blocks/alert
├── block.json　# 設定ファイル
├── edit.js # エディターでのブロックの見た目を表現するファイル
├── editor.scss # エディター用CSS
├── index.js # ルートJS
├── save.js # ルートJS
└── style.scss # 共通で読み込まれるCSS
```

この中で核心的なものは `block.json` になります。
以前はJavasScriptとPHPそれぞれで設定を行っていましたが、JSONファイルを介することで二重指定がなくなりました。
詳細な設定項目は [公式ドキュメント](https://ja.wordpress.org/team/handbook/block-editor/reference-guides/block-api/block-metadata/) に譲りますが、
頻繁にカスタマイズ対象になるオプションについてだけ説明します。

```json
{
  "attributes": {
    "number": {
      "type": "number",
      "default": 5
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "viewStyle": [ "file:./view.css", "example-view-style" ],
  "render": "file:./render.php",
  "viewScript": [ "file:./view.js", "jquery" ]
}
```

まず、 `attributes` ですが、これはブロックに渡される設定値です。
カスタムブロックでなんらかのリストを表示するとき、「件数」を指定したいようなケースがあります。
その場合、`attributes` として設定し、ブロックから参照できるようにします。
リファレンスは [ブロックAPIリファレンス](https://ja.wordpress.org/team/handbook/block-editor/reference-guides/block-api/block-attributes/) を参照してください。
なお、[サポート](https://ja.wordpress.org/team/handbook/block-editor/reference-guides/block-api/block-supports/)を追加することでアラインメント、背景色などは設定できるので、属性はあくまで独自のものに限るようにしましょう。

つづいて、JSおよびCSSの読み込み設定です。以下の項目を単体の文字列または配列で指定できます。

- `wp_register_script()`, `wp_register_style()` で登録されたハンドル名。
- `block.json` からの相対パス `file:./index.js`

**注意点:** 相対パスで指定したCSSおよびJSはインラインでheadタグに書き出されることに留意しましょう。
ページAとページBを見たときにブラウザキャッシュが活用されません。

| プロパティ名 | 読み込まれる箇所 | 必須 | 用途 |
| --------- | ------------ | --- | ---- |
| editorScript | ブロックエディター | ◯ | エディターのUIを作る |
| script | 共通 | - | ブロックを動かすとき必要（タブとか？） |
| viewScript | 公開画面 | - | 表示画面でだけ使う場合 |
| editorStyle | ブロックエディター | - | エディターのUIに適用（差分を吸収など） |
| style | 共通 | - | ブロックの基本的なスタイルを定義 |
| viewStyle | 公開画面 | - | テーマに依存したスタイル |

よく使うのは `editorScript` と `style` です。他は必要があれば定義しましょう。

`render` でPHPファイルを指定できますが、ここで指定されたPHPには `$attributes`, `$content`, `$block`が渡されるので、ブロックを出力します。
エディター側でHTMLをブロックに保存してもよいのですが、PHPによるサポート（例・外部リソースの取得など）が必要な場合はこれを活用しましょう。

### ビルド

`wp-scripts` コマンドを使ってビルドします。たとえば、 `src/blocks` にブロックがあり、それを `build/blocks` にビルドするには、次のようなコマンドを打ちます。

```
npx wp-scripts build --source-path=src/blocks --output-path=build/blocks 
```

頻繁に実行するなら、変更監視つきで `package.json` に定義しておくと良いでしょう。
このリポジトリでは `build` と `watch` を定義していますが、他にも使っているものが多いなら

```json
{
  "scripts": {
    "block:build": "wp-scripts build --source-path=src/blocks --output-path=build/blocks",
    "block:watch": "wp-scripts start --source-path=src/blocks --output-path=build/blocks",
  }
}
```

ビルドした結果、次のようなファイルが出力されます。

```
build/blocks/hero-unit
├── block.json
├── index-rtl.css
├── index.asset.php
├── index.css
├── index.js
└── render.php
```

`render.php` はそのままコピーされたもの、`index.asset.php` は依存関係を記載したファイルです。次のような内容になります。

```php
<?php return array('dependencies' => array('react-jsx-runtime', 'wp-block-editor', 'wp-blocks', 'wp-components', 'wp-i18n'), 'version' => '5adb16fe33a92d920185');
```

なぜこのファイルが出力されるのかと、どういう原理なのかを簡単に説明します。
ブロックはES Moduleの書き方で次のように記載できます。

```js
import { __ } from "@wordpress/i18n";
```

現在のブラウザではこれだけだとES Moduleでのインポートができないので、`wp-scripts` はビルド時に次のように書き換えます。  
※この書き換え対象になるのはWordPressコアが提供しているものに限ります。

```js
const { __ } = wp.i18n;
```

さら、このブロックの前に `wp_enqueue_script` で `wp-i18n` が依存関係にあることを明示しなければならないので、そのためのファイルを `index.asset.php` に書き出している、というわけです。

### WordPressからの読み込み

WordPressでこのブロックを読み込むには、 `register_block_type( $path_of_block_json )` を実行するだけです。
複数のブロックがあることを考慮すると、スキャンして読み込むのがよいでしょう。

```php
/**
 * ブロックを全部読み込む
 */
add_action( 'init', function () {
	$blocks_dir = get_template_directory() . '/build/blocks';
	// ブロックのディレククトリをスキャン
	foreach ( scandir( $blocks_dir ) as $block_name ) {
		// 隠しファイルかディレクトリパスならスキップ
		if ( '.' === $block_name[0] ) {
			continue;
		}
		$block_json = $blocks_dir . '/' . $block_name . '/block.json';
		if ( ! file_exists( $block_json ) ) {
			continue;
		}
		// ブロックを登録する
		register_block_type( $block_json );
	}
} );
```

これでブロックが登録され、使えるようになります。
このリポジトリではプラグインメインファイル `headfirst-create-block.php` の中でこの処理を行っています。
JavaScriptでもPHPでも `register_block_type()` を行うのは変なので、近い将来変わる可能性があります。
