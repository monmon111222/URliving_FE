// 內頁 呈現價格
// 從上層props傳入參數
// productData (obj 完整資料包)

let Price = {
	props: {
		productData: {
			type: Object,
			required: true,
		},
	},
	template: `
  <div>
    <div v-if="productData.Events.length !== 0 || productData.GiftEvents.length !== 0 || productData.Limit !== 0"
         class="product-event-info lh-15">
        <div v-if="productData.Limit !== 0" class="h6">
          此商品限購 {{productData.Limit}} 件
        </div>
        <div v-for="(event,index) in productData.Events" class="h6">
          <a :href="'/campaign/' + event.ID">{{event.Name}}</a>
        </div>
        <div v-for="(giftevent,index) in productData.GiftEvents" class="h6">
          <a :href="'/campaign/gift/' + giftevent.ID">{{giftevent.Name}}</a>
        </div>
    </div>
    <div class='product-price'>
      <span>
        {{productData.EventPrice >0 && productData.EventPrice < productData.SellPrice ? productData.EventPrice: productData.SellPrice}}
      </span>
      <span v-if="productData.SellPrice !== productData.OriginPrice && productData.EventPrice == 0" class="noreTaxt">{{productData.OriginPrice}}</span>
      <span v-else-if="productData.EventPrice >0" class="origin-price">{{productData.SellPrice}}</span>
    </div>
  </div>`,
};

module.exports = Price;
