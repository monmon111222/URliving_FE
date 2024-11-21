import PHOTO_TMPL from "@page/shopContent/js/photoTmpl";
import NewImage from "@global/components/global/image";
import Slick from "@global/vendors/vue-slick";
import zoomBox from "@global/components/product_vue/zoombox";
import imgTransfer from "@global/helpers/imgTransfer";
import setEnv from "@global/helpers/setEnv";
export default {
	template: PHOTO_TMPL,
	props: ["selected", "alldatas", "dataisload", "nowslideindex", "slideOpts", "slideNavOpts", "changeImage"],
	components: {
		NewImage,
		Slick,
	},
	computed: {
		selectedProductImg: function () {
			var images = [];

			this.selected.Images.forEach(function (element, index) {
				if (element.Category === 0) images.push(element);
			});

			return images;
		},
	},
	created: function () {},
	methods: {
		zoomPic(index, event) {
			let datas = [];

			this.selected.Images.forEach(function (element, index) {
				if (element.Category === 0) datas.push(element);
			});

			// console.log(JSON.parse(JSON.stringify(images)))

			const new_datas = datas.map((ele, index) => {
				if (ele.VideoUrl.length !== 0 || ele.VideoMUrl.length !== 0) {
					// 有影片
					return setEnv.myEquipment()
						? imgTransfer(ele.VideoMUrl.length !== 0 ? ele.VideoMUrl : ele.Url, "")
						: imgTransfer(ele.VideoUrl.length !== 0 ? ele.VideoUrl : ele.Url, "");
				} else {
					return imgTransfer(ele.Url, "");
				}
			});

			console.log(new_datas);

			zoomBox({
				images: JSON.parse(JSON.stringify(new_datas)),
				index: index,
				yPos: event.pageY - window.scrollY,
				tilting: true,
			});
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
				this.$refs.slickNav.reSlick();
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
	beforeUpdate() {
		if (this.changeImage) {
			// this.slideLoad = false;
			// $(this.$refs.slickNav.$el).hide();
			$(this.$refs.slick.$el).hide();
			this.$refs.slick.destroy();
			// console.log($(this.$refs.slickNav.$el))
		}
	},
	updated() {
		var _this = this;
		if (this.changeImage) {
			setTimeout(function () {
				_this.$nextTick(function () {
					if (_this.slideOpts.length !== 0) {
						_this.$refs.slick.create(_this.slideOpts);
						$(this.$refs.slick.$el).fadeIn("slow");
					}
				});
			}, 100);
		}
	},
};
