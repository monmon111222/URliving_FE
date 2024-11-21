import common from "@page/common/js/common";
import corpPage from "@global/components/global/staticInfoPage";
import Trend from "@page/trend/components/Trend.vue";

if (process.env.NODE_ENV === "development") {
	Vue.config.devtools = true;
}

new Vue(
	Object.assign(
		{
			el: "#trendAPP",
		},
		Trend
	)
);

corpPage();
