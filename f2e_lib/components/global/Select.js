var Select = Vue.extend({
	props: ["options", "defaultText", "onChangeValue", "isDefaultSelect", "NowMyEquipment", "optionsIndex", "isDropDown"],
	data: function () {
		return {
			isOpen: this.NowMyEquipment,
			isWeak: !(this.NowMyEquipment || this.isDefaultSelect),
		};
	},
	methods: {
		handleDropDownClick: function () {
			this.isOpen || document.addEventListener("click", this.handleDropDownClickOutSide, false);
		},
		handleDropDownClickOutSide: function (e) {
			this.hideOption();
			// this.select.contains(e.target) || this.hideOption()
		},
		hideOption: function (event) {
			this.NowMyEquipment &&
				this.isOpen &&
				document.removeEventListener("click", this.handleDropDownClickOutSide, false);
			this.isOpen = false;
		},
		toggleOption: function () {
			this.isOpen = !this.isOpen;
		},
		changeValue: function (newValue) {
			this.isOpen && this.hideOption();

			if (newValue !== this.nowValue) {
				this.onChangeValue(newValue);
			}
		},
		changeValueDefaultSelect: function (event) {
			this.onChangeValue(event.target.value);
		},
	},
	template: `
    <div @click="NowMyEquipment && handleDropDownClick">
      <div :class="'r-select__txt' + (options.length ? options[optionsIndex].isWeak ? ' weak' : '' : '')">
        <a href="javascript:;"
           @click="toggleOption"
        >{{defaultText}}</a>
      </div>
      <ul v-show="isOpen || isDropDown" class='r-select__options'>
        <li v-for="(item, index) in options" :class="item.isWeak ? 'weak' : ''">
          <span v-if="item.isDisabled">{{item.text}}</span>
          <a v-else  href="javascript:;" @click={changeValue(item.value)}>
            <span>{{item.text}}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
});
module.exports = Select;
