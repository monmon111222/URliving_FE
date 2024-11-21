<template>
	<div v-if="dataIsLoad" id="" class="product-info">
		<div class="info-wrap">
			<div class="tag-label">
				<span>NEW</span>
				<span>SALE</span>
			</div>
			<div class="product-fav">
				<div>
					<h3 class="brand-name">PAZZO</h3>
					<h1 class="product-name">{{ itemDatas.Name }}</h1>
				</div>
				<div>
					<div class="item-wish">
						<a @click.prevent="addToWish" v-if="!selectedData.IsFavorite" class="btn-wish">
							<i class="icon-heart"></i>
						</a>
						<a @click.prevent="removeWish" v-else class="btn-wish">
							<i class="icon-heart-active"></i>
						</a>
					</div>
					<share-btn />
				</div>
			</div>
			<h3 class="product-subtitle">{{ itemDatas.SubTitle }}</h3>
			<h3 class="product-price">
				<span v-if="itemDatas.EventPrice > 0 || itemDatas.SellPrice !== itemDatas.OriginPrice" class="origin-price"
					>NT.{{ itemDatas.OriginPrice }}
				</span>
				<span class="sell-price"
					>NT.{{
          itemDatas.EventPrice > 0 && itemDatas.EventPrice &lt; itemDatas.SellPrice
            ? itemDatas.EventPrice
            : itemDatas.SellPrice
					}}
				</span>
			</h3>
			<div
				v-if="itemDatas.Events.length !== 0 || itemDatas.GiftEvents.length !== 0 || itemDatas.Limit !== 0"
				class="product-event"
			>
				<div v-if="itemDatas.Limit !== 0" class="py-1">此商品限購 {{ itemDatas.Limit }} 件</div>
				<div v-for="(event, index) in itemDatas.Events" :key="index" class="py-1">
					<a :href="'/campaign/' + event.ID">{{ event.Name }}</a>
				</div>
				<div v-for="(giftevent, index) in itemDatas.GiftEvents" :key="index" class="py-1">
					<a :href="'/campaign/gift/' + giftevent.ID">{{ giftevent.Name }}</a>
				</div>
			</div>
			<div class="item-pick">
				<div class="select-block">
					<div class="select-style">
						<a class="select-btn" @click.prevent.stop="openSelector" href="#">{{ selectedData.Name }} </a>
						<ul class="select-opts" :class="{ isopen: selectIsOpen }">
							<li @click.prevent="changeImg(color.ID)" v-for="color in itemDatas.Colors" :key="color.ID">
								{{ color.Name }}
							</li>
						</ul>
					</div>
					<Selector :defaultTxt="'尺寸'" :options="selectedData.Specs" :selected="selectedSpec" @cb="selectSpec" />
				</div>
				<div class="count-selector">
					<Counter :defaultTxt="'數量'" :limit="counterOpts" :nowValue="counter" @cb="handleCount" />
				</div>
				<a @click.prevent="addToCart" :class="theBtnStyleGenerate" class="btn btn-primary w-100 btn-add2cart">{{
					theBtnDescriptionGenerate
				}}</a>
			</div>
			<div v-if="selectedSpec !== null && selectedSpec.PreOrder" class="product-arrival">
				{{ itemDatas.ArrivalExplanation }}
			</div>
		</div>
		<div class="product-ad">
			<img src="https://via.placeholder.com/440x137/0000FF/808080" class="img-fluid" />
			<img src="https://via.placeholder.com/440x137/0000FF/808080" class="img-fluid" />
		</div>
	</div>
</template>

<script>
import Selector from "@page/common/js/template/Select.vue";
import Counter from "@page/common/js/template/CountUI.vue";
import ShareBtn from "@page/common/dialog/shareBtn.vue";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
	name: "Spec",
	components: {
		Selector,
		Counter,
		ShareBtn,
	},
	watch: {
		dataIsLoad(val) {
			if (val && window.matchMedia("(min-width: 992px)").matches) {
				this.$nextTick(() => {
					$("#info-sidebar").stick_in_parent({ offset_top: 100 });
				});
			}
		},
		selectedData(val) {
			if (val.Specs.length === 1) {
				this.selectSpec(val.Specs[0]);
			}
		},
	},
	data() {
		return {
			CustomMarketID: CustomMarketID.substring(0, CustomMarketID.indexOf("CL")),
		};
	},
	computed: {
		...mapState("shopContent", [
			"selectedData",
			"itemDatas",
			"dataIsLoad",
			"hasStock",
			"carAddMainItem",
			"selectedSpec",
			"selectedSpecKey",
			"counter",
			"counterOpts",
			"btndescription",
			"btnStyleGenerate",
			"btnDescriptionGenerate",
			"selectIsOpen",
		]),
		...mapGetters("shopContent", ["theBtnStyleGenerate", "theBtnDescriptionGenerate"]),
	},
	methods: {
		...mapMutations("shopContent", ["changeCarAddMainItem", "handleCMID", "changeSelected", "changeNowSlideIndex"]),
		...mapActions("shopContent", [
			"addToWish",
			"removeWish",
			"renderCounterOpts",
			"addToCart",
			"selectSpec",
			"handleCount",
			"showSizeChart",
			"changeImg",
			"getCartDialog",
			"openSelector",
		]),
	},
};
</script>
