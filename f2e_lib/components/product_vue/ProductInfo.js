// 內頁 產品注意事項說明
// 從上層props傳入參數:
// infoData 物件 注意事項的陣列

let ProductInfo = {
	data: function () {
		return {};
	},
	props: {
		infoData: {
			type: Array,
		},
		IsCosmetic: {
			type: Boolean,
		},
		ReturnConsiderations: {
			type: String,
		},
	},
	computed: {},
	methods: {},
	components: {},
	mounted: function () {},
	template: `
  <ul v-if="IsCosmetic"
      class='LaundryUl'
      v-html="ReturnConsiderations"
  />
  <ul v-else>
    <li v-for="(item, index) in infoData"
        :key="item+index"
    >
    {{item}}
    </li>
  </ul>`,
};

module.exports = ProductInfo;
