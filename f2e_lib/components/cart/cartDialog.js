import CARTDIALOG_TMPL from '@page/cart/js/cartDialogTmpl';
import AlertDialog from '@global/helpers/alertDialog';
import NewImage from '@global/components/global/image';
import messageBox from '@global/helpers/messageBox';
import ArrivalNotice from '@global/components/product_vue/ArrivalNotice_vue'; // 索取到貨通知
import gtmTrace from '@global/components/tracing/gtm';
import utmKDetect from "@global/helpers/utmKDetect";
import store from "@global/components/store/index.js";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("miniCartModule");
const axios = require("axios");

export default {
	template: `<div>
				${CARTDIALOG_TMPL}
				<!--<ArrivalNotice
			      v-if="openArrivalNotice"
			      :CustomMarketID="itemSpecInfo"
			      @closeArrivalNotice="closeArrivalNotice"
			      />-->
      			</div>`,
	data: function(){
		return {
			alldatas: {},
			selectedID: null,
			selected: {},
			hasstock: true,
			isopen: false,
			selectedSpec: null,
			selectedSpecID: null,
			selectedSpecKey: null,
			counter: 1,
			btnStyle: 'disabled',
			btnDescription: this.btndescription.genernal,
			checkisopen: false,
			dataisload: false,
			openArrivalNotice: false,
			itemSpecInfo: ''
		}
	},
	store,
	components: { NewImage, ArrivalNotice },
	props: ["isnotice", "btndescription"],
	computed: {
		btnStyleGenerate: {
			get: function(){
				if (this.alldatas.IsPreShow) {
				this.btnStyle = 'disabled';
				} else if (!this.hasstock) {
				this.btnStyle = 'disabled';
				}

				return this.btnStyle;
			},
			set: function(newVal){
				this.btnStyle = newVal;
			}
		},
		btnDescriptionGenerate: {
			get: function(){
				if (this.alldatas.IsPreShow) {
					this.btnDescription = this.btndescription.preShow;
				} else if (this.isnotice && !this.hasstock) {
					this.btnDescription = this.btndescription.notice;
				} else if (!this.hasstock) {
					this.btnDescription = this.btndescription.soldout;
				}

				return this.btnDescription;
			},
			set: function(newVal){
				this.btnDescription = newVal;
			}			
		}
	},
	watch: {
		selectedID: function(){
			this.getSelectedData();
		}
	},
	methods: {
		...mapActions(["getCartInfo"]),
		closeArrivalNotice(){
			this.openArrivalNotice = false
		},
		checkHasStock: function(){
			var _this = this;
			_this.hasstock = false;
			_this.selected.Specs.forEach( function(element, index) {
				if (parseInt(element.Stock) !== 0) {
					_this.hasstock = true;
				}
			});
		},
		getSelectedData: function(){
			var _this = this;
			this.alldatas.Colors.forEach( function(element, index) {
				if (element.ID === _this.selectedID) {
					_this.selected = element;
				}
			});
			// this.checkHasStock();
		},
		closeSelf: function(){
			this.isopen = false;
			this.btnReset();
			this.clearSpec();
		},
		selectSpec: function(spec){
			this.selectedSpec = spec;
			this.selectedSpecID = spec.ID;
			this.selectedSpecKey = spec.Key;
			this.resetCounter();
			this.btnActive(spec.Stock, spec.IsOutOfStock, spec.PreOrder);
		},
		clearSpec: function(){
			this.selectedSpec = null;
			this.selectedSpecID = null;
			this.selectedSpecKey = null;
		},
		addCount: function(maxCount){
			if (this.counter >= maxCount || this.counter >=20) return;
			this.counter++;
		},
		reduceCount: function(){
			if (this.counter <= 1) return;
			this.counter--;
		},
		resetCounter: function(){
			this.counter = 1;
		},
		changeImg: function(colorID){
			if (this.selected.ID === colorID) return;
			this.btnReset();
			this.clearSpec();
			this.resetCounter();
			this.selectedID = colorID;
		},
		btnActive: function(stock, isSoldOut, isPreOrder){
			if (this.alldatas.IsPreShow) return;
			if (stock === 0 && isSoldOut && !isPreOrder) {
				// 現貨無庫存且斷貨
				this.btnStyleGenerate = 'disabled';
				this.btnDescriptionGenerate = this.btndescription.soldout;
			} else if (stock === 0 && !isPreOrder) {
				// 現貨無庫存
				this.btnStyleGenerate = 'active-mail';
				this.btnDescriptionGenerate = this.btndescription.notice;
			} else if (stock === 0 && isPreOrder) {
				// 預購無庫存
				this.btnStyleGenerate = 'active-mail';
				this.btnDescriptionGenerate = this.btndescription.notice;
			} else {
				this.btnStyleGenerate = 'active';
				this.btnDescriptionGenerate = this.btndescription.addbag;
			}
		},
		btnReset: function(){
			this.btnStyleGenerate = 'disabled';
			this.btnDescriptionGenerate = this.btndescription.genernal;
		},
		addToCart: function(){
			var custommarketid = this.alldatas.CustomMarketID;
			var itemSpecInfo = custommarketid.substring(0, custommarketid.indexOf('CL')) + 'CL' + this.selectedID + 'SZ' + this.selectedSpecKey;
			this.itemSpecInfo = itemSpecInfo;
			
			if (this.alldatas.IsPreShow) return;
			if (this.selectedSpec === null) {
				AlertDialog.alert('請選擇尺寸')
				return;
			}
			if (this.selectedSpec.Stock === 0 && this.isnotice) {
				return;
			} else if (this.selectedSpec.Stock === 0) {
				return;
			}

			let utmData = utmKDetect(itemSpecInfo) === null ? null : utmKDetect(itemSpecInfo);

			axios
				.post(API_URL.SHOPPING_CART, {
					CustomMarketID: itemSpecInfo,
					Count: this.counter,
					UtmTag: utmData,
				})
				.then((res) => {
					if (res.data.Code === 200 || res.data.Code === 406) {
						this.checkisopen = false;
						messageBox.cart("加入購物車");
						this.getCartInfo();
						gtmTrace.addToCart({
							name: this.alldatas.Name,
							id: itemSpecInfo,
							price: this.alldatas.OriginPrice,
							sale_price:
								this.alldatas.EventPrice > 0 && this.alldatas.EventPrice < this.alldatas.SellPrice
									? this.alldatas.EventPrice
									: this.alldatas.SellPrice,
							img_url: this.selected.Images[0].Url,
							product_url: this.selected.MarketUrl,
							color: this.selected.Name,
							count: this.counter,
						});
					} else if (res.data.Code === 205) {
						AlertDialog.alert('商品已售完', function(){
							location.reload();
						});
					} else {
						AlertDialog.alert(res.data.Message);
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		itemCheck: function(val){
			this.checkisopen = val;
		}
	}
}