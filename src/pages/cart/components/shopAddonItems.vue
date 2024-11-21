<template>
	<div v-if="dataIsLoad">
		<div class="cart-addon-slick-block" v-if="type === 'shoppingCart'">
			<div class="addon-slide">
				<div class="item-container" v-for="item in addonData" :key="item.CustomMarketID_withoutSize">
					<div class="product-img">
						<a href="javascript:;">
							<new-image :url="item.Cover" :size="'_w198_h252'" :name="item.Name"></new-image>
						</a>
					</div>
					<p class="item-brand">{{ item.BrandName }}</p>
					<p class="item-name">{{ item.Name }}</p>
					<div class="item-price">
						<div class="item-price-count">
							<span v-if="item.SellPrice !== item.OriginPrice" class="origin-price"> NT.{{ item.OriginPrice }} </span>
							<span class="sell-price"> NT.{{ item.SellPrice }} </span>
						</div>
					</div>
					<button class="btn btn-block" @click.prevent="showCartDialog(item.CustomMarketID_withoutSize)">
						<i class="icon-bag-plus"></i>
					</button>
				</div>
			</div>
			<a class="btn-more-addon" v-if="isNeedSlick">
				<a class="addon-arrow-left">
					<img class="img-fluid" src="https://static.tpx.tw/sff/pazzo-v2/static/img/addon-arrow-left.svg" />
				</a>
				<span>MORE</span>
				<a class="addon-arrow-right">
					<img class="img-fluid" src="https://static.tpx.tw/sff/pazzo-v2/static/img/addon-arrow-right.svg" />
				</a>
			</a>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import gtmTrace from "@global/components/tracing/gtm";
import Slick from "@global/vendors/vue-slick";
import imgTransfer from "@global/helpers/imgTransfer";
import utmKDetect from "@global/helpers/utmKDetect";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("miniCartModule");
import MessageBox from "@global/helpers/messageBox";

export default {
	name: "ShopAddonItems",
	props: ["addonData", "dataIsLoad", "maxShow", "type", "hasMainItem", "customSlick"],
	components: {
		Slick,
	},
	data() {
		return {
			selectedCustomMarketID: this.addonData.map(() => "default"),
			selectedCount: this.addonData.map(() => 1),
			selectIsOpen: false,
			cartAddonSlide: {
				infinite: false,
				slidesToShow: 3.5,
				slidesToScroll: 3,
				arrows: true,
				dots: false,
				speed: 800,
				prevArrow: ".arrow-left",
				nextArrow: ".arrow-right",
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 3.2,
							slidesToScroll: 3,
						},
					},
				],
			},
		};
	},
	mounted() {
		if (this.type === "shoppingCart") {
			$(".addon-slide").not(".slick-initialized").slick(this.cartAddonSlide);
		}
		if (this.customSlick === true) {
			$(".addon-slide").not(".slick-initialized").slick(this.cartAddonSlide);
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
						MessageBox.success("商品加入購物車");
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
</script>
