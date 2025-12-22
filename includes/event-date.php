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
 * @param WP_Post $post 現在の投稿オブジェクト
 */
function headfirst_render_event_date_meta_box( $post ) {
	// nonceフィールドを追加（CSRF対策）
	wp_nonce_field( 'event_date_meta_box', 'event_date_meta_box_nonce' );

	// 現在の値を取得
	$event_date = get_post_meta( $post->ID, 'event_date', true );
	?>
	<p>
		<label for="event_date_field">
			イベント開催日を入力してください。<br>
			<small>ブロックエディターで「イベント日」ブロックを追加すると、この値が表示されます。</small>
		</label>
	</p>
	<p>
		<input
			type="date"
			id="event_date_field"
			name="event_date"
			value="<?php echo esc_attr( $event_date ); ?>"
			class="widefat"
		/>
	</p>
	<?php
}

/**
 * メタボックスからの保存処理
 *
 * save_post フックで投稿保存時にメタデータを保存する。
 *
 * 注意: ブロックエディターからの保存（REST API経由）では
 * このフックは呼ばれず、register_post_meta() の設定が使われる。
 * このフックはクラシックエディターやメタボックスからの保存用。
 *
 * @param int $post_id 投稿ID
 */
add_action( 'save_post', function( $post_id ) {
	// nonceチェック
	if ( ! isset( $_POST['event_date_meta_box_nonce'] ) ) {
		return;
	}
	if ( ! wp_verify_nonce( $_POST['event_date_meta_box_nonce'], 'event_date_meta_box' ) ) {
		return;
	}

	// 自動保存時は何もしない
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// 権限チェック
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// 値を保存
	if ( isset( $_POST['event_date'] ) ) {
		update_post_meta(
			$post_id,
			'event_date',
			sanitize_text_field( $_POST['event_date'] )
		);
	}
} );
