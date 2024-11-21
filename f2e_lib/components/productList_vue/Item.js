import Info from "@global/components/productList_vue/item_Info";
import ImageCover from "@global/components/productList_vue/item_Image";

let Item = {
	template: `
    <li :class="isWideCover ? 'item largeCover' : 'item'">
      <ImageCover
        :imgSrc=imgSrc>
      </ImageCover>
      <Info
        :nowItem=nowItem
        :listSet=listSet
        :cateData = cateData
        :isNormalPage=isNormalPage
        :imgFrom=imgFrom
        :link=link
      />
    </li>
  `,
	data: function () {
		return {
			subCate: this.cateData[1],
			itemCate: this.cateData[2],
		};
	},
	computed: {
		link: function () {
			return encodeURI(
				"/Detail/" +
					this.nowItem.Barcode +
					"?brand=1&menu=1" +
					"|" +
					this.subCate +
					(this.itemCate ? "|" + this.itemCate : "")
			);
		},
		hasTwoCover: function () {
			return this.nowItem.CoverImage[1] ? this.nowItem.CoverImage[1].length > 0 : false;
		},
		imgSrc: function () {
			return this.imgFrom + this.nowItem.CoverImage[0];
		},
		smallImgSrc: function () {
			return this.hasTwoCover ? this.imgFrom + this.nowItem.CoverImage[1] : this.imgSrc;
		},
		isWideCover: function () {
			return this.nowItem.IsLargeCoverImage === 2;
		},
	},
	beforeCreate: function () {},
	created: function () {},
	components: {
		Info,
		ImageCover,
	},
	props: {
		listSet: {
			type: Object,
			required: false,
		},
		nowItem: {
			type: Object,
			required: false,
		},
		isNormalPage: {
			type: Boolean,
			required: false,
		},
		cateData: {
			type: Array,
			required: false,
		},
		imgFrom: {
			type: String,
			required: false,
		},
	},
	methods: {},
};

export default Item;
