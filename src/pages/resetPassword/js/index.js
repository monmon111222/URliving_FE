import common from "@page/common/js/common";

$.validator.addMethod(
	"regx",
	function (value, element, regexpr) {
		return regexpr.test(value);
	},
	"invalid format."
);
$("#form-reset").validate({
	errorClass: "error",
	errorElement: "div",
	rules: {
		password: {
			required: true,
			//change regexp to suit your needs
			regx: /^(?=.*\d)(?=.*[A-Za-z])[^\s]{6,15}$/,
		},
		checkPassword: {
			required: true,
			equalTo: "#password-reset",
		},
	},
	messages: {
		password: {
			required: "必填",
			regx: "6-15碼英數字",
		},
		checkPassword: {
			required: "必填",
			equalTo: "密碼不一致!",
		},
	},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		form.submit();
		// return false;
	},
});
