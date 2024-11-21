<template>
	<ul>
		<li class="item-list cart-gift-list" v-for="(gift, index) in giftEvent.Gifts" :key="index">
			<div class="item-container">
				<div class="product-img">
					<a href="javascript:;">
						<new-image :url="gift.Cover" :size="'_w306_h426'" :name="gift.Name"></new-image>
					</a>
				</div>
				<div class="item-info">
					<div>
						<p class="item-brand">{{ gift.BrandName }}</p>
						<p class="item-name">{{ gift.Name }}</p>
						<p class="item-color">{{ gift.ColorName }} / {{ gift.Size }}</p>
					</div>
					<div>
						<div class="item-price">
							<div class="item-counter">
								<span class="item-counter-text">數量</span>
								<span>{{ gift.HasStock ? gift.Count : "已贈完" }}</span>
							</div>
						</div>
						<div class="item-counter">
							<select v-model="preGiftID" @change="addToCart">
								<option
									v-for="(detail, index) in giftEvent.GiftDetails"
									:key="index"
									:class="{ 'text-gray-700': !detail.HasStock }"
									:disabled="!detail.HasStock"
									:value="detail.CustomMarketID"
								>
									{{ detail.ColorName }} / {{ detail.Size }}
									{{ !detail.HasStock ? "-已贈完" : "" }}
								</option>
								<option value="noGift">不索取贈品</option>
							</select>
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
				<p class="event-label active">贈品</p>
				<div class="reminder-content">
					<p class="active">(已符合) {{ giftEvent.Name }}</p>
				</div>
			</div>
		</li>
	</ul>
</template>

<script>
import NewImage from "@global/components/global/image";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("cartModule");

export default {
	name: "GiftDetail",
	props: ["giftEvent", "selectedGift"],
	components: {
		NewImage,
	},
	data() {
		return {
			preGiftID: this.selectedGift.Count === 0 ? "noGift" : this.selectedGift.CustomMarketID,
		};
	},
	methods: {
		...mapActions(["updateShoppingData"]),
		addToCart(event) {
			if (event.target.value === "noGift") {
				this.updateShoppingData({
					id: this.selectedGift.CustomMarketID,
					count: 0,
					isGift: true,
				});
			} else {
				this.updateShoppingData({
					id: event.target.value,
					count: 1,
				});
			}
		},
		deleteItem() {
			this.updateShoppingData({
				id: this.selectedGift.CustomMarketID,
				count: 0,
				isGift: true,
				item: this.selectedGift,
			});
		},
	},
};
</script>
