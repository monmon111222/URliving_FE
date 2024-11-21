<template>
	<div v-if="dataIsLoad" class="slide-main-block">
		<template v-if="!photoCover">
			<div class="d-lg-none photo-item" @click="zoomPic(0, $event)">
				<i v-if="selectedProductImg[0].VideoMUrl" class="icon-play"></i>
				<new-image
					class="w-100"
					:url="selectedProductImg[0].Url"
					:size="'_w1192_h1521'"
					:name="itemDatas.Name"
				></new-image>
				<!-- <img
          src="https://via.placeholder.com/692x968/0000FF/808080"
          class="img-fluid"
        /> -->
			</div>
			<div class="d-none d-lg-block photo-item" @click="zoomPic(0, $event)">
				<i v-if="selectedProductImg[0].VideoMUrl" class="icon-play"></i>
				<new-image
					class="w-100"
					:url="selectedProductImg[0].Url"
					:size="'_w2384_h3042'"
					:name="itemDatas.Name"
				></new-image>
				<!-- <img
          src="https://via.placeholder.com/692x968/0000FF/808080"
          class="img-fluid"
        /> -->
			</div>
		</template>
		<template v-else>
			<div
				class="d-lg-none photo-item"
				@click="zoomPic(index, $event)"
				v-for="(image, index) in selectedProductImg"
				:key="image + index"
			>
				<i v-if="image.VideoUrl && index !== 0" class="icon-play"></i>
				<new-image class="w-100" :url="image.Url" :size="'_w1192_h1521'" :name="itemDatas.Name"></new-image>
				<!-- <img
          v-if="index !== 0"
          src="https://via.placeholder.com/692x968/0000FF/808080"
          class="img-fluid"
        /> -->
			</div>
			<div
				class="d-none d-lg-block photo-item"
				@click="zoomPic(index, $event)"
				v-for="(image, index) in selectedProductImg"
				:key="image + index"
			>
				<i v-if="image.VideoUrl && index !== 0" class="icon-play"></i>
				<new-image class="w-100" :url="image.Url" :size="'_w2384_h3042'" :name="itemDatas.Name"></new-image>
				<!-- <img
          v-if="index !== 0"
          src="https://via.placeholder.com/692x968/0000FF/808080"
          class="img-fluid"
        /> -->
			</div>
		</template>
	</div>
</template>

<script>
import NewImage from "@global/components/global/image";
import zoomBox from "@global/components/product_vue/zoombox";
import imgTransfer from "@global/helpers/imgTransfer";
import setEnv from "@global/helpers/setEnv";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("shopContent");

export default {
	components: {
		NewImage,
	},
	props: {
		photoCover: {
			type: Boolean,
		},
	},
	computed: {
		...mapState(["dataIsLoad", "selectedData", "itemDatas", "changePic"]),
		selectedProductImg: function () {
			var images = [];

			this.selectedData.Images.forEach(function (element) {
				if (element.Category === 0) images.push(element);
			});

			return images;
		},
	},
	methods: {
		zoomPic(index, event) {
			let datas = [];

			this.selectedData.Images.forEach(function (element) {
				if (element.Category === 0) datas.push(element);
			});

			const new_datas = datas.map((ele) => {
				if (ele.VideoUrl.length !== 0 || ele.VideoMUrl.length !== 0) {
					// 有影片
					return setEnv.myEquipment()
						? imgTransfer(ele.VideoMUrl.length !== 0 ? ele.VideoMUrl : ele.Url, "")
						: imgTransfer(ele.VideoUrl.length !== 0 ? ele.VideoUrl : ele.Url, "");
				} else {
					return imgTransfer(ele.Url, "");
				}
			});

			zoomBox({
				images: JSON.parse(JSON.stringify(new_datas)),
				index: index,
				yPos: event.pageY - window.scrollY,
				tilting: true,
			});
		},
	},
};
</script>
