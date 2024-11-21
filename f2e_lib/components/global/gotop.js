export const init = (el, options) => {
	const $el = $(el);

	if ($el.length < 1) return;

	const opt = options || {};

	// 點擊回頂端功能
	function initScrollTop() {
		$el.on("click", function (event) {
			$("html, body").on("scroll mousedown wheel DOMMouseScroll mousewheel keydown touchstart", function () {
				$("html, body").stop();
			});

			// 預設 500 毫秒
			$("html, body").animate({ scrollTop: 0 }, opt.duration || 500);
			event.preventDefault();
		});
	}

	initScrollTop();

	// 如果 options 沒有 toggle 就不會有切換按鈕樣式的功能
	if (!opt.toggle) return;

	// 切換按鈕樣式
	function initToggleButtonStyle() {
		const $window = $(window);
		let timer;
		let comparePoint; // 比較點
		let changePoint; // 切換點
		let toggleTimeout; // 切換的 timeout
		let toggleDuration; // 漸出的時間
		let toggleTargetType; // 目標對象的類型(數字或selector)
		let $toggleTarget; // 留個位置給為selector的目標對象

		if (opt.toggle && opt.toggle.duration) {
			toggleDuration = opt.toggle.duration;
		}

		function toggleButtonStyle() {
			const isShow = $el.hasClass("scrolldown");

			if (comparePoint > changePoint && !isShow) {
				$el.addClass("scrolldown");
			} else if (comparePoint <= changePoint && isShow) {
				if (toggleDuration) {
					$el.addClass("fadeout");
					setTimeout(function () {
						$el.removeClass("fadeout scrolldown");
					}, toggleDuration);
				} else {
					$el.removeClass("scrolldown");
				}
			}
		}

		// window 有變更尺寸的時候重設
		function scrollListener() {
			$window.scroll(function () {
				if (toggleTargetType === "number") {
					comparePoint = $window.scrollTop();
				} else if (toggleTargetType === "selector") {
					comparePoint = $el.offset().top;
					changePoint = $toggleTarget.offset().top; // 如果畫面是動態生成會算成 0, 捲動的時候重設
				}

				clearTimeout(timer);
				timer = setTimeout(function () {
					toggleButtonStyle();
				}, toggleTimeout);
			});
		}

		// window 有變更尺寸的時候重設, 只有 toggleTargetType === 'selector' 的時候會觸發
		function resizeListener() {
			$window.resize(function () {
				comparePoint = $el.offset().top;
				changePoint = $toggleTarget.offset().top;

				toggleButtonStyle();
			});
		}

		// 有設定 toggleTarget 或剛好是 0 時執行
		if (opt.toggle && (opt.toggle.target || opt.toggle.target === 0)) {
			const toggleTarget = opt.toggle.target;

			toggleTimeout = opt.toggle && opt.toggle.timeout ? opt.toggle.timeout : 50;

			if (typeof toggleTarget === "number") {
				toggleTargetType = "number"; // 目標對象的類型設為數字
			} else if (typeof toggleTarget === "string") {
				toggleTargetType = "selector"; // 目標對象的類型設為 selector

				if ($(toggleTarget).length > 0) {
					// 設定目標對象
					$toggleTarget = $(toggleTarget);
				} else {
					// 沒選到目標對象的話給個 console
					console.error("Can not find the compare target, please check your selector.");
				}
			}

			if (toggleTargetType === "number") {
				comparePoint = $window.scrollTop(); // 比較點設為螢幕卷軸位置
				changePoint = toggleTarget; // 設定切換點
			} else if (toggleTargetType === "selector") {
				comparePoint = $el.offset().top; // 比較點設為 gotop 按鈕的 offset top 值
				changePoint = $toggleTarget.offset().top; // 切換點設為 toggleTarget 物件的 offset top 值
				resizeListener();
			}

			// 初始設定先跑一次
			toggleButtonStyle();

			// 捲動事件
			scrollListener();
		}
	}

	initToggleButtonStyle();
};

export const initButton = (prevEl, options, callback) => {
	const el = options && options.el ? options.el : ".gotop";
	const name = el.substr(1);

	let type;
	switch (el.substr(0, 1)) {
		case ".":
			type = "class";
			break;
		case "#":
			type = "id";
			break;
	}

	const btn = `<a ${type}="${name}" href="javascript:;"></a>`;

	$(prevEl).after(btn);

	// set options
	if (options && typeof options === "object") {
		init(el, options);
	} else {
		init(el);
	}

	// callback
	if (options && typeof options === "function") {
		options();
	} else if (callback && typeof callback === "function") {
		callback();
	}
};

// export default  {
//   init,
//   initButton
// }
