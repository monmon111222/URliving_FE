let Quantity = {
	data: function () {
		return {
			duration: 250,
			isUpdateLimit: false,
			NowMyEquipment: nowEnv.NowMyEquipment,
			maxBuyAmount: nowBrand.miniCartConfig.maxBuyAmount || 20,
		};
	},
	computed: {},
	props: {
		limit: {
			type: Number,
			required: true,
		},
		nowValue: {
			type: Number,
			required: true,
		},
	},
	updated() {
		// // var maxBuyAmount = nowBrand.miniCartConfig.maxBuyAmount || 10
		// // console.log(maxBuyAmount)
		// var limit = (this.limit <= this.maxBuyAmount) ? this.limit : this.maxBuyAmount
		// // var limit = 20
		// if (!this.isUpdateLimit) {
		//   this.limit = limit
		//   this.isUpdateLimit = true
		//   // this.isUpdateLimit = false
		// }
	},
	methods: {
		onChangeAmount(value) {
			this.$emit("onChangeAmount", value);
		},
		onPlus() {
			if (this.nowValue < this.limit) {
				if (this.nowValue < this.maxBuyAmount) {
					this.onChangeAmount(this.nowValue + 1);
				}
				// if (this.duration > 50) {
				//   this.duration = this.duration - 50
				// }

				// this.timeout = window.setTimeout(this.onPlus, this.duration)
			}
		},
		onMinus() {
			if (this.nowValue > 1) {
				this.onChangeAmount(this.nowValue - 1);

				// if (this.duration > 50) {
				//   this.duration = this.duration - 50
				// }

				// this.timeout = window.setTimeout(this.onMinus, this.duration)
			}
		},
		onStop() {
			var isPressing = this.duration !== 250;
			if (isPressing) {
				window.clearTimeout(this.timeout);
				this.duration = 250;
			}
		},
		onChange(event) {
			var eventValue = parseInt(event.target.value);
			var newValue;
			if (event.target.value === "") {
				// delete or backspace
				newValue = "";
			} else if (!Number.isInteger(eventValue) || eventValue < 1) {
				// Nan after parseInt () or press '-' key
				return;
			} else if (eventValue > this.limit) {
				// if limit is not exsist (no size selected), set 1 as default value
				newValue = this.limit ? this.limit : 1;
			} else {
				newValue = eventValue;
			}
			this.onChangeAmount(newValue);
		},
		onKeyDown(event) {
			if (event.keyCode === 38) {
				this.onPlus();
			} else if (event.keyCode === 40) {
				this.onMinus();
			}
		},
	},

	template: `
    <div class='UiQuantity'>
      <a
        class='UiQuantity__btn UiQuantity__btn--minus'
        @click="onMinus"
      >–</a>
      <input
        class='UiQuantity__text'
        type='text'
        :value="nowValue"
        @change="onChange"
        @keyDown="onKeyDown"
        @keyUp="onStop"
      />
      <a
        class='UiQuantity__btn UiQuantity__btn--plus'
        @click="onPlus"
      >＋</a>
    </div>
  `,
};

export default Quantity;
