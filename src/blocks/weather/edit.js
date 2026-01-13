/**
 * テキストの翻訳を取得する関数。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * ブロックのラッパー要素をマークするためのReact Hook。
 * InspectorControlsはサイドバーに設定UIを表示するコンポーネントです。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * WordPress UIコンポーネント
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

/**
 * サーバーサイドでレンダリングされたブロックをエディター内で表示するコンポーネント。
 * render.phpの出力をエディター内でもプレビューできます。
 * このコンポーネントにattributesを渡すと、その内容でレンダリングします。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-server-side-render/
 */
import ServerSideRender from '@wordpress/server-side-render';

/**
 * JavaScriptファイルから参照されるCSS、SASS、SCSSファイルをwebpackで処理します。
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * edit関数はエディターのコンテキストにおけるブロックの構造を定義します。
 * Dynamic Blockなので、ServerSideRenderコンポーネントを使用して、
 * エディター内でもrender.phpの実際の出力をプレビュー表示します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               - ブロックのプロパティ
 * @param {Object}   props.attributes    - ブロックの属性
 * @param {Function} props.setAttributes - 属性を更新する関数
 * @param {string}   props.name          - ブロック名
 * @return {Element} レンダリングする要素。
 */
export default function Edit( { attributes, setAttributes, name } ) {
	const { location, unit } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( '天気設定', 'tarosky' ) }>
					<TextControl
						label={ __( '都市名', 'tarosky' ) }
						help={ __( '例: Tokyo, Osaka, London', 'tarosky' ) }
						value={ location }
						onChange={ ( value ) =>
							setAttributes( { location: value } )
						}
					/>
					<SelectControl
						label={ __( '温度単位', 'tarosky' ) }
						value={ unit }
						options={ [
							{
								label: __( '摂氏（℃）', 'tarosky' ),
								value: 'metric',
							},
							{
								label: __( '華氏（℉）', 'tarosky' ),
								value: 'imperial',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { unit: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
