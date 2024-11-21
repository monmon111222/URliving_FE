// 購物車翻譯

import detectLang from "@global/helpers/detectLang";

window.detectLang = detectLang();

export function initGlobalTxt() {
  const GLOBALTXT = {
    color: {
      en: "Color",
      cn: "颜色",
      tw: "顏色",
      jp: "カラー",
    },
    size: {
      en: "Size",
      cn: "尺寸",
      tw: "尺寸",
      jp: "サイズ",
    },
    price: {
      en: "Price",
      cn: "单价",
      tw: "單價",
      jp: "価格",
    },
    qty: {
      en: "Quantity",
      cn: "数量",
      tw: "數量",
      jp: "数量",
    },
    sellPrice: {
      en: "Sell price",
      cn: "折扣价",
      tw: "折扣價",
      jp: "割引価格",
    },
    subTotal: {
      en: "Subtotal",
      cn: "小计",
      tw: "小計",
      jp: "小計",
    },
    addon: {
      en: "Additional purchase price",
      cn: "加价购",
      tw: "加價購",
      jp: "追加",
    },
    saveForLater: {
      en: "Save for later",
      cn: "下次买",
      tw: "下次買",
      jp: "次回購入する",
    },
    match: {
      en: "match",
      cn: "已经匹配",
      tw: "已符合",
      jp: "match",
    },
    unmatch: {
      en: "Not match",
      cn: "未符合",
      tw: "未符合",
      jp: "Not match",
    },
    noReturnMsg: {
      en: "(!) There is no return service for this product",
      cn: "(!) 此商品无提供退货服务",
      tw: "(!) 此商品無提供退貨服務",
      jp: "(!) この製品の返品サービスはありません",
    },
    noOverseaAndShoreIsland: {
      en:
        "(!) This product does not support overseas and outlying island shipping",
      cn: "(!) 此商品不支援海外及离岛配送",
      tw: "(!) 此商品不支援海外及離島配送",
      jp: "(!) この商品は海外および離島発送をサポートしていません",
    },
    noOversea: {
      en: "(!) This product does not support overseas shipping",
      cn: "(!) 此商品不支援海外配送",
      tw: "(!) 此商品不支援海外配送",
      jp: "(!) この製品は海外発送をサポートしていません",
    },
    noShoreIsland: {
      en: "(!) This product does not support outlying island shipping",
      cn: "(!) 此商品不支援离岛配送",
      tw: "(!) 此商品不支援離島配送!",
      jp: "(!) この製品は、離島配送をサポートしていません",
    },
    noVipDiscount: {
      en: "(!) This product does not offer VIP/VVIP discount",
      cn: "(!) 此商品不提供VIP/VVIP折扣",
      tw: "(!) 此商品不提供VIP/VVIP折扣",
      jp: "(!) この製品はVIP / VVIP割引を提供していません",
    },
    coupon: {
      en: "Promo code",
      cn: "优惠券",
      tw: "折價券",
      jp: "クーポン",
    },
    eCoupon: {
      en: "E-coupon",
      cn: "电子折价券",
      tw: "電子折價券",
      jp: "電子割引クーポン",
    },
    deliveryFee: {
      en: "Delivery",
      cn: "运费",
      tw: "運費",
      jp: "送料",
    },
    bonus: {
      en: "Shopping bonus",
      cn: "购物金",
      tw: "購物金",
      jp: "ショッピングゴールド",
    },
    total: {
      en: "Total",
      cn: "总金额",
      tw: "總金額",
      jp: "合計",
    },
    addToCart: {
      en: "Add to cart",
      cn: "加到购物车",
      tw: "加到購物車",
      jp: "カートに追加",
    },
    enterCoupon: {
      en: "Please enter coupon code",
      cn: "请输入折价券代码",
      tw: "請輸入折價券代碼",
      jp: "クーポンコードを入力してください",
    },
    couponMsg1: {
      en: "A single order is limited to one coupon,",
      cn: "单笔订单限抵一张折价券，",
      tw: "單筆訂單限抵一張折價券。",
      jp: "1つの注文は1つのクーポンに制限されており、",
    },
    couponMsg2: {
      en:
        " and when the order is cancelled or returned, the coupon will be returned to the account if it is still in use.",
      cn: "取消订单或办理退货时，若折价券仍在使用期限将归还至帐户。",
      tw:
        "取消訂單、辦理整筆退貨或退貨後之保留商品未符合折價券使用條件時，若折價券能仍在使用期限內，將歸還至帳戶中。",
      jp:
        "注文がキャンセルまたは返品されたときに、クーポンがまだ使用中の場合は、アカウントに返品されます。",
    },
    delivery: {
      en: "Delivery Area",
      cn: "配送地区",
      tw: "配送地區",
      jp: "配送地区",
    },
    cancel: {
      en: "Cancel",
      cn: "取消",
      tw: "取消",
      jp: "キャンセル",
    },
    payment: {
      en: "Payment method",
      cn: "付款方式",
      tw: "付款方式",
      jp: "支払い方法",
    },
    province: {
      en: "Province",
      cn: "省份",
      tw: "省份",
      jp: "都道府県",
    },
    shipping: {
      en: "Shipping method",
      cn: "运送方式",
      tw: "運送方式",
      jp: "配送方法",
    },
    NoStoreSelected: {
      en: "No store selected",
      cn: "尚未选择门市",
      tw: "尚未選擇門市",
      jp: "店舗が選択されていません",
    },
    selectStore: {
      en: "Select store",
      cn: "选择门市",
      tw: "選擇門市",
      jp: "店舗を選択",
    },
    cart: {
      en: "Shopping Cart",
      cn: "购物车",
      tw: "購物車",
      jp: "購物車",
    },
    productInformation: {
      en: "Product information",
      cn: "产品查询",
      tw: "商品資訊",
      jp: "製品情報",
    },
    noItems: {
      en: "no items in your shopping cart.",
      cn: "购物车目前尚无商品",
      tw: "購物車目前尚無商品",
      jp: "ショッピングカートに商品がありません。",
    },
    continued: {
      en: "Continued",
      cn: "下一步",
      tw: "下一步",
      jp: "次のステップ",
    },
    payWarning: {
      en:
        "oops! For overseas order and preorder items, you can only choose to pay online!",
      cn: "海外訂單-現貨及預購都需先線上刷卡",
      tw: "海外訂單-現貨及預購都需先線上刷卡",
      jp:
        "oops! For overseas order and preorder items, you can only choose to pay online!",
    },
    oriTemp: {
      en:
        "Ordinary Temperatures",
      cn: "一般常溫",
      tw: "一般常溫",
      jp:
        "Ordinary Temperatures",
    },
    coldTemp: {
      en:
        "Cold Shipping",
      cn: "冷藏配送",
      tw: "冷藏配送",
      jp:
        "Cold Shipping",
    },
    freezeTemp: {
      en:
        "Freeze Shipping",
      cn: "冷凍配送",
      tw: "冷凍配送",
      jp:
        "Freeze Shipping",
    },
    instock: {
      en:
        "Instock",
      cn: "現貨",
      tw: "現貨",
      jp:
        "oops! For overseas order and preorder items, you can only choose to pay online!",
    },
    preorder: {
      en:
        "Preorder",
      cn: "預購",
      tw: "預購",
      jp:
        "oops! For overseas order and preorder items, you can only choose to pay online!",
    },
    addToWishlist: {
      en:
        "Add To Wishlist",
      cn: "加入欲望清单",
      tw: "加入慾望清單",
      jp:
        "oops! For overseas order and preorder items, you can only choose to pay online!",
    },
    wishlist: {
      en:
        "Wishlist",
      cn: "欲望清单",
      tw: "慾望清單",
      jp:
        "oops! For overseas order and preorder items, you can only choose to pay online!",
    }
  };

  window.GLOBALTXT = GLOBALTXT;
}

export const globalTxt = {
  template: `<div class="d-inline-block">
		<span v-if="detectLang === 'en'">{{txt.en}}</span>
		<span v-else-if="detectLang === 'cn'">{{txt.cn}}</span>
		<span v-else-if="detectLang === 'jp'">{{txt.jp}}</span>
		<span v-else>{{txt.tw}}</span>
	</div>`,
  props: ["txt"],
};

export default {
  initGlobalTxt: initGlobalTxt(),
  globalTxt: globalTxt,
};
