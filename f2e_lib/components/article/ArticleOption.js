let ArticleOption = {
	data: function () {
		return {
			newCate: this.nowCate,
		};
	},
	props: {
		categories: {
			type: Array,
		},
		nowCate: {
			type: String,
		},
		allOptionTxt: {
			type: String,
		},
	},
	computed: {
		// nowPageCate(){
		//   return nowCate.toLocaleLowerCase() == 'all' ? '' : this.nowCate
		// }
	},
	components: {},
	created: function () {},
	mounted: function () {},
	beforeUpdate() {},
	updated() {},
	methods: {
		handleChange(arg) {
			var baseUrl = "/mag";

			if (this.newCate !== "") {
				window.location = baseUrl + "/" + this.newCate; // + '&page=1'
			}
		},
	},
	template: `
  <div class='articleOption'>
    <div id='articleCategory'>
      <h4>文章分類</h4>
      <div class='articleCategorySelect'>
        <select
          v-model='newCate'
          name='category'
          id='category'
          @change="handleChange"
        >
          <option value='All'>{{allOptionTxt ? allOptionTxt : '選擇分類'}}</option>
          <option
            v-for="(item, index) in categories"
            :key="item.Code"
            :value="item.Code">
            {{item.Name}}
          </option>
        </select>
      </div>
    </div>
  </div>`,
};

module.exports = ArticleOption;
