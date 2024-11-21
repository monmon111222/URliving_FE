import List from "@global/components/promoteEvent/List";
import Pagination from "@global/components/global/Pagination";

let Content = {
	data: function () {
		return {};
	},
	computed: {
		groupItems: function () {
			var drawList = this.items;
			var arrtemp = [];
			var arr = [];
			var linecount = nowEnv.NowMyEquipment ? 2 : 4;

			for (var i = 0; i < drawList.length; i++) {
				var indextemp = i % linecount;
				if (indextemp == 0) {
					arrtemp = [];
					arr[arr.length] = arrtemp;
				}
				arrtemp[indextemp] = drawList[i];
			}
			return arr;
		},
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
		List,
		Pagination,
	},
	methods: {
		reRenderCart(item, aoumnt, sizeName) {
			console.log("testClick-content", item, aoumnt, sizeName);
			this.$emit("reRenderCart", item, aoumnt, sizeName);
		},
	},
	created: function () {},
	mounted: function () {},
	template: `
  <div class="promote-content">
      <div class="promote-list">
        <List v-if='items[0]!==undefined'
            v-on:reRenderCart=reRenderCart
            v-for="theItems in groupItems"
            :items=theItems
            :filterCartList='filterCartList' />
      </div>
      <Pagination :onepageqty="20"></Pagination>
  </div>
  `,
};
export default Content;
