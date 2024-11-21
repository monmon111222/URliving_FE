<template>
	<div v-if="rdataIsLoad" class="other-recommend">
		<cart-dialog ref="c_dialog" :isnotice="isNotice" />
		<span class="other-recommend-title">你可能會喜歡</span>
		<Slick
			v-if="recommandDatas.length > 0"
			class="recommend-slide"
			ref="slickRecommend"
			:options="slideOpts"
			@afterChange="handleAfterChange"
			@beforeChange="handleBeforeChange"
			@breakpoint="handleBreakpoint"
			@destroy="handleDestroy"
			@edge="handleEdge"
			@init="handleInit"
			@reInit="handleReInit"
			@setPosition="handleSetPosition"
			@swipe="handleSwipe"
			@lazyLoaded="handleLazyLoaded"
			@lazyLoadError="handleLazeLoadError"
		>
			<div v-for="r in recommandDatas" :key="r.MarketID" class="item-box">
				<div class="inner">
					<div class="item-img-box">
						<a :href="r.Colors[0].MarketUrl">
							<new-image :url="r.Colors[0].Covers[0]" :size="'_w320_h408'" :name="r.Name"></new-image>
							<!-- <img
                src="https://via.placeholder.com/460x644/0000FF/808080"
                class="img-fluid"
              /> -->

							<div class="brand-name">PAZZOPAZZOPAZZO</div>
							<div class="product-name">{{ r.Name }}</div>
							<div class="product-price">
								<span v-if="r.EventPrice > 0 || r.SellPrice !== r.OriginPrice" class="origin-price">
									NT.{{ r.OriginPrice }}
								</span>
								<span class="sell-price">
									NT.{{ r.EventPrice > 0 && r.EventPrice &lt; r.SellPrice ? r.EventPrice : r.SellPrice}}
								</span>
							</div>
						</a>
						<div class="tag-block">
							<div class="tag-label">
								<span>NEW</span>
								<span>SALE</span>
							</div>
							<a class="open-dialog" @click.prevent="openDialog(r.Colors[0].CustomMarketID)"
								><i class="icon-add-cart"></i
							></a>
						</div>
					</div>
				</div>
			</div>
		</Slick>
		<a class="arrow-left">
			<img class="img-fluid" src="https://s.azurecdns.com/sff-t/thebutters/static/img/arrow-left.svg" />
		</a>
		<a class="arrow-right">
			<img class="img-fluid" src="https://s.azurecdns.com/sff-t/thebutters/static/img/arrow-right.svg" />
		</a>
	</div>
</template>

<script>
import NewImage from "@global/components/global/image";
import Slick from "@global/vendors/vue-slick";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("shopContent");
import cartDialog from "@page/common/dialog/cartDialog.vue";
import axios from "axios";
import setEnv from "@global/helpers/setEnv";

export default {
	name: "Recommend",
	components: {
		NewImage,
		Slick,
		cartDialog,
	},
	data() {
		return {
			slideOpts: {
				centerMode: false,
				infinite: true,
				slidesToShow: 4,
				slidesToScroll: 3,
				arrows: true,
				dots: false,
				speed: 800,
				prevArrow: ".arrow-left",
				nextArrow: ".arrow-right",
			},
			isNotice: true,
		};
	},
	computed: {
		...mapState(["recommandDatas", "rdataIsLoad"]),
	},
	methods: {
		openDialog(id) {
			axios
				.get(API_URL.MARKET_CONTENT, {
					CustomMarketID: id,
				})
				.then((res) => {
					if (res.data.Code === 200) {
						if (!setEnv.myEquipment()) {
							$("#modal-market").modal("show");
						} else {
							this.$refs.c_dialog.isOpen = true;
						}
						this.$refs.c_dialog.allData = res.data.Response;
						this.$refs.c_dialog.selectedID = res.data.Response.ColorID;
						this.$refs.c_dialog.dataLoad = true;
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試");
					}
				});
		},
		next() {
			this.$refs.slick.next();
		},

		prev() {
			Slick;
			this.$refs.slick.prev();
		},

		reInit() {
			// Helpful if you have to deal with v-for to update dynamic lists
			this.$nextTick(() => {
				this.$refs.slick.reSlick();
				// this.$refs.slickNav.reSlick();
			});
		},
		// Events listeners
		handleAfterChange(event, slick, currentSlide) {
			// console.log('handleAfterChange', event, slick, currentSlide);
		},
		handleBeforeChange(event, slick, currentSlide, nextSlide) {
			// console.log('handleBeforeChange', event, slick, currentSlide, nextSlide);
		},
		handleBreakpoint(event, slick, breakpoint) {
			// console.log('handleBreakpoint', event, slick, breakpoint);
		},
		handleDestroy(event, slick) {
			// console.log('handleDestroy', event, slick);
		},
		handleEdge(event, slick, direction) {
			// console.log('handleEdge', event, slick, direction);
		},
		handleInit(event, slick) {
			// console.log('handleInit', event, slick);
		},
		handleReInit(event, slick) {
			// console.log('handleReInit', event, slick);
		},
		handleSetPosition(event, slick) {
			// console.log('handleSetPosition', event, slick);
		},
		handleSwipe(event, slick, direction) {
			// console.log('handleSwipe', event, slick, direction);
		},
		handleLazyLoaded(event, slick, image, imageSource) {
			// console.log('handleLazyLoaded', event, slick, image, imageSource);
		},
		handleLazeLoadError(event, slick, image, imageSource) {
			// console.log('handleLazeLoadError', event, slick, image, imageSource);
		},
	},
};
</script>
