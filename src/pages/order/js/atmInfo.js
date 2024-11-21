import Vue from "vue";
import ATMINFO_TMPL from "@page/order/template/atmInfoTmpl.pug";

const atmInfo = {
	template: ATMINFO_TMPL,
	data: function () {
		return {
			data: [],
			transactionID: null,
			dataisload: false,
		};
	},
	mounted: function () {
		this.modalCloseEvent();
	},
	watch: {
		transactionID: function (val) {
			var _this = this;
			if (val === null) return;
			$.ajax({
				type: "GET",
				url: API_URL.ORDER_ATM + "?TransactionID=" + val,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.data = res.Response;
						_this.dataisload = true;
						$("#lb-atm-info").modal("show");
					} else {
						AlertDialog.alert("系統忙線中");
					}
				},
			});
		},
	},
	methods: {
		modalCloseEvent: function () {
			var _this = this;
			$("#lb-atm-info").on("hidden.bs.modal", function (e) {
				// 清空modal資訊
				_this.transactionID = null;
				_this.data = [];
				_this.dataisload = false;
			});
		},
	},
};

export default atmInfo;
