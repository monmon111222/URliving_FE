import NOTICE_TMPL from "@page/shopContent/js/noticeTmpl";
export default {
	template: NOTICE_TMPL,
	props: ["custommarketid"],
	data: function () {
		return {
			usermail: "",
		};
	},
	methods: {
		getNotice: function () {
			var _this = this;
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (this.usermail.length !== 0 && regex.test(this.usermail)) {
				$.ajax({
					type: "POST",
					url: API_URL.IN_STOCK_EMAIL,
					dataType: "json",
					data: { CustomMarketID: _this.custommarketid, Email: _this.usermail },
					xhrFields: {
						withCredentials: true,
					},
					error: function () {
						console.log("error");
					},
					success: function (res) {
						if (res.Code === 200) {
							AlertDialog.alert("貨到通知索取成功!謝謝您~", function () {
								$("#lb-get-product-mail").modal("hide");
							});
						} else {
							$("#lb-get-product-mail").modal("hide");
						}
					},
				});
			} else {
				AlertDialog.alert("請輸入有效Email");
			}
		},
	},
};
