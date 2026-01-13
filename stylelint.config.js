module.exports = {
	extends: [
		'@wordpress/stylelint-config/scss',
	],
	rules: {
		// WordPressのBEM記法（__や--を含むクラス名）を許可
		'selector-class-pattern': null,
		// SCSSの空コメント（セクション区切り用）を許可
		'scss/comment-no-empty': null,
	},
};
