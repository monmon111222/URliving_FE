function topBanner(callback) {
	$.ajax({
		url: nowBrand.constants.GetBanners,
		type: "GET",
		cache: false,
		dataType: "json",
	}).success(function (data) {
		if (data) {
			const Bannerlength = data.Banner_freelayout.length;
			// 如果返回長度不等於0 表示有資料

			if (Bannerlength !== 0) {
				$("body").prepend('<div id="topBanner"></div>');
				for (var i = 0; i < Bannerlength; i++) {
					$("#topBanner").append(data.Banner_freelayout[i]);
				}

				if (callback && typeof callback === "function") callback();
			}
		}
	});
}

module.exports = topBanner;
