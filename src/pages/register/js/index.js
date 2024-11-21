import common from "@page/common/js/common";

$(".menu-type").click(function (e) {
	e.preventDefault();
	var $el = $(this),
		type = $el.data("type");
	$(".menu-type").removeClass("active");
	$el.addClass("active");
	if (type === "login") {
		$(".form-block.is-login").css("display", "block");
		$(".form-block.is-register").css("display", "none");
	} else {
		$(".form-block.is-login").css("display", "none");
		$(".form-block.is-register").css("display", "block");
	}
});

$.validator.addMethod(
	"regx",
	function (value, element, regexpr) {
		return regexpr.test(value);
	},
	"請輸入5碼至16碼英數字"
);

$("#form-register").validate({
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
		checkPassword: {
			required: true,
			equalTo: "#password-register",
		},
	},
	messages: {
		account: {
			required: "必填",
		},
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
		const $btn = $(form).find("input[type='submit']");
		$btn.addClass("disabled");
		$.ajax({
			url: API_URL.ACCOUNT_EXIST + "?Account=" + $(form).find('input[name="account"]').val(),
			type: "GET",
			dataType: "json",
			success: function (res) {
				if (res.Code == 200) {
					if (res.Response) {
						AlertDialog.alert(res.Message, function () {
							$btn.removeClass("disabled");
						});
					} else {
						form.submit();
					}
				} else {
					AlertDialog.alert("系統忙碌中，請稍後再試", function () {
						$btn.removeClass("disabled");
					});
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				$btn.removeClass("disabled");
			},
		});

		return false;
	},
});

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
