import Item from "@global/components/productList_vue/Item";

let List = {
	data: function () {
		return {};
	},
	props: {
		listSet: {
			type: Object,
			required: false,
		},
		Items: {
			type: Array,
			default: "black",
		},
		isNormalPage: {
			type: Boolean,
			required: false,
		},
		cateData: {
			type: Array,
			required: false,
		},
		nowColumn: {},
	},
	computed: {
		imgFrom: function () {
			return nowBrand.productConfig.imageBasePath.substring(0, nowBrand.productConfig.imageBasePath.length - 1);
		},
		sortItems: function () {
			let oldArray = this.Items.slice();
			let newArray;
			if (true && !nowEnv.NowMyEquipment) {
				newArray = this.arraySort(40, oldArray, 4);
			} else {
				newArray = this.arraySort(40, oldArray, 2);
			}
			return newArray;
		},
	},
	components: {
		Item,
	},
	methods: {
		arraySort(total, oldArray, limit) {
			let newArray = [];
			let TempIndex = 0;
			let TempSum = 0;
			for (let i = 0; i < oldArray.length; i++) {
				if (oldArray[i].IsLargeCoverImage === true || oldArray[i].IsLargeCoverImage === 2) {
					oldArray[i].IsLargeCoverImage = 1;
				} else {
					oldArray[i].IsLargeCoverImage = 1;
				}
			}
			while (oldArray.length > 0) {
				if (TempSum + oldArray[TempIndex].IsLargeCoverImage <= limit) {
					newArray.push(oldArray[TempIndex]);
					TempSum += oldArray[TempIndex].IsLargeCoverImage;
					if (TempSum === limit) {
						TempSum = 0;
					}
					oldArray.splice(TempIndex, 1);
					TempIndex = 0;
				} else {
					TempIndex++;
					if (TempIndex >= oldArray.length) {
						TempIndex = 0;
						TempSum = 0;
					}
				}
			}
			return newArray;
		},
	},
	beforeCreate: function () {},
	created: function () {},
	template: `
    <ul :class="{'item-list':true, 'item-list--2col':(nowColumn===2),'item-list--3col':(nowColumn!==2)}">
      <Item
        v-for="(item,index) in sortItems"
        :key="item.Barcode+index"
        :nowItem=item
        :listSet=listSet
        :isNormalPage=isNormalPage
        :cateData=cateData
        :imgFrom=imgFrom
      />
    </ul>
  `,
};

export default List;
