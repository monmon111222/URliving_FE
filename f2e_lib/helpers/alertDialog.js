import $ from "jquery";
import { brandAlertTemplate, removeAlertStyle } from "@global/helpers/brandAlertTemplate.js";

let alertInfoTemplate = "";
let alertConfirmTemplate = "";
let alertSpecialTemplate = "";
let squarebearAlertInfoTemplate = "";
let commonCartDeleteTemplate = "";

brandAlertTemplate(window.PictureContainer).then((res) => {
	alertInfoTemplate = res.alertInfoTemplate;
	alertConfirmTemplate = res.alertConfirmTemplate;
	alertSpecialTemplate = res.alertSpecialTemplate;
	squarebearAlertInfoTemplate = res.squarebearAlertInfoTemplate;
	commonCartDeleteTemplate = res.commonCartDeleteTemplate;
});

const brand = window.PictureContainer;

var AlertDialog = (function ($, o) {
	var $body = $("body");

	var alertInfo = function (msg, tmpl, textAlign, callback, name) {
		var $tmpl = $(tmpl);

		$tmpl.attr("data-name", name == undefined ? "" : name);

		$tmpl.find(".modal-info").html(msg);
		$tmpl.find(".modal-info").addClass(textAlign);

		$body.css({ overflow: "hidden" });
		$body.append($tmpl);

		$(".btn-cancel-alert")
			.unbind()
			.click(function (e) {
				e.preventDefault();
				removeAlertStyle.call($(this), brand);
				$body.css({ overflow: "", "padding-right": "" });
			});

		$(".alert-confirm-btn")
			.unbind()
			.click(function (e) {
				e.preventDefault();
				removeAlertStyle.call($(this), brand);
				$body.css({ overflow: "", "padding-right": "" });

				if (callback) {
					callback();
				}
			});

		$(".btn-close-alert, .btn-confirm-alert")
			.unbind()
			.click(function (e) {
				e.preventDefault();
				$(this).addClass("disabled");
				removeAlertStyle.call($(this), brand);
				$body.css({ overflow: "", "padding-right": "" });

				if (callback) {
					callback();
				}
			});
	};

	var alertCartInfo = function (msg, tmpl, textAlign, callback, callback2, name) {
		var $tmpl = $(tmpl);

		$tmpl.attr("data-name", name == undefined ? "" : name);

		$tmpl.find(".modal-info").html(msg);
		$tmpl.find(".modal-info").addClass(textAlign);

		$body.css({ overflow: "hidden" });
		$body.append($tmpl);

		$(".btn-cancel-alert").on("click", function (e) {
			e.preventDefault();
			removeAlertStyle.call($(this), brand);
			$body.css({ overflow: "", "padding-right": "" });
		});

		$(".btn-close-alert, .btn-confirm-alert").on("click", function (e) {
			e.preventDefault();
			$(this).addClass("disabled");
			$(this).parents(".alert-modal-style").remove();
			$body.css({ overflow: "", "padding-right": "" });
			if (callback == undefined || callback == null) return;
			callback();
		});

		$(".btn-confirm-wish").on("click", function () {
			$(this).addClass("disabled");
			$(this).parents(".alert-modal-style").remove();
			$body.css({ overflow: "", "padding-right": "" });
			if (callback == undefined || callback == null) return;
			callback2();
		});
	};

	o.alert = function (msg, callback, name) {
		alertInfo(msg, alertInfoTemplate, "text-center", callback, name);
	};

	o.confirm = function (msg, callback, name) {
		alertInfo(msg, alertConfirmTemplate, "text-center", callback, name);
	};

	o.special = function (msg, callback, name) {
		alertInfo(msg, alertSpecialTemplate, "text-center", callback, name);
	};

	o.alertBear = function (msg, callback, name) {
		alertInfo(msg, squarebearAlertInfoTemplate, "text-center", callback, name);
	};

	o.cartDelete = function (msg, callback, callback2, name) {
		alertCartInfo(msg, commonCartDeleteTemplate, "text-center", callback, callback2, name);
	};

	return o;
})($, window.AlertDialog || {});

export default AlertDialog;
