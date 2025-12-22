/**
 * イベント日ブロック - エディターコンポーネント
 *
 * useEntityProp を使用して投稿のメタデータを読み書きする。
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Placeholder } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Edit コンポーネント
 *
 * @param {Object} props              コンポーネントのプロパティ
 * @param {Object} props.attributes   ブロックの属性
 * @param {Function} props.setAttributes 属性を更新する関数
 * @param {Object} props.context      ブロックのコンテキスト（postId, postType など）
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const { prefix } = attributes;
	const { postType, postId } = context;

	/**
	 * useEntityProp フック
	 *
	 * WordPress のエンティティ（投稿、ユーザーなど）のプロパティを
	 * 読み書きするためのフック。
	 *
	 * 使い方:
	 * const [ value, setValue ] = useEntityProp( kind, name, prop, id );
	 *
	 * パラメータ:
	 * - kind: エンティティの種類（'postType', 'root', 'user' など）
	 * - name: エンティティ名（投稿タイプ名など。例: 'post', 'page'）
	 * - prop: プロパティ名（'title', 'content', 'meta' など）
	 * - id: エンティティのID（省略時は現在のエディターのエンティティ）
	 *
	 * 戻り値:
	 * - value: 現在の値
	 * - setValue: 値を更新する関数
	 * - fullValue: 完全な値（メタの場合はすべてのメタを含むオブジェクト）
	 *
	 * 'meta' を指定すると、すべてのメタデータがオブジェクトとして返される。
	 * 例: { event_date: '2025-01-15', other_meta: 'value' }
	 *
	 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-core-data/#useentityprop
	 */
	const [ meta, setMeta ] = useEntityProp(
		'postType',  // kind: 投稿タイプのエンティティ
		postType,    // name: 投稿タイプ名（context から取得）
		'meta'       // prop: メタデータ
		// id は省略（現在編集中の投稿）
	);

	// event_date の値を取得（undefined の場合は空文字）
	const eventDate = meta?.event_date || '';

	/**
	 * メタデータを更新する関数
	 *
	 * setMeta はすべてのメタを含むオブジェクトを受け取るため、
	 * スプレッド構文で既存の値を維持しながら更新する。
	 *
	 * @param {string} newDate 新しい日付値
	 */
	const updateEventDate = ( newDate ) => {
		setMeta( {
			...meta,
			event_date: newDate,
		} );
	};

	// ブロックのラッパー属性を取得
	const blockProps = useBlockProps( {
		className: 'wp-block-tarosky-event-date',
	} );

	return (
		<>
			{/* サイドバーの設定パネル */}
			<InspectorControls>
				<PanelBody title={ __( '表示設定', 'headfirst-create-block' ) }>
					<TextControl
						label={ __( '接頭辞', 'headfirst-create-block' ) }
						help={ __( '日付の前に表示するテキスト', 'headfirst-create-block' ) }
						value={ prefix }
						onChange={ ( value ) => setAttributes( { prefix: value } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'イベント日', 'headfirst-create-block' ) }>
					<TextControl
						label={ __( '日付', 'headfirst-create-block' ) }
						help={ __( 'メタボックスと同期されます', 'headfirst-create-block' ) }
						type="date"
						value={ eventDate }
						onChange={ updateEventDate }
					/>
				</PanelBody>
			</InspectorControls>

			{/* ブロックの表示 */}
			<div { ...blockProps }>
				{ eventDate ? (
					<p className="wp-block-tarosky-event-date__content">
						<span className="wp-block-tarosky-event-date__prefix">
							{ prefix }
						</span>
						<time
							className="wp-block-tarosky-event-date__date"
							dateTime={ eventDate }
						>
							{ eventDate }
						</time>
					</p>
				) : (
					<Placeholder
						icon="calendar-alt"
						label={ __( 'イベント日', 'headfirst-create-block' ) }
						instructions={ __(
							'メタボックスまたはサイドバーでイベント日を設定してください。',
							'headfirst-create-block'
						) }
					>
						<TextControl
							type="date"
							value={ eventDate }
							onChange={ updateEventDate }
							placeholder={ __( '日付を選択', 'headfirst-create-block' ) }
						/>
					</Placeholder>
				) }
			</div>
		</>
	);
}