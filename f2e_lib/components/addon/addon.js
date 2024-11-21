import axios from "axios";
import addonItems from "@global/components/addon/addonItems";
import addonSpecTransfer from "@global/components/addon/addonSpecTransfer";
import addonDetailPopup from "@global/components/addon/addonDetailPopup";

let addon = {
	name: "Addon",
	props: {
		marketID: {
			type: String,
			default: "",
		},
		carAddMainItem: {
			type: Boolean,
			default: false,
		},
	},
	components: { addonItems, addonDetailPopup },
	watch: {
		carAddMainItem() {
			this.getShoppingData();
		},
	},
	data() {
		return {
			cartHasMarketItem: false,
			markets: [],
			allAddonData: [],
			mapAddon: [],
			addonCheck: [],
			dataIsLoad: false,
			detailData: null,
			addonWarnText: false,
		};
	},
	created() {
		const IDNumber = this.marketID.substring(4);
		this.getShoppingData();
		this.getAllAddonData(IDNumber);
	},
	methods: {
		/**
		 * @description 比對購物車內是否有賣場商品，
		 * 如果有賣場商品且不是預購商品即可購買加價購商品
		 */
		getShoppingData() {
			axios.get(`${API_URL.CART_INFO}`).then((res) => {
				res.data.Response.Temperatures.forEach((element) => {
					element.Markets.forEach((market) => {
						let shoppingCartMarketID = market.CustomMarketID.substring(0, market.CustomMarketID.indexOf("CL"));
						if (shoppingCartMarketID === this.marketID && !market.PreOrder) {
							this.cartHasMarketItem = true;
						}
					});
				});
			});
		},
		/**
		 * @description 取得賣場單文頁的加價購商品
		 * @param {Number} marketID 賣場ID
		 */
		getAllAddonData(marketID) {
			axios
				.get(`${API_URL.ADDON_EVENT}`, {
					params: {
						MarketID: marketID,
					},
				})
				.then((res) => {
					if (res.data.Response.length) {
						this.allAddonData = res.data.Response[0].Markets;
						this.getNewData();
					}
				});
		},
		/**
		 * @description 將相同賣場ID商品集合
		 */
		getNewData() {
			this.addonCheck = this.allAddonData.map((item) => ({
				...item,
				isCheck: false,
			}));

			this.mapAddon = addonSpecTransfer(this.addonCheck);
			this.dataIsLoad = true;
		},
		/**
		 * @description 取得賣場popup詳細資料
		 */
		getPopupDetail(payLoad) {
			this.detailData = payLoad.detailData;

			window.setTimeout(() => {
				$("#popup-addon-detail").appendTo("body").modal("show");
			}, 100);
		},
	},
};

export default addon;
