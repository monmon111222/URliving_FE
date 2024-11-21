import ProductListTools from "./Tools";
import Amount from "./option_Amount";
import FilterComponent from "./option_Filter";
import Column from "./option_Column";

let Option = {
	data: function () {
		return {
			isOpen: false,
			show: true,
			tgQtyTags: [0, 1, 0],
			tgPriceTags: [0, 0],
			tgSizeTags: this.mapTgSizeTags(this.sizeTags),
			originalSizeTags: this.mapTgSizeTags(this.sizeTags),
			newUrl: "",
			isFiltered: false,
		};
	},
	computed: {},
	watch: {
		// tgSizeTags: function(){
		//   console.log('在 compouted 裡面')
		//   this.mapTgSizeTags(this.onChangeColumn)
		// },
		// originalSizeTags: function(){
		//   this.mapTgSizeTags(this.sizeTags)
		// }
	},
	props: {
		Total: {},
		Filters: {},
		sizeTags: {},
		hasSetAmount: {},
		hasSetColumn: {},
		nowColumn: {},
		filterSet: {},
		otherArgs: {},
		nowLimit: {},
	},
	components: {
		Amount,
		FilterComponent,
		Column,
	},
	methods: {
		onChangeColumn(e) {
			this.$emit("onChangeColumn", e);
		},
		mapTgSizeTags(sizeTags) {
			console.log("在 mapTgSizeTags methods裡面");
			const tmpAry = [];
			for (let i = 0; i < sizeTags.length; i++) {
				tmpAry.push(0);
			}
			return tmpAry;
		},
		addSelectedClass() {
			// 已經選過的尺寸加上selected
			const argsData = {
				getPage: parseInt(ProductListTools.getUrlArgs("page")),
				getUnit: parseInt(ProductListTools.getUrlArgs("qty")),
				price: ProductListTools.getUrlArgs("price"),
				size: ProductListTools.getUrlArgs("size"),
			};
			console.log(argsData);
			argsData.size = argsData.size.split(",");
			const alreadySize = argsData.size;
			const allSize = this.sizeTags;
			let tgQtyTags = this.tgQtyTags;
			let tgSizeTags = this.tgSizeTags;
			let tgPriceTags = this.tgPriceTags;

			// 找出已經選好的size
			for (let i in allSize) {
				for (let k in alreadySize) {
					if (allSize[i] === alreadySize[k]) {
						tgSizeTags[i] = 1;
					}
				}
			}
			// 找出已經選好的price
			switch (argsData.price.toLowerCase()) {
				case "high":
					tgPriceTags = [1, 0];
					break;
				case "low":
					tgPriceTags = [0, 1];
					break;
				default:
					tgPriceTags = [0, 0];
			}
			// 找出已經選好的數量
			if (argsData.getUnit === 30) {
				tgQtyTags = [1, 0, 0];
			} else if (argsData.getPage === 0) {
				tgQtyTags = [0, 0, 1];
			} else {
				tgQtyTags = [0, 1, 0];
			}

			this.tgPriceTags = tgPriceTags;
			this.tgSizeTags = tgSizeTags;
			this.tgQtyTags = tgQtyTags;
		},
		clearTags() {
			this.tgPriceTags = [0, 0];
			this.tgSizeTags = this.originalSizeTags;
		},
		reorganizeUrl() {
			const nowLoacation = window.location.toString();
			const otherArgs = this.otherArgs || {};
			let args;
			let argsString = "";
			const hasFilter = nowLoacation.indexOf("?") !== -1;
			// 先把篩選參數裝起來並刪除qty
			if (hasFilter) {
				args = nowLoacation.split("?")[1].split("&");
				let i = 0;
				while (i < args.length) {
					if (args[i].indexOf("qty") !== -1 || args[i].indexOf("page") !== -1) {
						args.splice(i, 1);
					} else {
						i++;
					}
				}
				// 再把篩選參數組回去
				if (args.length !== 0) {
					argsString = args.join("&") + "&";
				}
			}

			// 如果有其他參數但還沒加過就加上去
			let otherArgsString = "";
			const allArgsKey = args
				? args.map(function (value) {
						return value.split("=")[0];
				  })
				: [];
			Object.keys(otherArgs).map(function (key) {
				const value = otherArgs[key];
				if ($.inArray(key, allArgsKey) === -1 && value) otherArgsString += key + "=" + value + "&";
			});

			const newUrl = window.location.pathname + "?" + otherArgsString + argsString;
			this.newUrl = newUrl;
			this.isFiltered = hasFilter;
		},
		getURLParameter(n) {
			var i = new RegExp("(^|&)" + n + "=([^&]*)(&|$)");
			var t = window.location.search.substr(1).match(i);

			return t != null ? decodeURIComponent(t[2]) : "";
		},
		trim(n) {
			return n.replace(/^\s+|\s+$/g, "");
		},
		LoadProductListBySort() {
			var i = "";
			var t = "";
			i = $(".item-filter__radio > ul > li[class='selected']").find("a").text();

			switch (i) {
				case "HIGH TO LOW":
					i = "HIGH";
					break;
				case "LOW TO HIGH":
					i = "LOW";
					break;
				default:
					i = "";
			}
			$(".item-filter__tags > ul > li[class='selected']").each(function () {
				t = t + $(this).find("a").text() + ",";
			});
			if (t.length > 0) t = t.substr(0, t.length - 1);
			var r = this.getURLParameter("brand");
			var u = this.getURLParameter("qty");
			var f = this.getURLParameter("suit");
			var e = this.getURLParameter("keyword");
			var o = this.getURLParameter("osid");
			var s = this.getURLParameter("cid");
			var h = this.getURLParameter("main");
			var n = "";
			var trim = this.trim;
			if (trim(i) !== "") {
				n = n + "price=" + trim(i) + "&";
			}
			if (trim(t) !== "") {
				n = n + "size=" + trim(t) + "&";
			}
			if (trim(r) !== "") {
				n = n + "brand=" + trim(r) + "&";
			}
			if (trim(u) !== "") {
				n = n + "qty=" + trim(u) + "&";
			}
			if (trim(f) !== "") {
				n = n + "suit=" + trim(f) + "&";
			}
			if (trim(e) !== "") {
				n = n + "keyword=" + encodeURIComponent(trim(e)) + "&";
			}
			if (trim(o) !== "") {
				n = n + "osid=" + encodeURIComponent(trim(o)) + "&";
			}
			if (trim(s) !== "") {
				n = n + "cid=" + trim(s) + "&";
			}
			if (trim(h) !== "") {
				n = n + "main=" + trim(h) + "&";
			}
			if (trim(n) !== "") {
				n = "?" + n.substr(0, n.length - 1);
			}

			window.location.href = window.location.pathname + n;
		},
		onSwitch(e) {
			// e.preventDefault()
			// e.stopPropagation()
			console.log("在onSwitch裡面");
			if (!this.isOpen) {
				this.close();
				this.open();
			} else {
				this.close();
			}
		},
		open() {
			console.log("在open裡面");
			this.isOpen = true;
			this.globalClose();
		},
		globalClose() {
			const self = this;
			$(document).on("click.globalCloseOption", function (e) {
				if (
					(!$(e.target).hasClass("item-filter__content") && $(e.target).closest(".item-filter__content").length < 1) ||
					$(e.target).hasClass("item-filter__close")
				) {
					self.close();
				}
			});
		},
		close() {
			console.log("在close裡面");
			this.isOpen = false;
			$(document).off("click.globalCloseOption");
		},
		reorganizeUrl() {
			const nowLoacation = window.location.toString();
			const otherArgs = this.otherArgs || {};
			let args;
			let argsString = "";
			const hasFilter = nowLoacation.indexOf("?") !== -1;
			// 先把篩選參數裝起來並刪除qty
			if (hasFilter) {
				args = nowLoacation.split("?")[1].split("&");
				let i = 0;
				while (i < args.length) {
					if (args[i].indexOf("qty") !== -1 || args[i].indexOf("page") !== -1) {
						args.splice(i, 1);
					} else {
						i++;
					}
				}
				// 再把篩選參數組回去
				if (args.length !== 0) {
					argsString = args.join("&") + "&";
				}
			}

			// 如果有其他參數但還沒加過就加上去
			let otherArgsString = "";
			const allArgsKey = args
				? args.map(function (value) {
						return value.split("=")[0];
				  })
				: [];
			Object.keys(otherArgs).map(function (key) {
				const value = otherArgs[key];
				if ($.inArray(key, allArgsKey) === -1 && value) otherArgsString += key + "=" + value + "&";
			});

			const newUrl = window.location.pathname + "?" + otherArgsString + argsString;
			this.newUrl = newUrl;
			this.isFiltered = hasFilter;
		},
		changePriceShow(num) {
			const newArray = [0, 0];
			newArray[num] = !this.tgPriceTags[num];
			this.tgPriceTags = newArray;
		},
		changeSizeShow(num) {
			const newArray = this.tgSizeTags.slice();
			newArray[num] = !this.tgSizeTags[num];
			this.tgSizeTags = newArray;
		},
	},
	created: function () {},
	mounted: function () {
		this.reorganizeUrl();
		this.addSelectedClass();
		this.reorganizeUrl();
	},
	template: `
  <div class="list-options">
    <div class='list-options__total'><span>{{Total}}</span>ITEMS</div>
    <Amount
      v-if=hasSetAmount
      :tgQtyTags=tgQtyTags
      :newUrl=newUrl
    />

    <FilterComponent
      v-if=hasSetAmount
      v-on:onSwitch=onSwitch
      v-on:LoadProductListBySort=LoadProductListBySort
      v-on:changePriceShow=changePriceShow
      v-on:changeSizeShow=changeSizeShow
      v-on:clearTags=clearTags
      :filterSet=filterSet
      :isOpen=isOpen
      :sizeTags=sizeTags
      :tgPriceTags=tgPriceTags
      :isFiltered=isFiltered
      :tgSizeTags=tgSizeTags
    />
    <Column
      v-if=hasSetColumn
      v-on:onChangeColumn=onChangeColumn
      :nowColumn=nowColumn
      :nowLimit=nowLimit
    />
  </div>
  `,
};
export default Option;
