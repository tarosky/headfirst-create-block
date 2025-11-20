/**
 * 一意の名前とその動作を定義するオブジェクトを指定して、新しいブロックを登録します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * JavaScriptファイルから参照されるCSS、SASS、SCSSファイルをwebpackに処理するよう宣言します。
 * `style` キーワードを含むすべてのファイルは一緒にバンドルされます。
 * 使用されるコードは、サイトのフロントエンドとエディターの両方に適用されます。
 * このように書くことでwebpackが「style.scssを使うのだな」と判断します。
 * CSS in JSのやり方を真似ている手法ですが、実際にJSに埋め込まれるわけではありません。
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
 * すべてのブロックは、新しいブロックタイプ定義を登録することから始まります。
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
