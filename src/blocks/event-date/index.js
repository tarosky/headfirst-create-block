/**
 * イベント日ブロック
 *
 * 投稿のカスタムフィールド（post_meta）を表示・編集するブロック。
 * useEntityProp フックを使用して、投稿メタデータにアクセスする。
 *
 * このブロックの特徴:
 * - ブロック自体には値を保存しない（attributesにevent_dateがない）
 * - 代わりに投稿のpost_metaを直接読み書きする
 * - メタボックスで入力した値と自動的に同期される
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-core-data/#useentityprop
 */

import { registerBlockType } from '@wordpress/blocks';

/**
 * スタイルシートの読み込み
 *
 * wp-scriptsはこのインポートを検出し、style.scssを
 * style-index.cssにコンパイルする。
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

import Edit from './edit';
import metadata from './block.json';

/**
 * ブロックを登録
 *
 * save関数がnullなのは、このブロックが動的レンダリング（render.php）を
 * 使用するため。サーバーサイドで出力されるため、クライアント側での
 * 保存処理は不要。
 */
registerBlockType( metadata.name, {
	edit: Edit,

	// 動的ブロック（PHPでレンダリング）のためsaveはnull
	save: () => null,
} );
