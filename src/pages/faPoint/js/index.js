import common from "@page/common/js/common";
import setEnv from "@global/helpers/setEnv";
import faTemplate from "@page/faPoint/template/index.pug";
import axios from "axios";

new Vue({
	el: "#fasney-bind",
	template: faTemplate,
	data() {
		return {
			faPoint: null,
			faBindingTime: null,
			isBind: false,
			dataIsLoad: false,
			faUrl: null,
			isMobile: false,
		};
	},
	created() {
		this.getFaPoint();
	},
	methods: {
		getFaPoint() {
			this.dataIsLoad = false;
			axios.get(`${API_URL.FA_POINTS}`).then((res) => {
				if (res.data.Code === 200) {
					if (res.data.Response !== null) {
						this.isBind = true;
						this.faPoint = res.data.Response.Point;
						this.faBindingTime = res.data.Response.BindingTime;
						this.faUrl = res.data.Response.FasneyDetailUrl;
					}
					this.dataIsLoad = true;
				}
			});
		},
		checkFaPoint() {
			if (!setEnv.myEquipment()) {
				this.isMobile = false;
			} else {
				this.isMobile = true;
			}
			$("#lb-fa-check").modal("show");
		},
		cancelFaPoint() {
			axios.post(`${API_URL.UNBIND_FA_POINTS}`).then((res) => {
				if (res.data.Code === 200) {
					this.isBind = false;
					window.location.href = "/user/account";
				}
			});
		},
	},
});
