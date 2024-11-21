<template>
	<div id="lb-my-coupon" class="modal fade coupon-popup" tabindex="-1">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title">折價券</h3>
					<a class="modal-close" data-dismiss="modal"><i class="icon-close"></i></a>
				</div>
				<div class="modal-body">
					<div class="form-input filled-coupon">
						<input
							v-model.trim="selfKeyIn"
							@click="enterCoupon"
							type="text"
							class="form-control"
							name="self-coupon"
							placeholder="自行輸入折價券代碼"
						/>
					</div>
					<div class="coupon-list">
						<div v-for="(c, index) in myCoupon" :key="index" class="choose">
							<label :for="'coupon-' + index" class="choose-input">
								<input
									v-model="couponSelected"
									name="coupon-selected"
									:id="'coupon-' + index"
									type="radio"
									:value="c.Code"
								/>
								<span class="choose-checkMark"></span>
								<span>{{ c.Code }}</span>
								<span>{{ c.Description }}</span>
								<p>使用期限: {{ c.EndDate }}</p>
							</label>
						</div>
					</div>

					<div class="coupon-info">
						<p class="my-4">
							單筆訂單限抵一張折價券。<br />
							取消訂單、辦理整筆退貨或退貨後之保留商品未符合折價券使用條件時<br />
							若折價券能仍在使用期限內，將歸還至帳戶中。
						</p>
						<p>
							One order is limited to one voucher usage only.<br />
							Coupons (within validity) are deposited back to account in case<br />
							of a cancelled order or merchandise return.
						</p>
					</div>
				</div>
				<div class="modal-footer">
					<a id="btn-coupon-discount" @click.prevent="checkCoupon" class="btn btn-block btn-primary">確定</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AlertDialog from "@global/helpers/alertDialog";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cartModule");

export default {
	name: "CouponCheck",
	props: ["myCoupon"],
	data() {
		return {
			couponSelected: "",
			selfKeyIn: "",
		};
	},
	computed: {
		...mapState(["detectLang"]),
	},
	watch: {
		selfKeyIn(val) {
			if (val !== "") {
				this.couponSelected = "";
			}
		},
		couponSelected(val) {
			if (val !== "") {
				this.selfKeyIn = "";
			}
		},
	},
	methods: {
		enterCoupon() {
			this.couponSelected = "";
		},
		checkCoupon() {
			if (this.couponSelected === "" && this.selfKeyIn === "") {
				AlertDialog.alert("請輸入或選擇折價代碼");
				return;
			}
			this.$emit("coupon", this.selfKeyIn == "" ? this.couponSelected : this.selfKeyIn);

			$("#lb-my-coupon").modal("hide");
		},
	},
};
</script>
