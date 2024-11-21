//**
// 此檔案為動態連結程式庫DLL設定黨
// 目的: 將 不常更新版本且大量重複使用套件 獨立拉出編譯一次
// 防止每次編譯需再次編譯這些大型檔案而耗費過多時間
// 請至 ./config/base.js裡的library array 設定套件
//**

const
	path = require('path'),
	webpack = require('webpack');

const config = require('../config/base');

const libsPath = path.resolve(__dirname, '../../src/static/libs/js');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: {
		// 將專案需要的所有套件(vendors.js)放到動態連結程式庫中
		vendors: config.library
	},

	output: {
		//將輸出檔案放到../static/libs/js目錄下
		path: libsPath,
		filename: '[name].js',

		// 儲存動態連結程式庫的全域變數名稱
		library: '[name]_library'
	},
	optimization: {
	    minimizer: [
	      new UglifyJsPlugin({
	        exclude: /\.min\.js$/, 
	        cache: true,
	        parallel: true, // 開啟並行壓縮
	        sourceMap: true,
	        extractComments: false, // 移除註解
	        uglifyOptions: {
	          compress: {
	            unused: true,
	            warnings: false,
	            drop_debugger: true
	          },
	          output: {
	            comments: false
	          }
	        }
	      })
	    ]
	},

	plugins: [
	    // 作用域提升(Scope Hoisting) 讓打包出來的文件更小、運行更快
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.DllPlugin({
			// 描述動態連結程式庫的manifest.json檔案輸出時的檔案名稱
			path: path.join(libsPath, 'manifest_[name].json'),
			name: '[name]_library',
			context: __dirname
		})
	]
}