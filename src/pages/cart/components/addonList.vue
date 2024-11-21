<template>
	<ul>
		<li class="item-list cart-addon-list" v-for="(addon, index) in addonEvents.Items" :key="index">
			<div class="item-container">
				<div class="product-img">
					<a href="javascript:;">
						<new-image :url="addon.Cover" :size="'_w320_h408'" :name="addon.Name"></new-image>
					</a>
				</div>
				<div class="item-info">
					<div>
						<p class="item-brand">{{ addon.BrandName }}</p>
						<p class="item-name">{{ addon.Name }}</p>
						<p class="item-color">{{ addon.ColorName }} / {{ addon.Size }}</p>
					</div>
					<div>
						<div class="item-price">
							<div class="item-price-count">
								<span v-if="addon.SellPrice !== addon.OriginPrice" class="origin-price">
									NT.{{ addon.OriginPrice.toLocaleString() }}
								</span>
								<span class="sell-price"> NT.{{ addon.SellPrice.toLocaleString() }} </span>
							</div>
							<div class="item-price-total">
								<span>小計：{{ (addon.SellPrice * addon.Count).toLocaleString() }}</span>
							</div>
						</div>
						<div class="item-counter">
							<div class="quantity">
								<button type="button" class="quantity-btn-minus" @click="onMinus(addon.CustomMarketID, addon.Count)">
									–
								</button>
								<input :value="addon.Count" class="quantity-text" type="text" readonly />
								<button
									type="button"
									class="quantity-btn-plus"
									@click="onPlus(addon.CustomMarketID, addon.Count, addon.Stock)"
								>
									＋
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="item-btn">
					<a @click.prevent="deleteItem" class="btn-delete-item" :class="{ disabled: lockBtn }">
						<i class="icon-delete"></i>
					</a>
				</div>
			</div>
			<div class="reminder-block">
				<p class="event-label active">加價購</p>
				<div class="reminder-content">
					<p class="active">(已符合) {{ addonEvents.Name }}</p>
					<p v-if="addon.IsLimitedRefund">(!) 此商品無提供退貨服務!</p>
					<p v-if="addonEvents.IsOverCountLimit">
						超出可加購上限，請調整購買數量!（可加購總數量：{{ addonEvents.CountLimit }}）
					</p>
					<p v-if="!addonEvents.IsMatch">不符合加購條件，須購買指定商品方可加購</p>
					<p v-if="!addon.HasStock">超出可購買數量!</p>
				</div>
			</div>
		</li>
	</ul>
</template>
<script>
import NewImage from "@global/components/global/image";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("cartModule");

export default {
	name: "CartAddonList",
	props: ["addonEvents"],
	data() {
		return {
			selected: 0,
		};
	},
	components: { NewImage },
	computed: {
		...mapState(["detectLang"]),
	},
	created() {
		this.selected = this.countSelected;
	},
	methods: {
		...mapActions(["updateShoppingData"]),
		onMinus(id, count) {
			let select = count;
			if (select <= 1) return;

			select -= 1;
			this.onChange(id, count);
		},
		onPlus(id, count, stock) {
			let select = count;
			if (select >= stock) return;

			this.select += 1;
			this.onChange(id, count);
		},
		onChange(id, count) {
			this.updateShoppingData({ id: id, count: count });
		},

		deleteItem() {
			AlertDialog.confirm("請問您確定要刪除這項商品嗎？", () => {
				this.updateShoppingData({
					id: this.addonEvents.Items[0].CustomMarketID,
					count: 0,
					item: this.addonEvents.Items[0],
				});
			});
		},
	},
};
</script>
