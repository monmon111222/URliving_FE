import imgTransfer from "@global/helpers/imgTransfer";
import Select from "@global/components/global/Select_vue"; // 選擇尺寸下拉選單
import Quantity from "@global/components/product_vue/Ui_quantity"; // 選擇購買數量
import BuyButton from "@global/components/product_vue/BuyButton"; // 選擇購買數量

let Item = {
	data: function () {
		return {
			dollarSign: "NT.",
			sizeSelectOptions: [],
			barcode: "",
			sizeName: "",
			sizeIndex: -1, // 當前尺寸序號，以網址判斷，沒有的話-1
			sizeID: "",
			sizeData: [],
			buyAmount: 1, // 當前購買數量 預設1
			totalQty: 0,
			isPreOrderProduct: false,
			limit: 0,
		};
	},
	computed: {
		photoUrl() {
			let images = this.item.Color.Images;
			let cover = images.filter((item) => item.Category === 11);
			if (cover.length == 0) cover = images;
			return imgTransfer(cover[0].Url, "_w573_h730");
		},
		nowText: function () {
			return this.barcode === "" ? null : `${this.sizeName}${this.isPreOrderProduct ? " (預)" : ""}`;
		},
		isSelected: function () {
			let nowID = this.item.CustomMarketID.split("SZ")[0];
			let isSelected = this.filterCartList.find(function (arg, index, array) {
				console.log(arg.CustomMarketID, nowID);
				return arg.CustomMarketID.split("SZ")[0] == nowID;
			});
			return !!isSelected;
		},
	},
	props: {
		cover: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		sellPrice: {
			type: Number,
			required: true,
		},
		originPrice: {
			type: Number,
			required: true,
		},
		eventPrice: {
			type: Number,
			required: true,
		},
		specs: {
			type: Array,
			required: true,
		},
		item: {
			type: Object,
			required: true,
		},
		filterCartList: {
			type: Array,
			required: true,
		},
	},
	components: {
		Select,
		Quantity,
		BuyButton,
	},
	methods: {
		handleChangeSize(barcode) {
			const sizesData = this.specs;

			let sizeName;
			let sizeIndex;
			for (let i = 0, len = sizesData.length; i < len; i++) {
				if (sizesData[i].Barcode === barcode) {
					sizeName = sizesData[i].Name;
					sizeIndex = i;
					break;
				}
			}
			this.onChangeSize(sizesData[sizeIndex]);
			this.barcode = barcode;
			this.sizeName = sizeName;
			this.sizeIndex = sizeIndex;
			this.buyAmount = 1;
		},
		onChangeSize(sizeData) {
			console.log("sizeData", sizeData);
			this.checkIsPreOrderProduct(sizeData);
			this.updateTotalQty(sizeData);
			this.sizeData = sizeData;
			if (this.sizeData !== undefined) {
				this.sizeID = sizeData.Key;
			} else {
				this.sizeID = "";
			}
		},
		checkIsPreOrderProduct(sizeData) {
			const isPreOrderProduct = $.isEmptyObject(sizeData) ? false : sizeData.PreOrder;
			this.isPreOrderProduct = isPreOrderProduct;
		},
		updateTotalQty(sizeData) {
			const totalQty = $.isEmptyObject(sizeData)
				? 0
				: sizeData.PreOrder && sizeData.Stock < 1
				? sizeData.Stock
				: sizeData.Stock;
			this.totalQty = totalQty;
		},
		createSizeSelectOptions(sizes) {
			return sizes.map((size) => {
				let text = size.Name;
				let isWeak = false;
				if (size.PreOrder) {
					text += " (預)"; // 預購加字
				}
				if (size.Stock < 1) {
					isWeak = true;
				}

				return {
					value: size.Barcode,
					text: text,
					isWeak: isWeak,
				};
			});
		},
		updateSizeSelectOptions(index) {
			this.sizeSelectOptions = this.createSizeSelectOptions(this.specs);
		},
		updateTotalQty(sizeData) {
			const totalQty = $.isEmptyObject(sizeData)
				? 0
				: sizeData.PreOrder && sizeData.Stock < 1
				? sizeData.Stock
				: sizeData.Stock;
			this.totalQty = totalQty;
		},
		handleChangeAmount(amount) {
			this.buyAmount = amount;
		},
		reRenderCart(item, aoumnt, sizeName) {
			console.log("testClick-item", item, aoumnt, sizeName);
			this.$emit("reRenderCart", item, aoumnt, sizeName);
		},
	},
	created: function () {},
	mounted: function () {
		this.sizeSelectOptions = this.createSizeSelectOptions(this.specs);
	},
	template: `
  <li :class="isSelected ? 'item selected' : 'item'">
    <div class="item__images">
      <a :href="link">
        <picture>
            <source :srcset="photoUrl" media="(max-width: 480px)">
            <img :src="photoUrl" class="img-fluid" alt="">
        </picture>
      </a>
    </div>
    <div class="item__info">
      <div class="item__name">
        <a :href="link">{{name}}</a>
      </div>
      <div class="item__price">
        <span>
        {{dollarSign}}{{eventPrice >0 && eventPrice < sellPrice ? eventPrice: sellPrice}}
        </span>
        <span v-if="sellPrice !== originPrice && eventPrice == 0" class="noreTaxt">{{dollarSign}}{{originPrice}}</span>
        <span v-else-if="eventPrice >0" class="item__old-price">{{dollarSign}}{{sellPrice}}</span>
      </div>
    </div>
    <Select
      :options="sizeSelectOptions"
      :nowValue=barcode
      :nowText=nowText
      defaultText='SIZE'
      v-on:onChangeValue="handleChangeSize"
      id='sizeSelect'
      :isDropDown="false"
    />
    <div class="btnWraps">
        <Quantity
          :limit="!!limit?limit:totalQty"
          :nowValue="buyAmount"
          v-on:onChangeAmount="handleChangeAmount"
        />
        <BuyButton v-if="item.CustomMarketID"
          :CustomMarketID=item.CustomMarketID
          :barcode=barcode
          :productName=name
          :productColor=item.Name
          :sizeName=sizeName
          :buyAmount=buyAmount
          :sizeData=sizeData
          :sellingPrice=item.OriginPrice
          :eventPrice=item.EventPrice
          :discountPrice="true ? item.SellPrice : item.OriginPrice"
          :colorID=item.Color.ID
          :sizeID=sizeID
          :linkUrl=item.MarketUrl
          :isPreShow=item.IsPreShow
          v-on:reRenderCart=reRenderCart
        />
    </div>
  </li>
  `,
};
export default Item;
