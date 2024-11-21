import axios from "axios";
import addonItems from "./addonItems.js";
import addonRecommend from "@page/cart/template/addonRecommend.pug";
import addonSpecTransfer from "@global/components/addon/addonSpecTransfer";
import addonDetailPopup from "@global/components/addon/addonDetailPopup";
import cartDialog from "@global/components/addon/addonCartDialog";

const addonRecommandList = {
	name: "AddonCart",
	template: addonRecommend,
	components: {
		addonItems,
		cartDialog,
		addonDetailPopup,
	},
	props: {
		memo: {
			type: Object,
			required: true,
			default() {
				return {};
			},
		},
		cartTotalWithoutAddon: {
			type: Number,
			default: 0,
			required: true,
		},
	},
	data() {
		return {
			btnDescription: {
				preShow: "COMING SOON",
				soldout: "暫無庫存",
				notice: "暫銷售一空 ♡ 感謝熱烈支持",
				genernal: "請選擇尺寸",
				addbag: "Add to bag",
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
	},
	created() {
		this.getAddonData();
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
					},
				})
				.then((res) => {
					if (res.data.Response.length) {
						this.cartAddonData = res.data.Response;
						this.cartAddonData.forEach((ele) => (ele.isCheck = false));
						this.cartAddonData.forEach((ele) => (ele.Markets = addonSpecTransfer(ele.Markets)));
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
					this.$refs.cart_addon[0].isopen = true;
					this.$refs.cart_addon[0].alldatas = res.data.Response;
					this.$refs.cart_addon[0].selectedID = res.data.Response.ColorID;
					this.$refs.cart_addon[0].dataisload = true;
					this.detailData = res.data.Response;
				});
		},
	},
};

module.exports = addonRecommandList;
