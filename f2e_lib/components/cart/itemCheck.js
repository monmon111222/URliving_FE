import CARTCHECK_TMPL from "@page/cart/js/cartCheckTmpl";

module.exports = {
	template: CARTCHECK_TMPL,
	props: ["isopen", "userselect"],
	data: function () {
		return {
			checkMethod: 1,
		};
	},
	methods: {
		resetCart: function () {
			this.$emit("reset", this.checkMethod);
		},
		choseType: function (val) {
			this.checkMethod = val;
		},
	},
};
