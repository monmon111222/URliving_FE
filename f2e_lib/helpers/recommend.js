const axios = require("axios");

/**
 * @description 156-取得推薦商品 (條碼分類)
 * @param {String} CustomMarketID 客製化的MarketID
 * @param {String} Model 模組代碼(參考如下)
 *  1 SameCategory (取得相同分類的商品)
 *  2 DifferentCategory (取得不相同分類的商品)
 */
async function getRecommendData(mode) {
	const recommendData = await axios
		.get(API_URL.RecommendBarcode, {
			params: {
				CustomMarketID: window.CustomMarketID,
				Model: mode,
			},
		})
		.then((res) => {
			return res.data.Response;
		})
		.catch((err) => {
			return err;
		});

	return recommendData;
}

/**
 *  157-取得推薦商品 (賣場分類)
 */
export async function getRecommendDataByCategory() {
	try {
		if (window.CategoryIDs === undefined) throw "Err";

		const recommendData = await axios
			.get(API_URL.RECOMMENDATION, {
				params: {
					CustomMarketID: window.CustomMarketID,
					CategoryIDs: window.CategoryIDs.toString(),
				},
			})
			.then((res) => {
				return res.data.Response;
			});
		return recommendData;
	} catch (err) {
		return err;
	}
}
/**
 * @description 搜尋結果使用 API 12-取得最新賣場資料
 */
export async function getSearchRecommendData() {
	try {
		const recommendData = await axios
			.get(API_URL.MARKET_NEW, {
				params: {
					Page: 1,
					PageSize: 10,
					OnlyFirstColor: true,
				},
			})
			.then((res) => {
				return res.data.Response.Data;
			});
		return recommendData;
	} catch (err) {
		return err;
	}
}

/**
 * @description MQ 分類頁
 * @param {String} recommendMode
 *  1 SameCategory (取得相同分類的商品)
 *  2 DifferentCategory (取得不相同分類的商品)
 */
export async function recommend(recommendMode) {
	try {
		const recommendData = await getRecommendData(recommendMode);
		return recommendData;
	} catch (err) {
		return err;
	}
}

/**
 * @description 賣場商品推薦
 */
export async function getShopRecommend() {
	let recommendData = [];

	await getRecommendDataByCategory().then((res) => {
		recommendData = res.map((item) => {
			return {
				url: item.MarketUrl + "&page=product&source=ur&recommend=related_to_category",
				image: item.PictureUrl,
				originPrice: item.OriginPrice,
				sellPrice: item.SellPrice,
				eventPrice: item.EventPrice,
				name: item.Name,
			};
		});
	});
	return recommendData;
}
