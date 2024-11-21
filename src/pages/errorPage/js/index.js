import common from "@page/common/js/common";

window.onload = function () {
	//倒數
	var t = 10;

	function showTime() {
		t--;

		if (t == 0) {
			location.href = "/";
		}
		setTimeout(showTime, 1000);
	}
	showTime();
};
