<template>
	<div class="shopping-bag">
		<div class="shopping-bag-title">
			SHOPPING <br />
			BAG
			<span v-if="cartTotalWithoutAddon > 0"> ({{ cartTotalWithoutAddon | autoSupplement }})</span>
		</div>
		<ul class="shopping-bag-steps">
			<li :class="{ active: step === 1 }">1. 確認訂單</li>
			<li :class="{ active: step === 2 }">2. 填寫收件資料</li>
			<li :class="{ active: step === 3 }">3. 完成訂購</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("cartModule");
import store from "@global/components/store/index.js";

export default {
	store,
	props: ["step"],
	watch: {
		userSelect: {
			deep: true,
			handler(val) {
				if (this.isCalling) return;
				this.getShoppingData(val);
			},
		},
	},
	created() {
		this.getShoppingData(this.userSelect);
	},
	computed: {
		...mapState(["userSelect", "cartTotalWithoutAddon"]),
	},
	methods: {
		...mapActions(["getShoppingData"]),
	},
	filters: {
		autoSupplement: function (value) {
			if (value < 10) {
				return "0" + value;
			} else {
				return value;
			}
		},
	},
};
</script>
