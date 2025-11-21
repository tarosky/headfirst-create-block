/**
 * フロントエンドで実行されるJavaScript
 *
 * block.jsonの`viewScript`プロパティで指定すると、
 * このブロックを含む投稿/固定ページのフロントエンドでこのファイルが読み込まれます。
 *
 * このファイルでは、Chart.jsを使ってグラフを描画します。
 * Chart.jsは以下の方法で読み込んでいます。
 * 1. chart-jsとしてwp_register_scriptで登録（headfirst-create-block.php)
 * 2. block.jsonでviewScriptに依存先として登録（配列で書くことができます）
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/**
 * CSVデータをパースする関数
 *
 * @param {string} csvData - CSVデータ
 * @return {Object|null} パース結果 { labels: string[], values: number[] }
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
 * グラフを初期化する関数
 *
 * @param {HTMLElement} canvas - canvasエレメント
 */
function initChart( canvas ) {
	// Chart.jsが読み込まれているか確認
	if ( typeof Chart === 'undefined' ) {
		console.error( 'Chart.js is not loaded' );
		return;
	}

	// data-csv属性からCSVデータを取得
	const csvData = canvas.getAttribute( 'data-csv' );
	const parsedData = parseCSV( csvData );

	if ( ! parsedData ) {
		console.error( 'Invalid CSV data' );
		return;
	}

	// Chart.jsでグラフを描画
	new Chart( canvas, {
		type: 'bar',
		data: {
			labels: parsedData.labels,
			datasets: [
				{
					label: 'データ',
					data: parsedData.values,
					backgroundColor: [
						'rgba(255, 99, 132, 0.8)',
						'rgba(54, 162, 235, 0.8)',
						'rgba(255, 206, 86, 0.8)',
						'rgba(75, 192, 192, 0.8)',
						'rgba(153, 102, 255, 0.8)',
						'rgba(255, 159, 64, 0.8)',
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)',
					],
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
		},
	} );
}

/**
 * DOMContentLoadedまたはChart.jsの読み込み完了を待ってから初期化
 */
function initAllCharts() {
	const canvases = document.querySelectorAll(
		'.wp-block-tarosky-chart__canvas'
	);
	canvases.forEach( ( canvas ) => {
		initChart( canvas );
	} );
}

// Chart.jsが既に読み込まれている場合は即座に初期化
if ( typeof Chart !== 'undefined' ) {
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAllCharts );
	} else {
		initAllCharts();
	}
} else {
	// Chart.jsの読み込みを待つ
	window.addEventListener( 'load', initAllCharts );
}
