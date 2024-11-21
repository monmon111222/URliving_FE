import Clipboard from "clipboard";
import AlertDialog from "@global/helpers/alertDialog";

const ShareAction = (function () {
	var $document = $(document);

	var clipboard = new Clipboard("#copyLink");
	clipboard.on("success", function (e) {
		AlertDialog.alert("網址已複製。");

		e.clearSelection();
	});

	clipboard.on("error", function (e) {
		AlertDialog.alert("很抱歉，您的瀏覽器不支援複製網址，您可以手動複製。");
	});

	const shareToSocial = function (social, url) {
		setTimeout(function () {
			switch (social) {
				case "fb":
					window.open(
						"https://www.facebook.com/sharer/sharer.php?u=" + url,
						"_blank",
						"toolbar=yes,location=yes,directories=no,status=no, menubar=yes,scrollbars=yes,resizable=no, copyhistory=yes,width=600,height=500"
					);
					break;
				case "line":
					window.location.href = "http://line.naver.jp/R/msg/text/?" + url;
					break;
				case "link":
					break;
				case "weibo":
					var image = $('meta[itemprop="image"]').attr("content");
					var title = $('meta[itemprop="name"]').attr("content");
					window.open(
						"http://service.weibo.com/share/share.php?url=" +
							url +
							"&title=" +
							title +
							"&pic=" +
							encodeURIComponent(image),
						"_blank",
						"toolbar=yes,location=yes,directories=no,status=no, menubar=yes,scrollbars=yes,resizable=no, copyhistory=yes,width=600,height=500"
					);
					break;
			}
		});
	};

	$document.off("click", ".btn-share-this");

	$document.on("click", ".btn-share-this", function (e) {
		e.preventDefault();
		var socialType = $(this).data("social");
		shareToSocial(socialType, $("#share-link").val());
	});
})();

export default ShareAction;
