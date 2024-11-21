<template>
	<div>
		<div class="tab-btn-wrap" v-if="!isOnlyOneTemp">
			<button
				v-if="!isOnlyOneTemp && generalCount !== 0"
				class="tab-cart"
				@click.prevent="changeTemperature(1)"
				:class="{ active: temperature === 0 }"
			>
				<span>常溫 ({{ generalCount | autoSupplement }})</span>
			</button>

			<button
				v-if="!isOnlyOneTemp && refrigerationCount !== 0"
				class="tab-cart"
				@click.prevent="changeTemperature(3)"
				:class="{ active: temperature === 1 }"
			>
				<span>冷藏 ({{ refrigerationCount | autoSupplement }})</span>
			</button>

			<button
				v-if="!isOnlyOneTemp && freezingCount !== 0"
				class="tab-cart"
				@click.prevent="changeTemperature(5)"
				:class="{ active: temperature === 2 }"
			>
				<span>冷凍({{ freezingCount | autoSupplement }})</span>
			</button>
		</div>
		<div v-if="showStockTab" class="tab-stock-wrap">
			<a @click.prevent="changeIsPreOrder(false)" class="tab-cart" :class="{ active: !preOrder }">
				<span>現貨({{ mappingCartCount.spotGoodsCount | autoSupplement }})</span>
			</a>
			<a @click.prevent="changeIsPreOrder(true)" class="tab-cart" :class="{ active: preOrder }">
				<span>預購({{ mappingCartCount.preOrderCount | autoSupplement }})</span>
			</a>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
	name: "CartPanel",
	computed: {
		...mapState("cartModule", [
			"generalCount",
			"refrigerationCount",
			"freezingCount",
			"spotGoodsCount",
			"preOrderCount",
			"preOrder",
			"temperature",
		]),
		...mapGetters("cartModule", ["mappingCartCount"]),
		...mapGetters("miniCartModule", ["isOnlyOneTemp"]),
		showStockTab() {
			return this.mappingCartCount.preOrderCount !== 0 && this.mappingCartCount.spotGoodsCount !== 0;
		},
	},
	methods: {
		...mapMutations("cartModule", ["changeTemperature", "changeIsPreOrder"]),
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

<style></style>
