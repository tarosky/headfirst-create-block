/**
 * テキストの翻訳を取得する関数。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * ブロックのラッパー要素をマークするためのReact Hook。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * WordPress UIコンポーネント
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import { TextareaControl, Notice } from '@wordpress/components';

/**
 * エディター専用のスタイルをインポート
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * CSVデータをパースする関数
 *
 * @param {string} csvData - CSVデータ
 * @return {Object|null} パース結果 { labels: string[], values: number[] } またはエラー時はnull
 */
function parseCSV( csvData ) {
	if ( ! csvData || ! csvData.trim() ) {
		return null;
	}

	const lines = csvData.trim().split( '\n' );
	if ( lines.length < 2 ) {
		return null;
	}

	const labels = lines[ 0 ].split( ',' ).map( ( label ) => label.trim() );
	const values = lines[ 1 ].split( ',' ).map( ( value ) => {
		const num = parseFloat( value.trim() );
		return isNaN( num ) ? 0 : num;
	} );

	if ( labels.length !== values.length ) {
		return null;
	}

	return { labels, values };
}

/**
 * edit関数はエディターのコンテキストにおけるブロックの構造を定義します。
 * CSVデータを入力するTextareaと、パースしたデータのプレビュー（表形式）を表示します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               - ブロックのプロパティ
 * @param {Object}   props.attributes    - ブロックの属性
 * @param {Function} props.setAttributes - 属性を更新する関数
 * @return {Element} レンダリングする要素。
 */
export default function Edit( { attributes, setAttributes } ) {
	const { csvData } = attributes;
	const blockProps = useBlockProps();

	// CSVをパース
	const parsedData = parseCSV( csvData );

	return (
		<div { ...blockProps }>
			<div className="wp-block-tarosky-chart-editor">
				<h3>{ __( 'CSVデータ入力', 'tarosky' ) }</h3>
				<TextareaControl
					label={ __( 'CSVデータ', 'tarosky' ) }
					help={ __(
						'1行目：ラベル（カンマ区切り）、2行目：値（カンマ区切り）',
						'tarosky'
					) }
					value={ csvData }
					onChange={ ( value ) =>
						setAttributes( { csvData: value } )
					}
					rows={ 5 }
				/>

				{ parsedData ? (
					<div className="wp-block-tarosky-chart-preview">
						<h4>{ __( 'プレビュー', 'tarosky' ) }</h4>
						<table className="wp-block-tarosky-chart-table">
							<thead>
								<tr>
									{ parsedData.labels.map(
										( label, index ) => (
											<th key={ index }>{ label }</th>
										)
									) }
								</tr>
							</thead>
							<tbody>
								<tr>
									{ parsedData.values.map(
										( value, index ) => (
											<td key={ index }>{ value }</td>
										)
									) }
								</tr>
							</tbody>
						</table>
						<p className="description">
							{ __(
								'実際のグラフは公開ページで表示されます',
								'tarosky'
							) }
						</p>
					</div>
				) : (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'CSVデータが正しくありません。1行目にラベル、2行目に値を入力してください。',
							'tarosky'
						) }
					</Notice>
				) }
			</div>
		</div>
	);
}
