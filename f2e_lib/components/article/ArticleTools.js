export default {
	getUrlArgs: function (arg) {
		var url = window.location.toString(); // 取得當前網址
		var str = ""; // 參數中等號左邊的值
		var strValue = ""; // 參數中等號右邊的值

		// 如果網址有'?'符號
		if (url.indexOf("?") !== -1) {
			// 取得'?'右邊網址後利用'&'分割字串存入ary陣列
			var ary = url.split("?")[1].split("&");

			for (var i in ary) {
				// 取得參數'='左邊的值存入 str 變數中
				str = ary[i].split("=")[0];
				if (str === arg) {
					strValue = decodeURI(ary[i].split("=")[1]);
				}
			}
		}

		return strValue;
	},

	getPageType: function () {
		var url = window.location.toString();
		var strEnd = url.indexOf("?") !== -1 ? url.indexOf("?") : url.length;
		var getStr = url.substring(url.lastIndexOf("/") + 1, strEnd).toLowerCase();
		var pageType = getStr.indexOf("detail") !== -1 ? "detail" : "list";

		return pageType;
	},

	dateFormate: function (dataSrc) {
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		var dateArray = dataSrc.split("/");
		var y = dateArray[0];
		var m = monthNames[dateArray[1] - 1];
		var d = dateArray[2];

		var date = m + " " + d + ", " + y;
		return date;
	},
};
