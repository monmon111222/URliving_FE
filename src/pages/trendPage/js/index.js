import common from "@page/common/js/common";
import corpPage from "@global/components/global/staticInfoPage";
import TrendPage from "@page/trendPage/components/TrendPage.vue";

if (process.env.NODE_ENV === "development") {
	Vue.config.devtools = true;
}

new Vue(
	Object.assign(
		{
			el: "#trendPageAPP",
		},
		TrendPage
	)
);

corpPage();
