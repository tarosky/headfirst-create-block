/**
 * 一意の名前とその動作を定義するオブジェクトを指定して、新しいブロックを登録します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * JavaScriptファイルから参照されるCSS、SASS、SCSSファイルをwebpackで処理します。
 * `style` キーワードを含むすべてのファイルは一緒にバンドルされます。
 * 使用されるコードは、サイトのフロントエンドとエディターの両方に適用されます。
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * 内部依存関係
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * ブロックの登録
 * Dynamic Blockなので、save関数は不要です。
 * 代わりに、block.jsonの"render"プロパティでPHPファイルを指定します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
} );
