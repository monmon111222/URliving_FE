import freelayout from "@global/components/Home/freelayout";
import cartDialog from "@global/components/cart/cartDialog";

require("@global/vendors/slick");

freelayout.initSlick();
freelayout.transitionEffects();

const app = new Vue({
	el: "#app-event",
	template: `<div><cart-dialog ref="c_cartlib" :isnotice="isNotice" :btndescription="btnDescription"></cart-dialog></div>`,
	components: {
		cartDialog,
	},
	data: {
		isNotice: true, // 是否打開貨到通知功能
		btnDescription: {
			preShow: "COMING SOON",
			soldout: "SOLD OUT",
			notice: "SOLD OUT",
			genernal: "請選擇尺寸",
			addbag: "Add to bag",
		},
	},
});

$(document).on("click", ".show-item-detail", function (e) {
	e.preventDefault();
	let $el = $(this);
	let elCustomMarketID = $el.data("custommarketid");

	$.ajax({
		type: "GET",
		url: API_URL.MARKET_CONTENT + "?CustomMarketID=" + elCustomMarketID,
		dataType: "json",
		xhrFields: {
			withCredentials: true,
		},
		error: function () {
			console.log("error");
		},
		success: function (res) {
			if (res.Code === 200) {
				app.$refs.c_cartlib.isopen = true;
				app.$refs.c_cartlib.alldatas = res.Response;
				app.$refs.c_cartlib.selectedID = res.Response.ColorID;
				app.$refs.c_cartlib.dataisload = true;
			} else {
				AlertDialog.alert("系統忙線中,請稍後再試");
			}
		},
	});
});
