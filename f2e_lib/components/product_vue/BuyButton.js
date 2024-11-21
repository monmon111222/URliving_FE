// buybutton
// 傳入參數
/*
barcode //字串 完整巴摳(含色 尺寸碼)
productImage //字串 該色商品封面圖URL
productName //字串 商品名
productColor //字串 顏色名(紅/綠...)
buyAmount //數字 當前購買數量
sizeData //物件 該尺吋庫存資訊 (物件中 IsNotice / IsPreOrderProduct 非必要，不寫自動判false)
onSaleCode //字串 該款商品的特價Code (1Q65D...) 沒有傳空字串
sellingPrice //字串 正價
discountPrice //字串 特價 (沒有特價跟正價一樣)
ajaxFinishFunction //涵式 購物車API AJAX完成後會調用父輩Function
allBtnText //物件
  {
    plzChoose || '請選擇尺寸',
    add || '加入購物車',
    askNotice || '索取到貨通知',
    soldOut || '已售罄',
    addPre || '加入購物車 (預購)',
    overPreOrder || '此次預訂已達上限'
  }
*/

import ArrivalNotice from '@global/components/product_vue/ArrivalNotice_vue' // 索取到貨通知
import getURLParameter from '@global/helpers/getURLParameter'
import AlertDialog from '@global/helpers/alertDialog'
import MessageBox from '@global/helpers/messageBox'
import cartNotification from '@global/components/cart/cartNotification';
import gtmTrace from '@global/components/tracing/gtm';
import axios from 'axios'
import qs from 'Qs'
import utmKDetect from '@global/helpers/utmKDetect';
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("miniCartModule");

const NowMyEquipment = nowEnv.NowMyEquipment
const NowMyStorage = nowEnv.NowMyStorage

let BuyButton = {
  data: function () {
    return{
        defBtnText:{
          plzChoose: '請選擇尺寸',
          preShow: 'COMING SOON',
          add: '加入購物車',
          askNotice: '暫銷售一空 ♡ 感謝熱烈支持',
          soldOut: '已售罄',
          addPre: '加入購物車 (預購)',
          overPreOrder: '此次預訂已達上限'
        },
        openArrivalNotice: false
    }
  },
  props: {
    sitemap: {
      type: Object
    },
    CustomMarketID:{
      type: String
    },
    barcode: {
      type: String,
      required: true
    },
    productImage: {
      type: String
    },
    productName: {
      type: String,
      required: true
    },
    sizeName: {
      type: String
    },
    productColor: {
      type: String,
      required: true
    },
    buyAmount: {
      type: Number,
      required: true
    },
    sizeData: {},
    onSaleCode: {
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    eventPrice: {
      type: Number,
      required: true
    },
    originPrice: {
      type: Number,
      required: true
    },
    isCosmetic: {
      type: Boolean
    },
    extendText: {
    },
    colorID: {
      required: true
    },
    sizeID: {
      required: true
    },
    linkUrl: {},
		imgUrl: {},
    isPreShow: {
      type: Boolean
    }
  },
  computed: {
    allBtnText: function() {
      if(this.extendText!==null){
        return $.extend({}, this.defBtnText, this.extendText)
      }else{
        return this.defBtnText
      }
    },
    nowText: function() {
      if (this.isPreShow) {
        // preshow         
        return this.allBtnText.preShow
      } else {
        if (!$.isEmptyObject(this.sizeData)) {
          // 有選擇尺寸了
          if (this.sizeData.Stock > 0 && !this.sizeData.PreOrder) {
            // 一般庫存有 (正常賣)
            return this.allBtnText.add
          }else{
            // 一般庫存無
            if (this.sizeData.PreOrder) {
            // 預購開啟
              if (this.sizeData.Stock > 0) {
                // 預購庫存有 (可以預購)
                return this.allBtnText.addPre
              }else{
                // 預購庫存沒了 (不能預購)
                // return this.allBtnText.overPreOrder
                return this.allBtnText.askNotice
              }
            } else {
              // 一般庫存沒了，而且也沒開放預購
              return this.allBtnText.askNotice
            }
          }
        }else{
          // 還沒選尺寸
          return this.allBtnText.plzChoose
        }
      }

      
    }
  },
  methods: {
    ...mapActions(["getCartInfo"]),
    brandAlert (msg) {
      nowBrand.alert(msg, nowBrand.globalConfig.alertTitle || null)
    },
    addToCart (isPre, thisTag) {
      // 含普通購買+預購 傳參數判斷
      // true 為預購 反之為普通正常購
      let tex
      if (!isPre) {
        tex = ['商品已售完！', '庫存不足無法購買！', '已經超過單品購買上限！']
      } else {
        tex = ['預訂商品已售完！', '預訂庫存不足無法購買！', '已經超過單品預訂上限！']
      }

      let CustomMarketID_hasSize = this.CustomMarketID.substring(0, this.CustomMarketID.indexOf('CL')) + 'CL' + this.colorID+ 'SZ' + this.sizeID
      let postStr = utmKDetect(CustomMarketID_hasSize) !== null ? {
          CustomMarketID: CustomMarketID_hasSize,
          Count: this.buyAmount,
          UtmTag: utmKDetect(CustomMarketID_hasSize)
        } : {
          CustomMarketID: CustomMarketID_hasSize,
          Count: this.buyAmount
        }

      axios
        .post(API_URL.SHOPPING_CART, qs.stringify(postStr))
        .then((res) => {
          if (res.data.Code === 200 || res.data.Code === 406) {
            MessageBox.cart('加入購物車');
            this.getCartInfo();
            gtmTrace.addToCart({
              name: this.productName,
              id: CustomMarketID_hasSize,
              price: this.originPrice,
              sale_price: this.eventPrice > 0 && this.eventPrice < this.sellingPrice ? this.eventPrice : this.sellingPrice,
              img_url: this.imgUrl,
              product_url: this.linkUrl,
              color: this.productColor,
              count: this.buyAmount
            });
            this.$emit('reRenderCart',CustomMarketID_hasSize ,this.buyAmount ,this.sizeName)
          } else if (res.data.Code === 400) {
            window.location.href = window.CategoryUrl;
          }else if (res.data.Code === 205){
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
    clickFunction(){
      if (!$.isEmptyObject(this.sizeData)) {
        // 有選擇尺寸了
        if (this.sizeData.Stock > 0 && !this.sizeData.PreOrder && !this.isPreShow) {
          // 一般庫存有 (正常賣) 也不是preshow商品
          this.addToCart(false, event.target)
        }else{
          // 一般庫存無
          if (this.sizeData.PreOrder) {
          // 預購開啟
            if (this.sizeData.Stock > 0 && !this.isPreShow) { 
              // 預購庫存有 (可以預購)
              this.addToCart(true)
            }else{
              // 預購庫存沒了 (不能預購)
              this.openArrivalNotice = true
            }
          } else {
            // 一般庫存沒了，而且也沒開放預購
            this.openArrivalNotice = true
          }
        }
      }
    },
    closeArrivalNotice(){
      this.openArrivalNotice = false
    }
  },
  components: {
    ArrivalNotice
  },
  template: `
  <div class='product-buttons'>
    <button
     @click="clickFunction">
      <span>{{nowText}}</span>
    </button>
  </div>`
}

export default BuyButton
