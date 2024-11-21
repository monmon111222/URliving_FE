const axios = require("axios");

/**
 * @description 手機載具驗證檢查 (串財務部API)
 * @param { Object } _this  this object
 */
function checkMobileCode(_this) {
	return new Promise((resolve, reject) => {
		let lastMobileCode = _this.datas[1].MobileCode;
		let newMobileCode = $("#invoice-mobile-code").val();

		// 使用者選擇電子發票(手機載具)
		// 上一筆訂單載具已經驗證過就不需要再驗證，除非載具條碼有變更
		if (_this.selectedInvoice === 2 && lastMobileCode !== newMobileCode && _this.isOverSeaMode !== "True") {
			axios
				.get(API_URL.VERIFY_MOBILE_CODE, {
					params: {
						MobileCode: encodeURIComponent($("#invoice-mobile-code").val()),
					},
				})
				.then((res) => {
					if (res.data.Code === 200 && res.data.Response === "1") {
						resolve();
					} else if (res.data.Code === 200 && res.data.Response === "0") {
						AlertDialog.alert("手機條碼驗證錯誤", function () {
							$("button[type='submit'], input[type='submit']").removeClass("disabled");
						});
						reject("手機條碼驗證錯誤");
					} else {
						// 其他非預期內的回應，也視同驗證通過，可走後續下單流程。避免驗證API異常導致無法下單。
						resolve();
					}
				})
				.catch(() => {
					resolve();
				});
		} else {
			resolve();
		}
	});
}

export default checkMobileCode;
