<template>
	<div class="content-block">
		<div class="article-wrap">
			<div class="article-change">
				<div class="article-change-title">NEWS</div>
				<ul class="article-change-items">
					<li><a href="">重要公告</a></li>
					<li><a href="">活動資訊</a></li>
					<li class="active">
						<a href="">趨勢文章</a>
					</li>
				</ul>
			</div>
			<div class="article-info">
				<ul class="trend-list row">
					<li class="col-12 col-md-6" v-for="(item, index) in list">
						<a :href="'/trend/article/' + item.ID">
							<div class="img-ratio">
								<img class="img-fluid" :src="item.CoverImage" :alt="item.Title" />
							</div>
						</a>
						<p class="date">{{ item.PostTime }}</p>
						<a :href="'/trend/article/' + item.ID">
							<h3>{{ item.Title }}</h3>
						</a>
						<p>{{ item.Content }}</p>
						<div class="tags">
							<a href="">#APPAREL</a>
							<a href="">#PAZZO</a>
							<a href="">#MEIER.Q</a>
							<a href="">#MERCCI22</a>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<Pagination v-if="totalPage" :onepageqty="6" :totalPage="totalPage"></Pagination>
	</div>
</template>

<script>
import { dateFormate } from "@global/components/blog/ArticleTools";
import AlertDialog from "@global/helpers/alertDialog";
import axios from "axios";
import Pagination from "@page/common/js/Pagination";

export default {
	name: "Trend",
	data() {
		return {
			list: [],
			Categories: [],
			nowPage: this.page || 1,
			totalPage: null,
		};
	},
	components: {
		Pagination,
	},
	created() {
		this.getList();
	},
	methods: {
		dateFormate(PostTime) {
			return dateFormate(PostTime);
		},
		getList() {
			const nowLoacation = window.location.toString();

			if (nowLoacation.indexOf("?") !== -1) {
				let args = nowLoacation.split("?")[1].split("&");
				for (let i = 0; i < args.length; i++) {
					if (args[i].indexOf("P=") !== -1) {
						this.nowPage = parseInt(args[i].replace("P=", ""));
					}
				}
			} else {
				this.nowPage = 1;
			}

			let category = location.href.split("/trend/")[1] || "ALL";
			console.log(category);
			axios
				.get(`${API_URL.ARTICLE_LIST}`, {
					params: {
						Category: category,
						Limit: 6,
						Page: this.nowPage,
						Content: 1,
					},
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.list = res.data.Response.Data;
						this.totalPage = res.data.Response.PageCount;
						console.log(this.totalPage);
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試", function () {
							window.location.href = "/";
						});
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
	},
};
</script>
