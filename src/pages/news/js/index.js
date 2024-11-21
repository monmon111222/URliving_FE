import common from "@page/common/js/common";
import corpPage from "@global/components/global/staticInfoPage";
import Pagination from "@page/common/js/Pagination";

new Vue({
	el: "#pagination",
	components: {
		Pagination,
	},
	template: `<Pagination :onepageqty="7"></Pagination>`,
});

corpPage();
