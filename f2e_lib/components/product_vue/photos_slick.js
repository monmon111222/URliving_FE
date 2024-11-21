import zoomBox from "@global/components/product_vue/zoombox";
import ImagePlaceholder from "@global/components/global/ImagePlaceholder_vue";
import NewImage from "@global/components/global/image";
import Slick from "@global/vendors/vue-slick";

let PhotosSlick = {
	data: function () {
		return {
			defaultOptions: {
				slidesToShow: 3,
				responsive: [
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
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
		sizeLogic: {
			type: String,
		},
		NowMyEquipment: {
			type: Boolean,
		},
		zoom: {
			type: Boolean,
		},
		nowColorPhotoAry: {
			type: Array,
		},
		nowColorZoomAry: {
			type: Array,
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
		zoomImg: function (index, event) {
			if (this.zoom) {
				const nativeEvent = event.nativeEvent;
				zoomBox({
					images: JSON.parse(JSON.stringify(this.nowColorZoomAry)),
					imagesOnError: this.nowColorPhotoAry,
					index: index,
					yPos: event.pageY - window.scrollY,
					tilting: true,
				});
			}
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
	template: `
  <div :class=specifyClassName>
    <slick
      ref="slick"
      :options="allOptions"
      v-if="nowColorPhotoAry.length>0"
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
        v-for="(item, index) in nowColorPhotoAry"
        :key="item.imgUrl"
      >
        <a
          href='javascript:;'
          @click="zoomImg(index,$event)">
          <i v-if="item.VideoUrl" class="icon-play d-md-inline-block d-none" style="position: absolute; top: 50%; left: 50%; margin-top: -30px; margin-left: -30px; background-size: 60px; background-position: center; z-index: 1;"></i>
          <i v-if="item.VideoMUrl" class="icon-play d-md-none d-inline-block" style="position: absolute; top: 50%; left: 50%; margin-top: -30px; margin-left: -30px; background-size: 60px; background-position: center; z-index: 1;"></i>
         <img
          :src="item.imgUrl"
        />
        </a>
      </div>
    </slick>
  </div>`,
};

export default PhotosSlick;
