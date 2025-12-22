<?php
/**
 * CTAボタン（矢印付き）バリエーションの読み込み
 *
 * Block Variations を使用してコアブロック（core/button）を拡張する。
 *
 * 読み込みの構成:
 * - エディター: バリエーション登録用JS + スタイルCSS
 * - フロントエンド: アニメーション用JS + スタイルCSS（条件付き）
 *
 * @package headfirst-create-block
 */

defined( 'ABSPATH' ) or die();

/**
 * エディターでバリエーション登録用JSを読み込む
 *
 * enqueue_block_editor_assets フック:
 * - ブロックエディターが読み込まれるときに実行
 * - registerBlockVariation() を含むJSを読み込む
 * - これによりエディターの挿入パネルにCTAボタンが表示される
 *
 * @see https://developer.wordpress.org/reference/hooks/enqueue_block_editor_assets/
 */
add_action( 'enqueue_block_editor_assets', function() {
	// cta-button-editor: registerBlockVariation() を含むJS
	// wp-dependencies.json で自動的に依存関係が設定される
	wp_enqueue_script( 'cta-button-editor' );
} );

/**
 * エディターとフロントエンドでスタイルCSSを読み込む
 *
 * enqueue_block_assets フック:
 * - エディターとフロントエンドの両方で実行
 * - CTAボタンのスタイル（矢印の配置など）を適用
 *
 * @see https://developer.wordpress.org/reference/hooks/enqueue_block_assets/
 */
add_action( 'enqueue_block_assets', function() {
	// cta-button-style: CTAボタンのCSS
	wp_enqueue_style( 'cta-button-style' );
} );

/**
 * フロントエンドでアニメーション用JSを条件付きで読み込む
 *
 * wp_enqueue_scripts フック:
 * - フロントエンドでのみ実行（エディターでは実行されない）
 *
 * 条件付き読み込みの実装方法:
 *
 * 方法1: has_block() を使う
 * - 現在の投稿に特定のブロックが含まれているかチェック
 * - 問題点: バリエーションはブロック名では判定できない
 *
 * 方法2: render_block フィルターを使う
 * - ブロックがレンダリングされるたびにフィルターが呼ばれる
 * - バリエーション固有のクラス（is-cta-arrow）を検出できる
 * - より正確な条件判定が可能
 *
 * ここでは方法2を採用する。
 */

/**
 * render_block フィルターでCTAボタンを検出
 *
 * render_block フィルター:
 * - 各ブロックがHTMLにレンダリングされる際に呼ばれる
 * - 第1引数: レンダリングされたHTML
 * - 第2引数: ブロックの情報（名前、属性など）
 *
 * @param string $block_content レンダリングされたブロックのHTML
 * @param array  $block         ブロックの情報
 * @return string フィルター後のHTML（今回は変更なし）
 */
add_filter( 'render_block', function( $block_content, $block ) {
	// core/button ブロック以外はスキップ
	if ( 'core/button' !== $block['blockName'] ) {
		return $block_content;
	}

	// className 属性に 'is-cta-arrow' が含まれているかチェック
	// バリエーションで設定した className を検出
	$class_name = $block['attrs']['className'] ?? '';
	if ( strpos( $class_name, 'is-cta-arrow' ) === false ) {
		return $block_content;
	}

	// CTAボタンが見つかったらviewScriptをキューに追加
	// wp_enqueue_script は複数回呼んでも1回だけ読み込まれる
	wp_enqueue_script( 'cta-button-view' );

	// ブロックのHTMLは変更せずにそのまま返す
	return $block_content;
}, 10, 2 );

/**
 * 別の方法: wp_enqueue_block_style() を使う
 *
 * WordPress 5.9 以降では wp_enqueue_block_style() を使って
 * 特定のブロックが使用されている場合のみスタイルを読み込むことができる。
 *
 * ただし、これはスタイルシート専用の関数であり、
 * スクリプトには使用できない。
 *
 * 例:
 * wp_enqueue_block_style( 'core/button', [
 *     'handle' => 'cta-button-style',
 *     'src'    => plugin_dir_url( __DIR__ ) . 'build/css/cta-button.css',
 * ] );
 */