// 內頁推薦其他商品模組 | 今日瀏覽
// 從上層props傳入參數
// slick (布林 是否輪播)
// slidesToShow (若有輪播，最少一次秀幾張)
// title 標題

// import Slick from '@global/vendors/vue-slick';
import NewImage from "@global/components/global/image";
import r from "@global/helpers/recommendLib";

if (typeof window !== "undefined") {
	var slick = require("slick-carousel");
}

let Recommend = {
	data: function () {
		return {
			defaultOptions: {
				slidesToShow: 3,
				responsive: [
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3,
						},
					},
				],
			},
			recommendData: [],
			rMode: "",
			isLoaded: false,
		};
	},
	props: {
		FeaturedProducts: {
			type: Array,
		},
		title: {
			type: String,
		},
		CustomMarketID: {
			type: String,
		},
		slidesToShow: {
			type: Number,
		},
		arrows: {
			type: Boolean,
		},
		className: {
			type: String,
		},
		brand: {
			type: String,
		},
		picSize: {
			type: String,
		},
	},
	computed: {
		allOptions: function () {
			let propsOption = {
				slidesToShow: this.slidesToShow,
				arrows: this.arrows,
				slidesToScroll: this.slidesToShow,
			};
			return $.extend({}, this.defaultOptions, propsOption);
		},
	},
	methods: {
		callApi: function () {
			var _this = this;
			$.ajax({
				type: "GET",
				url:
					API_URL.MARKET_RECOMMAND +
					"?OnlyFirstColor=true" +
					"&CategoryIDs=" +
					window.CategoryIDs.toString() +
					"&Page=" +
					1 +
					"&PageSize=" +
					24,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.recommendData = res.Response.Data.map(function (item) {
							return {
								url: item.Colors[0].MarketUrl + "&regular=related_to_category",
								image: item.Colors[0].Covers[0],
							};
						});
						setTimeout(function () {
							$("." + _this.className).slick(_this.allOptions);
						}, 100);
					}
				},
			});
		},
	},
	components: {
		NewImage,
	},
	mounted: function () {},
	created: function () {
		var _this = this;
		var productId = _this.CustomMarketID;
		r(productId, _this.brand).then((data) => {
			_this.recommendData = data.data;
			_this.rMode = data.mode;
			setTimeout(function () {
				$("." + _this.className)
					.not(".slick-initialized")
					.slick(_this.allOptions);
				_this.isLoaded = true;
			}, 100);
		});
	},
	template: `
    <div class='product-photos__featured product-photos__sliderbox' v-show="isLoaded">
      <h3 v-html='title'></h3>
        <div :class="className" v-if="recommendData.length!==0">
            <div
              v-for="(item, index) in recommendData"
              :key="item+index"
            >
              <a :href="item.url">
                 <new-image v-if="rMode === 'self' || rMode === 'rosetta'" :url="item.image" :size="picSize"></new-image>
                 <img v-else class="img-fluid" :src="item.image" />
              </a>
            </div>
        </div>
    </div>
  `,
};

export default Recommend;
