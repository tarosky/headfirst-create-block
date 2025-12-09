/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';
import metadata from './block.json';

/**
 * シンプルなブロックなので、edit.js と save.js という別ファイルに分けずにindex.js 内に直接記述する
 */
registerBlockType( metadata.name, {
	/**
	 * エディター内での表示
	 */
	edit( { attributes, setAttributes, className } ) {
		// useBlockProps()は、スタイルで選択された is-style-warning などの必要なクラスや属性を自動で付けてくれるフック
		const blockProps = useBlockProps();

		return (
			// block.jsonで attributes.contents.selectorに ".mm-alert" を指定しているため、保存したい中身を含んでいる要素に クラス .mm-alert をつける必要がある
			<div { ...blockProps }>
				<div className="mm-alert">
					<RichText
						tagName="div"
						// value={ attributes.content } で保存されている内容をエディターに表示
						value={ attributes.content }
						// onChangeで、入力が変わるたびに `attributes.content` を更新
						onChange={ ( content ) => setAttributes( { content } ) }
						placeholder={ __( 'アラートメッセージを入力...', 'tarosky' ) }
					/>
				</div>
			</div>
		);
	},

	/**
	 * 保存時のHTML
	 */
	save( { attributes } ) {
		const blockProps = useBlockProps.save();

		return (
			<div { ...blockProps }>
				<div className="mm-alert">
					<RichText.Content
						tagName="div"
						value={ attributes.content }
					/>
				</div>
			</div>
		);
	},
} );
