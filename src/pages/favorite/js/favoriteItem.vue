<template>
	<div class="fav-box">
		<div v-if="data.IsSoldOut" class="item_soldout">
			<img class="img-fluid" src="https://via.placeholder.com/752x956/0000FF/808080" />
			<!--<new-image
			:url="productImg"
			:size="'_w752_h956'"
			:name="productName"
		></new-image>-->
			<div class="soldout-block">
				<span>Sold out</span>
				<div class="btn-block">
					<a class="btn" @click.prevent="cancelFavorite(data.Colors[0].CustomMarketID)"> 找相似的 </a>
					<a class="btn" @click.prevent="cancelFavorite(data.Colors[0].CustomMarketID)"> 刪除 </a>
				</div>
			</div>
			<a @click.prevent="cancelFavorite(data.Colors[0].CustomMarketID)" href="#" class="btn-f-remove">
				<i class="icon-heart-active"></i>
			</a>
		</div>
		<a v-else :href="productLink" class="fav-pic">
			<img class="img-fluid" src="https://via.placeholder.com/752x956/0000FF/808080" />
			<!--<new-image
			:url="productImg"
			:size="'_w752_h956'"
			:name="productName"
		></new-image>-->
			<a @click.prevent="cancelFavorite(data.Colors[0].CustomMarketID)" href="#" class="btn-f-remove">
				<i class="icon-close"></i>
			</a>
		</a>

		<div class="fav-info">
			<div class="brand-name">miyuki select miyuki select</div>
			<div class="product-name">
				<a :href="productLink">{{ productName }}({{ data.Colors[0].ColorName }})</a>
			</div>
			<div class="item-price">
				<span class="sell-price d-inline-block mx-1"
					>NT.{{ eventPrice > 0 && eventPrice < sellPrice ? eventPrice : sellPrice }}</span
				>
				<span v-if="sellPrice !== originPrice || eventPrice > 0" class="origin-price d-inline-block mx-1"
					>NT.{{ originPrice }}</span
				>
			</div>
			<div class="tag-block">
				<div class="tag-label">
					<span>NEW</span>
					<span>SALE</span>
				</div>
				<a class="open-dialog" :data-custommarketid="data.Colors[0].CustomMarketID">
					<i class="icon-add-cart"></i>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import NewImage from "@global/components/global/image";
export default {
	name: "FavoriteItem",
	props: ["data", "idx"],
	components: {
		NewImage,
	},
	data() {
		return {
			productName: this.data.Name,
			productImg: this.data.Colors[0].Covers[0],
			productLink: this.data.Colors[0].MarketUrl,
			originPrice: this.data.OriginPrice,
			sellPrice: this.data.SellPrice,
			eventPrice: this.data.EventPrice,
		};
	},
	methods: {
		cancelFavorite: function (elCustomMarketID) {
			var _this = this;
			$.ajax({
				type: "delete",
				url: API_URL.FAVORITE,
				dataType: "json",
				data: { CustomMarketID: elCustomMarketID },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.$emit("delete");
					} else if (res.Code === 401) {
						AlertDialog.alert("請先登入");
					} else {
						AlertDialog.alert("系統忙線中");
					}
				},
			});
		},
	},
};
</script>
