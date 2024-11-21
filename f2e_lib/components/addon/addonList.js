import cartAddonList from "@page/cart/template/cartAddonList.pug";
import imgTransfer from "@global/helpers/imgTransfer";

const addonRecommendList = {
	name: "AddonList",
	template: cartAddonList,
	props: ["addonEvents", "dataisload"],
	methods: {
		renderPic: function (picUrl, sizeStr) {
			return imgTransfer(picUrl, sizeStr);
		},
		updateCart: function (id, count) {
			this.$emit("addToCart", { id: id, count: count });
		},
	},
};

module.exports = addonRecommendList;
