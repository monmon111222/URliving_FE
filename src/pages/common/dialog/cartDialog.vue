<template>
	<div>
		<!-- mb版 上滑popup -->
		<transition name="slideup">
			<div v-if="dataLoad && isOpen" id="dialog-market" :class="{ active: isOpen }" class="dialog-bottom">
				<div @click="closeSelf" class="mask"></div>
				<div class="dialog-inner">
					<div class="cart-content">
						<a @click.prevent="closeSelf" class="btn-delete">
							<i class="icon-close"></i>
						</a>
						<div class="item-detail">
							<div class="item-img">
								<!--<img class="img-fluid" src="https://via.placeholder.com/752x956/0000FF/808080" />-->
								<new-image
									v-if="selected.Images.length !== 0"
									:url="selected.Images[0].Url"
									:size="'_w752_h956'"
									:name="allData.Name"
								></new-image>
							</div>
							<div class="item-info">
								<div class="item-order">
									<div class="brand-name">miyuki select miyuki select</div>
									<div class="item-name">{{ allData.Name }}</div>
									<div class="item-price">
										<span v-if="mapOriginPrice" class="origin-price">
											NT$ {{ allData.OriginPrice.toLocaleString() }}
										</span>
										<span class="sell-price">NT$ {{ mapSellPrice }}</span>
									</div>
									<ul class="item-event">
										<li v-for="event in allData.Events" :key="event.ID">{{ event.Name }}</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="item-pick">
							<div class="select-block">
								<div class="select-style">
									<a class="select-btn" @click.prevent="openSelector">{{ selected.Name }}</a>
									<ul class="select-opts" :class="{ isopen: selectIsOpen }">
										<li v-for="color in allData.Colors" :key="color.ID" @click="changeImg(color.ID)">
											{{ color.Name }}
										</li>
									</ul>
								</div>
								<Selector @cb="selectSpec" :defaultTxt="'尺寸'" :options="selected.Specs" :selected="selectedSpec" />
							</div>
							<div class="UiQuantity">
								<a @click.prevent="reduceCount" class="UiQuantity__btn UiQuantity__btn--minus">–</a>
								<span class="UiQuantity__text">{{ counter }}</span>
								<a
									@click.prevent="addCount(selectedSpec === null ? 1 : selectedSpec.Stock)"
									class="UiQuantity__btn UiQuantity__btn--plus"
								>
									＋
								</a>
							</div>
							<button @click.prevent="addToCart" class="btn btn-primary w-100 btn-add2cart" :class="btnStyle">
								{{ btnDescriptionGenerate }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<!-- pc版 model -->
		<div id="modal-market" ref="vuemodal" class="modal fade">
			<div @click.prevent="closeSelf" class="mask"></div>
			<div class="modal-dialog modal-lg">
				<div class="cart-content modal-content">
					<a data-dismiss="modal" class="modal-close" href="#"><i class="icon-close"></i></a>
					<div v-if="dataLoad" class="item-detail">
						<div class="item-img">
							<!--<img class="img-fluid" src="https://via.placeholder.com/752x956/0000FF/808080" />-->
							<new-image
								v-if="selected.Images.length !== 0"
								:url="selected.Images[0].Url"
								:size="'_w752_h956'"
								:name="allData.Name"
							></new-image>
						</div>
						<div class="item-info shopping-table">
							<div class="item-order">
								<div class="brand-name h3">miyuki select miyuki select</div>
								<div class="item-name h3">{{ allData.Name }}</div>
								<div class="item-price">
									<span v-if="mapOriginPrice" class="origin-price">NT$ {{ allData.OriginPrice.toLocaleString() }}</span>
									<span class="sell-price">NT$ {{ mapSellPrice }} </span>
								</div>
								<ul class="item-event">
									<li v-for="event in allData.Events" :key="event.ID">{{ event.Name }}</li>
								</ul>
							</div>
							<div class="item-pick">
								<div class="select-block">
									<div class="select-style">
										<a class="select-btn" @click.prevent="openSelector">{{ selected.Name }} </a>
										<ul class="select-opts" :class="{ isopen: selectIsOpen }">
											<li @click.prevent="changeImg(color.ID)" v-for="(color, index) in allData.Colors" :key="index">
												{{ color.Name }}
											</li>
										</ul>
									</div>
									<Selector @cb="selectSpec" :defaultTxt="'尺寸'" :options="selected.Specs" :selected="selectedSpec" />
								</div>
								<div class="UiQuantity">
									<a @click.prevent="reduceCount" class="UiQuantity__btn UiQuantity__btn--minus">–</a>
									<span class="UiQuantity__text">{{ counter }}</span>
									<a
										@click.prevent="addCount(selectedSpec === null ? 1 : selectedSpec.Stock)"
										class="UiQuantity__btn UiQuantity__btn--plus"
									>
										＋
									</a>
								</div>
								<button @click.prevent="addToCart" class="btn btn-primary w-100 btn-add2cart" :class="btnStyle">
									{{ btnDescriptionGenerate }}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Notice :CustomMarketID="itemSpecInfo"></Notice>
	</div>
</template>

<script>
import NewImage from "@global/components/global/image";
import gtmTrace from "@global/components/tracing/gtm";
import utmKDetect from "@global/helpers/utmKDetect";
import Notice from "@page/shopContent/components/Notice.vue";
import axios from "axios";
import Selector from "@page/common/js/template/select";
import store from "@global/components/store/index.js";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("miniCartModule");

export default {
	name: "cartDialog",
	data() {
		return {
			allData: {},
			selectedID: null,
			selected: {},
			hasStock: true,
			isOpen: false,
			selectedSpec: { Name: "尺寸", Key: "default" },
			selectedSpecID: null,
			selectedSpecKey: null,
			counter: 1,
			btnStyle: "disabled",
			checkisopen: false,
			dataLoad: false,
			itemSpecInfo: "",
			selectIsOpen: false,
			btnDescriptionEnum: {
				general: "請選擇尺寸",
				preShow: "COMING SOON",
				addBag: "ADD TO BAG",
				soldOut: "SOLD OUT",
				notice: "索取貨到通知",
			},
			btnDescription: "請選擇尺寸",
		};
	},
	store,
	components: { NewImage, Notice, Selector },
	props: ["isnotice"],
	mounted() {
		$(this.$refs.vuemodal).on("hidden.bs.modal", (e) => {
			this.closeSelf();
		});
	},
	computed: {
		btnStyleGenerate: {
			get() {
				if (this.allData.IsPreShow) {
					this.btnStyle = "disabled";
				} else if (!this.hasStock) {
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
				if (this.allData.IsPreShow) {
					return this.btnDescriptionEnum.preShow;
				} else if (this.isnotice && !this.hasStock) {
					return this.btnDescriptionEnum.notice;
				} else if (!this.hasStock) {
					return this.btnDescriptionEnum.soldOut;
				}

				return this.btnDescription;
			},
			set(newVal) {
				this.btnDescription = newVal;
			},
		},
		mapOriginPrice() {
			if (Object.keys(this.allData).length !== 0) {
				return this.allData.SellPrice !== this.allData.OriginPrice || this.allData.EventPrice > 0;
			} else {
				return null;
			}
		},
		mapSellPrice() {
			if (Object.keys(this.allData).length !== 0) {
				return this.allData.EventPrice > 0 && this.allData.EventPrice < this.allData.SellPrice
					? this.allData.EventPrice.toLocaleString()
					: this.allData.SellPrice.toLocaleString();
			} else {
				return null;
			}
		},
	},
	watch: {
		selectedID() {
			this.allData.Colors.forEach((element) => {
				if (element.ID === this.selectedID) {
					this.selected = element;
				}
			});

			this.checkHasStock();
			this.checkIfOnlyOneHasStock();
		},
	},
	methods: {
		...mapActions(["getCartInfo"]),

		checkIfOnlyOneHasStock() {
			let hasStockCount = 0;
			let hasStockIndex = 0;

			this.selected.Specs.forEach((element, index) => {
				if (parseInt(element.Stock) !== 0) {
					hasStockCount++;
					hasStockIndex = index;
				}
			});
			if (hasStockCount === 1) {
				this.selectSpec(this.selected.Specs[hasStockIndex]);
			}
		},
		checkHasStock() {
			this.hasStock = false;

			this.selected.Specs.forEach((element) => {
				if (parseInt(element.Stock) !== 0) {
					this.hasStock = true;
				}
			});
		},
		closeSelf() {
			this.isOpen = false;
			this.btnReset();
			this.clearSpec();
		},
		selectSpec(spec) {
			if (spec.Key === "default") {
				this.btnStyleGenerate = "disabled";
				this.btnDescriptionGenerate = this.btnDescriptionEnum.general;
				this.clearSpec();
				return;
			}

			this.selectedSpec = spec;
			this.selectedSpecID = spec.ID;
			this.selectedSpecKey = spec.Key;
			this.resetCounter();
			this.btnActive(spec.Stock, spec.IsOutOfStock, spec.PreOrder);
		},
		clearSpec() {
			this.selectedSpec = { Name: "尺寸", Key: "default" };
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
			this.selectIsOpen = false;
			if (this.selected.ID === colorID) return;

			this.btnReset();
			this.clearSpec();
			this.resetCounter();
			this.selectedID = colorID;
		},
		btnActive(stock, isSoldOut, isPreOrder) {
			if (this.allData.IsPreShow) return;
			if (stock === 0 && isSoldOut && !isPreOrder) {
				// 現貨無庫存且斷貨
				this.btnStyleGenerate = "disabled";
				this.btnDescriptionGenerate = this.btnDescriptionEnum.soldOut;
				// 無庫存
			} else if (stock === 0) {
				this.btnStyleGenerate = "active-mail";
				this.btnDescriptionGenerate = this.btnDescriptionEnum.notice;
			} else {
				this.btnStyleGenerate = "active";
				this.btnDescriptionGenerate = this.btnDescriptionEnum.addBag;
			}
		},
		btnReset() {
			this.btnStyleGenerate = "disabled";
			this.btnDescriptionGenerate = this.btnDescriptionEnum.general;
		},
		addToCart() {
			let itemSpecInfo =
				this.allData.CustomMarketID.substring(0, this.allData.CustomMarketID.indexOf("CL")) +
				"CL" +
				this.selectedID +
				"SZ" +
				this.selectedSpecKey;

			this.itemSpecInfo = itemSpecInfo;

			if (this.allData.IsPreShow) return;

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

			let utmData = utmKDetect(itemSpecInfo) === null ? null : utmKDetect(itemSpecInfo);

			axios
				.post(API_URL.SHOPPING_CART, {
					CustomMarketID: itemSpecInfo,
					Count: this.counter,
					UtmTag: utmData,
				})
				.then((res) => {
					if (res.data.Code === 200 || res.data.Code === 406) {
						this.checkisopen = false;
						$("#lb-add-to-cart").modal("show");

						setTimeout(function () {
							$("#lb-add-to-cart").modal("hide");
						}, 2000);
						this.getCartInfo();

						gtmTrace.addToCart({
							name: this.allData.Name,
							id: itemSpecInfo,
							price: this.allData.OriginPrice,
							sale_price:
								this.allData.EventPrice > 0 && this.allData.EventPrice < this.allData.SellPrice
									? this.allData.EventPrice
									: this.allData.SellPrice,
							img_url: this.selected.Images[0].Url,
							product_url: this.selected.MarketUrl,
							color: this.selected.Name,
							count: this.counter,
						});
					} else if (res.data.Code === 205) {
						AlertDialog.alert("商品已售完", function () {
							location.reload();
						});
					} else {
						AlertDialog.alert(res.data.Message);
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		openSelector() {
			this.selectIsOpen = !this.selectIsOpen;
		},
	},
};
</script>

<style></style>
