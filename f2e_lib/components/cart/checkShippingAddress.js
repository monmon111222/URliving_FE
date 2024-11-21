const axios = require("axios");

/**
 * @description 宅配地址檢查 (串黑貓)
 * @param { Object } _this  this object
 */
function checkShippingAddress(_this) {
	return new Promise((resolve, reject) => {
		// 宅配才去檢查地址
		if (window.DeliveryType === "HomeDelivery" && window.isEmployee !== "True") {
			let address = "";
			let originAddress = ""; // 舊用戶取上一筆訂單地址

			if ($("#same-as-buyer:checked").length > 0) {
				// 訂購人地址
				// 訂購人地址不管有沒有變動，只要勾選同訂購人就必須要去驗
				// 避免送單前訂購人地址是錯誤的，只驗收件人導致下次送單
				// 地址沒驗到
				address =
					$("select[name='city']").val() + $("select[name='district']").val() + $("input[name='address']").val();

				axios
					.get(API_URL.ORDER_ADDRESS, {
						params: {
							address: address,
						},
					})
					.then((res) => {
						if (res.data.Code === 200) {
							if (!res.data.Response) {
								AlertDialog.alert(window.shippingError || "很抱歉,此地址恕無法受理宅配運送,<br/>請選擇其他運送方式");
								$("input[type='submit'], button[type='submit']").removeClass("disabled");
								reject(res.data.Message);
							} else {
								resolve();
							}
						} else {
							// 串接端有問題直接忽略
							resolve();
						}
					})
					.catch((error) => {
						resolve(error);
					});
			} else {
				// 取收件人地址
				address =
					$("select[name='recipientCity']").val() +
					$("select[name='recipientDistrict']").val() +
					$("input[name='recipientAddress']").val();

				originAddress = _this.shippingAddress.county + _this.shippingAddress.zipcode + _this.shippingAddress.address;

				if (address !== originAddress) {
					// 舊地址與新地址不同才去打檢查地址 API
					axios
						.get(API_URL.ORDER_ADDRESS, {
							params: {
								address: address,
							},
						})
						.then((res) => {
							if (res.data.Code === 200) {
								if (!res.data.Response) {
									AlertDialog.alert(window.shippingError || "很抱歉,此地址恕無法受理宅配運送,<br/>請選擇其他運送方式");
									$("input[type='submit'], button[type='submit']").removeClass("disabled");
									reject(res.data.Message);
								} else {
									resolve();
								}
							} else {
								// 串接端有問題直接忽略
								resolve();
							}
						})
						.catch((error) => {
							resolve(error);
						});
				} else {
					resolve();
				}
			}
		} else {
			resolve();
		}
	});
}

export default checkShippingAddress;
