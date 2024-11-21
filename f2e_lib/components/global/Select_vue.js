let Select = {
	data: function () {
		return {
			componentClass: "r-select",
			isOpen: this.isDropDown ? false : null,
			isWeak: this.isDefaultSelect ? false : null,
		};
	},
	computed: {},
	updated() {
		this.checkIsWeak(this.options, this.nowValue);
	},
	props: {
		options: {
			type: Array,
			required: true,
		},
		nowValue: {
			type: String,
			required: true,
		},
		nowText: {
			type: String,
			required: false,
		},
		defaultText: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
			default: "select",
		},
		isDefaultSelect: {
			type: Boolean,
			required: false,
		},
		isDropDown: {
			type: Boolean,
			required: false,
		},
	},
	methods: {
		onChangeValue(value) {
			this.$emit("onChangeValue", value);
		},
		checkIsWeak(options, nowValue) {
			for (let i = 0, len = options.length; i < len; i++) {
				if (options[i].value === nowValue) {
					this.isWeak = options[i].isWeak;
					break;
				}
			}
		},
		handleDropDownClick() {
			this.isOpen || document.addEventListener("click", this.handleDropDownClickOutSide, false);
		},
		handleDropDownClickOutSide(e) {
			this.$refs.selectRef.contains(e.target) || this.hideOption();
		},
		hideOption() {
			document.removeEventListener("click", this.handleDropDownClickOutSide);
			this.isOpen = false;
		},
		toggleOption() {
			this.isOpen = !this.isOpen;
		},
		changeValue(newValue) {
			this.isDropDown && this.hideOption();

			console.log("conponent changeValue--->", "newValue:", newValue, "this.nowValue:", this.nowValue);
			if (newValue !== this.nowValue) {
				this.onChangeValue(newValue);
			}
		},
		changeValueDefaultSelect(event) {
			this.onChangeValue(event.target.value);
			console.log("conponent changeValueDefaultSelect --->", "event.target.value:", event.target.value);
		},
	},
	mounted: function () {
		console.log("options", this.options);
	},
	template: `
  <div
    ref="selectRef"
    :class="componentClass"
    @click="handleDropDownClick"
    :id="isDefaultSelect ? null : id"
  >

    <template v-if="isDefaultSelect">
      <select
        :name="id"
        :id="id"
        @change="changeValueDefaultSelect"
        :value="nowValue"
        :class="isWeak && nowText ? 'weak' : null"
      >
          <option disabled hidden>{{defaultText}}</option>
          <option v-for="(item, index) in options"
            :key="id+item.value+index"
            :value="item.value"
            :disabled="item.isDisabled"
            :class="item.isWeak ? 'weak' : null"
          >
            {{item.text}}
          </option>
      </select>
    </template>

    <template v-if="isDropDown">
      <div :class="isWeak && nowText?'r-select__txt weak':'r-select__txt'">
        <a
          href='javascript:;'
          @click="toggleOption"
        >{{nowText ||defaultText}}</a>
      </div>
    </template>
    <template v-if="!isDefaultSelect && (!isDropDown || isOpen)">
          <ul class='r-select__options'>
                <li v-for="(item, index) in options"
                  :key="id+item.value+index"
                  :class="{ disabled: item.isDisabled,
                            weak: item.isWeak,
                            selected: (item.value === nowValue)}"
                >
                  <a href='javascript:;' @click="changeValue(item.value)">
                    {{item.text}}
                  </a>
                </li>
          </ul>
    </template>
  </div>
  `,
};

module.exports = Select;
