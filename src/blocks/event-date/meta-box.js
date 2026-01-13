/**
 * メタボックス用 React コンポーネント
 *
 * add_meta_box で作成されたメタボックス内にマウントされ、
 * useEntityProp を使用してメタデータを読み書きする。
 *
 * これにより、従来の save_post + wp_nonce_field による保存ではなく、
 * REST API 経由でブロックエディターと同じ仕組みで保存される。
 */

import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * メタボックスのコンテンツコンポーネント
 *
 * useEntityProp を使用して event_date メタを読み書きする。
 * ブロックエディターで編集した値とリアルタイムで同期される。
 */
export default function MetaBoxContent() {
	/**
	 * 現在編集中の投稿タイプと投稿IDを取得
	 *
	 * useSelect を使用してエディターストアから取得する。
	 *
	 * メタボックスはブロックの context 外で動作するため、
	 * ブロックのように context.postType / context.postId は使えない。
	 * 代わりに core/editor ストアから直接取得する。
	 */
	const { postType, postId } = useSelect( ( select ) => {
		const editor = select( 'core/editor' );
		return {
			postType: editor.getCurrentPostType(),
			postId: editor.getCurrentPostId(),
		};
	}, [] );

	/**
	 * useEntityProp でメタデータを取得・更新
	 *
	 * edit.js と同じフックを使用しているため、
	 * ブロック内で編集した値とメタボックスの値が自動的に同期される。
	 *
	 * 第4引数に postId を明示的に渡す必要がある。
	 * ブロック内では省略可能だが、メタボックスはブロックの
	 * コンテキスト外なので省略すると動作しない。
	 */
	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	// event_date の値を取得
	const eventDate = meta?.event_date || '';

	/**
	 * メタデータを更新
	 *
	 * setMeta はすべてのメタを含むオブジェクトを受け取るため、
	 * スプレッド構文で既存の値を維持しながら更新する。
	 *
	 * @param {string} newDate 新しい日付値
	 */
	const updateEventDate = ( newDate ) => {
		setMeta( {
			...( meta || {} ),
			event_date: newDate,
		} );
	};

	// postType がまだ取得できていない場合はローディング表示
	if ( ! postType ) {
		return <p>{ __( '読み込み中…', 'headfirst-create-block' ) }</p>;
	}

	return (
		<>
			<p>
				<label htmlFor="event_date_field">
					{ __(
						'イベント開催日を入力してください。',
						'headfirst-create-block'
					) }
					<br />
					<small>
						{ __(
							'ブロックエディターで「イベント日」ブロックを追加すると、この値が表示されます。',
							'headfirst-create-block'
						) }
					</small>
				</label>
			</p>
			<TextControl
				id="event_date_field"
				type="date"
				value={ eventDate }
				onChange={ updateEventDate }
				__nextHasNoMarginBottom
			/>
		</>
	);
}
