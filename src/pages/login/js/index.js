import common from "@page/common/js/common";

$(".btn-forget-pws").click((e) => {
	e.preventDefault();
	console.log("click");
	$(".form-block").removeClass("is-login");
	$(".form-block").addClass("is-forgot");
});

$("#form-login").validate({
	errorClass: "error",
	errorElement: "div",
	rules: {
		account: "required",
		password: "required",
	},
	messages: {
		account: {
			required: "請輸入會員帳號",
		},
		password: {
			required: "請輸入會員密碼",
		},
	},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		form.submit();
	},
});

$("#form-user-forgot").validate({
	errorClass: "error",
	errorElement: "div",
	rules: {
		account: {
			required: true,
		},
	},
	messages: {
		account: {
			required: "必填",
		},
	},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		const $btn = $(form).find("input[type='submit']");
		$btn.addClass("disabled");
		$.ajax({
			url: API_URL.FORGET_PS,
			type: "get",
			dataType: "json",
			data: $(form).serialize(),
			success: function (res) {
				if (res.Code === 400) {
					$("#email-forgot")
						.parent()
						.append('<div id="email-forgot-error" class="error">' + res.Message + "</div>");
				} else {
					$("#success-msg").css("display", "block");
					$(".form-block").css("display", "none");
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log("error");
			},
		});
	},
});
