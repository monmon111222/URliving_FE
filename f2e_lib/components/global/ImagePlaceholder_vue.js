let ImagePlaceholder = {
	template: `
    <img
      :src="newSrc ? newSrc:src"
      :alt="alt"
      :title="title"
      :className="className"
      @click="onClick"
      @load="onLoad ? onLoad:null"
      @error="onError"
      :style="{display: display}"
    />
  `,
	props: {
		src: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			required: false,
		},
		alt: {
			type: String,
			required: false,
		},
		title: {
			type: String,
			required: false,
		},
		className: {
			type: String,
			required: false,
		},
		onLoad: {
			type: Function,
			required: false,
		},
		onClick: {
			type: Function,
			required: false,
			default: function () {},
		},
		errorHidden: {
			type: Boolean,
			required: false,
		},
	},
	data: function () {
		return {
			display: "",
			newSrc: "",
		};
	},
	computed: {
		isWebp: function () {
			return /\?/.test(this.src);
		},
	},
	methods: {
		onError() {
			this.errorHidden
				? (this.display = "none")
				: (this.newSrc = this.placeholder || nowBrand.imagePlaceholder.default);
		},
	},
};
export default ImagePlaceholder;
