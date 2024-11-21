import ArticleIntro from "@global/components/article/ArticleIntro";
let ArticleList = {
	data: function () {
		return {
			artList: [],
			page: 1,
			isViewAll: false,
			canLoad: true,
			noMorePage: false,
			isLoading: false,
			pageTotal: 1,
		};
	},
	props: {
		isList: {
			type: Boolean,
		},
		categoryName: {
			type: String,
		},
		isClickMore: {
			type: Boolean,
		},
		limit: {
			type: Number,
		},
	},
	computed: {},
	components: {
		ArticleIntro,
	},
	created: function () {
		this.getList();
	},
	mounted: function () {},
	beforeUpdate() {},
	updated() {},
	methods: {
		getList: function () {
			var self = this;
			$.ajax({
				type: "GET",
				url: API_URL.ARTICLE_LIST,
				data: {
					Category: self.categoryName,
					Page: 1,
					limit: self.limit ? self.limit : 10,
				},
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					console.log("res22", res);
					if (res.Code === 200) {
						self.artList = res.Response.Data;
						self.pageTotal = res.Response.PageCount;
						if (res.Response.Page < res.Response.PageCount) $(".articleMore-button").fadeIn();
					} else {
						// AlertDialog.alert('系統忙線中,請稍後再試', function(){window.location.href = '/';});
					}
				},
			});
		},
		onClickMore(e) {
			e.preventDefault();
			this.isLoading = true;
			this.onLoadMore();
		},
		infinitrScroll() {
			var self = this;

			var paginationOffset, bodyScroll;

			$(window).scroll(function (isInLoadArea, isMorePage, canLoad) {
				console.log("load more");
				// paginationOffset = $('.pagination').offset().top
				// bodyScroll = $(window).scrollTop()
				// isInLoadArea = (paginationOffset - 600 < bodyScroll)

				// isMorePage = (pageTotal > page)

				// if (!self.state.canLoad) return

				// if (isInLoadArea && isMorePage) {
				//   self.setState({
				//     canLoad: false,
				//     isLoading: true
				//   })
				//   self.onLoadMore()
				// }
			});
		},
		onLoadMore() {
			var self = this;
			setTimeout(function () {
				self.loadArticle(self.cate, self.unit, self.page + 1);
				self.isLoading = false;
			}, Math.random() * 750 + 250); // delay random time form 0.25s to 1s
		},
		loadArticle(cate, unit, loadPage) {
			var self = this;
			console.log("loadArticle");
			var isMorePage = self.pageTotal >= loadPage;
			var noMorePage = self.pageTotal === loadPage;

			if (isMorePage) {
				$.ajax({
					type: "GET",
					url: API_URL.ARTICLE_LIST,
					data: {
						Category: self.categoryName,
						Page: loadPage,
						limit: self.limit ? self.limit : 10,
					},
					dataType: "json",
					xhrFields: {
						withCredentials: true,
					},
					error: function () {
						console.log("error");
					},
					success: function (res) {
						console.log("res22", res);
						if (res.Code === 200) {
							self.artList = self.artList.concat(res.Response.Data);

							self.page = loadPage;
							console.log("artList", self.artList);
							self.$forceUpdate();
						} else {
							// AlertDialog.alert('系統忙線中,請稍後再試', function(){window.location.href = '/';});
						}
					},
				});
			} else {
				$(".articleMore-button").fadeOut();
			}
		},
	},
	template: `
  <div :class="isList ? 'articleList' : 'articlePage'">
    <ul v-if="limit===undefined">
      <li
        v-for="(item, index) in artList"
        :key="item.Code">
        <ArticleIntro :articleInfo="item" />
      </li>
    </ul>
    <ul v-else>
      <li
        v-if="index<limit"
        v-for="(item, index) in artList"
        :key="item.Code">
        <ArticleIntro :articleInfo="item" />
      </li>
    </ul>
    <div v-if='isClickMore && !noMorePage && !isLoading'
         class='articleMore-button'>
      <a @click.prevent="onClickMore">閱讀更多</a>
    </div>
    <div v-if='isLoading' class='articleMore-loading'>
      <img src='https://pic.pzcdn.tw/design/index/2020banner/loding.png' alt='loading' />
    </div>
  </div>`,
};

export default ArticleList;
