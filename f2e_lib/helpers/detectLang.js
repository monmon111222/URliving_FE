const detectLang = function () {
	const $body = $("body");

	let lang = "";

	if ($body.hasClass("style-lang-en")) {
		lang = "en";
	} else if ($body.hasClass("style-lang-jp")) {
		lang = "jp";
	} else if ($body.hasClass("style-lang-cn")) {
		lang = "cn";
	} else {
		lang = "tw";
	}

	return lang;
};

export default detectLang;
