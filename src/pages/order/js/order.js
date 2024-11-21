import Vue from "vue";
import refundList from "@page/order/js/getRefundList";
import cancelOrder from "@page/order/js/cancelOrder";
import orderProgress from "@page/order/js/shippingProgress";
import refundDetail from "@page/order/js/refundDetail";
import atmInfo from "@page/order/js/atmInfo";
import dateFilter from "@page/order/js/dateFilter";

const orderApp = (function () {
	const vueApp = new Vue({
		el: "#app-order",
		components: {
			refundList,
			orderProgress,
			refundDetail,
			atmInfo,
			cancelOrder,
			dateFilter,
		},
	});
	$(document).on("click", ".btn-order-detail", function (e) {
		window.transactionID = $(this).data("orderid");
	});
	$(document).on("click", ".btn-return-product", function (e) {
		e.preventDefault();
		vueApp.$refs.c_refund_list.transactionID = $(this).data("orderid");
	});

	$(document).on("click", ".btn-get-shipping", function (e) {
		e.preventDefault();
		vueApp.$refs.c_order_progress.transactionID = $(this).data("orderid");
		vueApp.$refs.c_order_progress.wmstransactionid = $(this).data("wmstransactionid");
	});

	$(document).on("click", ".btn-get-refund-detail", function (e) {
		e.preventDefault();
		vueApp.$refs.c_refund_detail.transactionID = $(this).data("orderid");
	});

	$(document).on("click", ".btn-get-atminfo", function (e) {
		e.preventDefault();
		vueApp.$refs.c_atm_info.transactionID = $(this).data("orderid");
	});

	$(document).on("click", ".btn-cancel-order", function (e) {
		e.preventDefault();
		vueApp.$refs.c_cancel_order.transactionID = $(this).data("orderid");
	});
})();

export default orderApp;
