# webpack-multiple-page (using pug, vuejs, scss/sass)

## 使用

``` shell
git clone 
cd [__dirname]
npm install
npm run dev
```

## 打包

配置兩種環境， `production`、`development`。

### dev

``` shell
npm run dev
```

### build

``` shell
npm run build
```

### dll(打包外部套件)

```  
npm run build:vendors
```

> *注意*: 如果需要打包外部套件，應先跑 `build:vendors` 指令，再執行編譯。
> 若需添加外部套件, 請至 ./config/base.js裡的library array 設定

## 專案結構

```
.
├── README.md
├── build
│   ├── build.js
│   ├── dev-client.js
│   ├── dev.js
│   ├── util.js
│   ├── webpack.base.config.js
│   ├── webpack.dev.config.js
│   ├── webpack.dll.config.js
│   └── webpack.prod.config.js
├── config
│   ├── base.js
│   ├── dev.env.js
│   ├── index.js
│   ├── prod.env.js
│   └── util.js
├── package-lock.json
├── package.json
└── src
    ├── pages
    │   ├── common (全站共用代碼)
    │   │   └── js
    │   │       └── common.js
    │   ├── index (頁面結構)
    │   │   ├── index.html
    │   │   ├── js
    │   │   │   ├── index.js
    │   │   
    │   └── component (全站共用component)
    │       
    └── static (靜態資源文件)
        ├── libs
        │   └── js
        │       ├── manifest_vendors.json
        │       └── vendors.js
        └── test.txt
```

### 每個頁面的基本結構

```
.my-page (頁面名稱)
├── index.html (渲染的html模版)
├── js
     └── index.js (入口)
```

## 配置

至`config/base.js`設定

## 備註

*參考 (https://github.com/Mrminfive/vue-multiple-page/)*