/**
 * ブロックのラッパー要素をマークするためのReact Hook。
 * クラス名など、必要なpropsを全て提供します。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * save関数は、異なる属性を最終的なマークアップに結合する方法を定義します。
 * このマークアップはブロックエディターによって `post_content` にシリアライズされます。
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} レンダリングする要素。
 */
export default function save() {
	return (
		<p { ...useBlockProps.save() }>
			{ 'Sample Block – hello from the saved content!' }
		</p>
	);
}
