export default {
	getUrlArgs: function (arg) {
		const url = window.location.toString(); // 取得當前網址
		let str = ""; // 參數中等號左邊的值
		let strValue = ""; // 參數中等號右邊的值

		// 如果網址有'?'符號
		if (url.indexOf("?") !== -1) {
			// 取得'?'右邊網址後利用'&'分割字串存入ary陣列
			const ary = url.split("?")[1].split("&");
			// console.log(ary)

			for (const i in ary) {
				// 取得參數'='左邊的值存入 str 變數中
				str = ary[i].split("=")[0];
				if (str === arg) {
					strValue = decodeURI(ary[i].split("=")[1]);
				}
			}
		}

		return strValue;
	},

	getNowCategory: function () {
		let cate;
		let url = window.location.toString();
		if (url.indexOf("/") !== -1) {
			cate = url.split("/");
			cate.splice(0, 3);
		}

		// 如果網址有'?'符號，把後面的刪掉
		if (url.indexOf("?") !== -1) {
			const cateLength = cate.length;
			const lastCate = cate[cateLength - 1];
			const indexNum = lastCate.indexOf("?");
			const newLastCate = lastCate.substring(0.0, indexNum);

			cate[cateLength - 1] = newLastCate;
		}

		return cate;
	},

	getPageType: function () {
		const cate = this.getNowCategory();
		const location = window.location.toString().toLowerCase();
		if (location.indexOf("search") === -1) {
			return cate[0] === "WOMEN" && !cate[1] ? "newest" : "normal";
		} else {
			return "search";
		}
	},

	verifyPageType: function (verifyPage) {
		// 後來沒用到，但先留著
		const pageType = this.getPageType();
		return pageType === verifyPage.toLowerCase();
	},
	isEmptyObject: function (e) {
		let t;
		for (t in e) {
			return !1;
		}
		return !0;
	},
};
