function zoombox(opt) {
	// 設定傳入的參數
	const imgArray = opt.images; // 所有圖片陣列
	const imgArrayOnError = opt.imagesOnError; // 大圖無法讀取時的圖片
	const tilting = opt.tilting; // 是否上下搖動
	const lastIndex = imgArray.length - 1;
	let index; // 當前圖片序號

	// 基本物件的設定
	const videoReg = /\.[mM][pP]4/;
	const $win = $(window);
	const $body = $("body");
	let $container = $("#zoombox");
	let $elm;

	// 顯示物件的資源參數
	let imageUrl;
	let source;
	let zbVideo;

	// 顯示物件的定位參數
	let winT;
	let elmW;
	let elmH;
	let panoH;
	let cy;
	let yPos;

	// 螢幕縮放時重新計算圖片/影片垂直及水平位置
	function resize() {
		elmW = $elm.width();
		elmH = $elm.height();
		panoH = $container.height();
		cy = (elmH - panoH) / panoH;
		$elm.css({
			top: -cy * yPos,
			"margin-left": -elmW / 2,
		});
	}

	// 定位設定
	function imgTilt(isImg) {
		// 清空 #zoombox 的滑鼠移動事件
		$container.off("mousemove");

		// 使用新的圖片/影片計算初始值
		// 切換時新的圖片/影片會在第一張
		winT = $win.scrollTop();
		$elm = $container.children().first();
		elmW = $elm.width();
		elmH = $elm.height();
		panoH = $container.height();
		cy = (elmH - panoH) / panoH;
		if (isImg && tilting) {
			// 如果是圖片且需要被上下搖動
			// 假如是點擊上下張按鈕的情形，yPos 已經設定過了
			// yPos 就維持原參數，如果還沒設定過使用傳入的 opt.pageY 計算
			// yPos = 鼠標在頁面中 y 軸的位置 - 頁面捲動的高度
			yPos = yPos || opt.yPos;
			$elm.css({
				top: -cy * yPos,
				left: "50%",
				"margin-left": -elmW / 2,
			});

			// 綁定滑鼠移動事件
			// 滑鼠移動時重新計算圖片垂直位置
			$container.on("mousemove", (event) => {
				yPos = event.pageY - winT;
				$elm.css("top", -cy * yPos);
			});
		} else {
			// 如果不是圖片或不需要被上下搖動
			// 但仍持續更新 yPos，避免回到圖片後的跳動
			// 設定圖片/影片垂直水平置中
			$container.on("mousemove", (event) => {
				yPos = event.pageY - winT;
			});

			$elm.css({
				top: "50%",
				left: "50%",
				"margin-top": -elmH / 2,
				"margin-left": -elmW / 2,
			});
		}

		// 設定完定位後淡入新的圖片/影片
		$elm.animate({ opacity: 1 }, 600);
	}

	function showImage(i) {
		// 設定要顯示的是陣列中 index 為 i 的圖片/影片
		imageUrl = imgArray[i];

		// 若沒有要顯示的圖片/影片就關閉 zoombox
		if (!imageUrl) {
			closeZoombox();
			return;
		}

		// 淡出並移除 zoombox 中原來的圖片/影片
		$container.children("img, video").fadeOut(600, function () {
			$(this).remove();
		});

		// 判斷為圖片/影片
		if (!videoReg.test(imageUrl)) {
			// 一般圖片
			// 建立一個圖片物件檢查圖片是否存在
			// 圖片順利載入後加到 #zoombox 的最前面
			// 圖片加入後設定放大圖片定位
			// imgTilt 傳入的 true 代表是圖片
			const newImage = new Image();
			newImage.src = imageUrl;
			newImage.onload = () => {
				$(newImage).css("opacity", 0).prependTo($container);
				imgTilt(true);
			};
			newImage.onerror = () => {
				// 建立一個圖片物件檢查 onerror 圖片是否存在
				// 404 圖片使用順序: opt.imagesOnError -> opt.imgPlaceholder -> nowBrand.imagePlaceholder.default
				// 如果仍找不到圖片就依序使用下一個設定
				// 建議至少要設定 nowBrand.imagePlaceholder.default
				// 當 onerror 的圖片順利載入後，重新設定 newImage 的 src
				const errorImage = new Image();
				errorImage.src = imgArrayOnError ? imgArrayOnError[i] : opt.imgPlaceholder || nowBrand.imagePlaceholder.default;
				errorImage.onerror = () => {
					newImage.src = opt.imgPlaceholder || nowBrand.imagePlaceholder.default;
				};
				errorImage.onload = () => {
					newImage.src = errorImage.src;
				};
			};
		} else {
			// 影片
			// 用 jQuery 比較好操作 video 物件的 css 跟 id
			// 建立一個影片物件
			// 影片設定後加到 #zoombox 的最前面
			// video 標籤的資源讀完後才有辦法抓到影片的高度
			// 所以在資源讀完以後再設定定位
			// imgTilt 傳入的 false 代表是影片
			source = document.createElement("source");
			source.type = "video/mp4";
			source.src = imageUrl;

			$elm = $(document.createElement("video"));
			$elm
				.attr("autoplay", true)
				.attr("loop", true)
				.attr("width", "100%")
				.attr("id", "zb-video")
				.attr("class", "video-js vjs-default-skin")
				.css("opacity", 0)
				.append(source)
				.prependTo($container);

			zbVideo = document.getElementById("zb-video");
			zbVideo.onloadeddata = () => {
				imgTilt(false);
			};
		}
	}

	function showButton(i) {
		i === 0 ? $container.find(".prev").fadeOut() : $container.find(".prev").fadeIn();

		i === lastIndex ? $container.find(".next").fadeOut() : $container.find(".next").fadeIn();
	}

	function createZoombox() {
		const content =
			'<div id="zoombox">' +
			'<a class="prev" href="javascript:;">PREV</a>' +
			'<a class="next" href="javascript:;">NEXT</a>' +
			'<a class="btn-close btn-close--bigger" href="javascript:;">CLOSE</a>' +
			"</div>";

		$container = $(content);

		// 設定初始按鈕樣式
		index === 0 && $container.find(".prev").hide();
		index === lastIndex && $container.find(".next").hide();

		// 如果有自訂的 class 加到 #zoombox 上
		opt.zbClass && $container.addClass(opt.zbClass);

		return $container;
	}

	function showZoombox() {
		$container.fadeIn(400);
		showImage(index);
		showButton(index);

		// 綁定螢幕縮放事件
		$win.on("resize.zoombox", resize);
	}

	function closeZoombox() {
		// 關閉 #zoombox 後移除所有相關物件、綁定、設定
		$win.off("resize.zoombox");
		$body.removeClass("hasoverlay");

		// 移除前先微調一下圖片訂位
		$elm.css("margin-left", -$elm.width() / 2);
		$container.fadeOut(400, () => {
			$container.remove();
		});
	}

	function onkeydown(event) {
		switch (event.keyCode) {
			case 27: // Esc
				closeZoombox();
				break;
			case 37: // 右箭頭，沒顯示的話不點
				index !== 0 && $container.find(".prev").click();
				break;
			case 39: // 左箭頭，沒顯示的話不點
				index !== lastIndex && $container.find(".next").click();
				break;
		}
	}

	const init = () => {
		index = opt.index;

		// body 加上 class 'hasoverlay' 來鎖定頁面
		$body.addClass("hasoverlay");

		createZoombox().appendTo("body");
		showZoombox();

		// 點擊 #zoombox 關閉自己
		// 除非是點到上/下張
		$container.on("click", closeZoombox);
		$container.find(".next").on("click", (event) => {
			index++;
			showImage(index);
			showButton(index);
			event.preventDefault();
			event.stopPropagation();
		});
		$container.find(".prev").on("click", (event) => {
			index--;
			showImage(index);
			showButton(index);
			event.preventDefault();
			event.stopPropagation();
		});

		// 設定 Esc, 左右箭頭按鍵事件
		$body.on("keydown", onkeydown);
	};

	// 呼叫 zoombox 時直接執行 init
	return init();
}

export default zoombox;
