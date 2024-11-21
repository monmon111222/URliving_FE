function navDesktop() {
	// 登入按鈕顯示
	function tabStatus() {
		if (nowEnv.NowIsLogin) {
			$("li.secnav-right__signin").remove();
		} else {
			$("li.secnav-right__signout, li.secnav-right__mypazzo").remove();
		}
	}

	tabStatus();
}

function subnavDesktop() {
	const SubMenu = function (el) {
		this.el = el;
	};

	SubMenu.prototype.init = function () {
		const closeTimeout = this.closeTimeout || 600;
		const el = this.el;
		const $el = $(el);

		let isDrag = 0;
		let isEnter = 0;
		let timerIn = 0;
		let timerOut = 0;

		$el.parent().hover(
			function () {
				const $that = $(this);

				isEnter = 1;
				if (isDrag === 0) {
					$that.siblings().find(el).removeClass("open");
				}
				clearTimeout(timerOut);
				timerIn = setTimeout(function () {
					$that.find(el).addClass("open");
				}, 150);
			},
			function () {
				const $that = $(this);

				isEnter = 0;

				clearTimeout(timerIn);
				timerOut = setTimeout(function () {
					if (isDrag === 0) {
						$that.find(el).removeClass("open");
					}
				}, closeTimeout);
			}
		);

		if (document.addEventListener) {
			document.addEventListener(
				"mousedown",
				function (e) {
					if (e.target.className === "slider") {
						isDrag = 1;
						$(this).addClass("dragging");
						$(document).one("mouseup", function () {
							if (isEnter === 0) {
								timerOut = setTimeout(function () {
									$el.removeClass("open");
								}, 1000);
							}
							isDrag = 0;
						});
					}
				},
				true
			);
		}
	};

	// 會員中心 & 迷你購物車
	const subnav = new SubMenu(".subnav");
	subnav.init();

	// nav 的次選單
	function NavSubmenu(el) {
		this.closeTimeout = 150;
		SubMenu.call(this, el);
	}

	NavSubmenu.prototype = Object.create(SubMenu.prototype);
	NavSubmenu.prototype.constructor = NavSubmenu;
	NavSubmenu.prototype.parentToggleClass = function () {
		const $el = $(this.el);
		const $parent = $el.siblings("a");
		const closeTimeout = this.closeTimeout;

		$el.add($parent).hover(
			function () {
				$parent.addClass("focus");
			},
			function () {
				setTimeout(function () {
					// 等 timeout 過後判斷是否還開著
					if (!$el.hasClass("open")) {
						$parent.removeClass("focus");
					}
				}, closeTimeout + 30);
			}
		);
	};

	const navSubmenu = new NavSubmenu(".nav__submenu");

	navSubmenu.init();
	navSubmenu.parentToggleClass();
}

function navMobile() {
	const headerFixedCss = "js-headerShow";

	let $allList = $(".ALLITEM_list, ul.more_list, ul.member_list");

	function resetNav() {
		// 搬移修正手機定位bug
		$(".header").append($(".nav"));
		$(".header").after($(".secnav"));
		$(".footer").before($(".footerInfo"));

		// 移動A列表
		$(".nav .A ul").addClass("A_list");
		$(".ALLITEM_list").after($(".nav .A ul"));
		$allList = $allList.add($(".A_list"));
	}

	function fixedHeader() {
		const $window = $(window);
		const headerHeight = 91;
		let p;
		let t;
		let listShow;

		$window.scroll(function () {
			p = $(this).scrollTop();

			if (p >= t && listShow === 0) {
				// 下滑且列表都沒有顯示時
				$("body").removeClass(headerFixedCss);
			} else if (p > headerHeight) {
				// 上滑且卷軸超過 header 高
				$("body").addClass(headerFixedCss);
			}

			setTimeout(function () {
				listShow = $allList.filter(":visible").length;
				// 避免關閉列表時立刻判斷成列表沒有顯示而觸發隱藏 header 事件
				t = p;
			}, 0);
		});
	}

	function topLevel() {
		// 第一層開關
		const categoryButton = ".ALLITEM > a";
		const aButton = ".nav .A > a, .nav .A > a > span";
		const memberButton = ".secnav-right__mypazzo > a, .secnav-right__mypazzo > a > span";
		const moreButton = ".secnav-right__more > a, .secnav-right__more > a > span";
		const $allListButton = $(categoryButton).add($(aButton)).add($(memberButton)).add($(moreButton));
		let winScrollTop;
		let listShow;

		$allListButton.on("click", function (e, target) {
			e.preventDefault();

			listShow = $allList.filter(":visible").length;

			$(".subnav_mobile").removeClass("open"); // 關閉社群列表
			$("body").addClass(headerFixedCss); // 顯示 header

			// 判斷 target
			if ($(e.target).is(categoryButton)) {
				target = ".ALLITEM_list";
			} else if ($(e.target).is(aButton)) {
				target = ".A_list";
			} else if ($(e.target).is(memberButton)) {
				target = ".member_list";
			} else if ($(e.target).is(moreButton)) {
				target = ".more_list";
			}

			// 如果所有列表都還沒開就記錄卷軸位置
			if (listShow === 0) {
				winScrollTop = $(window).scrollTop();
			}

			// 如果自己沒開表示正要執行打開動作
			if ($(target).filter(":visible").length === 0) {
				$(".wrap").addClass("disappear"); // 避免重新 loading 造成畫面閃爍，使用css控制
				$(target).slideDown();
				$allList.not(target).slideUp(); // 除了自己以外的都hide吧
				$(window).scrollTop(0);

				listShow = $allList.filter(":visible").length;
			} else {
				// 自己已經開了
				$(".wrap").removeClass("disappear");
				$(target).hide();
				$(window).scrollTop(winScrollTop);

				setTimeout(function () {
					listShow = $allList.filter(":visible").length;
					// 避免關閉列表時立刻判斷成列表沒有顯示而觸發隱藏 header 事件
				}, 0);
			}

			// more跟member可能target為span，需阻止事件冒泡
			e.stopPropagation();
		});

		// 有子層時增加 className 'open'
		const $allListLi = $allList.find("li");
		for (var i = 0; i < $allListLi.length; i++) {
			if ($allListLi.eq(i).children("ul").length > 0) {
				$allListLi.children("a").eq(i).addClass("open");
			}
		}
	}

	// 社群由 subnavMobile() 控制

	function subLevel() {
		// 子層開關
		const $allListSubButton = $allList.find("a");
		$allListSubButton.on("click touch", function (e) {
			// 有子層才會跑
			if ($(this).next("ul").children("li").length > 0) {
				e.preventDefault();
				$(this).next("ul").slideToggle();
				$(this).toggleClass("close");
			}
		});

		// 預設打開第二個
		$(".more_list > li:nth-child(2) > a").click();
	}

	// 登入按鈕顯示
	function tabStatus() {
		$("li.secnav-right__signout").remove();
		if (nowEnv.NowIsLogin) {
			$("li.secnav-right__signin").remove();
		} else {
			$("li.secnav-right__mypazzo").remove();
		}
	}

	if ($(".header").length > 0) {
		resetNav();
		fixedHeader();
		topLevel();
		subLevel();
		tabStatus();
	}
}

function subnavMobile() {
	const $el = $(".subnav_mobile");

	$el.siblings("a").on("click", function () {
		$(this).siblings(".subnav_mobile").toggleClass("open");
	});

	$el.find(".clossFollow").on("click", function () {
		$(this).parent(".subnav_mobile").toggleClass("open");
	});
}

function globalSearch(searchbox) {
	var $el = $(searchbox);
	var $form = $el.children("form");
	var $input = $form.find(":text");

	$(searchbox).on("click", function (event) {
		event.stopPropagation();
	});

	$form.find("label").on("click", function (event) {
		event.preventDefault();

		if (!$el.hasClass("js-open")) {
			$el.addClass("js-open");
		} else {
			$el.removeClass("js-open");
			$el.addClass("js-hiding");
			setTimeout(function () {
				$el.removeClass("js-hiding");
			}, 500);
		}

		setTimeout(function () {
			$input.focus();
		}, 300);

		$(window).one("click", function () {
			$el.removeClass("js-open");
			$el.addClass("js-hiding");
			setTimeout(function () {
				$el.removeClass("js-hiding");
			}, 500);
		});
	});

	$form.find(".global-search__btn").on("click", function (event) {
		event.preventDefault();
		// $form.trigger('submit')
		window.location.href = "/search?Keyword=" + $("#global-search").val();
	});

	$input.on("keydown", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
		}
	});

	$input.on("keyup", function (event) {
		if (event.keyCode === 13) {
			window.location.href = "/search?Keyword=" + $("#global-search").val();
		}
	});

	$form.on("submit", function (event) {
		var text = $input.val();

		$input.blur();

		if (text === "") {
			nowBrand.alert("請輸入文字", "貼心提醒");
			event.preventDefault();
		} else if (text.length < 2) {
			nowBrand.alert("尋找商品至少要二個字以上哦！", "貼心提醒");
			event.preventDefault();
		}
	});
}

export default {
	navDesktop: navDesktop,
	subnavDesktop: subnavDesktop,
	navMobile: navMobile,
	subnavMobile: subnavMobile,
	globalSearch: globalSearch,
};
