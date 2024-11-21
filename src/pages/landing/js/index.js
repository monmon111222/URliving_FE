// import common from '@page/common/js/common';
import validate from "@global/vendors/jquery.validate.min";
import modal from "bootstrap/js/dist/modal";
import AlertDialog from "@global/helpers/alertDialog";

global.$ = global.jQuery = require("jquery");

let isPostingMail = false;
const mailValidate = {
	errorClass: "error",
	errorElement: "div",
	rules: {
		newsletter: {
			required: true,
			email: true,
		},
	},
	messages: {},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		if (isPostingMail) return;
		const $input = $("#subscribe-input");
		$(form).find("input[type='submit']").addClass("disabled");
		isPostingMail = true;
		$.ajax({
			type: "POST",
			url: "https://www-s.mouggan.com/api/v1/Subscribe/Apply",
			dataType: "json",
			data: { Email: $input.val() },
			xhrFields: {
				withCredentials: false,
			},
			error: function () {
				console.log("error");
			},
			success: function (res) {
				if (res.Code === 200) {
					AlertDialog.alert(
						"您已訂閱成功",
						function () {
							isPostingMail = false;
							location.reload();
						},
						"alert-success-subscribe"
					);
				} else {
					AlertDialog.alert(
						res.Message,
						function () {
							isPostingMail = false;
							location.reload();
						},
						"alert-success-subscribe"
					);
				}
			},
		});
	},
};

$("#form-subscribe").validate(mailValidate);
$("#subscribe-input").get(0).focus();

$(".btn-subscribe").hover(
	function () {
		/* Stuff to do when the mouse enters the element */
		$(this).val("訂閱");
	},
	function () {
		/* Stuff to do when the mouse leaves the element */
		$(this).val("SUBSCRIBE");
	}
);

setTimeout(function () {
	$("#page-home").css("opacity", "1");
}, 100);

window.AlertDialog = AlertDialog;
