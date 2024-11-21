import preloadimages from "@global/helpers/preloadimages";

function FooterNotice(target, opt) {
	this.target = ".FooterNotice";
	this.opt = { statusClass: "open" };
	this.isOpen = false;
	this.size = 0;

	if (target) {
		switch (typeof target) {
			case "string":
				this.target = target;
				break;
			case "object":
				this.opt = $.extend({}, this.opt, target);
				break;
		}
	}

	if (opt && typeof opt === "object") {
		this.opt = $.extend({}, this.opt, opt);
	}
}

FooterNotice.prototype.toggle = function () {
	if ($(this.target).hasClass(this.opt.statusClass)) {
		this.close(); // 已展開的就收起來
	} else {
		this.open(); // 未展開的就展開
	}
};

FooterNotice.prototype.close = function () {
	this.isOpen = false;
	$(this.target).css("bottom", -this.size).removeClass(this.opt.statusClass);
	$(this.target).off("click.closeFooterNotice");
};

FooterNotice.prototype.open = function () {
	this.isOpen = true;
	$(this.target).css("bottom", 0).addClass(this.opt.statusClass);
	$(this.target).on("click.closeFooterNotice", (e) => {
		if ($(e.target).closest(this.target).length === 0) this.close();
	});
};

FooterNotice.prototype.init = function () {
	// 後端直接render
	// $.ajax({
	//   url: nowBrand.constants.GetBanners,
	//   type: 'GET',
	//   cache: false,
	//   async: false,
	//   dataType: 'json'
	// }).success(data => {
	//   const Bannerlength = data.Banner_freelayout.length

	//   if (Bannerlength !== 0) { // 如果返回長度不等於0 表示有資料
	//     this.data = data.Banner_freelayout[0]
	//     this.titlecolor = $(this.data).data('titlecolor')
	//     this.titlebgcolor = $(this.data).data('titlebgcolor')
	//   }
	// })

	if (typeof mobileADConfig === "undefined" || $("#mobileAD-container").length === 0) return;

	const nowDate = new Date();
	// 取國際時間UTC
	const serverTime = new Date(
		nowDate.getUTCFullYear(),
		nowDate.getUTCMonth(),
		nowDate.getUTCDate(),
		nowDate.getUTCHours() + 8, // 換台灣時間+8
		nowDate.getMinutes(),
		nowDate.getUTCSeconds(),
		nowDate.getUTCMilliseconds()
	).getTime();

	// if ($(".FooterNotice").length !== 0) {
	// const html =
	//   `<div class="${this.target.replace(/\./gi, '')}">` +
	//     '<style>' +
	//       `${this.target} {` +
	//         `color: ${this.titlecolor}; ` +
	//         `background-color: ${this.titlebgcolor};` +
	//       '}' +
	//       `${this.target} .notice__arrow:before, ${this.target} .notice__arrow:after {` +
	//         `background-color: ${this.titlecolor};` +
	//       '}' +
	//     '</style>' +
	//     '<div class="notice__inner"><div class="notice__wrap">' +
	//       '<i class="notice__arrow"></i>' +
	//     '</div></div>' +
	//   '</div>'

	// $('body').append(html)
	const dataPopupAD = mobileADConfig.popupAD;

	for (let i = 0; i < dataPopupAD.length; i++) {
		if (!dataPopupAD[i].note) {
			// 排除筆記
			const startTime = new Date(
				dataPopupAD[i].start[0],
				dataPopupAD[i].start[1] - 1, // 月份要-1
				dataPopupAD[i].start[2],
				dataPopupAD[i].start[3],
				dataPopupAD[i].start[4],
				dataPopupAD[i].start[5],
				dataPopupAD[i].start[6]
			).getTime();

			const endTime = new Date(
				dataPopupAD[i].end[0],
				dataPopupAD[i].end[1] - 1, // 月份要-1
				dataPopupAD[i].end[2],
				dataPopupAD[i].end[3],
				dataPopupAD[i].end[4],
				dataPopupAD[i].end[5],
				dataPopupAD[i].end[6]
			).getTime();

			const dataPopupID = dataPopupAD[i].popupID;

			if (startTime < serverTime && endTime > serverTime) {
				// 目標popup
				const $popup = $(`#mobile_${dataPopupID}`);
				$popup.show();
				const $target = $(this.target);
				// $target.find('.notice__wrap').append(this.data).find('.sim-row').toggleClass('sim-row notice__content')

				// 把 go top 放上去一點
				$(".gotop").css("bottom", 95);

				// 取得高並設定
				const self = this;
				const $images = $popup.find("img");

				const urlArray = $images.map((index) => {
					return $images.eq(index).attr("src");
				});
				// preloadimages 該模塊應傳入圖片URL之陣列才能在抓完後執行fn
				preloadimages(urlArray).done(() => {
					// set size after every image are loaded
					self.size = $popup.find(".sideBySide").outerHeight();
					// set position
					$popup.css("bottom", -self.size);

					// show by css
					setTimeout(() => {
						$popup.addClass("loaded");
					}, 30);

					// auto open
					const clickTimeout = setTimeout(() => {
						$popup.click();
						clearTimeout(clickTimeout);
					}, 3000);

					// bind one click event
					$popup.one("click", () => {
						clearTimeout(clickTimeout);
					});

					// handle click events
					$popup.on("click", (e) => {
						if (!($(e.target).is(".sideBySide") || $(e.target).closest(".sideBySide").length)) {
							self.toggle();
						}
					});
				});
			}
		}
	}

	// }
};

export default FooterNotice;
