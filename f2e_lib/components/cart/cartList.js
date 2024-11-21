import CARTLIST_TMPL from "@page/cart/js/cartListTmpl";
import AlertDialog from "@global/helpers/alertDialog";
import MessageBox from "@global/helpers/messageBox";
import NewImage from "@global/components/global/image";

module.exports = {
	template: CARTLIST_TMPL,
	props: ["item", "dataisload", "lockbtn", "isemployee", "isfriend", "memo"],
	components: { NewImage },
	computed: {
		selected: {
			get: function () {
				var selected = "";

				if (this.item.Limit !== 0) {
					// 限購
					if (this.item.Stock > this.item.Count) {
						// 足夠庫存
						selected = this.item.Limit > this.item.Count ? this.item.Count : this.item.Limit;
					} else {
						// 庫存小於數量
						selected = this.item.Limit > this.item.Stock ? this.item.Stock : this.item.Limit;
					}
				} else {
					// 一般商品
					selected = this.item.Stock > this.item.Count ? this.item.Count : this.item.Stock;
				}

				return selected;
			},
			set: function () {},
		},
		maxCount: {
			get: function () {
				var max = "";
				if (this.item.Limit !== 0) {
					// 限購
					max = this.item.Stock > this.item.Limit ? this.item.Limit : this.item.Stock;
				} else {
					max = this.item.Stock;
				}

				return max;
			},
			set: function () {},
		},
	},
	methods: {
		deleteItem: function () {
			var _this = this;
			AlertDialog.confirm(
				window.deleteText || "確定移除此商品？",
				function () {
					_this.$emit("delete", { id: _this.item.CustomMarketID, count: 0, datas: _this.item });
				},
				"alert-remove-item"
			);
		},
		movetoNextbuy: function (CustomMarketID) {
			var _this = this;

			_this.$emit("tolockbtn", true);

			$.ajax({
				type: "POST",
				url: API_URL.NEXTBUY_CART,
				dataType: "json",
				data: { CustomMarketID: CustomMarketID },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.$emit("delete", { id: _this.item.CustomMarketID, count: 0, datas: _this.item });
						_this.$emit("refreshtabcount");
						MessageBox.success(window.moveItemText || "已移至下次買", function () {
							_this.$emit("tolockbtn", false);
						});
					} else {
						AlertDialog.alert(window.severBusy || "系統忙線中,請稍後再試");
					}
				},
			});
		},
		onChange: function (event, item, type) {
			let count;
			if (event === null) {
				count = type === "add" ? (this.selected += 1) : (this.selected -= 1);
			} else {
				count = parseInt(event.target.value);
			}
			this.$emit("updatecount", { id: this.item.CustomMarketID, count: count });
		},
		updateQuantity(count) {
			if (this.selected + count > this.maxCount) return;
			if (this.selected + count < 1) return;
			this.$emit("updatecount", { id: this.item.CustomMarketID, count: this.selected + count });
		},
	},
};
