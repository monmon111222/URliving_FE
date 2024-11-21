/**
 * webpack通用配置
 */

const path = require('path');

module.exports = {
	// 多頁配置
	isMultiplePage: true,
	// 異步加載功能??（启用的状态下，`commons` 参数将失效）
	isOpenSyncImport: true,
	// 最小chunk的大小
	minChunkSize: 10000,
	// 自動開啟網頁
	autoOpenBrowser: true,
	// 文件目錄
	assetsRoot: path.resolve(__dirname, '../../src'),
	// 生成目錄
	buildRoot: path.resolve(__dirname, '../../dist'),
	// 靜態資料目錄
	staticAssets: 'static',
	// 生成路径
	publicPath: '/',
	// 公用别名
	commonAlias: {
		Static: '../src/static/',
		'@': '../src',
		'@page': '../src/pages',
		'@global': '../f2e_lib',
		'vue$': '../node_modules/vue/dist/vue.esm.js'
	},
	// 
	externals: {

	},
	// 公共模塊(默認common／js文件下的文件作為`commons chunk`打包)
	commons: {
	},
	// 要打包的外部資源
	library: [
		'vue/dist/vue.esm.js',
		'jquery'
	],
	// 指定要引入外部資源的頁面(為空則全部引入)
	libraryEntry: [],
	port: 8009,
	proxy: {
		// '/api': {
		// 	target: "http://*.com",
		// 	changeOrigin: true,
		// 	pathRewrite: {
		// 		'^/api': ''
		// 	},
		// 	logLevel: 'error'
		// }
	}
}