import SPEC_TMPL from "@page/shopContent/js/specTmpl";
import gtmTrace from "@global/components/tracing/gtm";
// import Addon from "@page/shopContent/js/addon";

module.exports = {
	template: SPEC_TMPL,
	props: ["selected", "alldatas", "dataisload", "hasstock", "btndescription"],
	components: {
		Addon,
	},
	data() {
		return {
			selectedSpec: null,
			selectedSpecID: null,
			selectedSpecKey: null,
			counter: 1,
			btnStyle: "disabled",
			btnDescription: this.btndescription.default,
			isopen: false,
			windowHeight: 0,
			CustomMarketID: window.CustomMarketID.substring(0, CustomMarketID.indexOf("CL")),
			carAddMainItem: false,
		};
	},
	watch: {
		dataisload: function (val) {
			if (val) {
				this.pickSize(this.alldatas.ColorID);
			}
			if (val && window.matchMedia("(min-width: 768px)").matches) {
				this.$nextTick(() => {
					$("#info-sidebar").stick_in_parent({
						offset_top: $(window).height() / 2 - $(this.$refs.infoblock).height() / 2,
					});
				});
			}
		},
	},
	computed: {
		btnStyleGenerate: {
			get: function () {
				if (this.alldatas.IsPreShow) {
					this.btnStyle = "disabled";
				}

				return this.btnStyle;
			},
			set: function (newVal) {
				this.btnStyle = newVal;
			},
		},
		btnDescriptionGenerate: {
			get: function () {
				if (this.alldatas.IsPreShow) {
					this.btnDescription = this.btndescription.preshow;
				}
				return this.btnDescription;
			},
			set: function (newVal) {
				this.btnDescription = newVal;
			},
		},
	},
	methods: {
		pickSize: function (colorID) {
			let data = this.alldatas.Colors.find((element) => element.ID === colorID);
			if (data.Specs.length === 1 && data.Specs[0].Name === "F") {
				this.selectSpec(data.Specs[0]);
			}
		},
		toggleFavorite: function () {
			var _this = this;
			$.ajax({
				type: "PUT",
				url: API_URL.FAVORITE,
				dataType: "json",
				data: {
					CustomMarketID:
						_this.alldatas.CustomMarketID.substring(0, _this.alldatas.CustomMarketID.indexOf("CL")) +
						"CL" +
						_this.selected.ID +
						"SZ_",
				},
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.selected.IsFavorite = !_this.selected.IsFavorite;

						if (_this.selected.IsFavorite) {
							_this.selected.FavoriteCount++;
						} else {
							_this.selected.FavoriteCount--;
						}
					} else if (res.Code === 401) {
						AlertDialog.alert("請先登入");
					} else {
						AlertDialog.alert("系統忙線中");
					}
				},
			});
		},
		selectSpec: function (spec) {
			this.selectedSpec = spec;
			this.selectedSpecID = spec.ID;
			this.selectedSpecKey = spec.Key;
			this.resetCounter();
			this.getBtnStatus(spec.Stock, spec.IsOutOfStock, spec.PreOrder);
		},
		clearSpec: function () {
			this.selectedSpec = null;
			this.selectedSpecID = null;
			this.selectedSpecKey = null;
		},
		addCount: function (maxCount, limit) {
			if (this.counter >= maxCount || this.counter >= 10) return;
			if (this.counter >= limit && limit !== 0) return;
			this.counter++;
		},
		reduceCount: function () {
			if (this.counter <= 1) return;
			this.counter--;
		},
		resetCounter: function () {
			this.counter = 1;
		},
		changeImg: function (colorID) {
			if (this.selected.ID === colorID) return;
			this.btnReset();
			this.clearSpec();
			this.resetCounter();
			// this.selectedID = colorID;

			this.$emit("change-slideindex", 0);
			this.$emit("change-selected", colorID);
			this.pickSize(colorID);
		},
		getBtnStatus: function (stock, isSoldOut, isPreOrder) {
			if (stock === 0 && isSoldOut && !isPreOrder) {
				// 現貨無庫存且斷貨
				this.btnStyleGenerate = "disabled";
				this.btnDescriptionGenerate = this.btndescription.soldout;
			} else if (stock === 0 && !isPreOrder) {
				// 現貨無庫存
				this.btnStyleGenerate = "active-mail";
				this.btnDescriptionGenerate = this.btndescription.notice;
			} else if (stock === 0 && isPreOrder) {
				// 預購無庫存
				this.btnStyleGenerate = "active-mail";
				this.btnDescriptionGenerate = this.btndescription.notice;
			} else {
				this.btnStyleGenerate = "active";
				this.btnDescriptionGenerate = this.btndescription.addCart;
			}
		},
		btnReset: function () {
			this.btnStyleGenerate = "disabled";
			this.btnDescriptionGenerate = this.btndescription.default;
		},
		addToCart: function () {
			var _this = this;
			var custommarketid = this.alldatas.CustomMarketID;
			var itemSpecInfo =
				custommarketid.substring(0, custommarketid.indexOf("CL")) +
				"CL" +
				this.selected.ID +
				"SZ" +
				this.selectedSpecKey;

			// if (this.alldatas.IsPreShow) return;

			this.$emit("changecmid", itemSpecInfo);

			if (this.selectedSpec === null) {
				AlertDialog.alert("請選擇尺寸");
				return;
			}
			if (this.selectedSpec.Stock === 0 && this.selectedSpec.IsOutOfStock && !this.selectedSpec.PreOrder) {
				// this.openArrivalNotice = true;
				return;
			} else if (this.selectedSpec.Stock === 0) {
				$("#lb-get-product-mail").modal("show");
				return;
			}

			$.ajax({
				type: "POST",
				url: API_URL.SHOPPING_CART,
				dataType: "json",
				data: "CustomMarketID=" + itemSpecInfo + "&Count=" + _this.counter,
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200 || res.Code === 406) {
						_this.checkisopen = false;
						appNotificationCart.getShoppingDatas();
						gtmTrace.addToCart({
							name: _this.alldatas.Name,
							id: itemSpecInfo,
							price: _this.alldatas.SellPrice,
							color: _this.selected.Name,
							count: _this.counter,
						});
						_this.carAddMainItem = true;
					} else if (res.Code === 205) {
						AlertDialog.alert("商品已售完", function () {
							location.reload();
						});
					} else {
						AlertDialog.alert(res.Message);
					}
				},
			});
		},
		showSizeChart: function () {
			$("#modal-sizechart").modal("show");
		},
	},
};
