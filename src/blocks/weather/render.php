<?php
/**
 * 天気ブロックのレンダリング
 *
 * @param array    $attributes ブロックの属性
 * @param string   $content    InnerBlocksのコンテンツ（このブロックでは使用しない）
 * @param WP_Block $block      ブロックインスタンス
 */

// ブロックのラッパー属性を取得
$wrapper_attributes = get_block_wrapper_attributes();

// 都市名と温度単位を取得
$location = $attributes['location'] ?? 'Tokyo';
$unit     = $attributes['unit'] ?? 'metric';
$api_key  = headfirst_get_weather_api_key();

// APIキーが未設定の場合
if ( empty( $api_key ) ) {
	?>
	<div <?php echo $wrapper_attributes; ?>>
		<div class="wp-block-tarosky-weather__error">
			<p><strong>⚠️ APIキーが設定されていません</strong></p>
			<p>管理画面の「設定 → 天気情報API」でAPIキーを設定してください。</p>
		</div>
	</div>
	<?php
	return;
}

// トランジェントのキャッシュキーを生成
$cache_key = 'weather_' . md5( $location . $unit );
$weather_data = get_transient( $cache_key );

// キャッシュがない場合はAPIを呼び出す
if ( false === $weather_data ) {
	$api_url = add_query_arg(
		[
			'q'     => $location,
			'appid' => $api_key,
			'units' => $unit,
			'lang'  => 'ja',
		],
		'https://api.openweathermap.org/data/2.5/weather'
	);

	$response = wp_remote_get( $api_url );

	if ( is_wp_error( $response ) ) {
		?>
		<div <?php echo $wrapper_attributes; ?>>
			<div class="wp-block-tarosky-weather__error">
				<p><strong>⚠️ 天気情報の取得に失敗しました</strong></p>
				<p><?php echo esc_html( $response->get_error_message() ); ?></p>
			</div>
		</div>
		<?php
		return;
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );

	// APIエラーの場合
	if ( ! isset( $data['main'] ) ) {
		$error_message = $data['message'] ?? '不明なエラー';
		?>
		<div <?php echo $wrapper_attributes; ?>>
			<div class="wp-block-tarosky-weather__error">
				<p><strong>⚠️ 天気情報の取得に失敗しました</strong></p>
				<p><?php echo esc_html( $error_message ); ?></p>
				<p class="description">都市名を確認してください（例: Tokyo, Osaka, London）</p>
			</div>
		</div>
		<?php
		return;
	}

	$weather_data = $data;
	// 1時間キャッシュ
	set_transient( $cache_key, $weather_data, HOUR_IN_SECONDS );
}

// 天気情報を整形
$city_name   = $weather_data['name'] ?? $location;
$description = $weather_data['weather'][0]['description'] ?? '';
$temp        = round( $weather_data['main']['temp'] ?? 0, 1 );
$feels_like  = round( $weather_data['main']['feels_like'] ?? 0, 1 );
$humidity    = $weather_data['main']['humidity'] ?? 0;
$icon        = $weather_data['weather'][0]['icon'] ?? '01d';
$temp_unit   = $unit === 'metric' ? '℃' : '℉';

?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="wp-block-tarosky-weather__content">
		<div class="wp-block-tarosky-weather__header">
			<img src="https://openweathermap.org/img/wn/<?php echo esc_attr( $icon ); ?>@2x.png"
				 alt="<?php echo esc_attr( $description ); ?>"
				 class="wp-block-tarosky-weather__icon">
			<div>
				<h3 class="wp-block-tarosky-weather__city"><?php echo esc_html( $city_name ); ?></h3>
				<p class="wp-block-tarosky-weather__description"><?php echo esc_html( $description ); ?></p>
			</div>
		</div>
		<div class="wp-block-tarosky-weather__temp">
			<span class="wp-block-tarosky-weather__temp-value"><?php echo esc_html( $temp ); ?></span>
			<span class="wp-block-tarosky-weather__temp-unit"><?php echo esc_html( $temp_unit ); ?></span>
		</div>
		<div class="wp-block-tarosky-weather__details">
			<div class="wp-block-tarosky-weather__detail">
				<span class="label">体感温度</span>
				<span class="value"><?php echo esc_html( $feels_like . $temp_unit ); ?></span>
			</div>
			<div class="wp-block-tarosky-weather__detail">
				<span class="label">湿度</span>
				<span class="value"><?php echo esc_html( $humidity . '%' ); ?></span>
			</div>
		</div>
	</div>
</div>
