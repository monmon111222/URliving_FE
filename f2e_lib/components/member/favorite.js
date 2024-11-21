// var object = require('lodash/fp/object');

import NewImage from "@global/components/global/image";
import AlertDialog from "@global/helpers/alertDialog";
import ITEM_TMPL from "@page/favorite/js/itemTmpl";
import TABLE_TMPL from "@page/favorite/js/tableTmpl";
import APP_TMPL from "@page/favorite/js/appTmpl";

const favoriteItem = {
	template: ITEM_TMPL,
	props: ["data", "idx"],
	components: {
		NewImage,
	},
	data: function () {
		return {
			productName: this.data.Name,
			productImg: this.data.Cover,
			productLink: this.data.MarketUrl,
			originPrice: this.data.OriginPrice,
			sellPrice: this.data.SellPrice,
			eventPrice: this.data.EventPrice,
		};
	},
	methods: {
		openDialog: function (elCustomMarketID) {
			// $.ajax({
			// 	type: 'GET',
			// 	url: API_URL.MARKET_CONTENT + '?CustomMarketID=' + elCustomMarketID,
			// 	dataType: 'json',
			// 	xhrFields: {
			// 		withCredentials: true
			// 	},
			// 	error: function() {
			// 		console.log('error');
			// 	},
			// 	success: function(res) {
			// 		if (res.Code === 200) {
			// 			app.$refs.c_favorite.isopen = true;
			// 			app.$refs.c_favorite.alldatas = res.Response;
			// 			app.$refs.c_favorite.selectedID = res.Response.ColorID;
			// 			app.$refs.c_favorite.dataisload = true;
			// 		} else {
			// 			AlertDialog.alert('系統忙線中,請稍後再試');
			// 		}
			// 	}
			// });
		},
		cancelFavorite: function (elCustomMarketID) {
			var _this = this;
			$.ajax({
				type: "PUT",
				url: API_URL.FAVORITE,
				dataType: "json",
				data: { CustomMarketID: elCustomMarketID },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.$emit("delete");
					} else if (res.Code === 401) {
						AlertDialog.alert("請先登入");
					} else {
						AlertDialog.alert("系統忙線中");
					}
				},
			});
		},
	},
};

const favoriteTable = {
	template: TABLE_TMPL,
	props: ["datas"],
	components: {
		favoriteItem,
	},
	methods: {
		cancelFavorite: function (index) {
			this.$emit("delete", index);
		},
	},
};

const favoriteApp = {
	template: APP_TMPL,
	components: {
		favoriteTable,
	},
	data: function () {
		return {
			dataIsLoad: false,
			isLoading: false,
			page: 1,
			datas: [],
			noItems: false,
			pageCount: 1,
			arrayCount: 0,
			totalCount: 0,
		};
	},
	props: ["maxcount", "pagesize"],
	created: function () {
		this.fetchItems();
	},
	mounted: function () {
		var _this = this;
		window.addEventListener("scroll", this.scrollEvent);
	},
	methods: {
		cancelFavorite: function (index) {
			console.log(index);
			this.datas.splice(index, 1);
		},
		fetchItems: function () {
			var _this = this;

			this.isLoading = true;

			var maxPage =
				_this.maxcount % _this.pagesize !== 0
					? Math.ceil(_this.maxcount / _this.pagesize)
					: _this.maxcount / _this.pagesize;

			if (_this.page > _this.pageCount || _this.page > maxPage) {
				_this.reachLastPage();
				return;
			}

			// 	Count: 9
			// maxCount:7
			// pageSize:2

			$.ajax({
				type: "GET",
				url: API_URL.FAVORITE + "?Page=" + _this.page + "&PageSize=" + _this.pagesize,
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.dataIsLoad = true;
						_this.pageCount = res.Response.PageCount;
						_this.totalCount = res.Response.TotalCount;

						if (_this.pageCount === 0) {
							_this.noItem();
							return;
						}

						if (_this.page > _this.pageCount || _this.page > maxPage) {
							_this.reachLastPage();
							return;
						}

						if (_this.page >= maxPage) {
							if (_this.maxcount > res.Response.TotalCount) {
								var len = _this.maxcount - res.Response.TotalCount;
							} else if (_this.maxcount <= res.Response.TotalCount) {
								var len = _this.page * _this.pagesize - _this.maxcount;
							}
						} else {
							var len = res.Response.Data.length;
						}

						for (var i = 0; i < len; i++) {
							_this.datas.push(res.Response.Data[i]);
						}

						setTimeout(function () {
							_this.isLoading = false;
							_this.page++;
							// _this.datas = [];
						}, 200);
					}
				},
			});
		},
		scrollEvent: function () {
			var $window = $(window),
				$document = $(document);

			if (!this.isLoading) {
				var winHeight = window.innerHeight ? window.innerHeight : $window.height(), // iphone fix
					closeToBottom = $window.scrollTop() + winHeight > $document.height() - 1500;
				if (closeToBottom) {
					// Get datas and add them to the bottom of the grid
					this.fetchItems();
				}
			}
		},
		reachLastPage: function () {
			this.isLoading = false;
			window.removeEventListener("scroll", this.scrollEvent);
		},
		noItem: function () {
			this.isLoading = false;
			this.noItems = true;
			window.removeEventListener("scroll", this.scrollEvent);
		},
	},
	beforeDestroy: function () {
		window.removeEventListener("scroll");
	},
};

module.exports = favoriteApp;
