import CARTDIALOG_TMPL from "@page/cart/template/addonCartDialogTmpl.pug";
import AlertDialog from "@global/helpers/alertDialog";
import NewImage from "@global/components/global/image";
import messageBox from "@global/helpers/messageBox";
import ArrivalNotice from "@global/components/product_vue/ArrivalNotice_vue"; // 索取到貨通知
import gtmTrace from "@global/components/tracing/gtm";
import utmKDetect from "@global/helpers/utmKDetect";

module.exports = {
	template: `${CARTDIALOG_TMPL}`,
	data() {
		return {
			alldatas: {},
			selectedID: null,
			selected: {},
			hasstock: true,
			isopen: false,
			selectedSpec: null,
			selectedSpecID: null,
			selectedSpecKey: null,
			counter: 1,
			btnStyle: "disabled",
			btnDescription: this.btndescription.genernal,
			checkisopen: false,
			dataisload: false,
			openArrivalNotice: false,
			itemSpecInfo: "",
		};
	},
	components: { NewImage, ArrivalNotice },
	props: ["isnotice", "btndescription"],
	computed: {
		btnStyleGenerate: {
			get() {
				if (this.alldatas.IsPreShow) {
					this.btnStyle = "disabled";
				} else if (!this.hasstock) {
					this.btnStyle = "disabled";
				}

				return this.btnStyle;
			},
			set(newVal) {
				this.btnStyle = newVal;
			},
		},
		btnDescriptionGenerate: {
			get() {
				if (this.alldatas.IsPreShow) {
					this.btnDescription = this.btndescription.preShow;
				} else if (this.isnotice && !this.hasstock) {
					this.btnDescription = this.btndescription.notice;
				} else if (!this.hasstock) {
					this.btnDescription = this.btndescription.soldout;
				}

				return this.btnDescription;
			},
			set(newVal) {
				this.btnDescription = newVal;
			},
		},
		getEventPrice() {
			return this.alldatas.EventPrice > 0 && this.alldatas.EventPrice < this.alldatas.SellPrice
				? this.alldatas.EventPrice.toLocaleString()
				: this.alldatas.SellPrice.toLocaleString();
		},
	},
	watch: {
		selectedID() {
			this.getSelectedData();
		},
	},
	methods: {
		closeArrivalNotice() {
			this.openArrivalNotice = false;
		},
		checkHasStock() {
			var _this = this;
			_this.hasstock = false;
			_this.selected.Specs.forEach(function (element, index) {
				if (parseInt(element.Stock) !== 0) {
					_this.hasstock = true;
				}
			});
		},
		getSelectedData() {
			var _this = this;
			this.alldatas.Colors.forEach(function (element, index) {
				if (element.ID === _this.selectedID) {
					_this.selected = element;
				}
			});
			// this.checkHasStock();
		},
		closeSelf() {
			this.isopen = false;
			this.btnReset();
			this.clearSpec();
		},
		selectSpec(spec) {
			this.selectedSpec = spec;
			this.selectedSpecID = spec.ID;
			this.selectedSpecKey = spec.Key;
			this.resetCounter();
			this.btnActive(spec.Stock, spec.IsOutOfStock, spec.PreOrder);
		},
		clearSpec() {
			this.selectedSpec = null;
			this.selectedSpecID = null;
			this.selectedSpecKey = null;
		},
		addCount(maxCount) {
			if (this.counter >= maxCount || this.counter >= 10) return;
			this.counter++;
		},
		reduceCount() {
			if (this.counter <= 1) return;
			this.counter--;
		},
		resetCounter() {
			this.counter = 1;
		},
		changeImg(colorID) {
			if (this.selected.ID === colorID) return;
			this.btnReset();
			this.clearSpec();
			this.resetCounter();
			this.selectedID = colorID;
		},
		btnActive(stock, isSoldOut, isPreOrder) {
			if (this.alldatas.IsPreShow) return;
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
				this.btnDescriptionGenerate = this.btndescription.addbag;
			}
		},
		btnReset() {
			this.btnStyleGenerate = "disabled";
			this.btnDescriptionGenerate = this.btndescription.genernal;
		},
		addToCart() {
			var _this = this;
			var custommarketid = this.alldatas.CustomMarketID;
			var itemSpecInfo =
				custommarketid.substring(0, custommarketid.indexOf("CL")) +
				"CL" +
				this.selectedID +
				"SZ" +
				this.selectedSpecKey;
			this.itemSpecInfo = itemSpecInfo;

			if (this.alldatas.IsPreShow) return;

			if (this.selectedSpec === null) {
				AlertDialog.alert("請選擇尺寸");
				return;
			}

			if (this.selectedSpec.Stock === 0 && this.isnotice) {
				return;
			} else if (this.selectedSpec.Stock === 0) {
				return;
			}

			let utmData = utmKDetect(itemSpecInfo) === null ? null : utmKDetect(itemSpecInfo);

			$.ajax({
				type: "POST",
				url: API_URL.SHOPPING_CART,
				dataType: "json",
				data: {
					CustomMarketID: itemSpecInfo,
					Count: _this.counter,
					UtmTag: utmData,
				},
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200 || res.Code === 406) {
						_this.checkisopen = false;
						messageBox.cart("加入購物車");
						appNotificationCart.getShoppingDatas();
						gtmTrace.addToCart({
							name: _this.alldatas.Name,
							id: itemSpecInfo,
							price:
								_this.alldatas.EventPrice > 0 && _this.alldatas.EventPrice < _this.alldatas.SellPrice
									? _this.alldatas.EventPrice
									: _this.alldatas.SellPrice,
							color: _this.selected.Name,
							count: _this.counter,
						});
						location.reload();
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
		itemCheck: function (val) {
			this.checkisopen = val;
		},
		showProductInfo() {
			$("#popup-addon-detail").appendTo("body").modal("show");
			$(".modal-backdrop").css("z-index", "2000");
		},
	},
};
