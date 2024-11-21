var NowMyEquipment = nowEnv.NowMyEquipment;

function eventPanel() {
	var $eventPanel = $(".event-panel");
	var $btnToggle = $eventPanel.find(".event-panel__toggle");
	var $btnClose = $eventPanel.find(".event-panel__close");
	var $slider = $eventPanel.find(".event-panel__events");
	var cssClass = "js-close";

	// console.log($slider.children().length)
	if ($slider.children().length === 0) {
		$eventPanel.remove();
		return;
	}

	function showPanel() {
		$eventPanel.removeClass(cssClass);
	}

	function hidePanel() {
		$eventPanel.addClass(cssClass);
	}

	function togglePanel(isClose) {
		isClose = $eventPanel.hasClass(cssClass);

		if (isClose) {
			showPanel();
		} else {
			hidePanel();
		}
	}

	if (NowMyEquipment) {
		// 如果是手機版請跑這裡
		$eventPanel.insertAfter(".secnav-right");
		$slider.slick({
			/* autoplay: true, */
			arrows: false,
			dots: true,
		});
		$eventPanel.css("opacity", 1);

		$btnClose.on("click", function (event) {
			event.preventDefault();
			$slider.slick("unslick");
			$btnClose.off("click");
			$eventPanel.remove();
		});
	} else {
		$btnToggle.on("click", function (event) {
			event.preventDefault();
			togglePanel();
		});

		setTimeout(function () {
			$btnToggle.click();
		}, 3000);

		// 一種關閉的方法用滑出的
		$eventPanel.mouseout(function (e) {
			e.stopPropagation();
			hidePanel();
		});

		// 一種打開的方法用滑入的
		$eventPanel.mouseover(function (e) {
			e.stopPropagation();
			showPanel();
		});

		// 整個關了
		$btnClose.on("click", function (event) {
			event.preventDefault();
			$slider.slick("unslick");
			$btnToggle.off("click");
			$btnClose.off("click");
			$eventPanel.remove();
		});

		$slider.slick({
			slidesToShow: 2,
			slidesToScroll: 2,
			vertical: true,
			autoplay: true,
		});
	}
}

module.exports = eventPanel;
