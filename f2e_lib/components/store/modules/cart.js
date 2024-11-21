import detectLang from "@global/helpers/detectLang";
import Cookies from "js-cookie";
import gtmTrace from "@global/components/tracing/gtm";
import AlertDialog from "@global/helpers/alertDialog";
const axios = require("axios");

const cartModule = {
	namespaced: true,
	state: {
		addOnEvents: [],
		cartTotal: 0,
		can_paytype: true,
		can_delivery: true,
		cartTotalWithoutAddon: 0,
		detectLang: detectLang(),
		dataIsLoad: false,
		giftEvents: [],
		hasPreOrder: false,
		isEmployee: false,
		IsOffshoreIsland: true, // 是否可以離島運送
		memo: {
			DeliveryMemo: {
				Message: "",
				AlertMessage: "",
				CanUseDelivery: [],
				AllDelivery: [],
			},
			PayMemo: {
				Message: "",
				CanUsePay: [],
				AllPayType: [],
				CanUseFasneyInstallmentPlan: [],
			},
			SortOutMemo: {
				Message: "",
			},
			AddOnEventMemo: {
				Message: "",
			},
			RewardPointsMemo: {
				Message: "",
				RewardDescription: "",
			},
			FaPointsMemo: {
				IsBound: false,
				PointsBalance: 0.0,
				CanUse: false,
				Threshold: 1000,
				PointsAvailable: 0.0,
				Message: "",
				FaPointsDescription: "",
				AddFaPoints: 0.0,
			},
		},
		shoppingData: [],
		specialCoupon: "",
		userSelect: {
			region: 1,
			province: "",
			payType: 1,
			deliveryType: 1,
			coupon: "",
			account: "",
			autoPickCoupon: 0,
			basket: 1,
			points: -1,
			faPoints: -1,
		},
		addonBasket: 1,
		cvsCode: window.cvsCode ? window.cvsCode : "",
		cvsName: window.cvsName ? window.cvsName : "",
		cvsAddress: window.cvsAddress ? window.cvsAddress : "",
		lockBtn: false,
		isCalling: true,
		isForeign: false,
		showRecommendItems: false,
		isFriend: false,
		generalCount: 0, // 常溫總數量
		refrigerationCount: 0, // 冷藏總數量
		freezingCount: 0, // 冷凍總數量
		preOrder: false, // 現貨預購商品
		temperature: 0, // 溫層 0:常溫 1:冷藏 2 冷凍
		generalSpotGoodsCount: 0, // 一般常溫現貨數量
		generalPreOrderCount: 0, // 一般常溫預購數量
		refrigerationSpotGoodsCount: 0, // 冷藏現貨數量
		refrigerationPreOrderCount: 0, // 冷藏預購數量
		freezingSpotGoodsCount: 0, // 冷凍現貨數量
		freezingPreOrderCount: 0, // 冷凍預購數量
		isCartActive: true,
		recommendID: "",
		nextBuyData: [],
		nextBuyPage: 2,
		nextBuyTotal: 0,
		nextBuyDataIsLoad: false,
		selectedInstallmentPlan: 1, // 使用者分期期數
		newsEvent: false,
		fasneyEvent: false,
		canUseFaPoints: true,
		myCoupon: [],
		couponDescription: {},
	},
	mutations: {
		changeUserSelect(state, userSelectPayload) {
			const { userSelectKey, userSelectValue } = userSelectPayload;
			state.userSelect[userSelectKey] = userSelectValue;
		},
		/**
		 * @description 改變使用者基本資料
		 */
		changeUserInfo(state, userInfo) {
			const { userInfoKey, userInfoValue } = userInfo;
			state[userInfoKey] = userInfoValue;
		},
		/**
		 * @description 購物車初始化資料(拿取上筆訂單資訊)
		 */
		initCartInfo(state) {
			state.userSelect.region = window.shipRegionType !== "0" ? parseInt(window.shipRegionType) : 1;
			state.userSelect.payType = window.payType !== "0" ? parseInt(window.payType) : 1;
			state.userSelect.deliveryType = window.deliveryType !== "0" ? parseInt(window.deliveryType) : 1;
			state.userSelect.province = window.provinceType !== "0" ? parseInt(window.provinceType) : "";
			state.selectedInstallmentPlan = window.installmentPlan ? parseInt(window.installmentPlan) : 1;
			state.userSelect.points = window.points ? parseInt(window.points) : -1;
			state.userSelect.faPoints = window.fapoints ? parseInt(window.fapoints) : -1;
		},
		/**
		 * @description 購物車初始化購物藍
		 */
		initCartTab(state) {
			let url_string = window.location.href;
			let temp = new URL(url_string).searchParams.get("temp");

			if (temp) {
				state.temperature = parseInt(window.temperature);
				state.preOrder = window.preorder === "true";
				state.userSelect.basket = parseInt(window.basket);

				// 超商取貨頁面回來時
				Cookies.set("basket", state.userSelect.basket);
				Cookies.set("temperature", state.temperature);
				Cookies.set("preOrder", state.preOrder);
			} else {
				// 使用者不指定溫層且第一次進入購物車畫面，由後端寫入最後一次加入購物車的溫層
				if (Cookies.get("basket") === undefined) {
					state.temperature = parseInt(window.temperature);
					state.preOrder = window.preorder === "true";
					state.userSelect.basket = parseInt(window.basket);

					Cookies.set("basket", parseInt(window.basket));
					Cookies.set("temperature", parseInt(window.temperature));
					Cookies.set("preOrder", window.preorder === "true");
				} else {
					// 便利商店畫面與加價購畫面 reload 時
					state.userSelect.basket = parseInt(Cookies.get("basket"));
					state.temperature = parseInt(Cookies.get("temperature"));
					state.preOrder = Cookies.get("preOrder") === "true";
				}
			}
		},
		changeTemperature(state, temperature) {
			// 切換溫層後 coupon 機制需更新回預設狀態
			Cookies.remove("coupon");
			Cookies.set("autocoupon", 1);
			state.userSelect.autoPickCoupon = 1;
			state.userSelect.coupon = "";
			state.specialCoupon = "";

			// 推薦商品隱藏
			state.showRecommendItems = false;

			// 使用者購物車購物籃
			if (temperature === 1) {
				// 一般常溫
				state.temperature = 0;

				if (state.generalSpotGoodsCount !== 0) {
					state.preOrder = false;
					state.userSelect.basket = 1;
				} else {
					// 如果現貨商品為 0 ，則切換成預購商品
					state.preOrder = true;
					state.userSelect.basket = 2;
				}
			} else if (temperature === 3) {
				// 冷藏配送
				state.temperature = 1;

				if (state.refrigerationSpotGoodsCount !== 0) {
					state.preOrder = false;
					state.userSelect.basket = 3;
				} else {
					state.preOrder = true;
					state.userSelect.basket = 4;
				}
			} else {
				// 冷凍配送
				state.temperature = 2;

				if (state.freezingSpotGoodsCount !== 0) {
					state.preOrder = false;
					state.userSelect.basket = 5;
				} else {
					state.preOrder = true;
					state.userSelect.basket = 6;
				}
			}

			// reload page
			Cookies.set("basket", state.userSelect.basket);
			Cookies.set("temperature", state.temperature);
			Cookies.set("preOrder", state.preOrder);
		},
		changeIsPreOrder(state, isPreOrder) {
			Cookies.remove("coupon");
			Cookies.set("autocoupon", 1);

			state.userSelect.autoPickCoupon = 1;
			state.userSelect.coupon = "";
			state.specialCoupon = "";

			state.showRecommendItems = false;

			if (isPreOrder) {
				state.preOrder = true;
				if (state.temperature === 0) {
					state.userSelect.basket = 2;
				} else if (state.temperature === 1) {
					state.userSelect.basket = 4;
				} else {
					state.userSelect.basket = 6;
				}
			} else {
				state.preOrder = false;
				if (state.temperature === 0) {
					state.userSelect.basket = 1;
				} else if (state.temperature === 1) {
					state.userSelect.basket = 3;
				} else {
					state.userSelect.basket = 5;
				}
			}

			Cookies.set("basket", state.userSelect.basket);
			Cookies.set("temperature", state.temperature);
			Cookies.set("preOrder", state.preOrder);
		},
		changeCartTotalCount(state, itemArray) {
			// 溫層ID (0: 常溫，1: 冷藏，2: 常溫)
			itemArray.data.Response.Temperatures.forEach((itemArray) => {
				if (itemArray.ID === 0) {
					state.generalCount = itemArray.Count;
					state.generalSpotGoodsCount = itemArray.InstockCount;
					state.generalPreOrderCount = itemArray.PreorderCount;
				} else if (itemArray.ID === 1) {
					state.refrigerationCount = itemArray.Count;
					state.refrigerationSpotGoodsCount = itemArray.InstockCount;
					state.refrigerationPreOrderCount = itemArray.PreorderCount;
				} else {
					state.freezingCount = itemArray.Count;
					state.freezingSpotGoodsCount = itemArray.InstockCount;
					state.freezingPreOrderCount = itemArray.PreorderCount;
				}
			});
		},
		/**
		 * @description 檢查是否可使用點數
		 */
		checkIfCanUsePoints(state, memo) {
			if (memo.RewardPointsMemo.Message && $('[data-name="alert-soldout"]').length === 0) {
				AlertDialog.alert(memo.RewardPointsMemo.Message, undefined, "alert-soldout");
			}

			if (memo.FaPointsMemo.Message && $('[data-name="alert-soldout"]').length === 0) {
				AlertDialog.alert(memo.FaPointsMemo.Message, undefined, "alert-soldout");
			}
		},
		/**
		 * @description 檢查是否售完
		 */
		checkIfSoldOut(state, memo) {
			if (memo.SortOutMemo.Message && $('[data-name="alert-soldout"]').length === 0) {
				AlertDialog.alert(memo.SortOutMemo.Message, undefined, "alert-soldout");
			}

			if (memo.AddOnEventMemo.Message && $('[data-name="alert-soldout"]').length === 0) {
				AlertDialog.alert(memo.AddOnEventMemo.Message, undefined, "alert-soldout");
			}
		},
		checkIsEmployee(state) {
			if (state.memo.UserLevelMemo === null) return;
			if (state.memo.UserLevelMemo.Name === "員工") {
				window.isEmployee = true;
				state.isEmployee = true;
				state.userSelect.deliveryType = 5;
			} else {
				window.isEmployee = false;
				state.isEmployee = false;
			}

			if (state.memo.UserLevelMemo.Name === "親友團") {
				state.isFriend = true;
				window.isFriend = true;
			}
		},
		checkCoupon(state, couponMemo) {
			state.specialCoupon = "";
			// user 改變過 Coupon 但 response 回應無此 Coupon 時
			if (state.userSelect.coupon !== "") {
				if (couponMemo.Code === null) {
					AlertDialog.alert(couponMemo.Message);
					state.userSelect.coupon = "";
					Cookies.remove("coupon");
				}
			}

			// 自動帶入折價券
			if (couponMemo.Code !== null && state.userSelect.coupon.length === 0) {
				state.specialCoupon = couponMemo.Code;
				Cookies.set("autocoupon", 1);
			}
		},
		/**
		 * @description 檢查付款方式可否使用
		 * @param { Object } data
		 * @param { Array } data.CanUsePay 可用的付款方式
		 */
		checkPay(state, data) {
			state.can_paytype = false;
			data.CanUsePay.forEach((element) => {
				if (element === state.userSelect.payType) {
					state.can_paytype = true;
				}
			});
		},
		checkIfAllowIsland(state, payload) {
			const { data, giftData } = payload;
			state.IsOffshoreIsland = true;
			for (let el of data) {
				if (typeof el.IsOffshoreIsland !== "undefined" && !el.IsOffshoreIsland) {
					state.IsOffshoreIsland = false;
					break;
				}
			}
			for (let el of giftData) {
				if (typeof el.IsOffshoreIsland !== "undefined" && !el.IsOffshoreIsland) {
					state.IsOffshoreIsland = false;
					break;
				}
			}
		},
		checkIfHasPreOrder(state, marketDatas) {
			state.hasPreOrder = false;
			marketDatas.forEach((element) => {
				if (element.PreOrder) {
					state.hasPreOrder = true;
				}
			});
		},
		toLockBtn(state, bool) {
			state.lockBtn = bool;
		},
		setShoppingCartData(state, shoppingCartData) {
			// 刷新購物車列表
			state.shoppingData = shoppingCartData.ShoppingCart.Markets;
			// 刷新贈品列表
			state.giftEvents = shoppingCartData.ShoppingCart.GiftEvents;
			// 刷新加價購列表
			state.addOnEvents = shoppingCartData.ShoppingCart.AddOnEvents;
			// 刷新tab商品數量
			state.cartTotal = shoppingCartData.ShoppingCart.Count;
			// 刷新tab商品數量
			state.cartTotalWithoutAddon = shoppingCartData.ShoppingCart.MarketCount;
			// 多一個溫層變數，讓不同溫層同樣商品數量再打一次加價購api
			state.addonBasket = state.userSelect.basket;
			// 刷新memo
			state.memo = shoppingCartData.Memo;
		},
		changeCSVCode(state) {
			state.cvsCode = "";
			state.cvsName = "";
			state.cvsAddress = "";
		},
		addNextBuyTotal(state) {
			state.nextBuyTotal++;
		},
		changeNextBuyDate(state, index) {
			state.nextBuyData.splice(index, 1);
			state.nextBuyTotal -= 1;
		},
		changeFasneyEvent(state) {
			let nowDate = new Date().getTime();
			let startDate = new Date(2023, 2, 6, 0, 0, 0).getTime();
			let endDate = new Date(2023, 3, 6, 0, 0, 0).getTime();
			if (nowDate >= startDate && nowDate <= endDate) {
				state.newsEvent = true;
			}

			let faNowDate = new Date().getTime();
			let faStartDate = new Date(2023, 1, 13, 0, 0, 0).getTime();
			let faEndDate = new Date(2023, 3, 1, 0, 0, 0).getTime();
			if (faNowDate >= faStartDate && faNowDate <= faEndDate) {
				state.fasneyEvent = true;
			}
		},
		setUserCoupon(state, coupons) {
			state.myCoupon = coupons;

			if (state.myCoupon.length) {
				if (state.specialCoupon) {
					state.couponDescription = state.myCoupon.find((element) => {
						return element.Code === state.specialCoupon;
					});
				} else {
					state.couponDescription = state.myCoupon.find((element) => {
						return element.Code === state.userSelect.coupon;
					});
				}
			}
		},
		clearCouponDescription(state) {
			state.couponDescription = {};
		},
	},
	actions: {
		getShoppingData({ state, dispatch }, userSelect) {
			state.dataIsLoad = false;
			state.isCartActive = true;

			axios
				.get(API_URL.SHOPPING_CART, {
					params: {
						ShippingRegion: userSelect.region,
						Province: userSelect.province,
						PayType: userSelect.payType,
						DeliveryType: userSelect.deliveryType,
						Coupon: userSelect.coupon,
						SortOut: 1,
						AutoPickCoupon: userSelect.autoPickCoupon,
						Basket: userSelect.basket,
						Points: userSelect.points,
						FAPoints: userSelect.faPoints,
					},
				})
				.then((res) => {
					if (res.data.Code === 200) {
						if (res.data.Response.ShoppingCart.Markets.length === 0) {
							// 當使用者刪除商品，若該溫層內沒有其它預購或現貨商品時，
							// 則刷新頁面，並走後端 window 值，跳到有商品的那個溫層

							Cookies.remove("basket");
							Cookies.remove("temperature");
							Cookies.remove("preOrder");

							if (state.temperature === 0) {
								// 一般常溫 tab 在冷藏與冷凍都為 0 時，不顯示
								if (state.generalCount !== 0) {
									// 若預購現貨商品總數量為 0，留在頁面
									// 若不為 0 跳到另一個預購/現貨 tab
									window.location.href = "/zh-tw/checkout";
								}
							}

							// 冷藏與冷凍商品數量為 0 時，需要自動換頁
							// 若留在原頁面，user 沒有一般常溫 tab 可選
							if (state.temperature === 1 || state.temperature === 2) {
								window.location.href = "/zh-tw/checkout";
							}
						}

						dispatch("showShoppingList", res.data);
					} else if (res.data.Code === 205) {
						dispatch("showShoppingList", res.data);

						AlertDialog.special(
							detectLang === "tw" || detectLang === "cn"
								? `<div>提醒您，此贈品不提供海外配送將自動移除!</div><div class="mt-4"><a class="btn-close-alert btn btn-secondary btn-block" href="#">取消贈品</a></div>`
								: `<div>Remind you that this gift is not provided for overseas shipping and will be automatically removed!</div><div class="mt-4"><a class="btn-close-alert btn btn-secondary btn-block" href="#">Cancel gift</a></div>`
						);
					} else if (res.data.Code === 206) {
						dispatch("showShoppingList", res.data);
						AlertDialog.alert(
							detectLang === "tw" || detectLang === "cn"
								? "贈品庫存異動，請重新確認購物車!"
								: "Gift inventory changes, please reconfirm your shopping cart"
						);
					} else {
						AlertDialog.alert("System is busy, please try again later", function () {
							window.location.href = "/";
						});
					}

					// 推薦商品
					if (res.data.Code !== 400 && !state.showRecommendItems) {
						if (res.data.Response.ShoppingCart.Markets.length === 0) {
							state.recommendID = "";
						} else {
							state.recommendID = res.data.Response.ShoppingCart.Markets[0].CustomMarketID;
							state.showRecommendItems = true;
						}
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		updateShoppingData({ state, dispatch }, updateDate) {
			const { id, count, item, isGift } = updateDate;
			axios
				.put(API_URL.SHOPPING_CART, {
					CustomMarketID: id,
					Count: count,
				})
				.then((res) => {
					if (res.data.Code === 200) {
						dispatch("miniCartModule/getCartInfo", null, { root: true });
						dispatch("getShoppingData", state.userSelect);

						if (count === 0 && isGift === undefined) {
							// 目前公版沒這一段
							gtmTrace.removeFromCart({
								name: item.Name,
								id: id,
								price: item.OriginPrice,
								sale_price: item.SellPrice,
								img_url: item.Cover,
								product_url: item.Url,
								color: item.Pattern === 1 ? item.ColorName : item.Series.FlavorName,
								count: count,
							});
						}

						if (count > 0 && item) {
							gtmTrace.checkout({
								name: item.Name,
								id: id,
								price: item.OriginPrice,
								sale_price: item.SellPrice,
								img_url: item.Cover,
								product_url: item.Url,
								color: item.Pattern === 1 ? item.ColorName : item.Series.FlavorName,
								count: count,
							});
						}
					} else {
						AlertDialog.alert("System is busy, please try again later");
					}
				})
				.catch(() => {
					AlertDialog.alert("System is busy, please try again later");
				});
		},
		showShoppingList({ state, commit }, res) {
			commit("checkIfSoldOut", res.Response.Memo);
			commit("checkIfCanUsePoints", res.Response.Memo);
			commit("setShoppingCartData", res.Response);
			commit("checkIsEmployee");
			commit("checkCoupon", res.Response.Memo.CouponMemo);
			commit("checkPay", res.Response.Memo.PayMemo);
			// 判斷是否有不允許離島配送商品
			commit("checkIfAllowIsland", {
				data: res.Response.ShoppingCart.Markets,
				giftData: res.Response.ShoppingCart.GiftEvents,
			});
			// 檢查購物車是否有預購商品
			commit("checkIfHasPreOrder", res.Response.ShoppingCart.Markets);
			state.dataIsLoad = true;
			commit("toLockBtn", false);
			state.isCalling = false;
		},
		getNextBuyData({ state }, page) {
			state.isCartActive = false;

			let nowPage = page === "loadmore" ? state.nextBuyPage : page;

			if (state.nextBuyTotal < state.nextBuyData.length) return;

			axios
				.get(API_URL.FAVORITE, {
					params: {
						Page: nowPage,
						PageSize: 10,
						Basket: state.userSelect.basket,
					},
				})
				.then((res) => {
					if (res.data.Code === 200) {
						if (nowPage === 1) {
							state.nextBuyData = res.data.Response.Data;
						} else {
							state.nextBuyData = state.nextBuyData.concat(res.data.Response.Data);

							if (state.nextBuyPage < res.data.Response.PageCount) {
								state.nextBuyPage++;
							}
						}
						// 刷新tab商品數量
						state.nextBuyTotal = res.data.Response.TotalCount;

						// load data complete
						state.nextBuyDataIsLoad = true;
					} else {
						AlertDialog.alert(window.severBusy || "系統忙線中，請稍後再試");
					}
				})
				.catch(() => {
					AlertDialog.alert(window.severBusy || "系統忙線中，請稍後再試");
				});
		},
		getCoupon({ state, commit }) {
			let shoppingCartItems = [];

			state.shoppingData.forEach((ele) => {
				let endIndex = ele.CustomMarketID.indexOf("CL");
				let marketID = ele.CustomMarketID.slice(4, endIndex);

				shoppingCartItems.push({
					MarketID: marketID,
					SellPrice: ele.SellPrice,
					Count: ele.Count,
				});
			});

			return new Promise((resolve, reject) => {
				axios
					.post(API_URL.COUPON, {
						ShoppingCartItems: shoppingCartItems,
					})
					.then((res) => {
						if (res.data.Code === 200) {
							commit("setUserCoupon", res.data.Response);
							resolve();
						} else if (res.data.Code === 401) {
							AlertDialog.alert("請先登入");
							reject();
						} else {
							AlertDialog.alert("系統忙線中,請稍後再試");
							reject();
						}
					});
			});
		},
	},
	getters: {
		mappingCartCount(state) {
			if (state.temperature === 0) {
				return {
					spotGoodsCount: state.generalSpotGoodsCount,
					preOrderCount: state.generalPreOrderCount,
				};
			} else if (state.temperature === 1) {
				return {
					spotGoodsCount: state.refrigerationSpotGoodsCount,
					preOrderCount: state.refrigerationPreOrderCount,
				};
			} else {
				return {
					spotGoodsCount: state.freezingSpotGoodsCount,
					preOrderCount: state.freezingPreOrderCount,
				};
			}
		},
		userSelectedPayType(state) {
			return state.userSelect.payType;
		},
		userSelectedRegion(state) {
			return state.userSelect.region;
		},
		userSelectedDeliveryType(state) {
			return state.userSelect.deliveryType;
		},
		userSelectedProvince(state) {
			return state.userSelect.province;
		},
		userSelectedPoints(state) {
			return state.userSelect.points;
		},
		userSelectedFaPoints(state) {
			if (state.memo.FaPointsMemo.IsBound) {
				if (state.memo.FaPointsMemo.CanUse) {
					if (state.userSelect.faPoints === -1) {
						// 第一次進來使用最大點數
						state.canUseFaPoints = true;
						return state.memo.FaPointsMemo.PointsAvailable;
					} else if (state.canUseFaPoints === false) {
						// 不可以使用點數到可以使用點數，預設帶入最大點數
						state.canUseFaPoints = true;
						return state.memo.FaPointsMemo.PointsAvailable;
					} else {
						// 回傳使用者自己輸入的使用點數
						return state.userSelect.faPoints;
					}
				} else {
					// 不可使用 Fa Points 0 點
					state.canUseFaPoints = false;
					return 0;
				}
			} else {
				// 未綁定使用 Fa Points 0 點
				return 0;
			}
		},
	},
};

export default cartModule;
