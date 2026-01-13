/**
 * アラートボックス
 *
 * このブロックで学べること：
 * 1. 別でregister_styleしたもの（Bootstrap）を利用できる
 * 2. 「スタイル」という基本的なプロパティを切り替えると見た目が変わる
 *
 * まとめて1つのJSにしても問題ないです。
 * WordPressのコアは分けていることが多いです。
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

/**
 * Bootstrapのアラートクラスを取得する
 *
 * WordPressは選択されたスタイルに応じて 'is-style-{name}' クラスを自動追加します。
 * このクラスからBootstrapの 'alert-{type}' クラスに変換します。
 *
 * @param {string} className - ブロックのクラス名
 * @return {string} Bootstrapのアラートタイプ（例：'alert-primary'）
 */
function getAlertClass( className ) {
	// is-style-primary → alert-primary に変換
	const match = className?.match( /is-style-(\w+)/ );
	return match ? `alert-${ match[ 1 ] }` : 'alert-primary';
}

/**
 * エディター内での表示
 *
 * @param {Object}   props               - ブロックのプロパティ
 * @param {Object}   props.attributes    - ブロックの属性
 * @param {Function} props.setAttributes - 属性を更新する関数
 * @return {JSX.Element} エディター用のJSX
 */
function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const alertClass = getAlertClass( blockProps.className );

	return (
		<RichText
			{ ...blockProps }
			tagName="div"
			className={ `${ blockProps.className } alert ${ alertClass }` }
			value={ attributes.content }
			onChange={ ( content ) => setAttributes( { content } ) }
			placeholder={ __( 'アラートメッセージを入力…', 'tarosky' ) }
		/>
	);
}

/**
 * 保存時のHTML出力
 *
 * @param {Object} props            - ブロックのプロパティ
 * @param {Object} props.attributes - ブロックの属性
 * @return {JSX.Element} 保存用のJSX
 */
function Save( { attributes } ) {
	const blockProps = useBlockProps.save();
	const alertClass = getAlertClass( blockProps.className );

	return (
		<RichText.Content
			{ ...blockProps }
			tagName="div"
			className={ `${ blockProps.className } alert ${ alertClass }` }
			value={ attributes.content }
		/>
	);
}

/**
 * ブロックの登録
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save: Save,
} );
