import imgTransfer from "@global/helpers/imgTransfer";

const Image = {
	template: `<img class="img-fluid" :class="classname" :src="renderImg" :alt="name">`,
	props: ["url", "size", "name", "classname"],
	computed: {
		renderImg: function () {
			return imgTransfer(this.url, this.size);
		},
	},
};

export default Image;
