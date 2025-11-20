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
import save from './save';
import metadata from './block.json';

/**
 * ブロックの登録
 * Static Blockなので、editとsave両方の関数が必要です。
 * また、view.jsでフロントエンドのJavaScript（Chart.js初期化）を実行します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
