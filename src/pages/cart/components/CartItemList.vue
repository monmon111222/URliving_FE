<template>
	<div>
		<ul class="shopping-block">
			<div v-if="shoppingData.length === 0" class="py-5">購物車目前尚無商品</div>
			<cart-list v-for="item in shoppingData" :item="item" :key="item.CustomMarketID" :lockbtn="lockBtn"></cart-list>
		</ul>
		<ul class="addon-block" v-if="addOnEvents.length !== 0 && dataIsLoad">
			<addon-list v-for="addonEvent in addOnEvents" :addonEvents="addonEvent" :key="addonEvent.ID" />
		</ul>

		<ul class="gift-block" v-if="giftEvents.length !== 0 && dataIsLoad">
			<cart-gift
				v-for="giftEvent in giftEvents"
				:key="giftEvent.ID"
				:giftEvent="giftEvent"
				:selectedGift="giftEvent.Gifts[0]"
			/>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cartModule");
import cartList from "@page/cart/components/CartList.vue";
import cartGift from "@page/cart/components/CartGift.vue";
import addonList from "@page/cart/components/AddonList.vue";

export default {
	name: "CartItemList",
	components: { cartList, cartGift, addonList },
	computed: {
		...mapState(["detectLang", "shoppingData", "dataIsLoad", "lockBtn", "addOnEvents", "giftEvents"]),
	},
};
</script>
