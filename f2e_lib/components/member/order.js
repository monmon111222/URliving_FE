import Vue from "vue";
import refundList from "@page/order/js/getRefundList";
import cancelOrder from "@global/components/member/cancelOrder";
import orderProgress from "@global/components/member/shippingProgress";
import refundDetail from "@global/components/member/refundDetail";
import atmInfo from "@global/components/member/atmInfo";
import dateFilter from "@global/components/member/dateFilter";

export const orderApp = (function () {
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
