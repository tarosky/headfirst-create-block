<?php
/**
 * Plugin Name: はじめてのクリエイトブロック
 * Plugin URI: https://github.com/tarosky/headfirst-create-block
 * Description: wp create blockの学習用リポジトリ
 * Author: Tarosky INC.
 * Version: nightly
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author URI: https://tarosky.co.jp/
 * License: GPL3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: llm-chain
 * Domain Path: /languages
 */

defined( 'ABSPATH' ) or die();

/**
 * ブロックを全部読み込む
 */
add_action( 'init', function () {
	$blocks_dir = __DIR__ . '/build/blocks';
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

/**
 * ブロックにカテゴリーを登録する
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#managing-block-categories
 */
add_filter( 'block_categories_all', function ( $categories ) {
	$new_categories = [];
	foreach ( $categories as $category ) {
		if ( 'widgets' === $category['slug'] ) {
			$new_categories[] = [
				'slug'  => 'tarosky',
				'title' => 'Tarosky',
				'icon'  => 'building',
			];
		}
		$new_categories[] = $category;
	}
	return $new_categories;
} );

/**
 * 外部のリソースを追加する
 */
add_action( 'init', function() {
	// twitter bootstrap
	// @see https://getbootstrap.jp/docs/5.3/getting-started/introduction/
	wp_register_style( 'bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', [], null, 'screen' );

	// Chart.js
	// @see https://www.chartjs.org/
	wp_register_script( 'chart-js', 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js', [], '4.4.0', true );
} );

/**
 * グラフブロックが使われているときにChart.jsを読み込む
 */
add_filter( 'render_block', function( $block_content, $block ) {
	// グラフブロックの場合、Chart.jsをエンキュー
	if ( 'tarosky/chart' === $block['blockName'] ) {
		wp_enqueue_script( 'chart-js' );
	}
	return $block_content;
}, 10, 2 );

/**
 * 天気情報ブロックのAPI設定を読み込む
 */
require_once __DIR__ . '/includes/setting-weather.php';
