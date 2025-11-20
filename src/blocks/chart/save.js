/**
 * ブロックのラッパー要素をマークするためのReact Hook。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * save関数は、異なる属性を最終的なマークアップにどのように結合するかを定義します。
 * このマークアップは、ブロックエディターによって`post_content`にシリアライズされます。
 *
 * グラフブロックでは、CSVデータをdata-csv属性として保存し、
 * view.jsがそれを読み取ってChart.jsでグラフを描画します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props            - プロパティオブジェクト
 * @param {Object} props.attributes - ブロックの属性
 * @return {Element} レンダリングする要素。
 */
export default function save( { attributes } ) {
	const { csvData } = attributes;

	return (
		<div { ...useBlockProps.save() }>
			<canvas
				className="wp-block-tarosky-chart__canvas"
				data-csv={ csvData }
			></canvas>
		</div>
	);
}
