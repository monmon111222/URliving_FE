const axios = require("axios");

const miniCartModule = {
	namespaced: true,
	state: {
		dataIsLoad: false,
		totalCount: 0, // 所有溫藏商品總數
		generalCount: 0, // 常溫總數量
		refrigerationCount: 0, // 冷藏總數量
		freezingCount: 0, // 冷凍總數量,
		generalMarketProducts: [],
		refrigerationMarketProducts: [],
		freezingMarketProducts: [],
		temperaturesData: [],
		count: 0, // 所有商品總數(for 一頁式)
		hotSearch: [],
		hotLoad: false,
	},
	mutations: {
		changeCartTotalCount(state, itemArray) {
			state.totalCount = itemArray.data.Response.TotalCount;
			state.count = itemArray.data.Response.TotalCount;
			state.temperaturesData = itemArray.data.Response.Temperatures;
			// 溫層ID (0: 常溫，1: 冷藏，2: 常溫)
			itemArray.data.Response.Temperatures.forEach((itemArray) => {
				if (itemArray.ID === 0) {
					state.generalCount = itemArray.Count;
					state.generalMarketProducts = itemArray.Markets;
				} else if (itemArray.ID === 1) {
					state.refrigerationCount = itemArray.Count;
					state.refrigerationMarketProducts = itemArray.Markets;
				} else {
					state.freezingCount = itemArray.Count;
					state.freezingMarketProducts = itemArray.Markets;
				}
			});
			state.dataIsLoad = true;
		},
	},
	actions: {
		getCartInfo({ state, commit }) {
			state.dataIsLoad = false;
			axios.get(API_URL.CART_INFO).then((res) => {
				if (res.data.Code === 200 || res.data.Code === 406) {
					commit("changeCartTotalCount", res);
					// 更新購物車商品數量
					commit("cartModule/changeCartTotalCount", res, { root: true });
				}
			});
		},
		getHotSearch({ state, commit }) {
			state.hotLoad = false;
			axios
				.get(API_URL.HOT_SEARCH, {
					params: {
						period: "range",
						date: "last3",
						limit: 10,
					},
				})
				.then((res) => {
					if (res.data.Code === 200) {
						let hotArray = [];
						for (let i = 0; i < res.data.Response.length; i++) {
							hotArray.push(res.data.Response[i]);
						}
						state.hotSearch = hotArray;
						state.hotLoad = true;
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
	},
	getters: {
		isOnlyOneTemp(state) {
			let hasProductTempCount = 0;
			if (state.generalCount > 0) {
				hasProductTempCount++;
			}
			if (state.refrigerationCount > 0) {
				hasProductTempCount++;
			}
			if (state.freezingCount > 0) {
				hasProductTempCount++;
			}
			return hasProductTempCount === 1;
		},
	},
};

export default miniCartModule;
