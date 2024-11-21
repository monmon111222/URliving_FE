import Tools from "@global/components/productList_vue/Tools";
import List from "@global/components/productList_vue/List";
import Option from "@global/components/productList_vue/Option";
import Pagination from "@global/components/global/Pagination";

let Content = {
	data: function () {
		return {
			Total: "",
			Filters: [],
			Items: [],
			mainCate: Tools.getNowCategory()[0].toLowerCase() !== "home" ? Tools.getNowCategory()[0].toLowerCase() : "WOMEN",
			subCate: Tools.getNowCategory()[1],
			itemCate: Tools.getNowCategory()[2],
			pageType: Tools.getPageType(),
			nowColumn: parseInt(window.localStorage.getItem("columnStatus")) || 4,
			serverTime: "",
			BannerImgs: {},
			allCateData: [],
			sitemap: {},
			isNormalPage: Tools.getPageType() === "normal",
			getPage: parseInt(Tools.getUrlArgs("page")),
			// page: isNaN(this.getPage) ? 1 : this.getPage,
			getUnit: parseInt(Tools.getUrlArgs("qty")),
			// unit: isNaN(this.getUnit) ? ((this.page === 0) ? this.Total : 60) : this.getUnit
		};
	},
	computed: {
		page: function () {
			return isNaN(this.getPage) ? 1 : this.getPage;
		},
		unit: function () {
			return isNaN(this.getUnit) ? (this.page === 0 ? this.Total : 60) : this.getUnit;
		},
	},
	props: {
		listSet: {
			type: Object,
			required: false,
		},
		sizeTags: {
			type: Array,
			required: false,
		},
		hasLodingImg: {
			type: Boolean,
			required: false,
		},
		filterSet: {
			type: Object,
			required: false,
		},
	},
	components: {
		List,
		Option,
		Pagination,
	},
	methods: {
		dataHandler() {
			var dataAll = {
				saleId: Tools.getUrlArgs("osid"),
				getPage: parseInt(Tools.getUrlArgs("page")),
				getUnit: parseInt(Tools.getUrlArgs("qty")),
				price: Tools.getUrlArgs("price"),
				size: Tools.getUrlArgs("size"),
				keyword: Tools.getUrlArgs("keyword"),
			};
			dataAll.page = isNaN(dataAll.getPage) ? 1 : dataAll.getPage;
			/*
      要傳給後端的目前一頁幾筆資料
       ● 「如果取不到Unit」--> 代表剛進來還沒點過Option 或是 ALL的狀態 (再判斷page是不是0 是的話回500 )
       ● 「如果取到Unit」  --> 代表點過30||60  */
			dataAll.unit = isNaN(dataAll.getUnit) ? (parseInt(dataAll.getPage) === 0 ? 500 : 60) : dataAll.getUnit;
			// 要傳給後端的資料們(END)------------
			this.getData(dataAll);
		},
		getData(arg) {
			const self = this;
			// 取得伺服器時間

			$.ajax({
				url: API_URL.GetTime,
				type: "GET",
				cache: false,
				success: function (dataGetTime) {
					const serverTime = new Date(
						dataGetTime.year,
						dataGetTime.month - 1, // 月份要-1
						dataGetTime.day,
						dataGetTime.hour,
						dataGetTime.minute,
						dataGetTime.second,
						dataGetTime.millisecond
					).getTime();
					self.serverTime = serverTime;
				},
			});

			// 取得商品列表資訊
			if (/*! (this.state.pageType === 'search') */ true) {
				// 如果是一般列表 或 最新商品列表
				$.ajax({
					url: API_URL.ListItems,
					type: "GET",
					data: {
						MAIN: this.mainCate,
						SUB: this.subCate,
						ITEM: this.itemCate,
						ONSALEID: arg.saleId,
						UNIT: arg.unit,
						PAGE: arg.page,
						PRICE: arg.price,
						SIZE: arg.size,
					},
					success: function (arg) {
						self.Total = arg.Total;
						self.Filters = arg.Filters;
						self.Items = arg.Items;
					},
				});
			} else {
				// 如果是搜尋結果
				$.ajax({
					url: API_URL.KeywordListItems,
					type: "GET",
					data: {
						KEYWORD: arg.keyword,
						UNIT: 40,
						PAGE: arg.page,
					},
				}).success(function (data) {
					self.Total = arg.Total;
					self.Filters = arg.Filters;
					self.Items = arg.Items;
				});
			}
		},
		onChangeColumn(e) {
			this.nowColumn = parseInt(e.target.dataset.col);
			window.localStorage.setItem("columnStatus", e.target.dataset.col);
			this.dataHandler();
			$(window).scroll();
		},
	},
	created: function () {
		this.dataHandler();
	},
	mounted: function () {
		this.hasLodingImg && $("body").css({ background: "none" });
	},
	template: `
  <div class="ReactWrap">
    <div class="product-content">
      <Option
        v-on:onChangeColumn=onChangeColumn
        :Total=Total
        :Filters=Filters
        :filterSet=filterSet
        :sizeTags=sizeTags
        :hasSetAmount="true"
        :hasSetColumn="true"
        :nowColumn=nowColumn
      />
      <List
        :Items=Items
        :listSet=listSet
        :isNormalPage=isNormalPage
        :cateData = "[mainCate, subCate, itemCate]"
        :nowColumn=nowColumn
      />
      <Pagination
        :onePageQty=unit
        :totalQty=Total
        :Total=Total
        :unit=unit
        :page=page
        />
    </div>
  </div>
  `,
};
export default Content;
