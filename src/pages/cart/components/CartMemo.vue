<template>
	<div v-if="dataIsLoad" class="total-block">
		<div class="price-block">
			<div class="row">
				<div class="col-9">總金額</div>
				<div class="col-3 text-right">NT.{{ memo.TotalPrice.toLocaleString() }}</div>
			</div>
			<div v-if="memo.FaPointsMemo.IsBound && memo.UseFaPoints !== 0" class="row">
				<div class="col-9">fa points</div>
				<div class="col-3 text-right">NT.{{ memo.UseFaPoints.toLocaleString() }}</div>
			</div>
			<div class="row">
				<div class="col-9">
					運費
					<span v-if="!isEmployee && memo.ShippingThreshold !== 999999" class="shipping-text">
						<template v-if="noShippingCostGap === 0">
							<span class="active" v-if="memo.ShippingThreshold === -1">您已達到購買指定商品免運</span>
							<span class="active" v-else> 您已到達 NT.{{ memo.ShippingThreshold }}免運門檻了 </span>
						</template>
						<template v-else>
							<span> 商品金額只差 NT.{{ noShippingCostGap }}可享滿 NT.{{ shippingThreshold }} 免運 </span>
						</template>
					</span>
				</div>
				<div class="col-3 text-right">NT.{{ memo.ShippingCost }}</div>
			</div>
			<div class="row">
				<div class="col-9">加價購</div>
				<div class="col-3 text-right">NT.{{ memo.AddOnPrice.toLocaleString() }}</div>
			</div>
			<div class="row">
				<div class="col-9">回饋金</div>
				<div class="col-3 text-right">NT.{{ memo.ShareDiscount }}</div>
			</div>
			<div class="row total-border">
				<div class="col-9">購物金</div>
				<div class="col-3 text-right">NT.{{ memo.UserVirtualCurrency }}</div>
			</div>
			<div class="row">
				<div class="col-9">分享回饋折扣</div>
				<div class="col-3 text-right">NT.{{ memo.UseRebate }}</div>
			</div>
			<div class="row">
				<div class="col-9">
					折價券 <span v-if="specialCoupon || coupon">({{ specialCoupon.length !== 0 ? specialCoupon : coupon }})</span>
				</div>
				<div class="col-3 text-right">NT.{{ memo.CouponDiscount }}</div>
			</div>
			<div class="row total-price">
				<div class="col">應付金額</div>
				<div class="col total-price-num text-right">NT.{{ memo.PayPrice.toLocaleString() }}</div>
			</div>
			<div class="cart-fasney-memo" v-if="memo.FaPointsMemo.IsBound">
				<p>此筆訂單可獲得 {{ memo.FaPointsMemo.AddFaPoints }} fa points回饋</p>
			</div>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cartModule");

export default {
	name: "ShopTotal",
	computed: {
		...mapState(["dataIsLoad", "memo", "specialCoupon", "detectLang", "isEmployee"]),
		noShippingCostGap() {
			return this.memo.NoShippingCostGap;
		},
		shippingThreshold() {
			return this.memo.ShippingThreshold;
		},
		coupon() {
			return this.$store.state.cartModule.userSelect.coupon;
		},
	},
};
</script>
