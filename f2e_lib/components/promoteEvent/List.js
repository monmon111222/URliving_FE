import Item from "@global/components/promoteEvent/Item";

let List = {
	data: function () {
		return {};
	},
	computed: {
		selectedList() {},
	},
	props: {
		items: {
			type: Array,
			required: true,
		},
		filterCartList: {
			type: Array,
			required: true,
		},
	},
	components: {
		Item,
	},
	methods: {
		reRenderCart(item, aoumnt, sizeName) {
			console.log("testClick-list", item, aoumnt, sizeName);
			this.$emit("reRenderCart", item, aoumnt, sizeName);
		},
	},
	created: function () {},
	mounted: function () {},
	template: `
    <ul>
        <Item
          v-if="items[0]!==undefined"
          v-for="item in items"
          :cover="item.cover"
          :link="item.Color.MarketUrl"
          :name="item.Name"
          :sellPrice="item.SellPrice"
          :originPrice="item.OriginPrice"
          :eventPrice="item.EventPrice"
          :specs="item.Color.Specs"
          :item="item"
          v-on:reRenderCart=reRenderCart
          :filterCartList='filterCartList'
        />
    </ul>
  `,
};
export default List;
