<template>
	<div class="content-block">
		<div class="article-wrap">
			<div class="article-change">
				<div class="article-change-title">NEWS</div>
				<ul class="article-change-items">
					<li><a href="">重要公告</a></li>
					<li><a href="">活動資訊</a></li>
					<li class="active"><a href="">趨勢文章</a></li>
				</ul>
			</div>
			<div class="article-info">
				<div class="trend-page">
					<div class="img-ratio">
						<img class="img-fluid" :src="theArticle.CoverImage" :alt="theArticle.Title" />
					</div>
					<h3>{{ theArticle.Title }}</h3>
					<div class="date">{{ theArticle.PostTime }}</div>
					<div class="tags">
						<a href="">#APPAREL</a><a href="">#PAZZO</a><a href="">#MEIER.Q</a><a href="">#MERCCI22</a>
					</div>
					<div class="trend-page-content">
						<div v-html="theArticle.Content"></div>
						<div class="trend-products">
							<ul class="row">
								<li class="col-12 col-md-6 product">
									<img
										class="img-fluid"
										src="https://via.placeholder.com/120x153/0000FF/808080"
										alt="雙膝T字破壞刀割褲"
									/>
									<div class="product-info">
										<p>PAZZO</p>
										<p class="product-info-name">V領薄針織開襟外套V領薄針織開襟V領薄針織開襟外套V領薄針織開...</p>
										<p class="product-info-price">
											<span class="origin-price">NT.790</span><span class="sell-price">NT.590</span>
										</p>
									</div>
									<div class="product-button"><i class="icon-heart"></i><i class="icon-bag-plus"></i></div>
								</li>
								<li class="col-12 col-md-6 product">
									<img
										class="img-fluid"
										src="https://via.placeholder.com/120x153/0000FF/808080"
										alt="雙膝T字破壞刀割褲"
									/>
									<div class="product-info">
										<p>PAZZO</p>
										<p class="product-info-name">V領薄針織開襟外套V領薄針織開襟V領薄針織開襟外套V領薄針織開...</p>
										<p class="product-info-price">
											<span class="origin-price">NT.790</span><span class="sell-price">NT.590</span>
										</p>
									</div>
									<div class="product-button"><i class="icon-heart"></i><i class="icon-bag-plus"></i></div>
								</li>
							</ul>
						</div>
					</div>
					<a class="btn btn-block btn-primary" href="javascript:;" @click="goBack()">回上一頁</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { dateFormate } from "@global/components/blog/ArticleTools";
import AlertDialog from "@global/helpers/alertDialog";
import axios from "axios";

export default {
	name: "TrendPage",
	data() {
		return {
			theArticle: {},
		};
	},
	created() {
		this.getArticle();
	},
	mounted() {},
	methods: {
		dateFormate(arg) {
			return arg !== undefined ? dateFormate(arg) : "";
		},
		getArticle() {
			let articleID =
				location.href.indexOf("?") !== -1
					? location.href.split("/trend/article/")[1].substr(0, location.href.split("/trend/article/")[1].indexOf("?"))
					: location.href.split("/trend/article/")[1];

			axios
				.get(`${API_URL.ARTICLE_CONTENT}/${articleID}`, {
					params: {
						id: articleID,
					},
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.theArticle = res.data.Response;
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
		goBack() {
			history.go(-1);
		},
	},
};
</script>

<style></style>
