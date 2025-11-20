/**
 * テキストの翻訳を取得する関数。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * ブロックのラッパー要素をマークするためのReact Hook。
 * クラス名など、必要なpropsを全て提供します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * JavaScriptファイルから参照されるCSS、SASS、SCSSファイルをwebpackで処理します。
 * これらのファイルには、エディターに適用される任意のCSSコードを含めることができます。
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * edit関数はエディターのコンテキストにおけるブロックの構造を定義します。
 * InnerBlocksを使用することで、このブロック内に他のブロックをネストできます。
 * allowedBlocksで中に配置できるブロックを制限できるので、dl(>dt, dd)のような「制限」が簡単になります。
 * また、templateを指定すると、初期値を設定できます。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} レンダリングする要素。
 */
export default function Edit() {
	const blockProps = useBlockProps();

	return (
		<aside { ...blockProps }>
			<InnerBlocks
				allowedBlocks={ [
					'core/heading',
					'core/paragraph',
					'core/list',
					'core/quote',
				] }
				template={ [
					[ 'core/heading', { level: 4, placeholder: __( '注釈タイトル', 'tarosky' ) } ],
					[ 'core/paragraph', { placeholder: __( '注釈の内容を入力...', 'tarosky' ) } ],
				] }
			/>
		</aside>
	);
}
