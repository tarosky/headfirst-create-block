/*!
 * Block Styles Registration
 *
 * コアブロックにスタイルバリエーションを登録するファイル
 *
 * このファイルはブロックエディターで読み込まれ、
 * 既存のコアブロックに新しいスタイルオプションを追加します。
 *
 * @handle ts-block-style
 * @deps wp-blocks, wp-dom-ready
 */

/**
 * wp.blocks - ブロック関連のAPI
 * wp.domReady - DOMが準備完了したときに実行する関数
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dom-ready/
 */
const { registerBlockStyle } = wp.blocks;
const { domReady } = wp;

/**
 * ブロックスタイルの登録
 *
 * domReady() を使う理由:
 * - ブロックエディターが完全に初期化されてからスタイルを登録するため
 * - コアブロックが登録される前にスタイルを追加しようとするとエラーになる
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/
 */
domReady( () => {
	/**
	 * セパレーターブロック（hr）にカスタムスタイルを追加
	 *
	 * コアのセパレーターブロックには以下のデフォルトスタイルがある:
	 * - default: 通常の線
	 * - wide: 幅広の線
	 * - dots: ドット（点線）
	 *
	 * ここでは新しいスタイルを追加する:
	 * - gradient: グラデーションの線
	 * - double: 二重線
	 */

	// グラデーションスタイル
	registerBlockStyle( 'core/separator', {
		name: 'gradient',        // CSSクラス名: is-style-gradient
		label: 'グラデーション',  // エディターに表示される名前
	} );

	// 二重線スタイル
	registerBlockStyle( 'core/separator', {
		name: 'double',
		label: '二重線',
	} );

	// 波線スタイル
	registerBlockStyle( 'core/separator', {
		name: 'wave',
		label: '波線',
	} );
} );