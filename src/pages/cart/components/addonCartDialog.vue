<template>
	<div class="">
		<!-- 手機板開始 -->
		<div>
			<transition name="slideup">
				<div
					class="dialog-bottom dialog-item"
					id="dialog-market"
					v-if="dataisload && isopen"
					:class="{ active: isopen }"
				>
					<div @click.prevent="closeSelf" class="mask" data-target="#dialog-market"></div>
					<div class="dialog-inner">
						<div class="cart-content">
							<a class="btn-delete" @click.prevent="closeSelf">
								<i class="icon-close"></i>
							</a>
							<div class="item-detail">
								<div class="item-img">
									<new-image
										v-if="selected.Images.length !== 0"
										:url="selected.Images[0].Url"
										:size="'_w752_h956'"
										:name="alldatas.Name"
									></new-image>
								</div>
								<div class="item-info shopping-table">
									<div class="item-order">
										<div class="brand-name h3">{{ alldatas.Brand.Name }}</div>
										<div class="item-name h3">{{ alldatas.Name }}</div>
										<div class="item-price">
											<span
												v-if="alldatas.SellPrice !== alldatas.OriginPrice || alldatas.EventPrice > 0"
												class="origin-price"
												>NT$ {{ alldatas.OriginPrice.toLocaleString() }}</span
											>
											<span class="sell-price"
												>NT$
												{{
													alldatas.EventPrice > 0 && alldatas.EventPrice < alldatas.SellPrice
														? alldatas.EventPrice.toLocaleString()
														: alldatas.SellPrice.toLocaleString()
												}}</span
											>
										</div>
										<div class="item-event">
											<span v-for="(event, index) in alldatas.Events">{{ event.Name }}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="item-pick">
								<div class="select-block">
									<div class="select-style">
										<a class="select-btn" @click.prevent.stop="openSelector" href="#">{{ selected.Name }} </a>
										<ul class="select-opts" :class="{ isopen: selectIsOpen }">
											<li @click.prevent="changeImg(color.ID)" v-for="(color, index) in alldatas.Colors">
												{{ color.Name }}
											</li>
										</ul>
									</div>
									<Selector
										v-on:cb="selectSpec"
										:defaultTxt="'尺寸'"
										:options="selected.Specs"
										:selected="selectedSpec"
									/>
								</div>
								<div class="row">
									<div class="col-12">
										<div class="UiQuantity w-100 bg-white counter">
											<a @click.prevent="reduceCount" class="UiQuantity__btn UiQuantity__btn--minus">–</a>
											<span class="UiQuantity__text">{{ counter }}</span>
											<a
												@click.prevent="addCount(selectedSpec === null ? 1 : selectedSpec.Stock)"
												class="UiQuantity__btn UiQuantity__btn--plus"
												>＋</a
											>
										</div>
									</div>
									<div class="col-12">
										<button @click.prevent="addToCart" class="btn btn-primary w-100 btn-add2cart" :class="btnStyle">
											<span>{{ btnDescriptionGenerate }}</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>
		</div>
		<!-- 手機板結束 -->
		<!-- 桌機板開始 -->
		<div id="modal-market" class="modal fade">
			<div @click.prevent="closeSelf" class="mask" data-target="#dialog-market"></div>
			<div class="modal-dialog modal-lg">
				<div class="cart-content modal-content">
					<a data-dismiss="modal" class="modal-close" href="#"><i class="icon-close"></i></a>
					<div v-if="dataisload" class="item-detail">
						<div class="item-img">
							<new-image
								v-if="selected.Images.length !== 0"
								:url="selected.Images[0].Url"
								:size="'_w245_h315'"
								:name="alldatas.Name"
							></new-image>
						</div>
						<div class="item-info shopping-table">
							<div class="item-order">
								<div class="brand-name h3">{{ alldatas.Brand.Name }}</div>
								<div class="item-name h3">{{ alldatas.Name }}</div>
								<div class="item-price">
									<span
										v-if="alldatas.SellPrice !== alldatas.OriginPrice || alldatas.EventPrice > 0"
										class="origin-price"
										>NT$ {{ alldatas.OriginPrice.toLocaleString() }}</span
									>
									<span class="sell-price"
										>NT$
										{{
											alldatas.EventPrice > 0 && alldatas.EventPrice < alldatas.SellPrice
												? alldatas.EventPrice.toLocaleString()
												: alldatas.SellPrice.toLocaleString()
										}}</span
									>
								</div>
								<div class="item-event">
									<span v-for="(event, index) in alldatas.Events">{{ event.Name }}</span>
								</div>
							</div>
							<div class="item-pick">
								<div class="select-block">
									<div class="select-style">
										<a class="select-btn" @click.prevent.stop="openSelector" href="#">{{ selected.Name }} </a>
										<ul class="select-opts" :class="{ isopen: selectIsOpen }">
											<li @click.prevent="changeImg(color.ID)" v-for="(color, index) in alldatas.Colors">
												{{ color.Name }}
											</li>
										</ul>
									</div>
									<Selector
										v-on:cb="selectSpec"
										:defaultTxt="'尺寸'"
										:options="selected.Specs"
										:selected="selectedSpec"
									/>
								</div>
								<div class="row">
									<div class="col-12">
										<div class="UiQuantity w-100 bg-white counter">
											<a @click.prevent="reduceCount" class="UiQuantity__btn UiQuantity__btn--minus">–</a>
											<span class="UiQuantity__text">{{ counter }}</span>
											<a
												@click.prevent="addCount(selectedSpec === null ? 1 : selectedSpec.Stock)"
												class="UiQuantity__btn UiQuantity__btn--plus"
												>＋</a
											>
										</div>
									</div>
									<div class="col-12">
										<button @click.prevent="addToCart" class="btn btn-primary w-100 btn-add2cart" :class="btnStyle">
											<span>{{ btnDescriptionGenerate }}</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 桌機板結束 -->
		<!-- 貨到通知 -->
		<Notice :CustomMarketID="itemSpecInfo"></Notice>
	</div>
</template>

<script>
import NewImage from "@global/components/global/image";
import gtmTrace from "@global/components/tracing/gtm";
import utmKDetect from "@global/helpers/utmKDetect";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("miniCartModule");
import Notice from "@page/shopContent/components/Notice.vue";
import Selector from "@page/common/js/template/select";
import axios from "axios";

export default {
	data() {
		return {
			alldatas: {},
			selectedID: null,
			selected: {},
			hasstock: true,
			isopen: false,
			selectedSpec: null,
			selectedSpecID: null,
			selectedSpecKey: null,
			counter: 1,
			btnStyle: "disabled",
			btnDescription: this.btndescription.genernal,
			checkisopen: false,
			dataisload: false,
			openArrivalNotice: false,
			itemSpecInfo: "",
		};
	},
	components: { NewImage, Notice, Selector },
	props: ["isnotice", "btndescription"],
	computed: {
		btnStyleGenerate: {
			get() {
				if (this.alldatas.IsPreShow) {
					this.btnStyle = "disabled";
				} else if (!this.hasstock) {
					this.btnStyle = "disabled";
				}

				return this.btnStyle;
			},
			set(newVal) {
				this.btnStyle = newVal;
			},
		},
		btnDescriptionGenerate: {
			get() {
				if (this.alldatas.IsPreShow) {
					this.btnDescription = this.btndescription.preShow;
				} else if (this.isnotice && !this.hasstock) {
					this.btnDescription = this.btndescription.notice;
				} else if (!this.hasstock) {
					this.btnDescription = this.btndescription.soldout;
				}

				return this.btnDescription;
			},
			set(newVal) {
				this.btnDescription = newVal;
			},
		},
		getEventPrice() {
			return this.alldatas.EventPrice > 0 && this.alldatas.EventPrice < this.alldatas.SellPrice
				? this.alldatas.EventPrice.toLocaleString()
				: this.alldatas.SellPrice.toLocaleString();
		},
	},
	watch: {
		selectedID() {
			this.getSelectedData();
		},
	},
	methods: {
		...mapActions(["getCartInfo"]),
		closeArrivalNotice() {
			this.openArrivalNotice = false;
		},
		checkIfOnlyOneHasStock: function () {
			let hasStockCount = 0;
			let hasStockIndex = 0;
			this.selected.Specs.forEach(function (element, index) {
				if (parseInt(element.Stock) !== 0) {
					hasStockCount++;
					hasStockIndex = index;
				}
			});
			if (hasStockCount === 1) {
				this.selectSpec(this.selected.Specs[hasStockIndex]);
			}
		},
		checkHasStock: function () {
			var _this = this;
			_this.hasstock = false;
			_this.selected.Specs.forEach(function (element, index) {
				if (parseInt(element.Stock) !== 0) {
					_this.hasstock = true;
				}
			});
		},
		getSelectedData() {
			var _this = this;
			this.alldatas.Colors.forEach(function (element, index) {
				if (element.ID === _this.selectedID) {
					_this.selected = element;
				}
			});
			this.checkHasStock();
			this.checkIfOnlyOneHasStock();
		},
		closeSelf() {
			this.isopen = false;
			this.btnReset();
			this.clearSpec();
		},
		selectSpec(spec) {
			this.selectedSpec = spec;
			this.selectedSpecID = spec.ID;
			this.selectedSpecKey = spec.Key;
			this.resetCounter();
			this.btnActive(spec.Stock, spec.IsOutOfStock, spec.PreOrder);
		},
		clearSpec() {
			this.selectedSpec = null;
			this.selectedSpecID = null;
			this.selectedSpecKey = null;
		},
		addCount(maxCount) {
			if (this.counter >= maxCount) return;
			this.counter++;
		},
		reduceCount() {
			if (this.counter <= 1) return;
			this.counter--;
		},
		resetCounter() {
			this.counter = 1;
		},
		changeImg(colorID) {
			if (this.selected.ID === colorID) return;
			this.btnReset();
			this.clearSpec();
			this.resetCounter();
			this.selectedID = colorID;
		},
		btnActive(stock, isSoldOut, isPreOrder) {
			if (this.alldatas.IsPreShow) return;
			if (stock === 0 && isSoldOut && !isPreOrder) {
				// 現貨無庫存且斷貨
				this.btnStyleGenerate = "disabled";
				this.btnDescriptionGenerate = this.btndescription.soldout;
				// 無庫存
			} else if (stock === 0) {
				this.btnStyleGenerate = "active-mail";
				this.btnDescriptionGenerate = this.btndescription.notice;
			} else {
				this.btnStyleGenerate = "active";
				this.btnDescriptionGenerate = this.btndescription.addbag;
			}
		},
		btnReset() {
			this.btnStyleGenerate = "disabled";
			this.btnDescriptionGenerate = this.btndescription.genernal;
		},
		addToCart() {
			let custommarketid = this.alldatas.CustomMarketID;
			let itemSpecInfo =
				custommarketid.substring(0, custommarketid.indexOf("CL")) +
				"CL" +
				this.selectedID +
				"SZ" +
				this.selectedSpecKey;
			this.itemSpecInfo = itemSpecInfo;

			if (this.alldatas.IsPreShow) return;
			if (this.selectedSpec === null) {
				AlertDialog.alert("請選擇尺寸");
				return;
			}
			if (this.selectedSpec.Stock === 0) {
				if (this.selectedSpec.IsOutOfStock && !this.selectedSpec.PreOrder) {
					//庫存為0且為斷貨商品且不是預購商品
					return;
				} else {
					// 1.庫存為0且不是斷貨商品(不用管預購不預購)
					// 2.庫存為0且是斷貨商品但為預購商品
					$("#lb-get-product-mail").modal("show");
					return;
				}
			}

			let utmData = utmKDetect(itemSpecInfo) === null ? "" : utmKDetect(itemSpecInfo);

			axios
				.post(API_URL.SHOPPING_CART, {
					CustomMarketID: itemSpecInfo,
					Count: this.counter,
					UtmTag: utmData,
				})
				.then((res) => {
					if (res.data.Code === 200 || res.data.Code === 406) {
						this.checkisopen = false;
						this.isopen = false;

						$("#lb-add-to-cart").modal("show");
						setTimeout(function () {
							$("#lb-add-to-cart").modal("hide");
							window.location.href = "/zh-tw/checkout";
						}, 2000);

						this.getCartInfo();

						gtmTrace.addToCart({
							name: this.alldatas.Name,
							id: itemSpecInfo,
							price: this.alldatas.OriginPrice,
							sale_price:
								this.alldatas.EventPrice > 0 && this.alldatas.EventPrice < this.alldatas.SellPrice
									? this.alldatas.EventPrice
									: this.alldatas.SellPrice,
							img_url: this.selected.Images[0].Url,
							product_url: this.selected.MarketUrl,
							color: this.selected.Name,
							count: this.counter,
						});
					} else if (res.data.Code === 205) {
						AlertDialog.alert("商品已售完", function () {
							window.location.href = "/zh-tw/checkout";
						});
					} else {
						AlertDialog.alert(res.data.Message);
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		itemCheck: function (val) {
			this.checkisopen = val;
		},
		showProductInfo() {
			$("#popup-addon-detail").appendTo("body").modal("show");
			$(".modal-backdrop").css("z-index", "2000");
		},
	},
};
</script>
