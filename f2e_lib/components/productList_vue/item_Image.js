// import { VueLazyload } from 'vue-lazyload'

let ImageCover = {
	template: `
    <div class='item__images LazyLoad'>
      <a href="#">
        <img v-lazy="imgSrc"  >
      </a>
    </div>
  `,
	data: function () {
		return {
			img: {
				src: "//cdn.pazzo.com.tw/2018SS_item/w/P40005507/P40005507-11DM.jpg",
			},
		};
	},
	computed: {},
	props: {
		imgSrc: {
			type: String,
			required: false,
		},
	},
	components: {},
	methods: {},
};

module.exports = ImageCover;
