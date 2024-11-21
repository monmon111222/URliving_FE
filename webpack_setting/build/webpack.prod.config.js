/**
 * 生產環境 webpack 配置
 */

const path = require("path"),
	webpack = require("webpack"),
	webpackMerge = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin"),
	OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin"),
	CopyWebpackPlugin = require("copy-webpack-plugin"),
	CompressionWebpackPlugin = require("compression-webpack-plugin"),
	BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

const baseWebpackConfig = require("./webpack.base.config"),
	{ nowConfig, commonsChunkName } = require("./util");

const API_CONFIG = require("../../src/api/api_config_production");

const config = nowConfig();

const commonsChunk = commonsChunkName();

module.exports = webpackMerge(
	{
		devtool: "source-map",

		mode: "production",

		// 針對NPM中的協力廠商模組優先採用jsnext:main中指向的ES6模組化的檔案
		// 因為 scope hoisting 需採用ES6語法
		resolve: {
			mainFields: ["jsnext:main", "browser", "main"],
		},

		plugins: [
			new webpack.DefinePlugin({
				"process.env": config.env,
				API_URL: API_CONFIG,
			}),

			// 壓縮css **在壓縮css keyframes name時有問題**
			// new OptimizeCSSPlugin(),

			// scope hoisting: 減少、優化打包代碼
			new webpack.optimize.ModuleConcatenationPlugin(),

			// 壓縮靜態檔案
			new CompressionWebpackPlugin({
				asset: "[path].gz[query]",
				algorithm: "gzip",
				test: /\.js$|\.html$/,
				threshold: 10240,
				minRatio: 0.8,
			}),

			// 拷貝靜態資源
			new CopyWebpackPlugin([
				{
					from: path.join(config.assetsRoot, config.staticAssets),
					to: path.join(config.buildRoot, config.staticAssets),
				},
			]),

			// bundle分析 https://segmentfault.com/a/1190000012220132
			// 使用webpack-bundle-analyzer 可以看到項目各模塊的大小，可以按需優化
			new BundleAnalyzerPlugin(),
		].concat(
			config.template.map(template => {
				let chunkName = template.split(path.sep).slice(-2)[0];

				return new HtmlWebpackPlugin({
					filename: chunkName + ".html",
					template: template,
					chunks: [chunkName].concat(commonsChunk),
					inject: true,
					minify: {
						removeComments: true,
						collapseWhitespace: true,
						removeAttributeQuotes: false,
					},
					showErrors: true,
					chunksSortMode: function(chunk1, chunk2) {
						let entrys = Object.keys(config.entry),
							vendors = commonsChunk;

						let orders = ["manifest"].concat(vendors, entrys),
							order1 = orders.indexOf(chunk1.names[0]),
							order2 = orders.indexOf(chunk2.names[0]);

						if (order1 > order2) {
							return 1;
						} else if (order1 < order2) {
							return -1;
						} else {
							return 0;
						}
					},
				});
			})
		),

		//壓縮js
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					parallel: true,
					extractComments: false,
				}),
			],
			// minimizer: [
			// 	new UglifyJSPlugin({
			// 		exclude: /\.min\.js$/,
			// 		cache: true,
			// 		parallel: true, // 開啟並行壓縮
			// 		sourceMap: true,
			// 		extractComments: false, // 移除註解
			// 		uglifyOptions: {
			// 			compress: {
			// 				unused: true,
			// 				warnings: false,
			// 				drop_debugger: true,
			// 				drop_console: true,
			// 			},
			// 			output: {
			// 				comments: false,
			// 			},
			// 		},
			// 	}),
			// ],
			nodeEnv: "production",
		},
	},
	baseWebpackConfig
);
