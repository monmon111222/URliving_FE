let Info = {
	template: `
    <div class="item__info">
      <template v-if="listSet.sizeAtTop">
        <ul class='item__size'>
          <li v-for="(sizeItem,index) in nowItem.Sizes"
              :key="index+!!(sizeItem.linkSize)"
              :class="(sizeItem.IsSoldOut && !sizeItem.IsPreOrderProduct) || (sizeItem.IsPreOrderProduct && sizeItem.IsPreSoldOut) ? 'soldout' : null">
              <a :href="link.slice(0, linkSliceInedx - 2) + (sizeItem.Barcode) + '/' + (sizeItem.Size.replace(/\./g, '_')) + (isNormalPage ? link.slice(linkSliceInedx) : '')">
                <span>{{sizeItem.Size + (sizeItem.IsPreOrderProduct ? ' (預)' : '')}}</span>
              </a>
          </li>
        </ul>
      </template>
      <template v-else>
        <span class='item__info__wrap'>
          <p v-if="listSet.hasSubtitle" class='item__name title-en'><a :href="link">{{nowItem.Subtitle}}</a></p>
          <p class='item__name title-tw'><a :href="link">{{nowItem.ProductName}}</a></p>
          <span v-if="listSet.hasBarcode" class='item__id'>{nowItem.Barcode.slice(0, nowItem.Barcode.length - 4)}</span>
          <span v-if="listSet.hasColorName" class='item__color'>{{'COLOR : ' + nowItem.ColorName}}</span>
          <p v-if="listSet.hasTwoTitle" class='item__name title-tw-below'><a :href="link">{{nowItem.ProductName}}</a></p>
          <ul class='item__size'>
            <li v-for="(sizeItem,index) in nowItem.Sizes"
                :key="index+!!(sizeItem.linkSize)"
                :class="(sizeItem.IsSoldOut && !sizeItem.IsPreOrderProduct) || (sizeItem.IsPreOrderProduct && sizeItem.IsPreSoldOut) ? 'soldout' : null">
                <a :href="link.slice(0, linkSliceInedx - 2) + (sizeItem.Barcode) + '/' + (sizeItem.Size.replace(/\./g, '_')) + (isNormalPage ? link.slice(linkSliceInedx) : '')">
                  <span>{{sizeItem.Size + (sizeItem.IsPreOrderProduct ? ' (預)' : '')}}</span>
                </a>
            </li>
          </ul>
          <p className='item__price'>
            <span v-if="isDiscount" class='item__old-price'>{{listSet.pricetype + nowItem.SellingPrice}}</span>
            <span>{{listSet.pricetype + nowItem.DiscountPrice}}</span>
          </p>
        </span>
      </template>

    </div>
  `,
	data: function () {
		return {};
	},
	computed: {
		linkSliceInedx: function () {
			return this.link.lastIndexOf("?");
		},
		isDiscount: function () {
			return this.nowItem.DiscountPrice < this.nowItem.SellingPrice;
		},
	},
	props: {
		listSet: {
			type: Object,
			required: false,
		},
		nowItem: {
			type: Object,
			required: false,
		},
		isNormalPage: {
			type: Boolean,
			required: false,
		},
		cateData: {
			type: Array,
			required: false,
		},
		imgFrom: {
			type: String,
			required: false,
		},
		link: {
			type: String,
			required: false,
		},
	},
};

export default Info;
