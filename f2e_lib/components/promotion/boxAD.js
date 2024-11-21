function boxAD() {
	$.ajax({
		url: nowBrand.constants.GetBanners,
		type: "GET",
		cache: false,
		dataType: "json",
	}).success(function (data) {
		var Bannerlength = data.Banner_freelayout.length;
		// 如果返回長度不等於0 表示有資料
		if (Bannerlength !== 0) {
			$(".home-content").prepend('<div id="bannerBox"></div>');
			for (var i = 0; i < Bannerlength; i++) {
				$("#bannerBox").append(data.Banner_freelayout[i]);
			}
			$(".closeBox").click(function () {
				$("#bannerBox").css("display", "none");
			});
		}
	});
}

module.exports = boxAD;
