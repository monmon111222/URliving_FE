import NEXTBUY_TMPL from "@page/cart/js/cartNextbuyTmpl";
import NewImage from "@global/components/global/image";

module.exports = {
	template: NEXTBUY_TMPL,
	props: ["item", "nextbuydataisload", "lockbtn", "index"],
	components: { NewImage },
	methods: {
		movetoCart: function () {
			var _this = this;
			this.$emit("movetocart", { item: _this.item, idx: _this.index });
		},
		deleteItem: function (CustomMarketID, idx) {
			var _this = this;
			_this.$emit("tolockbtn", true);
			_this.$emit("delete", { id: _this.item.CustomMarketID, idx: idx });
		},
	},
};
