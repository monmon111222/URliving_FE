const Accordion = (elm, options, noSlide) => {
	var $container = $(elm);
	var defaults = { collapse: true, children: "li" };
	var opt = $.extend({}, defaults, options);

	if ($container.length > 1 || $container.children(opt.children).length > 1) {
		init();
	}

	function init() {
		$container.each(function () {
			var self = this;
			var $this = $(this);
			var $list = $this.children(opt.children);
			var $titles = $list.children(":first-child");
			var $contents = $list.children(":last-child");

			this.openAndClose = function (target) {
				if ($(target).parent().hasClass("open")) return;

				if (noSlide) {
					$(target)
						.next()
						.show()
						.parent()
						.addClass("open")
						.siblings(".open")
						.removeClass("open")
						.children(":last-child")
						.hide();
				} else {
					$(target)
						.next()
						.slideDown()
						.parent()
						.addClass("open")
						.siblings(".open")
						.removeClass("open")
						.children(":last-child")
						.slideUp();
				}
			};

			this.open = function (target) {
				if (noSlide) {
					$(target).next().show().parent().addClass("open");
				} else {
					$(target).next().slideDown().parent().addClass("open");
				}
			};

			this.close = function (target) {
				if (noSlide) {
					$(target).next().hide().parent().removeClass("open");
				} else {
					$(target).next().slideUp().parent().removeClass("open");
				}
			};

			this.toggle = function (target) {
				if ($(target).parent().hasClass("open")) {
					this.close(target);
				} else {
					this.open(target);
				}
			};

			$this.addClass("accordion");

			$titles.addClass("accordion__title").prepend($('<i class="accordion__icon"></i>'));

			$contents.addClass("accordion__content");

			$container.on("click touchend", ".accordion__title", function (event) {
				event.preventDefault();

				if (opt.collapse) {
					self.toggle(this);
				} else {
					self.openAndClose(this);
				}
			});

			// open first
			$titles.eq(0).parent().addClass("open").end().next().show();
		});
	}
};

module.exports = Accordion;
