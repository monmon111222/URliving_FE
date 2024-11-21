var NowMyEquipment = nowEnv.NowMyEquipment;

function corpPage() {
	if (NowMyEquipment) {
		// 卷軸
		$(".corp-menu > h3").next("ul").wrap('<div class="nanoscroll"></div>');

		$(".nanoscroll > ul").wrap('<div class="nanoscroll__content"></div>');

		setTimeout(function () {
			$(".nanoscroll").nanoScroller({
				contentClass: "nanoscroll__content",
				alwaysVisible: true,
			});
			// 開開關關
			$(".corp-menu > h3").on("click tough", function () {
				$(".nanoscroll").toggleClass("open");
			});
		});
		// 在HowToBuy單元拿掉ABOUT PAZZO連結，反之
		if (/HowToBuy/.test(window.location.pathname.split("/")[2])) {
			$("h3").has("a").remove();
		}
		if (/AboutPazzo/.test(window.location.pathname.split("/")[2])) {
			$("h3").has("a").next("h3").remove();
		}
	}
	function replaceTitle() {
		const $corp = $(".corp-menu, .corp-content");
		const $list = $(".corp-menu li a");
		$list.each(function () {
			const text = this.text.trim();
			const newText = $(".main").hasClass("mag") ? text : text.substr(3, text.length);

			if ($(".main").hasClass("mag")) {
				$(this)
					.addClass("has-cate")
					.html('<span class="mag-icon"></span>' + newText);
			} else {
				if (text.indexOf("贈品-") === 0) {
					$(this)
						.addClass("has-cate")
						.html('<span class="gift-icon"></span>' + newText);
				} else if (text.indexOf("公告-") === 0) {
					$(this)
						.addClass("has-cate")
						.html('<span class="post-icon"></span>' + newText);
				}
			}
		});
		$corp.fadeIn();
	}
	replaceTitle();

	if ($(".main").hasClass("mag")) {
		$(".corp-menu>ul>li>a").click(function (e) {
			e.preventDefault();
			$(this).siblings("ul").slideToggle();
		});
		var nowUrl = window.location.href;
		if (nowUrl.indexOf("mag?id") === -1) {
			// 3  .  4  .  5  .  8
			var index;
			switch (window.CategoryId) {
				case 3:
					index = 0;
					break;
				case 4:
					index = 1;
				case 5:
					index = 2;
				case 8:
					index = 3;
					break;
				default:
					index = 0;
			}
			$(".corp-menu>ul>li").eq(index).find("ul").slideDown();
		} else {
			let $list2 = $(".corp-menu ul li ul li a");
			$list2.each(function () {
				let href = $(this).attr("href");
				if (nowUrl.indexOf(href) !== -1) {
					$(this).parents("li").addClass("now");
					$(this).parents("ul").slideDown();
				}
			});
		}
	}

	$(window).trigger("checkImg", {
		type: "hidden",
		target: ".corp-content",
	});
}

export default corpPage;
