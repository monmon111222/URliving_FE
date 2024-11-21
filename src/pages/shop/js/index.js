import common from "@page/common/js/common";
import Pagination from "@page/common/js/Pagination";
import wishBtn from "@global/components/member/wishBtn";
import shareBtn from "@page/common/dialog/shareBtn.vue";
import sortControl from "@page/shop/js/sort";
import Slick from "@global/vendors/vue-slick";
require("@global/vendors/jquery.sticky-kit");
import cartDialog from "@page/common/dialog/cartDialog.vue";
import setEnv from "@global/helpers/setEnv";
import axios from "axios";

Vue.config.devtools = true;

new Vue({
	el: "#pagination",
	components: {
		Pagination,
	},
	template: `<Pagination :onepageqty="20"></Pagination>`,
});

const sortApp = {
	template: `<sort-control :condition="data" :isload="isload"></sort-control>`,
	components: {
		sortControl,
	},
	props: ["data", "isload"],
};

const app = new Vue({
	el: "#app-shop",
	components: {
		wishBtn,
		shareBtn,
		sortApp,
		cartDialog,
	},
	data: {
		largeMode: false,
		sortConditionDatas: null,
		sortConditionIsLoad: false,
		bannerSliderConfig: {
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			speed: 800,
			autoplay: true,
			autoplaySpeed: 6000,
		},
		isNotice: true,
	},
	created() {
		this.getSortCondition();
	},
	mounted: function () {
		if ($(".banner-slide").length) {
			$(".banner-slide").slick(this.bannerSliderConfig);
		}
	},
	methods: {
		getSortCondition() {
			var _this = this;
			$.ajax({
				type: "GET",
				url: API_URL.SORT_POPUP,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				success(res) {
					if (res.Code === 200) {
						_this.sortConditionDatas = res.Response;
						_this.sortConditionIsLoad = true;
					}
				},
			});
		},
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
