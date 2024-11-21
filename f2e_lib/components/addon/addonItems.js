import axios from "axios";
import Slick from "@global/vendors/vue-slick";
import ShopAddonItemsTmpl from "@page/cart/template/shopAddonItemsTmpl.pug";
import imgTransfer from "@global/helpers/imgTransfer";
import MessageBox from "@global/helpers/messageBox";
import utmKDetect from "@global/helpers/utmKDetect";
import store from "@global/components/store/index.js";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("miniCartModule");

let addonItems = {
	name: "AddonItems",
	template: ShopAddonItemsTmpl,
	store,
	props: ["addonData", "dataIsLoad", "maxShow", "type", "hasMainItem", "customSlick"],
	data() {
		return {
			selectedCustomMarketID: this.addonData.map(() => "default"),
			selectedCount: this.addonData.map(() => 1),
			selectIsOpen: false,
		};
	},
	mounted() {
		if (this.type === "shoppingCart") {
			$(".addon-slide").not(".slick-initialized").slick(window.cartAddonSlide);
		}
		if (this.customSlick === true) {
			$(".addon-slide").not(".slick-initialized").slick(window.cartAddonSlide);
		}
	},
	computed: {
		/**
		 * 取得加價購商品各規格的庫存數量
		 */
		stockArray() {
			let stockArr = [];
			this.addonData.forEach((item, index) => {
				let specStockCount = [];
				item.Specs.forEach((spec) => {
					specStockCount.push({
						customMarketID: spec.CustomMarketID,
						stock: spec.Stock,
					});
				});
				stockArr.push(specStockCount);
			});
			return stockArr;
		},
	},
	methods: {
		...mapActions(["getCartInfo"]),
		getItemDetail(customMarketID) {
			axios
				.get(`${API_URL.MARKET_CONTENT}`, {
					params: {
						CustomMarketID: customMarketID + "SZ_",
					},
				})
				.then((res) => {
					this.$emit("showPopupDetail", {
						detailData: res.data.Response,
					});
				})
				.catch(() => {
					AlertDialog.alert("系統忙線中,請稍後再試", function () {
						window.location.href = "/";
					});
				});
		},
		addToCart(idx) {
			if (this.selectedCustomMarketID[idx] === "default") {
				AlertDialog.alert("請選擇規格");
				return;
			}

			let utmData =
				utmKDetect(this.selectedCustomMarketID[idx]) !== null ? utmKDetect(this.selectedCustomMarketID[idx]) : "";

			axios
				.post(`${API_URL.SHOPPING_CART}`, {
					CustomMarketID: this.selectedCustomMarketID[idx],
					Count: this.selectedCount[idx],
					UtmTag: utmData,
				})
				.then((res) => {
					if (res.data.Code === 200 || res.data.Code === 406) {
						MessageBox.cart("加入購物車");
						this.getCartInfo();
					} else if (res.data.Code === 205) {
						AlertDialog.alert("商品已售完", function () {
							location.reload();
						});
					} else {
						AlertDialog.alert(res.data.Message);
					}
				});
		},
		renderPic(picUrl, sizeStr) {
			return imgTransfer(picUrl, sizeStr);
		},
		showCartDialog(customMarketID) {
			this.$emit("showCartDialog", customMarketID);
		},
		onMinus(index) {
			if (this.selectedCount[index] <= 1) return;
			this.$set(this.selectedCount, index, this.selectedCount[index] - 1);
		},
		onPlus(index) {
			if (this.selectedCustomMarketID[index] === "default") {
				AlertDialog.alert("請選擇商品規格");
				return;
			}
			let itemStock = this.stockArray[index].find((item) => item.customMarketID === this.selectedCustomMarketID[index]);
			if (this.selectedCount[index] >= itemStock.stock) return;
			if (this.selectedCount[index] >= 10) return;
			this.$set(this.selectedCount, index, this.selectedCount[index] + 1);
		},
		openSelector() {
			this.selectIsOpen = !this.selectIsOpen;
		},
		checkAddonInCart() {
			this.$emit("showAddonWarnText");
		},
	},
};

export default addonItems;
