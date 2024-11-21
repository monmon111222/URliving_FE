import common from "@page/common/js/common";
import cartDialog from "@page/common/dialog/cartDialog.vue";
import favoriteApp from "@page/favorite/js/favorite.vue";
import setEnv from "@global/helpers/setEnv";
import axios from "axios";

const app = new Vue({
	el: "#app-favorite",
	components: {
		favoriteApp,
		cartDialog,
	},
	data: {
		isNotice: true, // 是否打開貨到通知功能
	},
});

$(document).on("click", ".open-dialog", function (e) {
	e.preventDefault();
	var $el = $(this);
	var elCustomMarketID = $el.data("custommarketid");

	axios
		.get(API_URL.MARKET_CONTENT, {
			CustomMarketID: elCustomMarketID,
		})
		.then((res) => {
			if (res.data.Code === 200) {
				if (!setEnv.myEquipment()) {
					$("#modal-market").modal("show");
				} else {
					app.$refs.c_dialog.isOpen = true;
				}
				app.$refs.c_dialog.allData = res.data.Response;
				app.$refs.c_dialog.selectedID = res.data.Response.ColorID;
				app.$refs.c_dialog.dataLoad = true;
			} else {
				AlertDialog.alert("系統忙線中,請稍後再試");
			}
		});
});

$(".tab_product").click(function (e) {
	$(".tabs__nav a").removeClass("active");
	$(this).addClass("active");
	$(".tab_content").addClass("hide");
	$(".product_content").removeClass("hide");
});

$(".tab_brand").click(function (e) {
	$(".tabs__nav a").removeClass("active");
	$(this).addClass("active");
	$(".tab_content").addClass("hide");
	$(".brand_content").removeClass("hide");
});
