function AsideNotice(target, opt) {
	this.data = "";
	this.target = ".AsideNotice";
	this.opt = {
		position: "left",
		statusClass: "open",
	};
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

AsideNotice.prototype.toggle = function () {
	if ($(this.target).hasClass(this.opt.statusClass)) {
		this.close(); // 已展開的就收起來
	} else {
		this.open(); // 未展開的就展開
	}
};

AsideNotice.prototype.close = function () {
	this.isOpen = false;
	$(this.target).css(this.opt.position, -this.size).removeClass(this.opt.statusClass);

	$(window).off("click.closeAsideNotice");
};

AsideNotice.prototype.open = function () {
	this.isOpen = true;
	$(this.target).css(this.opt.position, 0).addClass(this.opt.statusClass);

	$(window).on("click.closeAsideNotice", (e) => {
		if ($(e.target).closest(this.target).length === 0) this.close();
	});
};

AsideNotice.prototype.init = function () {
	$.ajax({
		url: nowBrand.constants.GetBanners,
		type: "GET",
		cache: false,
		async: false,
		dataType: "json",
	}).success((data) => {
		const Bannerlength = data.Banner_freelayout.length;

		if (Bannerlength !== 0) {
			// 如果返回長度不等於0 表示有資料
			for (let i = 0; i < Bannerlength; i++) {
				this.data = this.data + data.Banner_freelayout[i];
			}
		}
	});

	if (this.data) {
		const html =
			"<div class=" +
			this.target.replace(/\./gi, "") +
			">" +
			'<a href="javascript:;" class="notice__open">open</a>' +
			'<div class="notice__inner"><div class="notice__content"></div></div>' +
			'<a href="javascript:;" class="notice__close">close</a>' +
			"</div>";

		$("body").append(html);

		const $target = $(this.target);

		if (this.opt.position === "left" || this.opt.position === "right") {
			this.size = $target.find(".notice__inner").outerWidth(); // 獲得寬並設定
		} else if (this.opt.position === "top" || this.opt.position === "bottom") {
			this.size = $target.find(".notice__inner").outerHeight(); // 獲得高並設定
		}

		$target.find(".notice__content").append(this.data).find(".sim-row").removeClass("sim-row");
		$target.css(this.opt.position, -this.size);
		setTimeout(() => $target.addClass("loaded"));

		$target.find(".notice__open").on("click", () => this.toggle());
		$target.find(".notice__close").on("click", () => this.close());
	}
};

module.exports = AsideNotice;
