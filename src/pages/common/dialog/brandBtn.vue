<template>
	<div class="item-wish">
		<a @click.prevent="addToWish" v-if="brandactive === 'False'" class="btn-wish" href="#">
			<i class="icon-heart"></i>
		</a>
		<a @click.prevent="removeWish" v-else class="btn-wish" href="#">
			<i class="icon-heart-active"></i>
		</a>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "BrandFollow",
	props: ["brandactive", "brandcode"],
	methods: {
		addToWish() {
			axios
				.post(API_URL.FAVORITE, {
					BrandCode: this.brandcode,
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.brandactive = "True";
					} else if (res.data.Code === 401) {
						AlertDialog.alert("請先登入");
					} else {
						AlertDialog.alert("系統忙線中");
					}
				});
		},
		removeWish() {
			axios
				.delete(API_URL.FAVORITE, {
					data: { BrandCode: this.brandcode },
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.brandactive = "False";
					} else if (res.data.Code === 401) {
						AlertDialog.alert("請先登入");
					} else {
						AlertDialog.alert("系統忙線中");
					}
				});
		},
	},
};
</script>
