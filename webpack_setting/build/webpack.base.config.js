const path = require("path"),
	webpack = require("webpack"),
	Glob = require("glob").Glob;

const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

// 升級webpack4 MiniCssExtractPlugin取代ExtractTextPlugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { nowConfig, pathJoin } = require("./util");

const config = nowConfig();

const VueLoaderPlugin = require("vue-loader/lib/plugin");

function getPath(...args) {
	return pathJoin(config.assetsRoot, ...args);
}

function getCommonsChunk() {
	return new Glob("!(_)*/!(_)*.js", {
		cwd: getPath("pages", "common"),
		sync: true,
	}).found.map(file => getPath("pages", "common", file));
}

const commonsChunk = config.isOpenSyncImport
	? {}
	: Object.assign(
			{
				common: getCommonsChunk(),
			},
			config.commons
	  );

function getCommonsChunkPluginSetting() {
	return config.isOpenSyncImport
		? config.minChunkSize
			? [
					//
					new webpack.optimize.MinChunkSizePlugin({
						minChunkSize: config.minChunkSize || 10000,
					}),
			  ]
			: []
		: [
				// 共用模塊抽離
				new webpack.optimize.CommonsChunkPlugin({
					names: ["manifest"].concat(Object.keys(commonsChunk)),
					minChunks: module => {
						return module.resource && /node_modules/.test(module.resource);
					},
				}),
		  ];
}
module.exports = {
	entry: Object.assign(
		{},
		config.entry,
		commonsChunk,
		{ main: "@/style/layout" },
		{ "rwd-content": "@/style/rwd-content" }
	),

	output: {
		path: config.buildRoot,
		filename: pathJoin("js", "[name].js"),
		chunkFilename: pathJoin("js", "[name].js"),
		publicPath: config.publicPath,
	},

	resolve: {
		extensions: [".js", ".vue", ".json", ".css", ".sass", ".scss"],
		alias: config.commonAlias,
	},

	externals: config.externals,

	module: {
		rules: [
			{
				test: /\.vue$/,
				use: {
					loader: "vue-loader",
					options: {
						loaders: {
							css: [devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
						},
					},
				},
			},
			{
				test: /\.m?js$/,
				exclude: ["/node_modules/", path.join(__dirname, "../../", "f2e_lib/vendors")],
				include: [config.assetsRoot, path.resolve(__dirname, "..", "text"), path.join(__dirname, "../../", "f2e_lib")],
				loader: "babel-loader",
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: {
					loader: "url-loader",
					options: {
						limit: 10000,
						name: pathJoin(config.staticAssets, "/img/[name].[hash:8].[ext]"),
					},
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				use: {
					loader: "url-loader",
					options: {
						limit: 10000,
						name: pathJoin(config.staticAssets, "/fonts/[name].[hash:8].[ext]"),
					},
				},
			},
			{
				test: /\.s[ac]ss$/i,
				exclude: /node_modules/,
				use: [MiniCssExtractPlugin.loader, "css-loader?sourceMap", "postcss-loader", "sass-loader?sourceMap"],
			},
			{
				test: /\.pug$/,
				use: ["html-loader", "pug-html-loader"],
			},
		],
	},

	plugins: [
		// 全域JQ
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			Util: "exports-loader?Util!bootstrap/js/dist/util", // fixed bs4 js bug
		}),

		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: pathJoin("css", "[name].css"),
		}),

		new VueLoaderPlugin(),

		// 檢查外部依賴套件是否更新
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require(`${config.assetsRoot}/${config.staticAssets}/libs/js/manifest_vendors.json`),
		}),

		// 插入自定義套件到html中
		new AddAssetHtmlPlugin([
			{
				filepath: pathJoin(config.assetsRoot, config.staticAssets, "libs/js/vendors.js"),
				publicPath: pathJoin(config.publicPath, config.staticAssets, "libs/js"),
				outputPath: pathJoin(config.staticAssets, "libs/js"),
				files: config.libraryEntry.map(entry => entry + ".html"),
				includeSourcemap: false,
			},
		]),
	].concat(getCommonsChunkPluginSetting()),
};
