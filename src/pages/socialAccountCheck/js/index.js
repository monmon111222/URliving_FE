import common from "@page/common/js/common";

$.validator.addMethod(
	"regx",
	function (value, element, regexpr) {
		return regexpr.test(value);
	},
	"invalid format."
);
$("#form-social-check").validate({
	errorClass: "error",
	errorElement: "div",
	rules: {
		password: {
			required: true,
			//change regexp to suit your needs
			regx: /^(?=.*\d)(?=.*[A-Za-z])[^\s]{6,15}$/,
		},
	},
	messages: {},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		form.submit();
	},
});

function resetPassword() {
	$("#btn-forget").on("click", function (event) {
		var $form = $("#form-social-check");
		$.ajax({
			url: API_URL.FORGET_PS,
			type: "post",
			dataType: "json",
			data: { account: $("#user-email").val() },
			success: function (res) {
				AlertDialog.alert(res.Message, function () {});
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log("error");
			},
		});

		event.preventDefault();
	});
}

resetPassword();
