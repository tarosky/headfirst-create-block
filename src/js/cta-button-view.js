/*!
 * CTA Button View Script
 *
 * @handle cta-button-view
 *
 * CTAボタン（矢印付き）のフロントエンド用スクリプト
 *
 * このスクリプトは公開画面でのみ読み込まれ、
 * ホバー時の矢印アニメーションを制御する。
 *
 * viewScript とは:
 * - ブロックの公開画面（フロントエンド）でのみ実行されるスクリプト
 * - エディター画面では実行されない
 * - インタラクティブな機能（クリック、ホバーなど）を実装するのに使う
 *
 * 注意: このスクリプトは条件付きで読み込まれる
 * - ページ内に .is-cta-arrow クラスを持つボタンがある場合のみ
 * - includes/cta-button.php で has_block() などで判定
 */

/**
 * DOMContentLoaded を待つ
 *
 * WordPress のブロックは通常 <body> 内にレンダリングされるため、
 * DOMContentLoaded で DOM が準備完了してから処理を開始する。
 */
document.addEventListener( 'DOMContentLoaded', () => {
	/**
	 * CTAボタンを全て取得
	 *
	 * セレクタの説明:
	 * - .wp-block-button: ボタンブロックのラッパー
	 * - .is-cta-arrow: CTAバリエーションを示すクラス
	 * - .wp-block-button__link: 実際のボタン要素（<a>タグ）
	 */
	const ctaButtons = document.querySelectorAll(
		'.wp-block-button.is-cta-arrow .wp-block-button__link'
	);

	// CTAボタンがなければ何もしない
	if ( ctaButtons.length === 0 ) {
		return;
	}

	/**
	 * 各CTAボタンにイベントリスナーを設定
	 *
	 * ここではCSSアニメーションを使うため、JSでは追加のクラスを
	 * 付与するだけで済む。より複雑なアニメーションが必要な場合は
	 * ここでJSアニメーションを実装する。
	 */
	ctaButtons.forEach( ( button ) => {
		/**
		 * 矢印要素を動的に追加
		 *
		 * CSSの ::after 疑似要素でも矢印を追加できるが、
		 * JSで要素を追加することで、より複雑なアニメーションや
		 * 状態管理が可能になる。
		 *
		 * 今回は学習目的でJSによる要素追加を実装する。
		 */

		// 既に矢印が追加されている場合はスキップ
		if ( button.querySelector( '.cta-arrow' ) ) {
			return;
		}

		// 矢印要素を作成
		const arrow = document.createElement( 'span' );
		arrow.className = 'cta-arrow';
		arrow.setAttribute( 'aria-hidden', 'true' ); // スクリーンリーダーから隠す
		arrow.textContent = '→';

		// ボタンの末尾に矢印を追加
		button.appendChild( arrow );

		/**
		 * マウスイベントでアニメーションクラスを切り替え
		 *
		 * mouseenter/mouseleave を使う理由:
		 * - mouseover/mouseout は子要素でも発火するため、
		 *   意図しないタイミングでイベントが発生する可能性がある
		 * - mouseenter/mouseleave は対象要素のみで発火する
		 */
		button.addEventListener( 'mouseenter', () => {
			button.classList.add( 'is-hovered' );
		} );

		button.addEventListener( 'mouseleave', () => {
			button.classList.remove( 'is-hovered' );
		} );

		/**
		 * キーボードアクセシビリティ
		 *
		 * フォーカス時にもホバーと同じ効果を適用することで、
		 * キーボードユーザーにも同じ体験を提供する。
		 */
		button.addEventListener( 'focus', () => {
			button.classList.add( 'is-hovered' );
		} );

		button.addEventListener( 'blur', () => {
			button.classList.remove( 'is-hovered' );
		} );
	} );

	// デバッグ用（本番では削除）
	// console.log( `CTA Buttons initialized: ${ ctaButtons.length }` );
} );
