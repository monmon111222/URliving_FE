import slick from "@global/vendors/slick";
import AOS from "aos";

const initSlick = function () {
	var allSlickBox = $(".slick");

	const slickDef = {
		autoplay: true,
		Speed: 300,
		autoplaySpeed: 3000,
		dots: false,
		pauseOnHover: false,
		fade: true,
		arrows: false,
		vertical: false,
	};

	for (let i = 0; i < allSlickBox.length; i++) {
		var $slicEq = $(".slick").eq(i);

		var userDef = {
			// 使用者的設定參數 由HTML ATTR來
			slidestoshow: parseInt($slicEq.attr("slidestoshow")) || 1,
			slidestoscroll: parseInt($slicEq.attr("slidestoscroll")) || 1,
			fade: !!($slicEq.attr("fade") === undefined || $slicEq.attr("fade") === true),
			dots: $slicEq.attr("dots") !== undefined,
			arrows: $slicEq.attr("arrows") !== undefined,
			autoplaySpeed: parseInt($slicEq.attr("autoplaySpeed")) || 3000,
			Speed: parseInt($slicEq.attr("speed")) || 300,
			vertical: $slicEq.attr("vertical") !== undefined,
		};

		var slickConfig = $.extend(slickDef, userDef);
		$slicEq.slick(slickConfig);
	}
	// IG box
	if ($("#IGbox").length === 1) {
		$(".home-IG__slider").slick({
			dots: false,
			speed: 2000,
			slidesToShow: 5,
			slidesToScroll: 5,
			autoplay: false,
			pauseOnHover: false,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
						infinite: true,
						dots: true,
					},
				},
				{
					breakpoint: 600,
					settings: "unslick",
				},
			],
		});
	}
};

const transitionEffects = function () {
	setTimeout(() => {
		// 設定進場動畫
		AOS.init({
			easing: "ease-in-out-sine",
			delay: 400,
			duration: 800,
		});
	}, 1000);
	// 載入完畢
	setTimeout(function () {
		$("#home-content-women").trigger("homeSliderLoaded");
	}, 10);
};

export default { initSlick: initSlick, transitionEffects: transitionEffects };
