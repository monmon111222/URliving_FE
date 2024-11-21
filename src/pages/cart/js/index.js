import $ from "jquery";
import validate from "@global/vendors/jquery.validate.min";
import Cookies from "js-cookie";
import common from "@page/common/js/common";
import cartItemList from "@page/cart/components/cartItemList.vue";
import cartPay from "@page/cart/components/CartPay.vue";
import cartMemo from "@page/cart/components/CartMemo.vue";
import cartTemp from "@page/cart/components/CartTemp.vue";
import addonCart from "@page/cart/components/AddonCart.vue";
import indexTemplate from "@page/cart/template/index.pug";
import AlertDialog from "@global/helpers/alertDialog";
import shoppingList from "@page/cart/components/ShoppingList.vue";

import store from "@global/components/store/index.js";

import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers("cartModule");

if (process.env.NODE_ENV === "development") {
	Vue.config.devtools = true;
}

const appCart = new Vue({
	name: "App-Cart",
	el: "#app-cart",
	template: indexTemplate,
	store,
	components: {
		cartTemp,
		cartItemList,
		cartPay,
		cartMemo,
		addonCart,
		shoppingList,
	},
	watch: {
		userSelect: {
			deep: true,
			handler(val) {
				if (this.isCalling) return;
				this.getShoppingData(val);
			},
		},
	},
	created() {
		// 判斷使用者之前是否自行設定過 coupon 券
		if (Cookies.get("coupon") !== undefined) {
			let couponCode = Cookies.get("coupon");
			this.changeUserSelect({
				userSelectKey: "coupon",
				userSelectValue: couponCode,
			});
		}

		if (this.userSelect.coupon.length === 0) {
			if (Cookies.get("autocoupon") === undefined) {
				this.changeUserSelect({
					userSelectKey: "autoPickCoupon",
					userSelectValue: 1,
				});
			} else {
				this.changeUserSelect({
					userSelectKey: "autoPickCoupon",
					userSelectValue: Number(Cookies.get("autocoupon")),
				});
			}
		}

		this.initCartInfo();
		this.initCartTab();
		this.getShoppingData(this.userSelect);
	},
	mounted() {
		var _this = this;
		$("#form-shopping-cart").validate({
			errorClass: "error",
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
			errorPlacement(error, element) {
				element.parent().append(error);
			},
			submitHandler(form) {
				if (!_this.can_paytype) {
					AlertDialog.alert(window.checkPayMethod || "請確認您的付款方式");
				} else if ($("#no-cvs").length !== 0) {
					AlertDialog.alert("請選擇超商");
				} else if (!_this.IsOffshoreIsland && !_this.isCVSShoreIsland()) {
					AlertDialog.alert(window.shippingError || "Oops！您的商品超過此運送方式限制，請更改配送方式或分開訂購喔！");
				} else if (_this.shoppingData.length === 0) {
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
	},
	data: {
		VerificationTokenValue: window.VerificationTokenValue,
		actionStr: "/zh-tw/checkout/step2",
		NowMyEquipment:
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			window.innerWidth <= 1024,
	},
	computed: {
		...mapState([
			"userSelect",
			"dataIsLoad",
			"detectLang",
			"memo",
			"isCalling",
			"can_paytype",
			"shoppingData",
			"hasPreOrder",
			"IsOffshoreIsland",
			"addOnEvents",
			"cartTotalWithoutAddon",
			"nextBuyData",
			"nextBuyDataIsLoad",
			"nextBuyTotal",
		]),
		actionStr() {
			if (this.detectLang === "en") {
				this.actionStr = "/en-us/checkout/step2";
			} else if (this.detectLang === "jp") {
				this.actionStr = "/ja-jp/checkout/step2";
			} else if (this.detectLang === "cn") {
				this.actionStr = "/zh-cn/checkout/step2";
			} else {
				this.actionStr = "/zh-tw/checkout/step2";
			}
		},
	},
	methods: {
		...mapMutations(["changeUserSelect", "changeUserInfo", "initCartInfo", "initCartTab"]),
		...mapActions(["getShoppingData", "getNextBuyData"]),
		isCVSShoreIsland() {
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
	},
	filters: {
		autoSupplement: function (value) {
			if (value < 10) {
				return "0" + value;
			} else {
				return value;
			}
		},
	},
});
