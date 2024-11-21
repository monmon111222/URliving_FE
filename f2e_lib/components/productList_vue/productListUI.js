var cssLazyloadName = "js-loaded";

function changeColumn(colType, NowMyStorage, callback) {
	// 更改雙列三列
	var $itemList = $(".item-list, .list-content");
	var $btnCol;
	var $win = $(window);

	if (colType === "2col") {
		$itemList.addClass("item-list--2col");
		$btnCol = $(".list-options__btn-2col, .list-content .btn-2col");
	} else {
		$itemList.removeClass("item-list--2col");
		$btnCol = $(".list-options__btn-3col, .list-content .btn-multi");
	}

	$btnCol.addClass("active").siblings().removeClass("active");

	if (nowBrand.stickyListMenu) {
		setMainHeight();
	}

	if (NowMyStorage) {
		window.localStorage.setItem("columnStatus", colType);
	}

	$win.onScreen("remove");
	$(".item__images, .items__image").removeClass(cssLazyloadName);

	if (callback && typeof callback === "function") callback();
}

function initChangeColumn(NowMyStorage) {
	$(".list-options__column, .list-options__views").on("click", "a", function (event) {
		var $this = $(this);
		let newColType = $this.data("column");

		if ($this.parent().hasClass("active")) return;

		changeColumn(newColType, NowMyStorage, function () {
			if (nowBrand.globalConfig.id !== "pazzo") {
				lazyload(newColType);
			}
		});
	});
}

function lazyload(type) {
	$(".item__images, .items__image").onScreen({
		doIn: function () {
			var $this = $(this);
			var $img = $this.find("img");
			var src;

			if ($this.hasClass(cssLazyloadName)) return;

			src = type === "2col" || type === "single" ? $img.data("lazy") : $img.data("lazy-s");

			$img.load(function () {
				setTimeout(function () {
					$this.addClass(cssLazyloadName);
				}, 20);
			});

			$img.attr("src", src);

			if ($img.get(0).complete) {
				$img.trigger("load");
			} else {
				$(window).trigger("checkImg", { target: $img });
			}
		},
	});
}

/*
function setMaxHeight () {
  var $productList = $('#product-list')
  var menuHeight = $('.product-menu').height()
  var contentHeight = $('.product-content').height()

  $productList.css('min-height', (menuHeight > contentHeight) ? menuHeight : contentHeight)
}
*/

function setMainHeight() {
	var $main = $(".main");
	var menuHeight = $(".product-menu").height();
	var contentHeight = $(".product-content").height();

	$main.css("height", menuHeight > contentHeight ? menuHeight : contentHeight);

	$(window).resize(function (event) {
		menuHeight = $(".product-menu").height();
		contentHeight = $(".product-content").height();
		$main.css("height", menuHeight > contentHeight ? menuHeight : contentHeight);
	});
}

function setMainMinHeight(target) {
	const $target = target ? $(target) : $(".main");
	$target.css("min-height", $(".product-menu").height() + 100);
}

function currentCategory() {
	const pathName = global.location.pathname;
	const pathSearch = global.location.search;
	const nowPath = pathSearch ? pathName + pathSearch : pathName;
	$('.product-menu a[href="' + nowPath + '"]')
		.parent()
		.addClass("active");
}

function cloneMenu() {
	const $newlist = $(".ALLITEM_list").clone().removeClass();
	$newlist.appendTo("#sidebar_left").wrap('<div class="product-menu"></div>');

	$(window).trigger("fixSidebar");
}

module.exports = {
	changeColumn: changeColumn,
	initChangeColumn: initChangeColumn,
	lazyload: lazyload,
	setMainHeight: setMainHeight,
	setMainMinHeight: setMainMinHeight,
	currentCategory: currentCategory,
	cloneMenu: cloneMenu,
};
