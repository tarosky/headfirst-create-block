# 天気ブロック（Weather Block）

指定した都市の現在の天気情報を表示するDynamic Blockです。OpenWeatherMap APIを使用して、リアルタイムの気象データを取得・表示します。

## 学習のポイント

このブロックでは以下のWordPressブロック開発の重要な概念を学ぶことができます：

### 1. Dynamic Block（動的ブロック）

**通常のブロックとの違い：**

- **Static Block（静的ブロック）**: `save()`関数でHTMLをシリアライズし、`post_content`に保存。表示時はそのHTMLをそのまま出力
- **Dynamic Block（動的ブロック）**: `save()`関数を持たず、表示時にPHPで動的にレンダリング

**Dynamic Blockが適している場面：**

- 外部APIからデータを取得する場合（本ブロック）
- データベースから最新情報を取得する場合
- ユーザーの状態（ログイン/ログアウト）によって表示を変える場合
- サーバー側の処理が必要な場合

**block.jsonでの定義：**

```json
{
  "render": "file:./render.php"
}
```

`render`プロパティでPHPファイルを指定すると、そのファイルが表示時に呼び出されます。`save()`関数は不要です。

### 2. InspectorControls（サイドバー設定UI）

エディター右サイドバーに設定パネルを追加するコンポーネントです。

**基本的な使い方：**

```javascript
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

<InspectorControls>
  <PanelBody title="設定">
    <TextControl
      label="ラベル"
      value={ attribute }
      onChange={ ( value ) => setAttributes( { attribute: value } ) }
    />
  </PanelBody>
</InspectorControls>
```

**主要なコンポーネント：**

- `PanelBody`: 折りたたみ可能なパネル
- `TextControl`: テキスト入力
- `SelectControl`: ドロップダウン選択
- `ToggleControl`: ON/OFFスイッチ
- `RangeControl`: スライダー

### 3. ServerSideRender（エディター内プレビュー）

Dynamic Blockの場合、エディター内でもPHPでレンダリングされた実際の表示を確認できると便利です。`ServerSideRender`コンポーネントを使うことで、エディター内で`render.php`の出力をプレビュー表示できます。

**基本的な使い方：**

```javascript
import ServerSideRender from '@wordpress/server-side-render';

<ServerSideRender
  block={ name }           // ブロック名（例: 'tarosky/weather'）
  attributes={ attributes } // ブロックの属性
/>
```

**メリット：**

- エディターとフロントエンドで同じ見た目を確認できる
- プレースホルダーを別途作る必要がない
- 属性を変更するとリアルタイムで更新される

**注意点：**

- APIリクエストなどサーバー処理が発生するため、表示に時間がかかる場合がある
- エディター内で何度もレンダリングが走るため、キャッシュ機構が重要

### 4. 外部API連携

**WordPressのHTTP API：**

`wp_remote_get()`を使用することで、安全にHTTPリクエストを送信できます。

```php
$response = wp_remote_get( $api_url );

if ( is_wp_error( $response ) ) {
    // エラー処理
    $error_message = $response->get_error_message();
}

$body = wp_remote_retrieve_body( $response );
$data = json_decode( $body, true );
```

**`wp_remote_get()`を使う理由：**

- cURLの有無に関わらず動作
- タイムアウトやエラーハンドリングが組み込まれている
- WordPressのフィルターフックで拡張可能
- HTTPSに対応

### 5. Transient API（キャッシュ機構）

同じデータを何度もAPIから取得するのは非効率です。Transient APIを使ってキャッシュします。

**基本的な使い方：**

```php
// キャッシュキーの生成（パラメータごとに一意に）
$cache_key = 'weather_' . md5( $location . $unit );

// キャッシュから取得
$data = get_transient( $cache_key );

if ( false === $data ) {
    // キャッシュがない場合はAPIを呼び出す
    $data = fetch_from_api();

    // 1時間キャッシュ
    set_transient( $cache_key, $data, HOUR_IN_SECONDS );
}
```

**キャッシュの有効期限：**

- `MINUTE_IN_SECONDS`: 60秒
- `HOUR_IN_SECONDS`: 3600秒
- `DAY_IN_SECONDS`: 86400秒
- `WEEK_IN_SECONDS`: 604800秒

### 6. エラーハンドリング

APIを使用する場合、複数のエラーケースに対応する必要があります。

**このブロックで処理しているエラー：**

1. **APIキー未設定**: `empty( $api_key )`
2. **ネットワークエラー**: `is_wp_error( $response )`
3. **APIエラー**: `! isset( $data['main'] )`

それぞれのケースで適切なエラーメッセージを表示します。

### 7. 設定画面の作成

API キーなどの機密情報は、ブロックの属性ではなくWordPressの設定に保存します。

**`includes/setting-weather.php`で実装：**

```php
// 設定ページの追加
add_action( 'admin_menu', 'headfirst_weather_add_settings_page' );

// 設定の登録
add_action( 'admin_init', 'headfirst_weather_register_settings' );

// 設定値の取得
function headfirst_get_weather_api_key() {
    return get_option( 'headfirst_weather_api_key', '' );
}
```

**なぜブロック属性に保存しないのか：**

- APIキーは投稿コンテンツではない
- すべてのブロックインスタンスで共有すべき
- データベースに暗号化されて保存される
- 投稿のエクスポート時に含まれない

## ファイル構成

```
weather/
├── block.json       # ブロックのメタデータ（attributes, render指定）
├── index.js         # ブロックの登録
├── edit.js          # エディター表示（InspectorControls + ServerSideRender）
├── render.php       # サーバーサイドレンダリング（API呼び出し + HTML生成）
├── style.scss       # フロントエンド + エディター共通スタイル
├── editor.scss      # エディター専用スタイル
└── README.md        # このファイル
```

**注意**: Dynamic Blockなので`save.js`は**ありません**。

## ブロックの動作フロー

### エディター内

1. ユーザーがブロックを挿入
2. `edit.js`が`ServerSideRender`コンポーネントを表示
3. `ServerSideRender`が内部で`render.php`を呼び出す
4. サイドバー（InspectorControls）で都市名と温度単位を設定
5. 属性を変更すると、`ServerSideRender`が自動的に再レンダリング
6. **エディター内でも実際の天気情報がリアルタイムで表示される**

### フロントエンド

1. 投稿が表示される
2. WordPressが`render.php`を呼び出す
3. `$attributes`配列で設定値（都市名、温度単位）を受け取る
4. Transientキャッシュをチェック
5. キャッシュがなければOpenWeatherMap APIを呼び出す
6. 取得したデータをキャッシュ（1時間）
7. HTMLを生成して表示

**重要**: エディター内もフロントエンドも同じ`render.php`を使用するため、表示が完全に一致します。

## 技術仕様

### API

- **サービス**: OpenWeatherMap API
- **エンドポイント**: `https://api.openweathermap.org/data/2.5/weather`
- **パラメータ**:
  - `q`: 都市名（例: Tokyo, Osaka, London）
  - `appid`: APIキー
  - `units`: 温度単位（`metric` = 摂氏、`imperial` = 華氏）
  - `lang`: 言語（`ja` = 日本語）

### 表示データ

- 都市名
- 天気の説明（例: 晴れ、曇り）
- 天気アイコン
- 現在の気温
- 体感温度
- 湿度

### キャッシュ

- **方式**: WordPress Transient API
- **有効期限**: 1時間
- **キーの形式**: `weather_{md5(location+unit)}`

## 参考リンク

- [Dynamic Blocks - Block Editor Handbook](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/creating-dynamic-blocks/)
- [InspectorControls - @wordpress/block-editor](https://developer.wordpress.org/block-editor/reference-guides/components/inspector-controls/)
- [ServerSideRender - @wordpress/server-side-render](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-server-side-render/)
- [Transient API - WordPress Developer Resources](https://developer.wordpress.org/apis/transients/)
- [HTTP API - WordPress Developer Resources](https://developer.wordpress.org/plugins/http-api/)
- [OpenWeatherMap API Documentation](https://openweathermap.org/current)