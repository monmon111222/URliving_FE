const hashAccordion = (elm) => {
	const $container = $(elm || ".accordion");

	if ($container.length < 1) return;

	// get hash and open/close the target element,
	// if it is not in the screen, scroll window
	const $win = $(window);

	$win.on("hashchange", function () {
		const hash = window.location.hash;
		const $target = $container.find(`a[href='${hash}']`);
		const winOffset = $win.scrollTop();
		const winHeight = $win.height();
		let targetOffset;

		if (!$target.length) {
			// if target does not exit, close all content
			$container.find("li").removeClass("open").find(".accordion__content").slideUp();
		} else {
			// if target exits, open it, and if not in screen, scroll window
			targetOffset = parseInt($target.offset().top);

			if (targetOffset < winOffset || targetOffset > winOffset + winHeight) {
				$("html, body").animate(
					{
						scrollTop: targetOffset - $(".header").outerHeight(),
					},
					300
				);
			}

			$target
				.next()
				.slideDown()
				.parent()
				.addClass("open")
				.siblings()
				.removeClass("open")
				.find(".accordion__content")
				.slideUp();
		}
	});

	// if click the same content title, clear hash and trigger event to close it
	$container.on("click", ".accordion__title", function (event) {
		if ($(this).parent().hasClass("open")) {
			window.location.hash = "";
			$win.trigger("hashchange");
			event.preventDefault();
		}
	});

	if (window.location.hash) {
		// trigger event when open page
		$win.trigger("hashchange");
	} else {
		window.location.hash = $(".accordion__title").eq(0).attr("href");
		$win.trigger("hashchange");
	}
};

export default hashAccordion;
