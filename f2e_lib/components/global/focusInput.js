const focusInput = (target) => {
	$(target).on("keyup", function () {
		if ($(target).val() !== "") {
			$(target).addClass("focus");
		} else {
			$(target).removeClass("focus");
		}
	});
};

module.exports = focusInput;
