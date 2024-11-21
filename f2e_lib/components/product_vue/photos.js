import zoomBox from "@global/components/product_vue/zoombox";
import ImagePlaceholder from "@global/components/global/ImagePlaceholder_vue";
import NewImage from "@global/components/global/image";

let Photos = {
	props: {
		specifyClassName: {
			type: String,
			required: true,
		},
		sizeLogic: {
			type: String,
			required: true,
		},
		NowMyEquipment: {
			type: Boolean,
			required: true,
		},
		zoom: {
			type: Boolean,
			required: true,
		},
		nowColorPhotoAry: {
			type: Array,
			required: true,
		},
		nowColorZoomAry: {
			type: Array,
			required: true,
		},
	},
	methods: {
		zoomImg(index) {
			if (this.zoom) {
				zoomBox({
					images: JSON.parse(JSON.stringify(this.nowColorZoomAry)),
					imagesOnError: this.nowColorPhotoAry,
					index: index,
					tilting: true,
				});
			}
		},
	},
	components: {
		NewImage,
		ImagePlaceholder,
	},
	template: /*html*/ `
  <div :class=specifyClassName>
    <div class="position-relative" v-for="(item, index) in nowColorPhotoAry" @click="zoomImg(index, this)">
      <i v-if="item.VideoUrl" class="icon-play d-md-inline-block d-none" style="position: absolute; top: 50%; left: 50%; margin-top: -30px; margin-left: -30px; background-size: 60px; background-position: center; z-index: 1;"></i>
      <i v-if="item.VideoMUrl" class="icon-play d-md-none d-inline-block" style="position: absolute; top: 50%; left: 50%; margin-top: -30px; margin-left: -30px; background-size: 60px; background-position: center; z-index: 1;"></i>
      <ImagePlaceholder        
        :src="item.imgUrl"
        :key="item.imgUrl"
      >
      </ImagePlaceholder>
    </div>
  </div>`,
};

export default Photos;
