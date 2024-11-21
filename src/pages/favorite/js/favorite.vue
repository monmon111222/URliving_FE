<template>
	<div class="wishlist-content">
		<ul class="tabs__nav">
			<li>
				<a class="tab_product">商品收藏</a>
			</li>
			<li>
				<a class="tab_brand">追蹤品牌</a>
			</li>
		</ul>
		<div class="tab_content product_content">
			<div class="fav-list" v-if="dataIsLoad">
				<favoriteItem
					v-for="(item, index) in datas"
					:key="item.Colors[0].CustomMarketID"
					:data="item"
					:idx="index"
					v-on:delete="cancelFavorite(index)"
				></favoriteItem>
			</div>
		</div>
		<div class="tab_content brand_content hide">123</div>
	</div>
</template>

<script>
import favoriteItem from "@page/favorite/js/favoriteItem.vue";
export default {
	name: "FavoriteTable",
	data() {
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
	components: {
		favoriteItem,
	},
	props: ["maxcount", "pagesize"],
	created() {
		this.fetchItems();
	},
	mounted() {
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
</script>
