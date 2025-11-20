/**
 * このブロックを含む投稿/ページのフロントエンドで実行したいJavaScriptコードは
 * このファイルに記述します。
 *
 * このファイルを `block.json` の `viewScript` プロパティの値として定義すると、
 * サイトのフロントエンドで読み込まれます。
 *
 * 例:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * プロジェクトでフロントエンドでJavaScriptを実行する必要がない場合は、
 * このファイルを削除し、`block.json` から `viewScript` プロパティを削除してください。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */
 
/* eslint-disable no-console */
console.log("Hello World! (from tarosky-sample block)");
/* eslint-enable no-console */
