<template>
	<li class="item-list">
		<div class="item-container">
			<div class="product-img">
				<a :href="item.Url">
					<new-image :url="item.Cover" :size="'_w320_h408'" :name="item.Name"></new-image>
				</a>
			</div>
			<div class="item-info">
				<div>
					<p class="item-brand">{{ item.BrandName }}</p>
					<a :href="item.Url" class="item-name">{{ item.Name }}</a>
					<p class="item-color">{{ item.ColorName }} / {{ item.Size }}</p>
				</div>
				<div>
					<div class="item-price">
						<div class="item-price-count">
							<span v-if="item.SellPrice !== item.OriginPrice" class="origin-price">
								NT.{{ item.OriginPrice.toLocaleString() }}
							</span>
							<span class="sell-price"> NT.{{ item.SellPrice.toLocaleString() }} </span>
						</div>
						<div class="item-price-total">
							<span>小計：{{ item.Subtotal.toLocaleString() }}</span>
						</div>
					</div>
					<div class="item-counter">
						<div class="quantity">
							<button type="button" class="quantity-btn-minus" @click="onMinus">–</button>
							<input :value="selected" class="quantity-text" type="text" readonly />
							<button type="button" class="quantity-btn-plus" @click="onPlus">＋</button>
						</div>
					</div>
				</div>
			</div>
			<div class="item-btn">
				<a @click.prevent="deleteItem" class="btn-delete-item" :class="{ disabled: lockBtn }">
					<i class="icon-delete"></i>
				</a>
				<a
					@click.prevent="addToFav(item.CustomMarketID)"
					class="btn-add-to-fav"
					:class="{ disabled: lockbtn, active: item.FavoriteFlag === 1 }"
				>
					<i class="icon-fav"></i>
				</a>
			</div>
		</div>

		<div class="reminder-block">
			<p class="event-label"></p>
			<div class="reminder-content">
				<p v-for="event in item.Events" :key="event.ID">
					<span v-if="event.IsMatch" class="active">
						(已符合)
						<a :href="'/campaign/' + event.ID">{{ event.Name }}</a>
					</span>
					<span v-else class="free-label">
						(未符合)
						<a :href="'/campaign/' + event.ID">{{ event.Name }}</a>
					</span>
				</p>
				<p class="active" v-if="item.Coupons.length">(已符合) {{ item.Coupons[0].Code }}</p>
				<p v-if="item.Levels.length">
					<span v-for="level in item.Levels" :key="level.ID">
						<span v-if="level.IsMatch" class="active">(已符合) {{ level.LevelEventName }}</span>
					</span>
				</p>
				<p v-if="item.IsLimitedRefund">(!) 此商品無提供退貨服務!</p>
				<p v-if="!item.IsForeginDeliver && !item.IsOffshoreIsland">(!) 此商品不支援海外及離島配送!</p>
				<p v-else-if="!item.IsForeginDeliver">(!) 此商品不支援海外配送!</p>
				<p v-else-if="!item.IsOffshoreIsland">(!) 此商品不支援離島配送!</p>
				<p v-if="item.IsNotEmployeeDiscount && isEmployee">(!) 此商品不提供員工折扣</p>
				<p v-if="item.StockMessage !== null">
					{{ item.StockMessage }}
				</p>
				<p v-if="item.LimitMessage !== null">
					{{ item.LimitMessage }}
				</p>
				<p v-if="!item.IsVipDiscount">
					<span v-show="memo.UserLevelMemo.Name === 'VVIP' || memo.UserLevelMemo.Name === 'VIP'">
						(!) 此商品不提供VIP/VVIP折扣
					</span>
				</p>
			</div>
		</div>
	</li>
</template>

<script>
import AlertDialog from "@global/helpers/alertDialog";
import NewImage from "@global/components/global/image";

import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers("cartModule");
import axios from "axios";
import MessageBox from "@global/helpers/messageBox";

export default {
	name: "CartList",
	props: ["item"],
	components: { NewImage },
	computed: {
		...mapState(["detectLang", "shoppingData", "isEmployee", "isFriend", "memo", "lockBtn"]),

		resizeImg: function () {
			return this.item.Cover + "?w=100&h=100&mode=crop";
		},
		countSelected() {
			let selected = "";

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
		// 數量
		maxCount() {
			if (this.item.Limit !== 0) {
				if (this.item.Count > this.item.Limit) {
					// 顧客加入購物車時，商品沒有限制購買數量
					// 但之後 API response 回來商品有限制購買數量
					this.updateShoppingData({
						id: this.item.CustomMarketID,
						count: this.item.Limit,
						item: this.item,
					});
					return;
				} else {
					return this.item.Stock > this.item.Limit ? this.item.Limit : this.item.Stock;
				}
			}
			return this.item.Stock;
		},
	},
	data() {
		return {
			selected: 0,
		};
	},
	created() {
		this.selected = this.countSelected;
		this.itemIsFavorite = this.item.FavoriteFlag;
	},
	methods: {
		...mapActions(["updateShoppingData"]),

		onMinus() {
			if (this.selected <= 1) return;

			this.selected -= 1;
			this.onChange(this.selected);
		},
		onPlus() {
			if (this.selected >= this.maxCount) return;

			this.selected += 1;
			this.onChange(this.selected);
		},
		onChange(number) {
			this.updateShoppingData({
				id: this.item.CustomMarketID,
				count: number,
			});
		},

		deleteItem() {
			AlertDialog.confirm("請問您確定要刪除這項商品嗎？", () => {
				this.updateShoppingData({
					id: this.item.CustomMarketID,
					count: 0,
					item: this.item,
				});
				this.tracingCode();
			});
		},

		tracingCode() {
			var _this = this;
			dataLayer.push({
				event: "removeFromCart",
				ecommerce: {
					remove: {
						products: [
							{
								name: htmlDecode(_this.item.Name),
								id: _this.item.CustomMarketID,
								price:
									_this.item.EventPrice > 0 && _this.item.EventPrice < _this.item.SellPrice
										? _this.item.EventPrice
										: _this.item.SellPrice,
								variant: _this.item.ColorName,
								quantity: _this.item.Count,
							},
						],
					},
				},
			});
		},
		addToFav(customMarketID) {
			let SZIndex = customMarketID.indexOf("SZ");
			let customMarketIDwithoutSZ = customMarketID.substring(0, SZIndex + 2) + "_";

			if (this.itemIsFavorite === 0) {
				axios
					.post(API_URL.FAVORITE, {
						CustomMarketID: customMarketIDwithoutSZ,
					})
					.then((res) => {
						if (res.data.Code === 200) {
							location.reload();
						} else if (res.data.Code === 401) {
							AlertDialog.alert("請先登入");
						} else {
							AlertDialog.alert("系統忙線中");
						}
					});
			} else {
				axios
					.delete(API_URL.FAVORITE, {
						data: { CustomMarketID: customMarketIDwithoutSZ },
					})
					.then((res) => {
						if (res.data.Code === 200) {
							location.reload();
						} else if (res.data.Code === 401) {
							AlertDialog.alert("請先登入");
						} else {
							AlertDialog.alert("系統忙線中");
						}
					});
			}
		},
	},
};
</script>
