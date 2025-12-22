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

/**
 * PHPでブロックスタイルを登録する例
 *
 * register_block_style() を使うと、JavaScript を使わずに
 * PHPのみでブロックスタイルを登録できる。
 *
 * JSで登録する場合との違い:
 * - PHP: シンプル、JSファイル不要、翻訳が容易
 * - JS: 動的な処理が可能、クライアントサイドで完結
 *
 * どちらを使うべきか:
 * - 単純なスタイル追加 → PHP（register_block_style）
 * - 複雑なロジックが必要 → JS（registerBlockStyle）
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_style/
 */
add_action( 'init', function() {
	// セパレーターブロックに「波線」スタイルを追加
	// src/js/styles.js では gradient と double を登録し、
	// wave はここで PHP から登録している
	register_block_style(
		'core/separator', // 対象のブロック名
		[
			'name'  => 'wave',  // スタイルの識別子（CSSクラス: is-style-wave）
			'label' => '波線',   // エディターに表示される名前
		]
	);
} );
