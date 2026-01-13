<?php
/**
 * イベント日カスタムフィールドの登録
 *
 * このファイルでは、投稿に紐づくカスタムフィールド（post_meta）を
 * REST API経由で利用できるようにし、メタボックスでの編集UIを提供する。
 *
 * ブロックエディターでは useEntityProp() フックを使って
 * この値を読み書きできる。
 *
 * @package headfirst-create-block
 */

defined( 'ABSPATH' ) or die();

/**
 * カスタムフィールドを登録する
 *
 * register_post_meta() を使用して post_meta を登録する。
 * show_in_rest を true にすることで、REST API 経由で
 * ブロックエディターからアクセス可能になる。
 *
 * 重要なパラメータ:
 * - show_in_rest: true にしないとブロックエディターから読み書きできない
 * - single: true = 単一の値、false = 配列
 * - type: 値の型（string, integer, boolean, number, array, object）
 *
 * @see https://developer.wordpress.org/reference/functions/register_post_meta/
 */
add_action( 'init', function() {
	register_post_meta(
		'post', // 対象の投稿タイプ（空文字列で全投稿タイプ）
		'event_date', // メタキー名
		[
			// REST API で公開する（ブロックエディターで使うには必須）
			'show_in_rest'  => true,

			// 単一の値として扱う（get_post_meta の第3引数が true 相当）
			'single'        => true,

			// 値の型
			'type'          => 'string',

			// デフォルト値
			'default'       => '',

			// サニタイズコールバック（保存時に実行）
			'sanitize_callback' => 'sanitize_text_field',

			// 認証コールバック（編集権限のチェック）
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		]
	);
} );

/**
 * メタボックスを追加する
 *
 * add_meta_box() を使用して、投稿編集画面にメタボックスを追加する。
 * これはブロックエディター以前からある従来の方法。
 *
 * ブロックエディターではサイドバー下部に表示される。
 *
 * @see https://developer.wordpress.org/reference/functions/add_meta_box/
 */
add_action( 'add_meta_boxes', function() {
	add_meta_box(
		'event_date_meta_box',              // メタボックスのID
		'イベント日',                        // タイトル
		'headfirst_render_event_date_meta_box', // 表示用コールバック
		'post',                             // 表示する投稿タイプ
		'side',                             // 表示位置（normal, side, advanced）
		'high'                              // 優先度（high, core, default, low）
	);
} );

/**
 * メタボックスの内容を表示する
 *
 * React コンポーネントをマウントするためのコンテナのみを出力する。
 * 実際のUIは JavaScript (meta-box.js) で描画され、
 * useEntityProp を使って保存される。
 *
 * @param WP_Post $post 現在の投稿オブジェクト
 */
function headfirst_render_event_date_meta_box( $post ) {
	?>
	<div id="event-date-meta-box-root">
		<!-- React コンポーネントがここにマウントされる -->
		<p>読み込み中...</p>
	</div>
	<?php
}

