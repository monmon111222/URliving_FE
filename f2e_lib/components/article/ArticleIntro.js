import ArticleImage from "@global/components/article/ArticleImage";
import ArticleTools from "@global/components/article/ArticleTools";

let ArticleIntro = {
	data: function () {
		return {};
	},
	props: {
		articleInfo: {
			type: Object,
		},
	},
	computed: {
		formateDate() {
			return ArticleTools.dateFormate(this.articleInfo.PostTime);
		},
	},
	components: {
		ArticleImage,
	},
	created: function () {
		console.log(this.articleInfo);
	},
	mounted: function () {},
	beforeUpdate() {},
	updated() {},
	methods: {},
	template: `
  <div class="articleIntro">
    <div class="article-coverImg">
        <ArticleImage
            :link="'/mag/article/'+ articleInfo.ID"
            :imgSrc="articleInfo.CoverImage"/>
    </div>
    <div class="article-title">
        <h3><a :href="'/mag/article/'+ articleInfo.ID">{{articleInfo.Title}}</a></h3>
    </div>
    <div class="article-date"><span>{{formateDate}}</span></div>
    <div class="article-content">
        <p v-html="articleInfo.Summary"></p>
    </div>
    <div class="article-link">
        <a :href="'/mag/article/'+ articleInfo.ID" class="btn">Read More</a>
    </div>
  </div>`,
};

export default ArticleIntro;
