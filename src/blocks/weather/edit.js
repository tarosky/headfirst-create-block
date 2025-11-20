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
 * JavaScriptファイルから参照されるCSS、SASS、SCSSファイルをwebpackで処理します。
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * edit関数はエディターのコンテキストにおけるブロックの構造を定義します。
 * Dynamic Blockなので、エディターではプレースホルダーを表示し、
 * 実際のレンダリングはPHP（render.php）で行います。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props - ブロックのプロパティ
 * @return {Element} レンダリングする要素。
 */
export default function Edit( { attributes, setAttributes } ) {
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
						onChange={ ( value ) => setAttributes( { location: value } ) }
					/>
					<SelectControl
						label={ __( '温度単位', 'tarosky' ) }
						value={ unit }
						options={ [
							{ label: __( '摂氏（℃）', 'tarosky' ), value: 'metric' },
							{ label: __( '華氏（℉）', 'tarosky' ), value: 'imperial' },
						] }
						onChange={ ( value ) => setAttributes( { unit: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="wp-block-tarosky-weather__placeholder">
					<span className="dashicons dashicons-cloud"></span>
					<p>
						{ __( '天気情報ブロック', 'tarosky' ) }
						<br />
						<strong>{ location || __( '都市名を設定してください', 'tarosky' ) }</strong>
					</p>
					<p className="description">
						{ __( '実際の天気情報は公開ページで表示されます', 'tarosky' ) }
					</p>
				</div>
			</div>
		</>
	);
}
