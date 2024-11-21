<template>
	<div v-if="dataIsLoad && cartAddonData[0].Markets.length > 0">
		<div class="addon-slick" v-for="addon in cartAddonData" :key="addon.ID">
			<p class="addon-title">加價購</p>
			<addonItems
				@showCartDialog="showCartDialog"
				:addonData="addon.Markets"
				:dataIsLoad="dataIsLoad"
				:maxShow="8"
				type="shoppingCart"
			/>
			<cartDialog ref="cart_addon" :isnotice="isNotice" :btndescription="btnDescription" />
			<addonDetailPopup :dataisload="dataIsLoad" :popupData="detailData" />
		</div>
	</div>
</template>

<script>
import axios from "axios";
import addonItems from "./ShopAddonItems.vue";
import addonSpecTransfer from "@global/components/addon/addonSpecTransfer";
import addonDetailPopup from "@global/components/addon/addonDetailPopup";
import cartDialog from "@page/cart/components/AddonCartDialog.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cartModule");
import setEnv from "@global/helpers/setEnv";

export default {
	name: "AddonRecommendList",
	components: { addonItems, cartDialog, addonDetailPopup },
	computed: {
		...mapState(["memo", "cartTotalWithoutAddon", "userSelect", "addonBasket"]),
	},

	data() {
		return {
			btnDescription: {
				genernal: "請選擇尺寸",
				preShow: "COMING SOON",
				addbag: "ADD TO BAG",
				soldout: "SOLD OUT",
				notice: "索取貨到通知",
			},
			dataIsLoad: false,
			cartAddonData: [],
			isNotice: true, // 是否打開貨到通知功能
			detailData: null,
		};
	},
	watch: {
		cartTotalWithoutAddon() {
			this.getAddonData();
		},
		addonBasket() {
			this.getAddonData();
		},
	},
	methods: {
		/**
		 * @description 取得購物車結帳頁加價購商品
		 */
		getAddonData() {
			if (Object.keys(this.memo).length === 0) return;
			axios
				.get(`${API_URL.ADDON_CART}`, {
					params: {
						TotalPrice: this.memo.TotalPrice,
						CouponDiscount: this.memo.CouponDiscount,
						TotalCount: this.cartTotalWithoutAddon,
						Basket: this.userSelect.basket,
					},
				})
				.then((res) => {
					if (res.data.Response) {
						let tempData = [];
						tempData = res.data.Response;
						tempData.forEach((ele) => (ele.isCheck = false));
						tempData.forEach((ele) => (ele.Markets = addonSpecTransfer(ele.Markets)));
						// 取得所有加價購活動的賣場
						let reBind = [];
						tempData.forEach((item) => {
							item.Markets.forEach((product) => {
								reBind.push(product);
							});
						});
						this.cartAddonData = [];
						this.cartAddonData.push({ Markets: reBind });
						this.dataIsLoad = true;
					} else {
						this.cartAddonData = [];
					}
				});
		},
		/**
		 * @description 展開商品詳細資訊
		 * @param {String} customMarketID 賣場ID
		 */
		showCartDialog(customMarketID) {
			const CustomMarketID = customMarketID + "SZ_";
			axios
				.get(`${API_URL.MARKET_CONTENT}`, {
					params: {
						CustomMarketID,
					},
				})
				.then((res) => {
					if (!setEnv.myEquipment()) {
						$("#modal-market").modal("show");
					} else {
						this.$refs.cart_addon[0].isopen = true;
					}
					this.$refs.cart_addon[0].alldatas = res.data.Response;
					this.$refs.cart_addon[0].selectedID = res.data.Response.ColorID;
					this.$refs.cart_addon[0].dataisload = true;
					this.detailData = res.data.Response;
				});
		},
	},
};
</script>

<style></style>
