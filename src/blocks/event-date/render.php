<?php
/**
 * イベント日ブロック - サーバーサイドレンダリング
 *
 * このファイルはブロックがフロントエンドで表示される際に実行される。
 * block.json の "render" で指定されている。
 *
 * 利用可能な変数:
 * - $attributes: ブロックの属性（block.json の attributes で定義されたもの）
 * - $content: ブロックのコンテンツ（InnerBlocks を使う場合）
 * - $block: WP_Block オブジェクト（コンテキストなどを含む）
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#render
 *
 * @var array    $attributes ブロック属性
 * @var string   $content    ブロックコンテンツ
 * @var WP_Block $block      ブロックインスタンス
 */

// 投稿IDを取得（コンテキストから）
$post_id = $block->context['postId'] ?? get_the_ID();

// カスタムフィールドの値を取得
$event_date = get_post_meta( $post_id, 'event_date', true );

// 値がなければ何も出力しない
if ( empty( $event_date ) ) {
	return;
}

// 接頭辞を取得（デフォルト: '開催日：'）
$prefix = $attributes['prefix'] ?? '開催日：';

// ラッパー属性を取得（Gutenbergが付与するクラスやスタイルを含む）
$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => 'wp-block-tarosky-event-date',
] );
?>

<div <?php echo $wrapper_attributes; ?>>
	<p class="wp-block-tarosky-event-date__content">
		<?php if ( $prefix ) : ?>
			<span class="wp-block-tarosky-event-date__prefix">
				<?php echo esc_html( $prefix ); ?>
			</span>
		<?php endif; ?>
		<time
			class="wp-block-tarosky-event-date__date"
			datetime="<?php echo esc_attr( $event_date ); ?>"
		>
			<?php
			// 日付をフォーマット（Y-m-d → 日本語形式）
			$timestamp = strtotime( $event_date );
			if ( $timestamp ) {
				echo esc_html( date_i18n( get_option( 'date_format' ), $timestamp ) );
			} else {
				echo esc_html( $event_date );
			}
			?>
		</time>
	</p>
</div>