<?php
/**
 * 天気情報ブロックのAPI設定
 *
 * OpenWeatherMap APIキーを管理画面で設定できるようにします。
 */

defined( 'ABSPATH' ) or die();

/**
 * 設定ページを管理メニューに追加
 */
add_action( 'admin_menu', function () {
	add_options_page(
		'天気情報API設定',           // ページタイトル
		'天気情報API',               // メニュー名
		'manage_options',            // 必要な権限
		'headfirst-weather-settings', // ページスラッグ
		'headfirst_weather_settings_page' // コールバック関数
	);
} );

/**
 * 設定ページのHTML出力
 */
function headfirst_weather_settings_page() {
	// 権限チェック
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// 設定を保存
	if ( isset( $_POST['headfirst_weather_api_key'] ) ) {
		check_admin_referer( 'headfirst_weather_settings' );
		update_option( 'headfirst_weather_api_key', sanitize_text_field( $_POST['headfirst_weather_api_key'] ) );
		echo '<div class="notice notice-success is-dismissible"><p>設定を保存しました。</p></div>';
	}

	$api_key = get_option( 'headfirst_weather_api_key', '' );
	?>
	<div class="wrap">
		<h1>天気情報API設定</h1>
		<p>OpenWeatherMap APIキーを設定します。APIキーは <a href="https://openweathermap.org/api" target="_blank">OpenWeatherMap</a> で無料取得できます。</p>

		<form method="post" action="">
			<?php wp_nonce_field( 'headfirst_weather_settings' ); ?>
			<table class="form-table">
				<tr>
					<th scope="row">
						<label for="headfirst_weather_api_key">OpenWeatherMap APIキー</label>
					</th>
					<td>
						<input type="text"
							   id="headfirst_weather_api_key"
							   name="headfirst_weather_api_key"
							   value="<?php echo esc_attr( $api_key ); ?>"
							   class="regular-text"
							   placeholder="あなたのAPIキーを入力">
						<p class="description">
							APIキーの取得方法：
							<ol>
								<li><a href="https://home.openweathermap.org/users/sign_up" target="_blank">OpenWeatherMapでアカウント作成</a></li>
								<li>メール認証を完了</li>
								<li><a href="https://home.openweathermap.org/api_keys" target="_blank">API Keys</a> ページでキーを取得</li>
								<li>アクティベーションまで数時間かかる場合があります</li>
							</ol>
						</p>
					</td>
				</tr>
			</table>
			<?php submit_button( '設定を保存' ); ?>
		</form>

		<hr>

		<h2>使用方法</h2>
		<ol>
			<li>上記でAPIキーを設定</li>
			<li>投稿/固定ページの編集画面で「天気」ブロックを追加</li>
			<li>ブロックのサイドバーで都市名（例：Tokyo, Osaka）を入力</li>
			<li>公開すると、その都市の天気情報が表示されます</li>
		</ol>

		<h3>API制限について</h3>
		<p>無料プランでは1分間に60回、1日に1,000回までAPIを呼び出せます。このブロックは1時間キャッシュするため、通常は制限内で使用できます。</p>
	</div>
	<?php
}

/**
 * APIキーを取得するヘルパー関数
 *
 * @return string APIキー（未設定の場合は空文字列）
 */
function headfirst_get_weather_api_key() {
	return get_option( 'headfirst_weather_api_key', '' );
}
