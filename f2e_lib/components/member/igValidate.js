const igValidate = (function () {
	$.validator.addMethod(
		"regx",
		function (value, element, regexpr) {
			return regexpr.test(value);
		},
		"請設定6碼至15碼英數字"
	);

	// ig validate
	$("#form-ig-validate").validate({
		errorClass: "error",
		errorElement: "div",
		rules: {
			account: {
				required: true,
				email: true,
			},
			password: {
				required: true,
				//change regexp to suit your needs
				regx: /^(?=.*\d)(?=.*[A-Za-z])[^\s]{6,15}$/,
			},
			checkpassword: {
				required: true,
				equalTo: "#password-reset",
			},
			checkaccount: {
				required: true,
				equalTo: "#account-reset",
			},
		},
		messages: {
			account: {
				required: "請輸入您的email",
				email: "請輸入有效的email",
			},
			password: {
				required: "請設定您的密碼",
			},
			checkpassword: {
				required: "請再次輸入您的密碼",
				equalTo: "密碼不一致",
			},
			checkaccount: {
				required: "請再次輸入您的email",
				equalTo: "信箱帳號不一致",
			},
		},
		errorPlacement: function (error, element) {
			element.parent().append(error);
		},
		submitHandler: function (form) {
			// do other things for a valid form
			form.submit();
		},
	});
})();

module.exports = igValidate;
