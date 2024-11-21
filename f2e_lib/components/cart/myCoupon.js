import AlertDialog from "@global/helpers/alertDialog";
import MYCOUPON_TMPL from "@page/cart/js/myCouponTmpl";
import modal from "bootstrap/js/dist/modal";

module.exports = {
	template: MYCOUPON_TMPL,
	props: ["mycoupon"],
	data: function () {
		return {
			couponSelected: "",
			selfFillin: "",
		};
	},
	watch: {
		selfFillin: function (val) {
			if (val !== "") {
				this.couponSelected = "";
			}
		},
		couponSelected: function (val) {
			if (val !== "") {
				this.selfFillin = "";
			}
		},
	},
	methods: {
		enterCoupon: function () {
			this.couponSelected = "";
		},
		checkCoupon: function () {
			if (this.couponSelected === "" && this.selfFillin === "") {
				AlertDialog.alert("請輸入或選擇折價代碼");
				return;
			}
			this.$emit("coupon", this.selfFillin == "" ? this.couponSelected : this.selfFillin);
			$("#lb-my-coupon").modal("hide");
		},
	},
};
