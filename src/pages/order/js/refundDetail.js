import Vue from "vue";
import DETAIL_TMPL from "@page/order/template/refundDetailTmpl.pug";

const detail = {
	template: DETAIL_TMPL,
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
				url: API_URL.REFUND_DETAIL + "?TransactionID=" + val,
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
						$("#lb-refund-detail").modal("show");
					} else if (res.Code === 400) {
						AlertDialog.alert(res.Message);
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
			$("#lb-refund-detail").on("hidden.bs.modal", function (e) {
				// 清空modal資訊
				_this.transactionID = null;
				_this.data = [];
				_this.dataisload = false;
			});
		},
	},
};

export default detail;
