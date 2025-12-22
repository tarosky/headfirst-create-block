<?php
/**
 * ブロックスタイル拡張の読み込み
 *
 * コアブロックにカスタムスタイルを追加するための処理。
 * - エディター: JSでスタイルを登録 + CSSで見た目を定義
 * - フロントエンド: CSSで見た目を定義
 *
 * @package headfirst-create-block
 */

defined( 'ABSPATH' ) or die();

/**
 * ブロックエディターでスタイル登録用JS(build/js/styles.js)を読み込む
 *
 * enqueue_block_editor_assets フック:
 * - ブロックエディターが読み込まれるときに実行される
 * - 管理画面の投稿編集ページでのみ発火する
 * - フロントエンドでは実行されない
 *
 * @see https://developer.wordpress.org/reference/hooks/enqueue_block_editor_assets/
 */
add_action( 'enqueue_block_editor_assets', function() {
	// wp-dependencies.json で登録されたハンドル名を使用
	// 依存関係（wp-blocks, wp-dom-ready）は自動的に読み込まれる
	wp_enqueue_script( 'ts-block-style' );
} );

/**
 * エディターとフロントエンド両方でスタイル用CSS(build/css/styles.css)を読み込む
 *
 * enqueue_block_assets フック:
 * - ブロックエディターとフロントエンドの両方で実行される
 * - ブロックが使用されているかどうかに関係なく読み込まれる
 *
 * 注意: ブロックが使用されている場合のみ読み込みたい場合は、
 * wp_enqueue_block_style() を使用する方法もある。
 *
 * @see https://developer.wordpress.org/reference/hooks/enqueue_block_assets/
 */
add_action( 'enqueue_block_assets', function() {
	// wp-dependencies.json で登録されたハンドル名を使用
	wp_enqueue_style( 'ts-style' );
} );
