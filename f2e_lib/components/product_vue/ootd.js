// 內頁 員工穿搭照
// 從上層props傳入參數:
// h4Title 字串 那個標題來著
// ootdData 物件 圖片的Url資料
// sizeLogic 字串 尺寸邏輯 "小尺寸尾贅字|大尺寸尾贅字"
// showQuantity 數字 輪播一次出現多少

import zoombox from "@global/components/product_vue/zoombox";
import NewImage from "@global/components/global/image";
import Slick from "@global/vendors/vue-slick";

let Ootd = {
	data: function () {
		return {
			defaultOptions: {
				slidesToShow: 3,
				slidesToScroll: 3,
				dots: false,
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
			colorIndex: 0,
		};
	},
	props: {
		h4Title: {
			type: String,
			required: true,
		},
		ootdData: {
			type: Array,
			required: true,
		},
		allOotdData: {
			type: Array,
			required: true,
		},
		showQuantity: {
			type: Number,
			required: true,
		},
		sizeLogic: {
			type: String,
			required: true,
		},
		slick: {
			type: Boolean,
			required: true,
		},
		zbClass: {
			type: String,
			required: true,
		},
		FeaturedProducts: {
			type: Array,
		},
		title: {
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
		blankPicUrl: {
			type: String,
		},
		blankPicUrl: {
			type: String,
		},
		picSize: {
			type: String,
		},
		// colorIndex:{
		//   type: Number,
		//   required: true
		// }
	},
	computed: {
		ootdImgUrlArray: function () {
			let ootdImgUrlArray = [];
			for (var i = 0; i < this.ootdData.length; i++) {
				ootdImgUrlArray.push(this.ootdData[i]);
			}
			var remainder = this.ootdData.length % this.showQuantity; // 餘數
			if (remainder !== 0) {
				for (var b = 0; b < this.showQuantity - remainder; b++) {
					// 加入空白圖片方便輪播
					ootdImgUrlArray.push(this.blankPicUrl);
				}
			}
			return ootdImgUrlArray;
		},
		allOotdImgUrlAry: function () {
			let allOotdImgUrlAry = [];
			for (var i = 0; i < this.allOotdData.length; i++) {
				let ootdImgUrlArray = [];
				for (var j = 0; j < this.allOotdData[i].length; j++) {
					ootdImgUrlArray.push(this.allOotdData[i][j]);
				}
				var remainder = this.allOotdData[i].length % this.showQuantity; // 餘數
				if (remainder !== 0) {
					for (var b = 0; b < this.showQuantity - remainder; b++) {
						// 加入空白圖片方便輪播
						ootdImgUrlArray.push(this.blankPicUrl);
					}
				}
				allOotdImgUrlAry[i] = ootdImgUrlArray;
			}
			console.log(allOotdImgUrlAry);
			return allOotdImgUrlAry;
		},
		sizeLogicAry: function () {
			return this.sizeLogic.split("|");
		},
		allOptions: function () {
			let propsOption = {
				slidesToShow: this.slidesToShow,
				arrows: this.arrows,
				slidesToScroll: this.slidesToShow,
			};
			return $.extend({}, this.defaultOptions, propsOption);
		},
	},
	updated() {
		console.log("updated");
	},
	watch: {
		// ootdImgUrlArray(newOne,oldOne){
		//   console.log(newOne,oldOne)
		// },
		// ootdData(newOne,oldOne){
		//   console.log(newOne,oldOne)
		//   if(newOne[0]!==oldOne[0]){
		//     let ootdImgUrlArray = []
		//     for (var i = 0; i <this.ootdData.length; i++) {
		//       ootdImgUrlArray.push(this.ootdData[i])
		//     }
		//     var remainder = this.ootdData.length % this.showQuantity // 餘數
		//     if (remainder !== 0) {
		//       for (var b = 0; b < this.showQuantity - remainder; b++) { // 加入空白圖片方便輪播
		//         ootdImgUrlArray.push('/static/img/img-blank-photo-s.png')
		//       }
		//     }
		//     this.ootdImgUrlArray = ootdImgUrlArray
		//   }
		// }
	},
	methods: {
		zoomImg: function (event, index) {
			const ootdData = this.allOotdImgUrlAry[this.colorIndex];
			const len = ootdData.length;
			let ootdArray = [];
			if (len !== 0) {
				for (let i = 0; i < len; i++) {
					let videoUrl = nowEnv.NowMyEquipment ? ootdData[i].VideoMUrl : ootdData[i].VideoUrl;
					ootdArray.push(videoUrl !== undefined && videoUrl.length !== 0 ? videoUrl : ootdData[i].imgUrl);
				}
			}
			zoombox({
				images: ootdArray,
				index: index,
				zbClass: this.zbClass ? this.zbClass : "",
				// yPos: event.pageY - window.scrollY,
				tilting: true,
			});
			console.log(ootdArray);
		},
		next() {
			this.$refs.slick.next();
		},

		prev() {
			this.$refs.slick.prev();
		},

		reInit() {
			// Helpful if you have to deal with v-for to update dynamic lists
			this.$nextTick(() => {
				this.$refs.slick.reSlick();
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
		Slick,
		NewImage,
	},
	mounted: function () {
		// if (this.slick) {
		//   $('.product-ootd__slider').slick({
		//     dots: true,
		//     autoplaySpeed: 4000,
		//     speed: 500,
		//     slidesToShow: this.showQuantity,
		//     slidesToScroll: this.showQuantity,
		//     pauseOnHover: false,
		//     arrows: false
		//   })
		// }
	},
	template: `
  <div class='product-ootd'>
    <h4 v-if="allOotdImgUrlAry[colorIndex].length>0">{{h4Title}}</h4>
    <slick
      ref="slick"
      :options="allOptions"
      :class="className"
      v-for="(node, index) in allOotdImgUrlAry"
      :key="node+index"
      v-show="index===colorIndex"
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
        v-for="(item, index) in node"
        :key="item+index"
      >
        <a
          v-if="!(/(blank)/.test(item))"
          href='javascript:;'
          @click="zoomImg(this, index)">
          <i v-if="item.VideoUrl" class="icon-play d-md-inline-block d-none" style="position: absolute; top: 50%; left: 50%; margin-top: -20px; margin-left: -20px; background-size: 40px; z-index: 1;"></i>
          <i v-if="item.VideoMUrl" class="icon-play d-md-none d-inline-block" style="position: absolute; top: 50%; left: 50%; margin-top: -20px; margin-left: -20px; background-size: 40px; z-index: 1;"></i>
          <new-image :url="item.imgUrl" :size="picSize"></new-image>
        </a>
        <span v-else>
          <img
            :src="item"
            />
        </span>
      </div>
    </slick>
  </div>`,
};

export default Ootd;
