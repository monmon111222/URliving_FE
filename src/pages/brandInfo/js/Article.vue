<template>
	<div class="article-block">
		<div class="title-wrap">
			<h3>品牌趨勢文章</h3>
			<span>查看全部</span>
		</div>
		<div class="article-wrap">
			<div class="article" v-for="article in popularList" :key="article.ID">
				<img class="img-fluid" :src="article.CoverImage" alt="TREND List" />
				<div class="title">{{ article.Title }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "Article",
	data() {
		return {
			dataIsLoad: false,
			popularList: [],
		};
	},
	mounted() {
		this.getTrendList();
	},
	methods: {
		getTrendList() {
			this.dataIsLoad = false;
			axios
				.get(API_URL.ARTICLE_LIST, {
					Category: "ALL",
					Limit: 2,
					Page: 1,
					Content: 1,
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.popularList = res.data.Response.Data;
						this.dataIsLoad = true;
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試", function () {
							window.location.href = "/";
						});
					}
				});
		},
	},
};
</script>
