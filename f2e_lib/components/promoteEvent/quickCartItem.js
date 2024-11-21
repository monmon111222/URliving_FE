import imgTransfer from "@global/helpers/imgTransfer";
import AlertDialog from "@global/helpers/alertDialog";
import MessageBox from "@global/helpers/messageBox";
import cartNotification from "@global/components/cart/cartNotification";
import axios from "axios";
import qs from "Qs";

let QuickCartItem = {
	data: function () {
		return {};
	},
	computed: {
		photoUrl() {
			return imgTransfer(this.item.Cover, "_w573_h730");
		},
	},
	props: {
		item: {
			type: Object,
			required: false,
		},
	},
	components: {},
	methods: {
		doDelete() {
			console.log("刪除", this.item.CustomMarketID);
			var self = this;
			axios
				.put(
					API_URL.SHOPPING_CART,
					qs.stringify({
						CustomMarketID: self.item.CustomMarketID,
						Count: 0,
					})
				)
				.then(function (res) {
					if (res.data.Code === 200 || res.data.Code === 406) {
						// MessageBox.cart('移除商品');
						appNotificationCart.getShoppingDatas();
						// self.onClickTest(CustomMarketID_hasSize,self.buyAmount)
						self.$emit("reRenderCart");
					} else {
						AlertDialog.alert(res.data.Message);
					}
				})
				.catch(function (error) {
					console.log("error");
					// self.brandAlert('無法連接伺服器，請稍候再試！!')
				});
		},
	},
	created: function () {},
	mounted: function () {},
	template: `
  <li class="quick-cart-item">
    <a :href="item.Url">
      <img :src="photoUrl" alt="" class="img-fluid"/>
    </a>
    <div class="info">
      <a :href="item.Url">
       <h3>{{item.Name}}</h3>
      </a>
      <div class="detail">
        <span>{{item.ColorName}}{{item.Size}}</span> -
        <span>{{item.Count}}件</span>
      </div>
      <a class="delete-btn" @click="doDelete"></a>
    </div>
  </li>
  `,
};
export default QuickCartItem;
