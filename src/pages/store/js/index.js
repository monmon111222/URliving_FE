import common from "@page/common/js/common";
function windowSize() {
	if ($(window).width() < 768) {
		return true;
	}
}
let isMobile = windowSize();
if (!isMobile) {
	$(".text-block").removeClass("collapse");
	$(".text-block").removeClass("show");
}
