import $ from "jquery";
import NewImage from "@global/components/global/image";

const appMiniCart = {
	data: {
		datas: [],
		count: 0,
		dataisload: false,
		isStep1: $(".step-panel__step2.active").length > 0 ? true : false,
	},
	created() {
		if (!this.isStep1) {
			this.getShoppingDatas();
		}
	},
	components: { NewImage },
	computed: {
		customCount() {
			if ($(".custom-count").length) {
				$(".custom-count").removeClass("active");
			}

			if (this.count > 0) {
				if ($(".custom-count").length) {
					$(".custom-count").addClass("active");
				}
			}

			if (this.count < 10) {
				return "0" + String(this.count);
			}

			return this.count;
		},
	},
	methods: {
		getShoppingDatas() {
			var _this = this;
			$.ajax({
				type: "GET",
				url: API_URL.CART_INFO,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.datas = res.Response.Markets;
						_this.count = res.Response.Count;
						_this.dataisload = true;
						if (_this.$refs.cartdot !== undefined) {
							$(_this.$refs.cartdot).removeClass("active");
							setTimeout(function () {
								$(_this.$refs.cartdot).addClass("active");
							}, 10);
						}
					}
				},
			});
		},
		feedData(data) {
			this.datas = data.Markets;
			this.count = data.Count;
			this.dataisload = true;
		},
	},
};

export default appMiniCart;
