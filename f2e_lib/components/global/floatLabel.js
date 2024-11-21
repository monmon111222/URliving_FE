const floatLabel = (options) => {
	const container = options && options.container ? options.container : ".form-float-label";
	const $labelBox = $(container).find("li");

	if ($labelBox.length < 1) return;

	const labelShowClass = options && options.labelShowClass ? options.labelShowClass : "float-label-show";
	const supportPlaceholder = (function () {
		const i = document.createElement("input");
		return "placeholder" in i;
	})();

	if (supportPlaceholder) {
		$labelBox.find("input, textarea").on("keyup", function (event) {
			const $this = $(this);
			const $parent = $this.parent();

			if ($this.val() === "") {
				$parent.removeClass(labelShowClass);
			} else {
				$parent.addClass(labelShowClass);
			}
		});
	}
};

export default floatLabel;
