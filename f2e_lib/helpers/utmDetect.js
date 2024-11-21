// 網址格式: ?utm_source=youtube&utm_medium=kol&utm_campaign=rainie&utm_content=videoID
// utm_medium來源為kol才記

const detectUtm = function() {
	let utmString = "";
	let urlQueryString = window.location.search.toLowerCase();

	if (
		urlQueryString.length !== 0 &&
		urlQueryString.indexOf("utm_source") !== -1 &&
		urlQueryString.indexOf("utm_medium") !== -1 &&
		urlQueryString.indexOf("utm_campaign") !== -1 &&
		urlQueryString.indexOf("utm_content") !== -1
	) {
		let utmArr = urlQueryString.split("&");
		let source = "";
		let medium = "";
		let campaign = "";
		let content = "";
		let checkIsKol = false;

		utmArr.forEach(function(el, index) {
			if (el.indexOf("source") !== -1) {
				source = el.substring(el.indexOf("=") + 1, el.length);
			} else if (el.indexOf("medium") !== -1) {
				medium = el.substring(el.indexOf("=") + 1, el.length);
				if (medium == "kol") {
					checkIsKol = true;
				}
			} else if (el.indexOf("campaign") !== -1) {
				campaign = el.substring(el.indexOf("=") + 1, el.length);
			} else if (el.indexOf("content") !== -1) {
				content = el.substring(el.indexOf("=") + 1, el.length);
			}
		});

		if (checkIsKol) {
			utmString = `${source}:${medium}:${campaign}:${content}`;
		} else {
			utmString = null;
		}
	} else {
		utmString = null;
	}

	return utmString;
};

export default detectUtm;
