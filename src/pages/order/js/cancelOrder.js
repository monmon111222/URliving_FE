import orderLoading from "@global/components/member/orderLoading";
import CANCELORDER_TMPL from "@page/order/template/cancelOrderTmpl.pug";

const cancelOrder = {
	template: CANCELORDER_TMPL,
	data() {
		return {
			transactionID: null,
			lockBtn: false,
			ShowLoadingModel: false,
		};
	},
	components: {
		orderLoading,
	},
	mounted() {
		$("#lb-cancel-order").on("hidden.bs.modal", () => {
			this.transactionID = null;
			this.lockBtn = false;
		});
	},
	methods: {
		confirmCancel() {
			let _this = this;
			this.lockBtn = true;
			let transactionID = this.transactionID;
			this.ShowLoadingModel = true;

			$("#lb-cancel-order").modal("hide");
			$("#lb-order-loading").modal("show");

			$.ajax({
				type: "delete",
				url: API_URL.ORDER + "?TransactionID=" + transactionID,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function (error) {
					_this.ShowLoadingModel = false;
					AlertDialog.alert(error.Message);
				},
				success: function (res) {
					_this.ShowLoadingModel = false;

					if (res.Code === 200) {
						location.reload();
					} else if (res.Code === 401) {
						AlertDialog.alert("請先登入", function () {
							window.location.href = "/login";
						});
					} else {
						AlertDialog.alert(res.Message);
					}
				},
			});
		},
	},
};

export default cancelOrder;
