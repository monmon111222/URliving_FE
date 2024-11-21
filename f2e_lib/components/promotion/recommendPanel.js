import _ from "vendors/lodash";
import Handlebars from "handlebars";
import gotop from "components/global/gotop";
import preloadimages from "helpers/preloadimages";
var fs = require("fs");

// 今日看了什麼商品

function RecommendPanel(options) {
	if (!navigator.cookieEnabled) {
		// 被禁止cooike的情況
		// console.log('Local storage not supported!')
		return;
	} else {
		var storage = window.localStorage;
		var storageName = "TodayViews";
		var todayViewsData;
		var todayViewsImage;
		var todayViewType;

		init();
	}

	// ios has bug in private mode
	// in private mode, set localStorage will cause error
	/*
  function detectLocalStorageSupport () {
    var testKey = 'pztest'

    try {
      storage.setItem(testKey, '1')
      storage.removeItem(testKey)
      return true
    } catch (error) {
      return false
    }
  }
  */

	function getTodayViewsData() {
		var initData = {
			expire: "",
			viewList: [],
		};
		var data = {};

		try {
			data = JSON.parse(storage.getItem(storageName)) || initData;
		} catch (error) {
			// console.log('Data can not parse. Refresh today view data')
			data = initData;
		}

		if (data.expire && isTimeExpired(data.expire)) {
			data = initData;
		}

		return data;
	}

	function isTimeExpired(time) {
		var timeLimit = 1000 * 60 * 60 * 24;
		var newTime = new Date().getTime();
		var pasedTime = parseInt(newTime, 10) - parseInt(time, 10);

		if (pasedTime > timeLimit) {
			return true;
		} else {
			return false;
		}
	}

	function addTodayViews(pid) {
		var newViews = todayViewsData.viewList.slice(0);
		var isAdded = _.indexOf(newViews, pid);
		var newData = "";

		if (isAdded >= 0) return;

		newViews.push(pid);

		if (newViews.length > 10) {
			newViews.shift();
		}

		newData = JSON.stringify({
			expire: new Date().getTime(),
			viewList: newViews,
		});

		storage.setItem(storageName, newData);
	}

	function getTodyViewsImage(pidArray, callback) {
		// if no data, just return empty images.
		if (pidArray.length === 0) {
			todayViewsImage = fillTodayViewImage([]);
			callback(_.pluck(todayViewsImage, "imgurl"));
			return;
		}

		var postData = pidArray.join();

		$.ajax({
			url: nowBrand.constants.todayViewImg,
			type: nowBrand.constants.todayViewImgType,
			data: { barcode: postData },
			dataType: "json",
		})
			.done(function (data) {
				var imgArr = [];

				todayViewsImage = data.reverse();

				if (todayViewsImage.length < 10) {
					todayViewsImage = fillTodayViewImage(todayViewsImage);
				}

				imgArr = _.pluck(todayViewsImage, "imgurl");

				callback(imgArr);
			})
			.fail(function () {
				// console.log('Can not connect to server.')
			});
	}

	function fillTodayViewImage(imgArr) {
		var newImgArr = [];
		var blankImgUrl;
		var basicCols = 5;
		var newCols = Math.ceil(imgArr.length / basicCols) * basicCols;

		if (todayViewType === "global") {
			blankImgUrl = "/img/img-blank-photo-s.png";
		} else if (todayViewType === "pdpage") {
			blankImgUrl = "/img/img-blank-photo.png";
		}

		for (let i = 0; i < newCols; i++) {
			if (imgArr[i]) {
				newImgArr[i] = imgArr[i];
			} else {
				newImgArr[i] = {
					imgurl: blankImgUrl,
				};
			}
		}

		return newImgArr;
	}

	function initTodayView(target) {
		todayViewType = "global";

		getTodyViewsImage(todayViewsData.viewList, function (imgArr) {
			preloadimages(imgArr).done(function () {
				var RecommendPanel;

				if (nowBrand.recommendPanelConfig.gotopType === "zh") {
					RecommendPanel = fs.readFileSync("f2e_lib/components/promotion/RecommendPanel_zh.hbs", "utf8");
				} else if (nowBrand.recommendPanelConfig.gotopType === "en") {
					RecommendPanel = fs.readFileSync("f2e_lib/components/promotion/RecommendPanel_en.hbs", "utf8");
				}

				var template = Handlebars.compile(RecommendPanel); // 這一塊是前端組出來的
				var markup = template(todayViewsImage);

				$(target).after(markup);

				$(".recommend__slider").slick({
					slidesToShow: 2,
					slidesToScroll: 2,
					vertical: true,
				});

				$(".recommend__title").on("click", function (event) {
					var $target = $(this).parent();
					var cssName = "js-close";

					if ($target.hasClass(cssName)) {
						$target.removeClass(cssName);
					} else {
						$target.addClass(cssName);
					}
				});

				gotop.init(".recommend__gotop");

				// fix safari do not show slider correctly.
				var isSafari = navigator.userAgent.indexOf("Safari") > -1;
				if (isSafari) {
					$(window).resize();
				}
			});
		});
	}

	function initPdpageTodayView(target) {
		todayViewType = "pdpage";

		getTodyViewsImage(todayViewsData.viewList, function (imgArr) {
			preloadimages(imgArr).done(function () {
				var RecommendPanelPdPage = fs.readFileSync("f2e_lib/components/promotion/RecommendPanelPdPage.hbs", "utf8");
				var template = Handlebars.compile(RecommendPanelPdPage);
				var markup = template(todayViewsImage);

				$(target).append(markup);

				$(".product-photos__todayview .product-photos__slider").slick({
					autoplaySpeed: 4000,
					speed: 500,
					slidesToShow: 5,
					slidesToScroll: 5,
					pauseOnHover: false,
					arrows: true,
				});
			});
		});
	}

	function init() {
		todayViewsData = getTodayViewsData();
	}

	return {
		addTodayViews: addTodayViews,
		initTodayView: initTodayView,
		initPdpageTodayView: initPdpageTodayView,
	};
}

module.exports = RecommendPanel;
