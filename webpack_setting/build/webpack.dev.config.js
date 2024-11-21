/**
 * @description 開發環境webpack配置
 */

const
	path = require('path'),
	webpack = require('webpack'),
	webpackMerge = require('webpack-merge');

const
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const
	baseWebpackConfig = require('./webpack.base.config'),
	{ nowConfig, commonsChunkName } = require('./util');

const
	API_CONFIG = require('../../src/api/api_config_dev');

const config = nowConfig();

const commonsChunk = commonsChunkName();

module.exports = webpackMerge({
	devtool: 'cheap-module-source-map',
	mode: 'development',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': config.env,
			'API_URL': API_CONFIG
		}),

		new webpack.HotModuleReplacementPlugin(),

		// 出錯時,跳過輸出階段。 這樣可以確保輸出資源不會包含錯誤
		new webpack.NoEmitOnErrorsPlugin(),

		new FriendlyErrorsPlugin()
	].concat(config.template.map(template => {
		let chunkName = template.split(path.sep).slice(-2)[0];

		return new HtmlWebpackPlugin({
			filename: chunkName + '.html',
			template: template,
			chunks: [chunkName].concat(commonsChunk),
			// 排序整理
			chunksSortMode: function(chunk1, chunk2) {
				let
					entrys = Object.keys(config.entry),
					vendors = commonsChunk;

				let 
					orders = ['manifest'].concat(vendors, entrys),
					order1 = orders.indexOf(chunk1.names[0]),
					order2 = orders.indexOf(chunk2.names[0]);

				if (order1 > order2) {
				    return 1;
				} else if (order1 < order2) {
				    return -1;
				} else {
				    return 0;
				}
			}
		});
	}))
}, baseWebpackConfig)