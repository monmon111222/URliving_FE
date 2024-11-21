import QuickCartItem from "@global/components/promoteEvent/QuickCartItem";

let QuickCart = {
	data: function () {
		return {
			cartStyle: {
				topOffset: 74,
				topHeight: 26,
				bottomHeight: 54,
				baseHeight: 75,
				listViewAmountMax: 3,
			},
		};
	},
	computed: {
		totalAmount() {
			if (this.filterCartList.length > 0) {
				let ary = this.filterCartList.map((item) => item.Count);
				return ary.reduce((prev, curr) => prev + curr);
			} else {
				return 0;
			}
		},
		totalOldPrice() {
			if (this.filterCartList.length > 0) {
				let ary = this.filterCartList.map((item) => item.OriginPrice * item.Count);
				return ary.reduce((prev, curr) => prev + curr);
			} else {
				return 0;
			}
		},
		totalSalePrice() {
			if (this.filterCartList.length > 0) {
				let ary = this.filterCartList.map((item) => item.Subtotal);
				return ary.reduce((prev, curr) => prev + curr);
			} else {
				return 0;
			}
		},
	},
	props: {
		filterCartList: {
			type: Array,
			required: false,
			default: [],
		},
	},
	components: {
		QuickCartItem,
	},
	watch: {
		// count: function(val){
		//     this.onSetCartHeight();
		// }
	},
	methods: {
		setNanoScroller: function () {
			const def = {
				contentClass: "nanoscroll__content",
				preventPageScrolling: true,
				disableResize: true,
			};
			const opt = $.extend({}, def);
			$(".nanoscroll").nanoScroller(opt);
		},
		onSetCartHeight: function () {
			console.log(this.$refs.nanoscrollWrap);
			var _this = this;

			// 綁訂 jQuery.nanoscroller
			let _winHeight = $(window).height();
			setTimeout(function () {
				$(".quick-cart-cnt").css("height", _winHeight - 420 + 60);
				_this.setNanoScroller();
			});
		},
		reRenderCart() {
			this.$emit("reRenderCart");
		},
	},
	created: function () {},
	mounted: function () {
		this.onSetCartHeight();
	},
	template: `
  <div class="quick-cart-wrap">
    <div class='calculation'>
      <p>已選購 <span>{{totalAmount}}</span>件</p>
      <p class="old-price">原價 {{totalOldPrice}} 元</p>
      <p class="sale-price">折扣價 {{totalSalePrice}} 元</p>
      <a class='checkout-cart' href="/checkout">BUY NOW !</a>
    </div>
    <div class="quick-cart-cnt nanoscroll" ref="nanoscrollWrap">
      <ul class="quick-cart-list nanoscroll__content">
        <QuickCartItem
          v-for="item in filterCartList"
          :item="item"
          v-on:reRenderCart=reRenderCart
        />
      </ul>
    </div>
  </div>
  `,
};
export default QuickCart;
