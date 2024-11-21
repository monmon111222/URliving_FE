import PROGRESS_TMPL from "@page/order/js/progressTmpl";

const progress = {
	template: PROGRESS_TMPL,
	data: function () {
		return {
			data: [],
			wmstransactionid: null,
			transactionID: null,
			dataisload: false,
			dataEn: {
				處理中: "Processing",
				準備中: "Packing",
				已出貨: "Shipped",
				已到貨: "Delivered",
				貨到門市: "Delivered",
				配送異常: "Exception",
				退貨至倉庫: "Return to warehouse",
				退貨申請: "Applying",
				物流處理中: "Processing",
				檢查退貨商品中: "Checking",
				退貨審核完成: "Review Process",
				退貨處理完成: "Return Confirmed",
				退貨取消: "",
				退款完成: "Refund Confirmed",
				貨故: "",
			},
		};
	},
	mounted: function () {
		this.modalCloseEvent();
	},
	watch: {
		wmstransactionid: function (val) {
			var _this = this;
			if (val === null) return;
			$.ajax({
				type: "GET",
				url:
					API_URL.SHIPPING_FLOW +
					"?TransactionID=" +
					_this.transactionID +
					"&WmsTransactionID=" +
					_this.wmstransactionid,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					_this.data = res.Response;
					_this.dataisload = true;
					$("#lb-order-transport").modal("show");
				},
			});
		},
	},
	methods: {
		modalCloseEvent: function () {
			var _this = this;
			$("#lb-order-transport").on("hidden.bs.modal", function (e) {
				// 清空modal資訊
				_this.transactionID = null;
				_this.data = [];
				_this.dataisload = false;
				_this.wmstransactionid = null;
			});
		},
	},
};

export default progress;
