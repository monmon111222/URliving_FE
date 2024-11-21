export default {
	isDev: function() {
		return window.location.port === nowBrand.globalConfig.devPort;
	},

	isTest: function() {
		return window.location.host !== nowBrand.globalConfig.host;
	},

	myEquipment: function() {
		return (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			window.innerWidth <= 1024
		);
	},

	smallScreen: function(breakpoint) {
		return window.innerWidth <= (breakpoint || 480);
	},

	isLogin: function() {
		return $(".secnav-right, .login-account").attr("islogin") === "true";
	},

	myCookie: function() {
		return navigator.cookieEnabled;
	},

	myStorage: function() {
		// ios has bug in private mode
		// in private mode, set localStorage will cause error
		var testKey = "test";
		var storage = window.localStorage;
		try {
			storage.setItem(testKey, "1");
			storage.removeItem(testKey);
			return true;
		} catch (e) {
			return false;
		}
	},

	pageDependReact: function() {
		// 檢查頁面是否有script標籤調用React libary
		return Boolean($('script[src*="react"]').length);
	},

	windowReload: function() {
		const windowSizeDefault = window.innerWidth > 1024;
		let windowSizeNew;

		$(window).resize(function() {
			windowSizeNew = window.innerWidth > 1024;

			if (windowSizeDefault !== windowSizeNew) {
				$(window).off("resize");
				window.location.reload();
			}
		});
	},
};
