const formInputOrder = (config) => {
	const inputArray = config.inputArray;
	const submitButton = config.submitButton;
	const lastInputIndex = inputArray.length - 1;

	// input switch event
	$.each(inputArray, (index, value) => {
		$("body").on("keydown", value, (event) => {
			const prevEl = index === 0 ? submitButton : inputArray[index - 1];
			const nextEl = index === lastInputIndex ? submitButton : inputArray[index + 1];

			// shift + tab
			if (event.which === 9 && event.shiftKey) {
				event.preventDefault();
				$(prevEl).focus();
			}

			// tab or enter
			if (
				(event.which === 9 && !event.shiftKey) ||
				(event.which === 13 && index !== inputArray.length - 1) // not include the last input
			) {
				event.preventDefault();
				$(nextEl).focus();
			}
		});
	});

	// button switch event
	$("body").on("keydown", submitButton, (event) => {
		if (event.which === 9) {
			// tab
			event.preventDefault();

			if (event.shiftKey) {
				// shift
				// back to last input
				$(inputArray[lastInputIndex]).focus();
			} else {
				// go to first input
				$(inputArray[0]).focus();
			}
		}
	});

	// click submit button when keydown enter on the last input
	$("body").on("keydown", inputArray[inputArray.length - 1], (event) => {
		if (event.which === 13) {
			event.preventDefault();
			$(submitButton).click();

			// for validate
			$.each(inputArray, (index, value) => {
				$(value).blur();
			});
		}
	});
};

module.exports = formInputOrder;
