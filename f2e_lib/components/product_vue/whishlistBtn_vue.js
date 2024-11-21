// 內頁推薦其他商品模組 | 今日瀏覽
// 從上層props傳入參數
// slick (布林 是否輪播)
// slidesToShow (若有輪播，最少一次秀幾張)
// title 標題
import axios from "axios";
import qs from "Qs";
// import aqTrace from '@global/components/tracing/aq';

let WhishlistBtn = {
	data: function () {
		return {
			isAddFavoriteNow: false,
		};
	},
	props: {
		isFavorite: {
			type: Boolean,
		},
		CustomMarketID: {
			type: String,
		},
		colorID: {
			required: true,
		},
		colorIndex: {
			type: Number,
			required: true,
		},
		productImage: {
			type: String,
		},
		productName: {
			type: String,
			required: true,
		},
		productColor: {
			type: String,
			required: true,
		},
		sellingPrice: {
			type: Number,
			required: true,
		},
		linkUrl: {},
		productImage: {
			type: String,
		},
	},
	computed: {},
	methods: {
		// onChangeState () {
		//   // 當按下顏色按鈕時，檢查是不是不一樣，透過涵式改上層的ColorIndex
		//   // if (this.colorIndex !== index) {
		//     this.$emit('handleChangeFavoriteState', this.colorIndex)
		//   // }
		// },
		brandAlert(msg) {
			nowBrand.alert(msg, nowBrand.globalConfig.alertTitle || null);
		},
		addToWishList() {
			if (this.isFavorite) return;

			let self = this;

			let CustomMarketID_hasColor =
				self.CustomMarketID.substring(0, self.CustomMarketID.indexOf("CL")) + "CL" + self.colorID + "SZ_";

			let url = API_URL.FAVORITE;
			axios
				.post(
					url,
					qs.stringify({
						CustomMarketID: CustomMarketID_hasColor,
					})
				)
				.then(function (res) {
					console.log(res);
					console.log(res.data.Code);
					if (res.data.Code === 200) {
						// self.brandAlert('已加入收藏')
						// self.isAddFavoriteNow = true
						console.log("已加入收藏", self.colorIndex);
						self.$emit("handleChangeFavoriteState", self.colorIndex);
					} else if (res.data.Code === 401) {
						// self.brandAlert('尚未登入')
						AlertDialog.alert("尚未登入");
					} else {
						AlertDialog.alert(res.data.Message);
					}
				});

			if (typeof qg !== "undefined") {
				// aqTrace.addedToWishlist({
				//   name: this.productName,
				//   id: this.CustomMarketID,
				//   price: this.sellingPrice,
				//   color: this.productColor,
				//   url: this.linkUrl,
				//   imgUrl: this.productImage
				// });
			}
		},
	},
	components: {},
	mounted: function () {},
	template: `
    <div>
      <a
        :class="{ 'product-btn-whishlist': true, 'done': isFavorite}"
        href='javascript:;'
        @click="addToWishList"
      >WISH LIST</a>
    </div>
  `,
};

export default WhishlistBtn;
