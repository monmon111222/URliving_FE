// PZ
import zoomBox from "@global/components/product_vue/zoombox";
import ImagePlaceholder from "@global/components/global/ImagePlaceholder_vue";
import NewImage from "@global/components/global/image";
import Slick from "@global/vendors/vue-slick";
import { dateFormate } from "@global/components/blog/ArticleTools";

let ArticleSlick = {
	data: function () {
		return {
			list: [],
			defaultOptions: {
				slidesToShow: 4,
				responsive: [
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
						},
					},
				],
			},
			nowColorPhotoAryNew: {},
		};
	},
	props: {
		specifyClassName: {
			type: String,
		},
		h4Name: {
			type: String,
		},
		NowMyEquipment: {
			type: Boolean,
		},
		categoryName: {
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
		dateFormate(PostTime) {
			return dateFormate(PostTime);
		},
		getList: function () {
			var self = this;
			$.ajax({
				type: "GET",
				url: API_URL.ARTICLE_LIST,
				data: { Category: self.categoryName },
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					console.log(res);
					if (res.Code === 200) {
						self.list = res.Response.Data;
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試", function () {
							window.location.href = "/";
						});
					}
				},
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
			console.log("handleInit", event, slick);
		},
		handleReInit(event, slick) {
			console.log("handleReInit", event, slick);
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
	components: {
		NewImage,
		ImagePlaceholder,
		Slick,
	},
	created: function () {
		this.getList();
	},
	mounted: function () {
		// if(this.nowColorPhotoAryNew[0]!==this.nowColorPhotoAry[0]){
		//  console.log('怎辦')
		// this.nowColorPhotoAryNew = this.nowColorPhotoAry
		// }
	},
	beforeUpdate() {
		if (this.$refs.slick) {
			this.$refs.slick.destroy();
		}
	},
	updated() {
		this.$nextTick(function () {
			if (this.$refs.slick) {
				this.$refs.slick.create(this.allOptions);
			}
		});
	},
	// updated:function(e) {
	//   console.log('photos_slick updated',e)
	// this.$forceUpdate()
	// Vue.set(object, key, value)
	// Vue.set(vm.nowColorPhotoAry, 'b', 2);
	// this.$set(app.data, 'b', 2)
	//  this.$set(this.nowColorPhotoAryNew,"age", 20)
	// this.nowColorPhotoAryNew = this.nowColorPhotoAry
	// destroy
	// },
	template: `
  <div :class=specifyClassName >
    <h4>{{h4Name}}<a class="more" :href="'/mag/'+categoryName">more stories/ 閱讀更多</a></h4>
    <slick
      ref="slick"
      :options="allOptions"
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
      @lazyLoadError="handleLazeLoadError">
      <div
        v-for="(item, index) in list"
        :key="item+index"
      >
        <a :href="'/mag/article/'+item.ID"">
            <div class="mag-cover" :style="{backgroundImage:'url(' + item.CoverImage + ')'}"></div>
            <div class="mag-list-info">
                <span class="post-time">{{dateFormate(item.PostTime)}}</span>
                <h3>{{item.Title}}</h3>
            </div>
        </a>
      </div>
    </slick>
  </div>`,
};

module.exports = ArticleSlick;
