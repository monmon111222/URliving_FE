import modal from "bootstrap/js/dist/modal";
import superslides from "@global/vendors/jquery.superslides.min";
import Hammer from "@global/vendors/hammer.min";

const banner = (isopen, data) => {
	if (!isopen) return;
	var $fullSlide = $(".full-banner");
	var fullBanner = function () {
		$fullSlide.on("init.slides", function () {
			var $slide = $(this);
			$slide.fadeIn();
			var firstSlide = $slide.find(".slides-container > li")[0];
			var firstVid = $(firstSlide).find("video")[0];
			if ($(firstVid).length) {
				$(firstVid)[0].oncanplaythrough = $(firstVid)[0].play();
			}
		});

		$fullSlide.superslides({ animation: "fade", play: data.fullbanner.play || 3000 });

		$fullSlide.on("animated.slides", function () {
			playVideo($(this));
		});

		function playVideo($slide) {
			var currentSlideIndex = $slide.superslides("current");
			var currentSlide = $slide.find(".slides-container > li")[currentSlideIndex];
			// pause all videos
			$slide.find("video").each(function () {
				this.pause();
			});
			// if there is a video on current slide, play it
			var currentVid = $(currentSlide).find("video")[0];
			if ($(currentVid).length) {
				$(currentVid)[0].oncanplaythrough = $(currentVid)[0].play();
			}
		}

		//Swipe event listeners with actions
		if ($fullSlide.length) {
			var myElement = $fullSlide.get(0);
			var mc = new Hammer(myElement);
			// listen to events...
			mc.on("swipeleft", function (ev) {
				$fullSlide.data("superslides").animate("next");
			});
			mc.on("swiperight", function (ev) {
				$fullSlide.data("superslides").animate("prev");
			});
		}
	};

	setTimeout(() => {
		$fullSlide.css("opacity", "1");
		new fullBanner();
	}, 50);

	var slideWrapper = $(".big-banner");

	slideWrapper.on("init", function (event, slick) {
		slick = $(slick.$slider);
		playPauseVideo(slick, "play");
	});

	slideWrapper.slick(data.opts);

	function playPauseVideo(slick, control) {
		var currentSlide, video;

		currentSlide = slick.find(".slick-current");

		video = currentSlide.find("video")[0];

		if (video != null) {
			if (control === "play") {
				$(video)[0].play();
			} else {
				$(video)[0].pause();
			}
		}
	}

	slideWrapper.on("beforeChange", function (event, slick) {
		slick = $(slick.$slider);
		playPauseVideo(slick, "pause");
	});
	slideWrapper.on("afterChange", function (event, slick) {
		slick = $(slick.$slider);
		playPauseVideo(slick, "play");
	});

	// console.log(opts)

	// 方形倫波
	$(".square-slide").each(function () {
		const $el = $(this);
		const defaultSquareOpts = {
			infinite: true,
			slidesToShow: 5,
			slidesToScroll: 5,
			dots: false,
			arrows: true,
			speed: 800,
			prevArrow: $el.parents(".square-slide-wrap").find(".square-slide-arrow-left"),
			nextArrow: $el.parents(".square-slide-wrap").find(".square-slide-arrow-right"),
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
						arrows: false,
					},
				},
				{
					breakpoint: 415,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: false,
						centerMode: true,
						dots: false,
					},
				},
			],
		};
		$el.slick(data.squareOpts || defaultSquareOpts);
	});
};

const popup = (isopen, showOnce) => {
	if (!isopen) return;

	let popupShowOnce = showOnce || true;
	// index popup show
	function popupShow() {
		var popup_array = [];
		if ($(".index-popup").length === 0) return;

		$(".index-popup").each(function (index, el) {
			popup_array.push({ name: "popupIndex" + $(el).data("key"), key: $(el).data("key") });
		});

		popup_array.forEach(function (element, index) {
			if (showOnce) {
				var cookie = getCookie(element.name);
				if (cookie == undefined || cookie == "") {
					setCookie(element.name, "OpenEvent", 1);
					$('.index-popup[data-key="' + element.key + '"]').modal("show");
				}
			} else {
				$('.index-popup[data-key="' + element.key + '"]').modal("show");
			}
		});
	}
	popupShow();

	//  set cookie
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
};

const globalLayout = (obj) => {
	banner(obj.banner.isopen, obj.banner);
	popup(obj.popupOpen, obj.popupShowOnce);
};

export default globalLayout;
