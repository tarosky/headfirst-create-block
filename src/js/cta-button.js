/*!
 * CTA Button Variation
 *
 * core/button ブロックに「CTAボタン（矢印付き）」バリエーションを追加する
 *
 * Block Variations とは:
 * - 既存のコアブロックをベースに、プリセット済みの設定を持つ
 *   「別のブロック」として挿入パネルに表示できる機能
 * - 新しいブロックを作成するのではなく、既存ブロックの設定を
 *   あらかじめ定義しておくことで、ユーザーの入力を省略できる
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
 *
 * @handle cta-button-editor
 * @deps wp-blocks, wp-dom-ready, wp-i18n
 */

const { registerBlockVariation } = wp.blocks;
const { domReady } = wp;
const { __ } = wp.i18n;

domReady( () => {
	/**
	 * CTAボタン（矢印付き）バリエーションを登録
	 *
	 * registerBlockVariation( blockName, variation ) の引数:
	 * - blockName: ベースとなるブロック名（例: 'core/button'）
	 * - variation: バリエーションの設定オブジェクト
	 *
	 * variation オブジェクトの主なプロパティ:
	 * - name: バリエーションの一意の識別子
	 * - title: 挿入パネルに表示される名前
	 * - description: バリエーションの説明
	 * - icon: 挿入パネルに表示されるアイコン
	 * - attributes: デフォルトで設定される属性値
	 * - isDefault: true の場合、このバリエーションがデフォルトになる
	 * - isActive: どのバリエーションがアクティブか判定する関数または属性配列
	 * - scope: バリエーションが表示される場所（'inserter', 'block', 'transform'）
	 */
	registerBlockVariation( 'core/button', {
		// バリエーションの識別子
		// この名前は内部的に使用され、クラス名などには影響しない
		name: 'cta-arrow',

		// 挿入パネルに表示される名前
		title: __( 'CTAボタン（矢印付き）', 'headfirst-create-block' ),

		// バリエーションの説明（挿入パネルでホバー時に表示）
		description: __(
			'ホバー時に矢印がアニメーションするCTAボタン',
			'headfirst-create-block'
		),

		// アイコン
		// WordPress の Dashicons または SVG を指定できる
		// @see https://developer.wordpress.org/resource/dashicons/
		icon: 'arrow-right-alt',

		// デフォルトの属性値
		// ここで指定した値が、ブロック挿入時に自動的に設定される
		attributes: {
			// className に独自のクラスを追加
			// このクラスを使ってCSSやJSでCTAボタンを識別する
			className: 'is-cta-arrow',

			// ボタンのデフォルトテキスト
			// ユーザーが変更可能
			text: __( 'お申し込みはこちら', 'headfirst-create-block' ),
		},

		// バリエーションが表示される場所
		// - 'inserter': ブロック挿入パネル
		// - 'block': ブロックツールバーの変換メニュー
		// - 'transform': ブロック変換時
		scope: [ 'inserter', 'transform' ],

		// アクティブ判定
		// エディター上でブロックを選択したとき、どのバリエーションとして
		// 認識されるかを判定する
		//
		// 方法1: 属性名の配列を指定（その属性が一致すればアクティブ）
		// isActive: [ 'className' ],
		//
		// 方法2: 関数で判定（より柔軟な判定が可能）
		isActive: ( blockAttributes ) => {
			// className に 'is-cta-arrow' が含まれていればこのバリエーション
			return blockAttributes.className?.includes( 'is-cta-arrow' );
		},

		// 例: 他の属性もプリセットしたい場合
		// attributes: {
		//     className: 'is-cta-arrow',
		//     backgroundColor: 'vivid-cyan-blue',
		//     textColor: 'white',
		//     style: {
		//         border: {
		//             radius: '4px'
		//         }
		//     }
		// },
	} );
} );
