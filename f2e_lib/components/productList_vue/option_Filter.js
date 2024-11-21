let FilterComponent = {
	data: function () {
		return {
			headerTitle: typeof this.filterSet.hasHeader !== "boolean" ? this.filterSet.hasHeader : "排序方式",
			optionTitle: this.filterSet.optionTitle || ["PRICE", "SIZE"],
			noteTxt: typeof this.filterSet.hasNote !== "boolean" ? this.filterSet.hasNote : "SIZE 可複選",
		};
	},
	props: {
		isFiltered: {},
		filterSet: {},
		isOpen: {},
		sizeTags: {},
		tgPriceTags: {},
		tgSizeTags: {},
	},
	methods: {
		onSwitch() {
			this.$emit("onSwitch");
		},
		changePriceShow(num) {
			this.$emit("changePriceShow", num);
		},
		changeSizeShow(num) {
			this.$emit("changeSizeShow", num);
		},
		clearTags() {
			this.$emit("clearTags");
		},
		LoadProductListBySort() {
			this.$emit("LoadProductListBySort");
		},
	},
	created: function () {},
	mounted: function () {},
	template: `
      <div :class="isOpen ? 'item-filter open' : 'item-filter'">
        <a
          :class="isFiltered ? 'item-filter__text isFiltered' : 'item-filter__text'"
          href='javascript:;'
          @click.prevent.stop=onSwitch
        >SORT BY</a>
        <div class='item-filter__content'>

          <div v-if="filterSet.hasCloseBtn" class='item-filter__close'>close</div>

          <div class='item-filter__hd'>{{headerTitle}}</div>

          <div class='item-filter__bd'>

            <div class='priceOption'>
              <h6 class='item-filter__title'>{{optionTitle[0]}}</h6>
              <div class='item-filter__radio'>
                <ul>
                  <li
                    @click="changePriceShow(0)"
                    :class="tgPriceTags[0] && 'selected'">
                    <a href='javascript:;'>HIGH TO LOW</a>
                  </li>
                  <li
                    @click="changePriceShow(1)"
                    :class="tgPriceTags[1] && 'selected'" >
                    <a href='javascript:;'>LOW TO HIGH</a>
                  </li>
                </ul>
              </div>
            </div>

            <div class='sizeOption'>
              <h6 class='item-filter__title'>{{optionTitle[1]}}</h6>
              <div class='item-filter__tags'>
                <ul>
                  <li
                    v-for="(item, index) in sizeTags"
                    :key="item+index"
                    @click="changeSizeShow(index)"
                    :class="tgSizeTags[index] ? 'selected' : null"
                  >
                  <a href="javascript:;">{{item}}</a>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div class='item-filter__ft'>
            <a class='item-filter__btn-clear' href='javascript:;' @click=clearTags>清除</a>
            <a class='item-filter__btn-ok' href='javascript:;' @click=LoadProductListBySort>確認</a>

            <p v-if="filterSet.hasNote" class='attention'>{{noteTxt}}</p>
          </div>
        </div>
      </div>
  `,
};

module.exports = FilterComponent;
