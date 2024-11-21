<template>
	<div v-if="dataIsLoad" class="counting-block">
		<!-- 折價券開始 -->
		<div class="coupon-block">
			<p class="label">折價券</p>
			<p @click.prevent="getCoupon" class="text-inputBox">
				<span v-if="!coupon && !specialCoupon">請輸入或選擇折價代碼</span>
				<span>{{ specialCoupon.length !== 0 ? specialCoupon : coupon }}</span>
				<a class="cancel-icon" v-if="coupon.length > 0 || specialCoupon.length > 0" @click.stop="checkCoupon('')">
					<i class="icon-close-noCircle"></i>
				</a>
			</p>
			<input
				id="input-coupon"
				name="coupon"
				type="hidden"
				:value="specialCoupon.length !== 0 ? specialCoupon : coupon"
				placeholder="折價券代號"
				readonly
			/>
		</div>
		<!-- 折價券結束 -->
		<!-- fa points開始 -->
		<div class="fasney-block">
			<div v-if="!memo.FaPointsMemo.IsBound" class="lh-2">
				<p class="label">fa points</p>
				<p class="text-inputBox">請至會員中心進行綁定，即刻享受點數折抵！</p>
			</div>
			<template v-else>
				<template v-if="memo.FaPointsMemo.CanUse">
					<p class="label">fa points</p>
					<div class="fasney-wrap">
						<div class="fasney-point">
							<span>現有點數</span>
							<span>{{ memo.FaPointsMemo.PointsBalance.toLocaleString() }}</span>
						</div>
						<div>
							<span>使用</span>
							<input type="text" :value="userSelectedFaPoints" @blur="checkFAPointIsOver" name="fapoints" />
							<span>點</span>
							<a target="_blank" href="https://www.fasney.com/products/fapoints.html">
								<i class="icon-help"></i>
							</a>
						</div>
					</div>
				</template>
				<div v-else>
					<p class="label">fa points</p>
					<p class="text-inputBox warning">單筆金額未達NT.{{ memo.FaPointsMemo.Threshold }}，無法使用fa points折抵！</p>
				</div>
				<div v-if="memo.FaPointsMemo.FaPointsDescription" class="cart-fasney-text">
					<span>{{ memo.FaPointsMemo.FaPointsDescription }}</span>
				</div>
			</template>
		</div>
		<!-- fa points結束 -->
		<!-- 運送區域開始 -->
		<div class="delivery-block">
			<p class="label">運送區域</p>
			<div class="cart-select">
				<div class="form-select">
					<select
						v-if="showOtherRegion"
						v-model="userSelectedRegion"
						@change="changeSelectedRegion($event)"
						id="select-region"
						name="ShippingRegion"
						required
					>
						<option v-for="country in regions" :key="country.value" :value="country.value">
							{{ country.name }}
						</option>
					</select>
					<select
						v-else
						v-model="userSelectedRegion"
						@change="changeSelectedRegion($event)"
						id="select-region"
						name="ShippingRegion"
						required
					>
						<option v-for="country in employeeRegions" :key="country.value" :value="country.value">
							{{ country.name }}
						</option>
					</select>
				</div>
			</div>
			<div v-if="userSelectedRegion === 17" class="province-block">
				<div class="province-select">
					<div class="form-select">
						<select
							v-model="userSelectedProvince"
							@change="changeSelectedProvince($event)"
							class="mt-2"
							name="province"
							required
						>
							<option v-for="(province, index) in provinces" :key="index" :value="province.value">
								{{ province.name }}
							</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		<!-- 運送區域結束 -->
		<!-- 付款方式開始 -->
		<div class="pay-block">
			<p class="label">付款方式</p>
			<div class="pay-wrap">
				<div v-for="(payType, index) in payTypes" :key="payType.ID">
					<div v-if="payType.ID !== 9" class="cart-choose choose">
						<label class="choose-input" :for="'payType' + index">
							<input
								v-model="userSelectedPayType"
								:value="payType.ID"
								@click="changePayType(payType.ID)"
								:id="'payType' + index"
								type="radio"
								name="PayTypeWithInstallment"
							/>
							<span class="choose-checkMark"></span>
							<span class="choose-text">{{ nowLanguage ? payType.ChineseName : payType.EnglishName }}</span>
						</label>
					</div>
				</div>
				<div class="pay-message" v-if="userSelectedRegion !== 1">海外訂單-現貨及預購都需先線上刷卡</div>
				<div class="pay-message" v-if="!can_paytype">
					{{ memo.PayMemo.Message }}
				</div>
				<div v-if="getFasneyPayment.length">
					<div class="cart-choose choose" v-for="(fasneyPay, index) in getFasneyPayment" :key="index">
						<label class="choose-input" v-if="fasneyPay === 1" :for="'fasneyPay' + fasneyPay">
							<input
								v-model="payTypeWithInstallment"
								:value="'9-' + fasneyPay"
								@click="changeInstallmentPlan(fasneyPay)"
								:id="'fasneyPay' + fasneyPay"
								type="radio"
								name="PayTypeWithInstallment"
							/>
							<span class="choose-checkMark"></span>
							<span class="choose-text">Fasney後支付</span>
							<!-- <img src="https://static.tpx.tw/sff/thebutters/static/img/fasney-img.png" /> -->
							<p class="choose-text mb-0">(免卡/免手續費/最晚45天繳款)</p>
						</label>
						<label class="choose-input" v-else :for="'fasneyPay' + fasneyPay">
							<input
								v-model="payTypeWithInstallment"
								:value="'9-' + fasneyPay"
								@click="changeInstallmentPlan(fasneyPay)"
								:id="'fasneyPay' + fasneyPay"
								type="radio"
								name="PayTypeWithInstallment"
							/>
							<span class="choose-checkMark"></span>
							<span class="choose-text">Fasney後支付-分{{ fasneyPay }}期</span>
							<!-- <img src="https://static.tpx.tw/sff/thebutters/static/img/fasney-img.png" /> -->
						</label>
					</div>
					<div v-if="fasneyEvent" class="fasney-info">
						<div class="info-text">
							<span class="date">2/13-3/31</span>
							<span>感恩回饋來了！分期消費不限金額送1%fa points筆筆都回饋！</span>
						</div>
						<a target="_blank" rel="noreferrer noopener" href="https://www.fasney.com/news/fasney-event.html"
							>詳情請見活動辦法</a
						>
					</div>
					<div v-if="newsEvent" class="fasney-info">
						<div class="info-text">
							<span class="date">3/6-4/5</span>
							<span>寵愛無上限！女王消費我來送！滿額3800即享5%回饋</span>
						</div>
						<a target="_blank" rel="noreferrer noopener" href="https://www.fasney.com/news/news-event.html"
							>詳情請見活動辦法</a
						>
					</div>
				</div>
			</div>
			<input type="hidden" :value="userSelectedPayType" name="PayType" />
			<input type="hidden" name="InstallmentPlan" :value="selectedInstallmentPlan" />
			<input type="hidden" :value="userSelect.basket" name="BasketID" />
		</div>
		<!-- 付款方式結束 -->
		<!-- 運送方式開始 -->
		<div class="delivery-type">
			<p class="label">運送方式</p>
			<div class="cart-select">
				<select
					v-model="userSelectedDeliveryType"
					@change="changeDelivery($event)"
					id="select-transfer-type"
					name="DeliveryType"
					required
				>
					<template v-for="deliveryType in deliveryTypes">
						<option :key="deliveryType.ID" :value="deliveryType.ID">
							{{ deliveryType.ChineseName }}
						</option>
					</template>
				</select>

				<div v-if="isCSVDeliveryType" id="store-info" class="cvs-block">
					<div class="cvs-text">
						<div v-if="cvsCode">
							<div>{{ cvsCode }} {{ cvsName }}</div>
							<div>{{ cvsAddress }}</div>
						</div>
						<div v-else>
							<div id="no-cvs">尚未選擇門市</div>
						</div>
					</div>
					<a @click.prevent="chooseCVS" class="btn btn-choose-csv">選擇門市</a>
				</div>
				<p class="delivery-message" v-if="memo.DeliveryMemo.Message">
					{{ memo.DeliveryMemo.Message }}
				</p>
				<input name="cvsCode" type="hidden" :value="cvsCode" />
				<input name="cvsName" type="hidden" :value="cvsName" />
				<input name="cvsAddress" type="hidden" :value="cvsAddress" />
				<my-coupon :myCoupon="myCoupon" @coupon="checkCoupon" />
			</div>
		</div>
		<!-- 運送方式結束 -->
	</div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations, mapGetters } = createNamespacedHelpers("cartModule");
import myCoupon from "@page/cart/components/MyCoupon.vue";
import Cookies from "js-cookie";
import axios from "axios";

export default {
	name: "CartPay",
	components: {
		myCoupon,
	},
	computed: {
		...mapGetters([
			"userSelectedPayType",
			"userSelectedRegion",
			"userSelectedDeliveryType",
			"userSelectedProvince",
			"userSelectedFaPoints",
		]),
		...mapState([
			"detectLang",
			"shoppingData",
			"dataIsLoad",
			"memo",
			"specialCoupon",
			"userSelect",
			"isEmployee",
			"can_paytype",
			"IsOffshoreIsland",
			"cvsCode",
			"cvsName",
			"cvsAddress",
			"temperature",
			"selectedInstallmentPlan",
			"newsEvent",
			"fasneyEvent",
		]),
		coupon() {
			return this.$store.state.cartModule.userSelect.coupon;
		},
		isCSVDeliveryType() {
			return (
				this.userSelectedDeliveryType === 2 || (this.userSelectedDeliveryType === 7 && this.userSelectedRegion === 1)
			);
		},
		nowLanguage() {
			return this.detectLang === "tw" || this.detectLang === "cn";
		},
		showOtherRegion() {
			return !this.isEmployee && this.temperature !== 1 && this.temperature !== 2;
		},
		getFasneyPayment() {
			return this.memo.PayMemo.CanUseFasneyInstallmentPlan;
		},
		payTypeWithInstallment() {
			if (this.userSelectedPayType === 9) {
				return "9-" + this.selectedInstallmentPlan;
			} else {
				return null;
			}
		},
	},
	watch: {
		dataIsLoad() {
			this.getSitePayType();
			this.getSiteDelivery();
		},
	},
	mounted() {
		this.getInitRegion();
		this.getSitePayType();
		this.getSiteDelivery();
		this.changeFasneyEvent();
	},
	data() {
		return {
			selectedProvince: "",
			regions: [],
			employeeRegions: [{ name: "台灣及離島", value: 1 }],
			provinces: [],
			myCoupon: [],
			payTypes: [],
			allPayTypes: JSON.parse(window.allPayTypes),
			deliveryTypes: [],
			allDeliveryTypes: JSON.parse(window.allDeliveryTypes),
		};
	},
	methods: {
		...mapMutations(["changeUserSelect", "changeUserInfo", "changeCSVCode", "changeFasneyEvent"]),
		/**
		 * @description 取得全站可使用付款方式
		 */
		getSitePayType() {
			this.payTypes = [];

			this.allPayTypes.forEach((el) => {
				if (this.memo.PayMemo.AllPayType.includes(el.ID)) {
					this.payTypes.push(el);
				}
			});
		},
		/**
		 * @description 取得使用者選取付款方式之可使用運送方式
		 */
		getSiteDelivery() {
			this.deliveryTypes = [];

			this.allDeliveryTypes.forEach((el) => {
				if (this.memo.DeliveryMemo.CanUseDelivery.includes(el.ID)) {
					this.deliveryTypes.push(el);
				}
			});
		},
		getInitRegion() {
			const _this = this;
			const arr = JSON.parse(window.shippingRegion);
			arr.forEach(function (element) {
				let cName = "";
				let eName = "";

				switch (element.ChineseName) {
					case "台灣及離島":
						cName = "台灣本島及離島";
						eName = element.EnglishName;
						break;
					case "中國":
						cName = "中國大陸";
						eName = element.EnglishName;
						break;
					case "香港":
						cName = "香港SAR";
						eName = element.EnglishName + " " + "SAR";
						break;
					case "澳門":
						cName = "澳門SAR";
						eName = element.EnglishName + " " + "SAR";
						break;
					default:
						cName = element.ChineseName;
						eName = element.EnglishName;
						break;
				}

				_this.regions.push({
					name: cName + " " + eName,
					value: element.ID,
					eName: eName,
				});
			});

			_this.provinces.push({ name: "請選擇省份", value: "" });
			arr[1].Province.forEach(function (element) {
				_this.provinces.push({
					name: element.SimpleChineseName,
					value: element.ID,
				});
			});
		},
		mapCouponArrayData() {
			let shoppingCartItems = [];

			this.shoppingData.forEach((ele) => {
				let endIndex = ele.CustomMarketID.indexOf("CL");
				let marketID = ele.CustomMarketID.slice(4, endIndex);
				shoppingCartItems.push({
					MarketID: marketID,
					SellPrice: ele.SellPrice,
					Count: ele.Count,
				});
			});

			return shoppingCartItems;
		},
		getCoupon() {
			let shoppingCartItems = this.mapCouponArrayData();

			axios
				.post(`${API_URL.COUPON2}`, { ShoppingCartItems: shoppingCartItems })
				.then((res) => {
					if (res.data.Code === 200) {
						this.myCoupon = res.data.Response;
						$("#lb-my-coupon").modal("show");
					} else if (res.Code === 401) {
						AlertDialog.alert("請先登入");
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試");
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		checkCoupon(val) {
			if (val.length === 0 && this.userSelect.autoPickCoupon === 1) {
				// 取消自動選取折價券
				this.changeUserSelect({
					userSelectKey: "autoPickCoupon",
					userSelectValue: 0,
				});

				this.changeUserInfo({
					userInfoKey: "specialCoupon",
					userInfoValue: "",
				});
				Cookies.set("autocoupon", 0);
			} else {
				// 一般折價券
				this.changeUserSelect({
					userSelectKey: "coupon",
					userSelectValue: val,
				});

				this.changeUserSelect({
					userSelectKey: "autoPickCoupon",
					userSelectValue: 0,
				});

				this.changeUserInfo({
					userInfoKey: "specialCoupon",
					userInfoValue: "",
				});
				Cookies.set("coupon", val);
				Cookies.set("autocoupon", 0);
			}
		},
		chooseCVS() {
			if (this.userSelectedDeliveryType === 2) {
				var url = "/ConvenienceStore/Choose?type=1";
			} else if (this.userSelectedDeliveryType === 3) {
				var url = "/ConvenienceStore/Choose?type=2";
			} else if (this.userSelectedDeliveryType === 7) {
				var url = "/ConvenienceStore/Choose?type=3";
			}
			if (this.coupon.length !== 0) {
				Cookies.set("coupon", this.coupon);
			}
			window.location.href =
				url +
				"&ShippingRegion=" +
				this.userSelectedRegion +
				"&PayType=" +
				this.userSelectedPayType +
				"&DeliveryType=" +
				this.userSelectedDeliveryType +
				"&Coupon=" +
				this.coupon +
				"&IsOffshoreIsland=" +
				this.IsOffshoreIsland +
				"&InstallmentPlan=" +
				this.selectedInstallmentPlan +
				"&fapoints=" +
				this.userSelectedFaPoints;
		},
		/**
		 * @description 更新付款方式
		 */
		changePayType(val) {
			this.changeCSVCode();

			if (val !== 9) {
				this.changeUserInfo({
					userInfoKey: "selectedInstallmentPlan",
					userInfoValue: 1,
				});
			}

			// 貨到宅配
			if (val === 2 && this.userSelectedRegion == 1) {
				this.changeUserSelect({
					userSelectKey: "deliveryType",
					userSelectValue: 1,
				});
			}

			// 貨到超商
			if (val === 3 && this.userSelectedRegion == 1) {
				this.changeUserSelect({
					userSelectKey: "deliveryType",
					userSelectValue: 2,
				});
			}

			this.changeUserSelect({
				userSelectKey: "payType",
				userSelectValue: val,
			});
		},
		/**
		 * @description 更新收件國家
		 */
		changeSelectedRegion(event) {
			let regionValue = parseInt(event.target.value);

			if (regionValue === 1) {
				this.changeUserSelect({
					userSelectKey: "deliveryType",
					userSelectValue: 1,
				});
			} else {
				// 海外預設信用卡
				this.changeUserSelect({
					userSelectKey: "payType",
					userSelectValue: 1,
				});

				// 海外預設海外運送
				this.changeUserSelect({
					userSelectKey: "deliveryType",
					userSelectValue: 4,
				});
			}

			this.changeUserSelect({
				userSelectKey: "province",
				userSelectValue: "",
			});

			this.changeUserSelect({
				userSelectKey: "region",
				userSelectValue: regionValue,
			});
		},
		/**
		 * @description 更新運送方式
		 */
		changeDelivery(event) {
			let deliveryType = parseInt(event.target.value);

			if (deliveryType === 2 || deliveryType === 7) {
				this.changeCSVCode();
			}

			this.changeUserSelect({
				userSelectKey: "deliveryType",
				userSelectValue: deliveryType,
			});
		},
		/**
		 * @description 更新省份
		 */
		changeSelectedProvince(event) {
			let province = parseInt(event.target.value);

			this.changeUserSelect({
				userSelectKey: "province",
				userSelectValue: province,
			});
		},
		changeInstallmentPlan(fasneyPayValue) {
			this.changeUserInfo({
				userInfoKey: "selectedInstallmentPlan",
				userInfoValue: fasneyPayValue,
			});
			this.changePayType(9);
			this.payTypeWithInstallment = "9-" + fasneyPayValue;
		},
		/**
		 * @description 確認會原輸入的點數是否超過可用點數
		 */
		checkFAPointIsOver(e) {
			let usePointValue = Number(e.target.value);

			if (usePointValue < 0) {
				AlertDialog.alert("請輸入大於或等於0的點數");

				this.changeUserSelect({
					userSelectKey: "faPoints",
					userSelectValue: "",
				});
				this.changeUserSelect({
					userSelectKey: "faPoints",
					userSelectValue: 0,
				});
				return;
			}

			this.changeUserSelect({
				userSelectKey: "faPoints",
				userSelectValue: usePointValue,
			});
		},
	},
};
</script>
