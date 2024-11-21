/**
 * dev 中介層設定 (express + middleware + HMR)
 * 要實現 HMR，我們必須在 serve 靜態檔案的 server 上，
 * 包一層 middleware 來監聽改變、動態換掉檔案，而這一層就是 webpack-dev-middleware。
 *
 */

const 
    path = require('path'),
    express = require('express'),
    webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    proxyMiddleware = require('http-proxy-middleware'),
    chalk = require('chalk'),
    opn = require('opn');

const 
    config = require('../config').dev, // dev.env.js
    app = express();

process.env.NODE_ENV = JSON.parse(config.env.NODE_ENV);

const webpackConfig = require('./webpack.dev.config');

// HMR(Hot Module Replacement) 允許任何設定好的文件一但更改，元件便立即更換、不整頁刷新
function addHRM(entry) {
    let result = {};

    Object.keys(entry).forEach(key => {
        result[key] = [
            path.resolve(__dirname, './dev-client')
        ].concat(entry[key]);
    });

    return result;
}

// 讓每一頁index.js掛載HRM
webpackConfig.entry = addHRM(webpackConfig.entry);

const compiler = webpack(webpackConfig);

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: config.publicPath, //**必填
    noInfo: false,
    stats: {
        // cmd console 輸出樣式設定
        colors: true,
        chunks: false,
        modules: false,
        reasons: true,
        errorDetails: true
    }
});

const hotMiddleware = webpackHotMiddleware(compiler);

// html 加入 HRM
compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, callback) => {
        hotMiddleware.publish({ action: 'reload' });
        callback();
    })
});

Object.keys(config.proxy).forEach(key => app.use(key, proxyMiddleware(config.proxy[key])));

// 掛載中介軟體
app.use('/', express.static(path.resolve(__dirname, config.assetsRoot)));
// Add middleware
app.use(devMiddleware);
// Add hot middleware support
app.use(hotMiddleware);

let devServer = app.listen(0, () => {
    opn(`http://localhost:${devServer.address().port}`)
});


// 伺服器啟用
module.exports = devServer