import common from "@page/common/js/common";
import validate from "@global/vendors/jquery.validate.min";
import tab from "@global/helpers/tab";
import Collapse from "bootstrap/js/dist/collapse";
import modal from "bootstrap/js/dist/modal";
import order from "@page/order/js/order";
import Pagination from "@page/common/js/Pagination";

$("#app-order").append('<div id="pagination"></div>');

new Vue({
	el: "#pagination",
	template: `<Pagination :onepageqty="20"></Pagination>`,
	components: {
		Pagination,
	},
});

var failCount = 0;
var buyAgainData = JSON.parse(window.BuyAgainData);

async function reorderToCart() {
	for (let i = 0; i < buyAgainData.length; i++) {
		await $.ajax({
			type: "post",
			url: API_URL.SHOPPING_CART,
			dataType: "json",
			data: {
				CustomMarketID: buyAgainData[i].CMID,
				Count: buyAgainData[i].Count,
				UtmTag: buyAgainData[i].UtmTag,
			},
			xhrFields: {
				withCredentials: true,
			},
			error: function () {
				console.log("error");
			},
			success: function (res) {
				if (res.Code !== 200) {
					failCount++;
				}
			},
		});
	}

	//如果有商品成功加入購物車，全部都無法加入購物車才跳提示訊息
	if (failCount !== buyAgainData.length) {
		window.location.href = "/zh-tw/checkout";
	} else {
		AlertDialog.alert("無法再次購買", function () {
			location.reload();
		});
	}
}

$(".btn-reorder").click(function (event) {
	event.preventDefault();
	reorderToCart();
});
