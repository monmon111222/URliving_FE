function footerBar() {
	var footerNoticeHeight = "";
	var openStatuses = "open_footerNotice open_footerInfo";

	function initFooterNotice() {
		var $footerTarget = $(".FooterNotice");
		// console.log($footerTarget)
		if ($footerTarget.length !== 0) {
			$footerTarget.addClass("loaded");
			$footerTarget.css("bottom", -$(".footerNotice").outerHeight());
		}
		// $.ajax({
		//   url: nowBrand.constants.GetBanners,
		//   type: 'GET',
		//   cache: false,
		//   dataType: 'json'
		// }).success(function (data) {
		//   var Bannerlength = data.Banner_freelayout.length
		//   // 如果返回長度不等於0 表示有資料
		//   if (Bannerlength !== 0) {
		//     for (let i = 0; i < Bannerlength; i++) {
		//       $('.footerNotice__content').append(data.Banner_freelayout[i])
		//     };
		//     $('.footerNotice__content').find('.sim-row').removeClass('sim-row')
		//     $('.footerNotice').css('bottom', -$('.footerNotice').outerHeight())
		//   }
		// })
	}

	function toggle(className) {
		// 獲得 footerNotive 高並設定
		footerNoticeHeight = $(".footerNotice").outerHeight();

		// 點到已展開的就收起來
		if ($(".footer").hasClass(className)) {
			close();

			// 不是點到點到已展開的就展開
		} else {
			// 設定 footerNotice 的位置
			$(".footerNotice").css("bottom", className === "open_footerNotice" ? 0 : -footerNoticeHeight);

			// 無論是誰都展開自己
			$(".footer").removeClass(openStatuses);
			$(".footer").addClass(className);
		}
	}

	function close() {
		$(".footer").removeClass(openStatuses);
		$(".footerNotice").css("bottom", -footerNoticeHeight);
	}

	initFooterNotice();

	$(".footerBar__notice").on("click", function () {
		toggle("open_footerNotice");
	});

	$(".footerBar__info").on("click", function () {
		toggle("open_footerInfo");
	});

	$(".footer__close").on("click", function () {
		close();
	});
}

module.exports = footerBar;
