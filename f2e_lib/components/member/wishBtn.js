import wishTmpl from "@page/common/js/template/wishTmpl";

const wishBtn = {
	template: wishTmpl,
	data: function () {
		return {
			isRunning: false,
		};
	},
	props: ["wishactive", "custommarketid", "styletype"],
	methods: {
		addToWish: function () {
			const _this = this;

			if (_this.isRunning) return;
			_this.isRunning = true;

			$.ajax({
				type: "post",
				url: API_URL.FAVORITE,
				dataType: "json",
				data: { CustomMarketID: _this.custommarketid },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.wishactive = "True";
					} else if (res.Code === 401) {
						AlertDialog.alert("Please login.");
					} else {
						AlertDialog.alert("The server is currently busy. Please try again later.");
					}
					_this.isRunning = false;
				},
			});
		},
		removeWish: function () {
			const _this = this;

			if (_this.isRunning) return;
			_this.isRunning = true;

			$.ajax({
				type: "delete",
				url: API_URL.FAVORITE,
				dataType: "json",
				data: { CustomMarketID: _this.custommarketid },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.wishactive = "False";
					} else if (res.Code === 401) {
						AlertDialog.alert("Please login.");
					} else {
						AlertDialog.alert("The server is currently busy. Please try again later.");
					}
					_this.isRunning = false;
				},
			});
		},
	},
};

export default wishBtn;
