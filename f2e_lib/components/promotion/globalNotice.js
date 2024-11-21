const $el = $(".global-notice");

function globalNotice() {
	const $elContent = $(".global-notice__content");
	const defaultWidth = $el.width();
	const fullHeight = $el.outerHeight() + $elContent.outerHeight();
	const isRoot = /^\/(tw\/?)?(?:|index\.html?)$/i.test(window.location.pathname);
	const autoOpenDuration = 3000;

	if ($el.length < 1) {
	} else {
		init();
	}

	function openNotice() {
		$el.css({
			width: 190,
			height: fullHeight,
		});
	}

	function closeNotice() {
		$el.css({
			width: defaultWidth,
			height: 0,
		});
	}

	function autoOpen() {
		openNotice();

		setTimeout(function () {
			closeNotice();
		}, autoOpenDuration);
	}

	function init() {
		$el.hover(
			function () {
				// 滑鼠移上去就會打開喔
				openNotice();
			},
			function () {
				closeNotice();
			}
		);

		if (isRoot) {
			autoOpen();
		}
	}
}

function globalNoticeMobile() {
	const $closeBottom = $(".global-notice__mark");
	const $elUl = $(".global-notice__content > ul");
	const $elUlLi = $(".global-notice__content > ul > li");

	if ($elUlLi.length < 1) {
		$el.remove();
		return; // 如果什麼也沒有就直接return 順便刪了$('.global-notice')
	} else {
		init();
	}

	function init() {
		$closeBottom.html("✕");
		$closeBottom.click(function () {
			$(this).parent().remove();
		});

		$elUl.slick({
			dots: true,
			infinite: true,
			speed: 800,
			autoplay: true,
			fade: true,
			autoplaySpeed: 3000,
		});
	}
	$el.css("opacity", 1);
}

module.exports = {
	globalNotice: globalNotice,
	globalNoticeMobile: globalNoticeMobile,
};
