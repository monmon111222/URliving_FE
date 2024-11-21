import common from "@page/common/js/common";
import Swiper, { Pagination, Scrollbar } from "swiper";
import axios from "axios";
import cartDialog from "@page/common/dialog/cartDialog.vue";
import setEnv from "@global/helpers/setEnv";

Vue.config.devtools = true;

new Swiper(".mySwiper", {
	speed: 400,
	spaceBetween: 100,
	modules: [Pagination, Scrollbar],
	pagination: {
		el: ".swiper-pagination",
		type: "fraction",
		formatFractionTotal(total) {
			return "0" + total;
		},
		formatFractionCurrent(current) {
			return "0" + current;
		},
	},
	scrollbar: {
		el: ".swiper-scrollbar",
		hide: true,
	},
});

const app = new Vue({
	name: "Index",
	el: "#home-content",
	components: {
		cartDialog,
	},
	data: {
		isNotice: true,
		popularList: [],
	},
	mounted() {
		this.getTrendList();
	},
	methods: {
		toggleFavorite(event) {
			let customMarketIDwithoutSZ = event.target.dataset.custommarketid;
			let isFavorite = event.target.classList.contains("icon-heart-active");

			if (isFavorite) {
				axios
					.delete(API_URL.FAVORITE, {
						CustomMarketID: customMarketIDwithoutSZ,
					})
					.then((res) => {
						if (res.data.Code === 200) {
							event.target.classList.remove("icon-heart-active");
						} else if (res.data.Code === 401) {
							AlertDialog.alert("請先登入");
						} else {
							AlertDialog.alert("系統忙線中");
						}
					});
			} else {
				axios
					.put(API_URL.FAVORITE, {
						CustomMarketID: customMarketIDwithoutSZ,
					})
					.then((res) => {
						if (res.data.Code === 200) {
							event.target.classList.add("icon-heart-active");
						} else if (res.data.Code === 401) {
							AlertDialog.alert("請先登入");
						} else {
							AlertDialog.alert("系統忙線中");
						}
					});
			}
		},
		getTrendList() {
			axios
				.get(API_URL.ARTICLE_LIST, {
					Category: "ALL",
					Limit: 2,
					Page: 1,
					Content: 1,
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.popularList = res.data.Response.Data;
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試", function () {
							window.location.href = "/";
						});
					}
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
