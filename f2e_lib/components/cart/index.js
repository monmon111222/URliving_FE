import $ from "jquery";
import validate from "@global/vendors/jquery.validate.min";
import Cookies from "js-cookie";
import itemCheck from "@global/components/cart/itemCheck";
import cartList from "@global/components/cart/cartList";
import cartGift from "@global/components/cart/cartGift";
import cartNextbuy from "@global/components/cart/cartNextbuy";
import cartPay from "@global/components/cart/cartPay";
import myCoupon from "@global/components/cart/myCoupon";
import cartMemo from "@global/components/cart/cartMemo";
import gtmTrace from "@global/components/tracing/gtm";
import indexTmpl from "@page/cart/js/indexTmpl";
import AlertDialog from "@global/helpers/alertDialog";
import MessageBox from "@global/helpers/messageBox";
import detectLang from "@global/helpers/detectLang";
import cookieMethod from "@global/helpers/cookieMethod";
import axios from "axios";
import AddonCart from "@global/components/addon/addonCart";
import AddonList from "@global/components/addon/addonList";
import utmKDetect from "@global/helpers/utmKDetect";

window.detectLang = detectLang();

if (process.env.NODE_ENV === "development") {
	Vue.config.devtools = true;
}

module.exports = {
	name: "CartApp",
	el: "#app-cart",
	template: indexTmpl,
	components: {
		itemCheck,
		cartList,
		cartGift,
		cartNextbuy,
		cartPay,
		myCoupon,
		cartMemo,
		AddonCart,
		AddonList,
	},
	watch: {
		userSelect: {
			deep: true,
			handler: function (val) {
				if (this.isCalling) return;
				this.getShoppingDatas(val);
				this.isCalling = true;
			},
		},
		dataIsLoad: function (val) {
			// yuyu mobile swipe delete功能
			if (val && window.isSwipe) {
				this.$nextTick(() => {
					SwipeDelete();
				});
			}
		},
	},
	created() {
		if (Cookies.get("coupon") !== undefined) {
			this.userSelect.coupon = Cookies.get("coupon");
		}

		if (this.userSelect.coupon.length === 0) {
			Cookies.get("autocoupon") === undefined
				? (this.userSelect.autoPickCoupon = 1)
				: (this.userSelect.autoPickCoupon = Cookies.get("autocoupon"));
		}

		if (this.userSelect.region !== 1) {
			this.isForeign = true;
		}

		// 拿取上筆訂單資訊
		this.userSelect.region = window.shipRegionType !== "0" ? parseInt(window.shipRegionType) : 1;
		this.userSelect.payType = window.payType !== "0" ? parseInt(window.payType) : "";
		this.userSelect.deliveryType =
			window.deliveryType !== "0" ? parseInt(window.deliveryType) : window.isFourBrand ? 3 : 1;
		this.userSelect.province = window.provinceType !== "0" ? parseInt(window.provinceType) : "";

		this.userSelect.installment = window.installmentPlan ? parseInt(window.installmentPlan) : "";

		this.getCVS();
		// 初始購物車資訊
		this.getNextBuyDatas(1);
		this.getShoppingDatas(this.userSelect);
	},
	data: {
		recommendID: "",
		shoppingDatas: [],
		nextBuyDatas: [],
		cartTotal: 0,
		nextBuyTotal: 0,
		favoriteTotal: 0,
		giftEvents: [],
		memo: {},
		userSelect: {
			region: 1,
			province: "",
			payType: "",
			deliveryType: 1,
			coupon: "",
			cvsCode: "",
			cvsName: "",
			cvsAddress: "",
			autoPickCoupon: 0,
			installment: 1,
		},
		isForeign: false,
		can_delivery: true,
		can_paytype: true,
		isCalling: true,
		dataIsLoad: false,
		nextbuyDataIsLoad: false,
		hasTwoTypes: false,
		isCartActive: true,
		isNextBuyActive: false,
		lockBtn: false,
		nextBuyLockBtn: false,
		myCoupon: [],
		couponPopupOpen: false,
		isEmployee: false,
		isFriend: false,
		VerificationTokenValue: window.VerificationTokenValue,
		IsOffshoreIsland: true, // 是否可以離島運送
		autoCouponCode: "",
		nextBuyPage: 2,
		cartTotalWithoutAddon: 0,
		addOnMarketCount: 0,
		addOnEvents: [],
		addOnItemArray: [],
		NowMyEquipment:
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			window.innerWidth <= 1024,
	},
	mounted() {
		var _this = this;
		$("#form-shopping-cart").validate({
			errorClass: "text-danger h6 pt-1 text-right",
			errorElement: "div",
			rules: {
				ShippingRegion: {
					required: true,
				},
				PayType: {
					required: true,
				},
				DeliveryType: {
					required: true,
				},
				province: {
					required: true,
				},
			},
			messages: {
				ShippingRegion: {
					required: "請選擇配送國家",
				},
				PayType: {
					required: window.checkPayMethod || "請選擇付款方式",
				},
				DeliveryType: {
					required: "請選擇運送方式",
				},
				province: {
					required: "請選擇省份",
				},
			},
			errorPlacement: function (error, element) {
				element.parent().append(error);
			},
			submitHandler: function (form) {
				if (!_this.can_paytype) {
					AlertDialog.alert(window.checkPayMethod || "請確認您的付款方式");
				} else if (!_this.can_delivery) {
					AlertDialog.alert(window.checkShippingMethod || "請確認您的運送方式");
				} else if ($("#no-cvs").length !== 0) {
					AlertDialog.alert("請選擇超商");
				} else if (!_this.IsOffshoreIsland && !_this.isCVSShoreIsland()) {
					AlertDialog.alert(window.shippingError || "Oops！您的商品超過此運送方式限制，請更改配送方式或分開訂購喔！");
				} else if (_this.shoppingDatas.length === 0) {
					AlertDialog.special(
						window.noItemInCart ||
							`<div>你的購物車沒有商品唷~</div><div class="mt-4"><a class="btn btn-secondary btn-block" href="/">來去逛逛</a></div>`
					);
				} else if (_this.memo.EmployeeMemo.Message.length !== 0) {
					AlertDialog.alert(_this.memo.EmployeeMemo.Message);
				} else {
					if (_this.memo.DeliveryMemo.AlertMessage.length !== 0) {
						AlertDialog.special(
							`<div class="text-left" style="line-break: anywhere;">${_this.memo.DeliveryMemo.AlertMessage}</div><div class="mt-4"><a class="btn-close-alert btn btn-secondary btn-block" href="#">我已明確了解此規範</a></div>`,
							function () {
								form.submit();
								$("#btn-go-checkout").addClass("disabled");
							}
						);
					} else {
						form.submit();
						$("#btn-go-checkout").addClass("disabled");
					}
				}
			},
		});

		// for yuyu
		if ($("#form-shopping-cart-pc")) {
			$("#form-shopping-cart-pc").validate({
				errorClass: "text-danger h6 pt-1 text-right",
				errorElement: "div",
				rules: {
					ShippingRegion: {
						required: true,
					},
					PayType: {
						required: true,
					},
					DeliveryType: {
						required: true,
					},
					province: {
						required: true,
					},
				},
				messages: {
					ShippingRegion: {
						required: "請選擇配送國家",
					},
					PayType: {
						required: window.checkPayMethod || "請選擇付款方式",
					},
					DeliveryType: {
						required: "請選擇運送方式",
					},
					province: {
						required: "請選擇省份",
					},
				},
				errorPlacement: function (error, element) {
					element.parent().append(error);
				},
				submitHandler: function (form) {
					if (!_this.can_paytype) {
						AlertDialog.alert(window.checkPayMethod || "請確認您的付款方式");
					} else if (!_this.can_delivery) {
						AlertDialog.alert(window.checkShippingMethod || "請確認您的運送方式");
					} else if ($("#no-cvs").length !== 0) {
						AlertDialog.alert("請選擇超商");
					} else if (!_this.IsOffshoreIsland && !_this.isCVSShoreIsland()) {
						AlertDialog.alert(window.shippingError || "Oops！您的商品超過此運送方式限制，請更改配送方式或分開訂購喔！");
					} else if (_this.shoppingDatas.length === 0) {
						AlertDialog.special(
							window.noItemInCart ||
								`<div>你的購物車沒有商品唷~</div><div class="mt-4"><a class="btn btn-secondary btn-block" href="/">來去逛逛</a></div>`
						);
					} else if (_this.memo.EmployeeMemo.Message.length !== 0) {
						AlertDialog.alert(_this.memo.EmployeeMemo.Message);
					} else {
						if (_this.memo.DeliveryMemo.AlertMessage.length !== 0) {
							AlertDialog.special(
								`<div class="text-left" style="line-break: anywhere;">${_this.memo.DeliveryMemo.AlertMessage}</div><div class="mt-4"><a class="btn-close-alert btn btn-secondary btn-block" href="#">我已明確了解此規範</a></div>`,
								function () {
									form.submit();
									$("#btn-go-checkout").addClass("disabled");
								}
							);
						} else {
							form.submit();
							$("#btn-go-checkout").addClass("disabled");
						}
					}
				},
			});
		}
		$.ajax({
			type: "GET",
			url: API_URL.FAVORITE + "?Page=1&PageSize=20",
			dataType: "json",
			xhrFields: {
				withCredentials: true,
			},
			error: function () {
				console.log("error");
			},
			success: function (res) {
				if (res.Code === 200) {
					_this.favoriteTotal = res.Response.TotalCount;
				}
			},
		});
	},
	methods: {
		checkChosingType: function (str) {
			// 檢查選擇方式值是否有效&是否存在
			if (str.indexOf("undefined") > -1 || str.indexOf("deliveryType") === -1 || str.indexOf("payType") === -1) {
				return false;
			} else {
				return true;
			}
		},
		isCVSShoreIsland: function () {
			var bool = true;
			var shoreIslandZipcodes = ["金門縣", "連江縣", "澎湖縣", "綠島鄉", "蘭嶼鄉", "琉球鄉"];

			if (this.userSelect.deliveryType === 2 || this.userSelect.deliveryType === 3) {
				// 選擇超商
				for (let el of shoreIslandZipcodes) {
					if (window.cvsAddress.indexOf(el) > -1) {
						bool = false;
						break;
					}
				}
				return bool;
			} else {
				return true;
			}
		},
		checkIfAllowIsland: function (data, giftEvents) {
			var _this = this;
			_this.IsOffshoreIsland = true;
			for (let el of data) {
				if (!el.IsOffshoreIsland) {
					_this.IsOffshoreIsland = false;
					break;
				}
			}
			for (var i = 0; i < giftEvents.length; i++) {
				for (let el of giftEvents[i].Gifts) {
					if (!el.IsOffshoreIsland) {
						_this.IsOffshoreIsland = false;
						break;
					}
				}
			}
		},
		checkIsEmployee: function () {
			if (this.memo.UserLevelMemo === null) return;
			if (this.memo.UserLevelMemo.Name === "員工") {
				window.isEmployee = true;
				this.isEmployee = true;
			} else {
				window.isEmployee = false;
				this.isEmployee = false;
			}

			if (this.memo.UserLevelMemo.Name === "親友團") {
				this.isFriend = true;
			}
		},
		renderImg: function (img) {
			imgTransfer(img.url, img.size);
		},
		getShoppingDatas: function (userSelect) {
			var _this = this;
			this.isCartActive = true;
			$.ajax({
				type: "GET",
				url: API_URL.SHOPPING_CART,
				dataType: "json",
				data: {
					ShippingRegion: userSelect.region,
					Province: userSelect.province,
					PayType: userSelect.payType,
					DeliveryType: userSelect.deliveryType,
					Coupon: userSelect.coupon,
					SortOut: 1,
					AutoPickCoupon: userSelect.autoPickCoupon,
				},
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.showShoppingList(res);
					} else if (res.Code === 205) {
						AlertDialog.special(
							detectLang === "en" || detectLang === "jp"
								? `<div>Remind you that this gift is not provided for overseas shipping and will be automatically removed!</div><div class="mt-4"><a class="btn-close-alert btn btn-secondary btn-block" href="#">Cancel gift</a></div>`
								: `<div>提醒您，此贈品不提供海外配送將自動移除!</div><div class="mt-4"><a class="btn-close-alert btn btn-secondary btn-block" href="#">取消贈品</a></div>`,
							function () {
								_this.showShoppingList(res);
							}
						);
					} else if (res.Code === 206) {
						AlertDialog.alert(
							detectLang === "en" || detectLang === "jp"
								? "Gift inventory changes, please reconfirm your shopping cart"
								: "贈品庫存異動，請重新確認購物車!",
							function () {
								_this.showShoppingList(res);
							}
						);
					} else if (res.Code === 406) {
						_this.showShoppingList(res);
						_this.hasTwoTypes = true;
					} else {
						AlertDialog.alert(window.severBusy || "系統忙線中,請稍後再試", function () {
							window.location.href = "/";
						});
					}
				},
			});
		},
		getNextBuyDatas: function (page) {
			var _this = this;

			_this.isCartActive = false;

			let nowPage = page === "loadmore" ? this.nextBuyPage : page;

			if (this.nextBuyTotal < this.nextBuyDatas.length) return;

			$.ajax({
				type: "GET",
				url: API_URL.NEXTBUY_CART + "?Page=" + nowPage + "&PageSize=10",
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						// 刷新下次買列表
						if (nowPage === 1) {
							_this.nextBuyDatas = res.Response.Data;
						} else {
							_this.nextBuyDatas = _this.nextBuyDatas.concat(res.Response.Data);
							if (_this.nextBuyPage < res.Response.PageCount) {
								_this.nextBuyPage++;
							}
						}
						// 刷新tab商品數量
						_this.nextBuyTotal = res.Response.TotalCount;

						// load data complete
						_this.nextbuyDataIsLoad = true;
						// unlock btn
						_this.toLockNextBuyBtn(false);
					} else {
						AlertDialog.alert(window.severBusy || "系統忙線中，請稍後再試");
					}
				},
			});
		},
		showShoppingList: function (res) {
			var _this = this;
			if (res.Response.ShoppingCart.Markets.length > 0) {
				_this.recommendID = res.Response.ShoppingCart.Markets[0].CustomMarketID;
			}
			// 檢查是否售完
			_this.checkIfSoldout(res.Response.Memo.SortOutMemo);
			// 刷新購物車列表
			_this.shoppingDatas = res.Response.ShoppingCart.Markets;
			// 刷新贈品列表
			_this.giftEvents = res.Response.ShoppingCart.GiftEvents;
			// 刷新tab商品數量
			_this.cartTotal = res.Response.ShoppingCart.Count;
			// 購物車中的一般商品數量
			_this.cartTotalWithoutAddon = res.Response.ShoppingCart.MarketCount;
			// 購物車中的加購品數量
			_this.addOnMarketCount = res.Response.ShoppingCart.AddOnMarketCount;
			// 加價購列表
			_this.addOnEvents = res.Response.ShoppingCart.AddOnEvents;

			_this.addOnItemArray = [];
			if (_this.addOnEvents.length) {
				_this.addOnEvents.forEach((addon) => {
					_this.addOnItemArray.push(...addon.Items);
				});
			}

			// 刷新header購物車
			appNotificationCart.feedData({
				Count: res.Response.ShoppingCart.Count,
				Markets: [...res.Response.ShoppingCart.Markets, ..._this.addOnItemArray],
			});

			// 刷新memo
			_this.memo = res.Response.Memo;
			// 判斷是否員工
			_this.checkIsEmployee();

			this.checkCoupon(res.Response.Memo.CouponMemo);
			if (res.Response.Memo.CouponMemo.Code !== null && this.userSelect.coupon.length === 0) {
				this.autoCouponCode = res.Response.Memo.CouponMemo.Code;
				Cookies.set("autocoupon", 1);
			}

			// 檢查付款方式可否使用
			_this.checkPay(res.Response.Memo.PayMemo);
			// 檢查運送方式可否使用
			// _this.checkDelivery(res.Response.Memo.DeliveryMemo);
			// 判斷是否有不允許離島配送商品
			_this.checkIfAllowIsland(res.Response.ShoppingCart.Markets, res.Response.ShoppingCart.GiftEvents);
			// load data complete
			_this.dataIsLoad = true;
			// unlock btn
			_this.toLockBtn(false);

			_this.isCalling = false;
		},
		updataShoppingDatas: function (data) {
			var _this = this;
			$.ajax({
				type: "PUT",
				url: API_URL.SHOPPING_CART,
				dataType: "json",
				data: { CustomMarketID: data.id, Count: data.count },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200 || res.Code === 409) {
						_this.getShoppingDatas(_this.userSelect);
						if (data.count === 0 && data.isGift === undefined) {
							gtmTrace.removeFromCart({
								name: data.datas.Name,
								id: data.datas.CustomMarketID,
								price: data.datas.SellPrice,
								color: data.datas.ColorName,
								count: data.datas.Count,
							});
						}
					} else {
						AlertDialog.alert(window.severBusy || "系統忙線中，請稍後再試");
					}
				},
			});
		},
		nextbuyMovetoCart: function (data) {
			var _this = this;

			_this.toLockBtn(true);

			let item = data.item;
			let utmData = utmKDetect(item.CustomMarketID) === null ? "" : utmKDetect(item.CustomMarketID);

			$.ajax({
				type: "POST",
				url: API_URL.SHOPPING_CART,
				dataType: "json",
				data: {
					CustomMarketID: item.CustomMarketID,
					Count: 1,
					UtmTag: utmData,
				},
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200 || res.Code === 406 || res.Code === 409) {
						_this.deleteNextbuyDatas({
							id: item.CustomMarketID,
							idx: data.idx,
						});
						_this.addCartTotal();
						// 埋入追蹤碼
						gtmTrace.addToCart({
							name: item.Name,
							id: item.CustomMarketID,
							price: "",
							color: item.ColorName,
							count: 1,
						});

						MessageBox.success(window.itemAddText || "加入成功", function () {
							_this.toLockBtn(false);
						});
					} else {
						AlertDialog.alert(window.severBusy || "系統忙線中,請稍後再試", function () {
							_this.toLockBtn(false);
						});
					}
				},
			});
		},
		deleteNextbuyDatas: function (data) {
			var _this = this;

			_this.toLockBtn(true);

			$.ajax({
				type: "DELETE",
				url: API_URL.NEXTBUY_CART + "?CustomMarketID=" + data.id,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					_this.toLockBtn(false);

					if (res.Code === 200 || res.Code === 406) {
						_this.nextBuyDatas.splice(data.idx, 1);
						_this.nextBuyTotal -= 1;
						_this.toLockNextBuyBtn(false);
					} else {
						AlertDialog.alert(window.severBusy || "系統忙線中,請稍後再試");
					}
				},
			});
		},
		// delete
		getCVS: function () {
			this.userSelect.cvsCode = window.cvsCode !== "" ? window.cvsCode : "";
			this.userSelect.cvsName = window.cvsName !== "" ? window.cvsName : "";
			this.userSelect.cvsAddress = window.cvsAddress !== "" ? window.cvsAddress : "";
		},
		checkIfSoldout: function (sortOutMemo) {
			if (sortOutMemo.Message !== "" && $('.alert-modal-style[data-name="alert-soldout"]').length === 0) {
				AlertDialog.alert(sortOutMemo.Message, undefined, "alert-soldout");
			}
		},
		/**
		 * @description 檢查折價券是否有效
		 * @param {String} couponMemo.Code 購物車折價券
		 * @param {String} couponMemo.Message 錯誤訊息
		 */
		checkCoupon: function (couponMemo) {
			if (this.userSelect.coupon !== "") {
				if (couponMemo.Code === null) {
					AlertDialog.alert(couponMemo.Message);
					this.userSelect.coupon = "";
					Cookies.remove("coupon");
				}
			}
		},
		checkDelivery: function (data) {
			var _this = this;
			_this.can_delivery = false;
			data.CanUseDelivery.forEach(function (element, index) {
				if (element == _this.userSelect.deliveryType) {
					_this.can_delivery = true;
				}
			});
		},
		checkPay: function (data) {
			var _this = this;
			_this.can_paytype = false;
			data.CanUsePay.forEach(function (element, index) {
				if (element == _this.userSelect.payType) {
					_this.can_paytype = true;
				}
			});
		},
		toLockBtn: function (bool) {
			this.lockBtn = bool;
		},
		toLockNextBuyBtn: function (bool) {
			this.nextBuyLockBtn = bool;
		},
		addCartTotal: function () {
			this.cartTotal++;
		},
		addNextbuyTotal: function () {
			this.nextBuyTotal++;
		},
		handleRegion: function (val) {
			this.userSelect.region = val;
			if (val !== 1) {
				// 海外
				this.isForeign = true;
			} else {
				this.isForeign = false;
			}
		},
		handleProvince: function (val) {
			this.userSelect.province = val;
		},
		handlePayType: function (val) {
			this.userSelect.payType = val;
		},
		handleDeliveryType: function (val) {
			this.userSelect.deliveryType = val;
		},
		handleCoupon: function (val) {
			if (val.length === 0 && this.userSelect.autoPickCoupon === 1) {
				// 取消自動選取折價券
				this.userSelect.autoPickCoupon = 0;
				this.autoCouponCode = "";
				Cookies.set("autocoupon", 0);
			} else {
				// 一般折價券
				this.userSelect.coupon = val;
				Cookies.set("coupon", val);
				this.userSelect.autoPickCoupon = 0;
				Cookies.set("autocoupon", 0);
				this.autoCouponCode = "";
			}
		},
		resetCart: function (val) {
			var _this = this;
			$.ajax({
				type: "DELETE",
				url: API_URL.SHOPPING_CART + "?Method=" + val,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.getNextBuyDatas(1);
						_this.getShoppingDatas(_this.userSelect);
						_this.hasTwoTypes = false;
					} else {
						AlertDialog.alert(res.Message);
					}
				},
			});
		},
		handlePopup: function (bool) {
			this.couponPopupOpen = bool;
		},
		mapCouponArrayData() {
			let shoppingCartItems = [];

			this.shoppingDatas.forEach((ele) => {
				let endIndex = ele.CustomMarketID.indexOf("CL");
				let marketID = ele.CustomMarketID.slice(4, endIndex);
				shoppingCartItems.push({
					MarketID: marketID,
					SellPrice: ele.SellPrice,
					Count: ele.Count,
				});
			});

			return shoppingCartItems;
		},
		openCouponPopup() {
			let shoppingCartItems = this.mapCouponArrayData();
			axios({
				method: "post",
				url: `${API_URL.COUPON2}`,
				data: {
					ShoppingCartItems: shoppingCartItems,
				},
			}).then((res) => {
				if (res.data.Code === 200) {
					this.myCoupon = res.data.Response;
					$("#lb-my-coupon").modal("show");
				} else if (res.data.Code === 401) {
					AlertDialog.alert("請先登入");
				} else {
					AlertDialog.alert(window.severBusy || "系統忙線中,請稍後再試");
				}
			});
		},
	},
};
