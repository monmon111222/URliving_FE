import common from "@page/common/js/common";
import Selector from "@page/common/js/template/select";
import Notice from "@page/shopContent/components/Notice.vue";
import INDEX_TMPL from "@page/shopContent/template/index.pug";
import Photo from "@page/shopContent/components/Photo.vue";
import Spec from "@page/shopContent/components/Spec.vue";
import Recommend from "@page/shopContent/components/Recommend.vue";
require("@global/vendors/jquery.sticky-kit");
import Addon from "@page/shopContent/js/addon";
import store from "@global/components/store/index.js";
import NewImage from "@global/components/global/image";

import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers("shopContent");

if (process.env.NODE_ENV === "development") {
	Vue.config.devtools = true;
}

const app = new Vue({
	name: "Shop-Content",
	el: "#shop-content",
	template: INDEX_TMPL,
	store,
	components: {
		Spec,
		Photo,
		Recommend,
		Notice,
		Selector,
		Addon,
		NewImage,
	},
	created() {
		this.getData();
		this.getRecommandData();
	},
	watch: {
		selectedDataID() {
			this.changeSelectedData();
		},
	},
	computed: {
		...mapState([
			"itemDatas",
			"selectedDataID",
			"selectedData",
			"recommandDatas",
			"dataIsLoad",
			"rdataIsLoad",
			"nowSlideIndex",
			"hasStock",
			"CMID",
			"changePic",
			"carAddMainItem",
			"utmData",
		]),
	},
	methods: {
		...mapActions(["getData", "getRecommandData", "changeSelectedData"]),
	},
});

$(".list-wrap a").click(function (e) {
	$(".list-wrap a").removeClass("active");
	$(this).addClass("active");
});