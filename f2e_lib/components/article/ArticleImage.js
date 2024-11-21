// import { VueLazyload } from 'vue-lazyload'

let ImageCover = {
	template: `
    <div class='item__images LazyLoad'>
      <a :href="link">
        <img v-lazy="imgSrc"  >
      </a>
    </div>
  `,
	data: function () {
		return {};
	},
	computed: {},
	props: {
		imgSrc: {
			type: String,
			required: false,
		},
		link: {
			type: String,
			required: true,
		},
	},
	components: {},
	methods: {},
};

module.exports = ImageCover;
