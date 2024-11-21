import CARTGIFT_TMPL from "@page/cart/js/cartGiftTmpl";
import NewImage from "@global/components/global/image";

module.exports = {
	template: CARTGIFT_TMPL,
	props: ["giftEvent", "selectedGift", "dataisload"],
	components: { NewImage },
	data() {
		return {
			preGiftID: this.selectedGift.Count === 0 ? "noGift" : this.selectedGift.CustomMarketID,
		};
	},
	methods: {
		addToCart() {
			this.$emit("addToCart", {
				id: this.preGiftID === "noGift" ? this.selectedGift.CustomMarketID : this.preGiftID,
				count: this.preGiftID === "noGift" ? 0 : 1,
				isGift: true,
			});
		},
	},
};
