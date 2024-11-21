const $el = $(".item-filter");

function open(self) {
	var $this = $(self);

	$this.parent().data("toggle", 1);
	$this.parents(".item-filter").addClass("open");

	// bind event once, let user can click anywhere to close the panel
	$(document).one("click", () => {
		close();
	});
}

function close() {
	$el.each(function () {
		const $this = $(this);

		$this.data("toggle", 0);
		$this.removeClass("open");
	});
}

function toggleTag(self) {
	const $this = $(self);
	const isTagged = $this.hasClass("selected");

	if (isTagged) {
		$this.removeClass("selected");
	} else {
		$this.addClass("selected");
	}
}

function radioTag(self) {
	const $this = $(self);
	const isTagged = $this.hasClass("selected");

	if (isTagged) {
		$this.removeClass("selected");
	} else {
		$this.addClass("selected").siblings().removeClass("selected");
	}
}

function clearTags(self) {
	$(self).parent().parent().find(".item-filter__tags li, .item-filter__radio li").removeClass("selected");
}

function init() {
	if ($el.length < 1) return;

	$el.data("toggle", 0);

	$el.find(".item-filter__text").on("click", function (event) {
		var $this = $(this);
		var $parent = $this.parent();
		var isOpen = $parent.data("toggle");

		event.preventDefault();
		// because open event bind a once event to document, so stop the propagation
		event.stopPropagation();

		if (!isOpen) {
			close();
			open(this);
		} else {
			close();
		}
	});

	$el.find(".item-filter__tags").on("click", "li", function (event) {
		event.preventDefault();
		toggleTag(this);
	});

	$el.find(".item-filter__radio").on("click", "li", function (event) {
		event.preventDefault();
		radioTag(this);
	});

	$el.find(".item-filter__btn-ok, .item-filter__btn-close, .item-filter__close").on("click", function (event) {
		event.preventDefault();
		close();
	});

	$el.find(".item-filter__btn-clear").on("click", function (event) {
		event.preventDefault();
		clearTags(this);
	});

	$el.find(".item-filter__content").on("click", function (event) {
		// because open event bind a once event to document, so stop the propagation
		event.preventDefault();
		event.stopPropagation();
	});
}

const itemFilter = {
	init,
};

module.exports = itemFilter;
