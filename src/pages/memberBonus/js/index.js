import common from "@page/common/js/common";
import datepicker from "@global/vendors/datepicker.min";

$.fn.datepicker.language["en"] = {
	days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	daysMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],
	monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	today: "Today",
	clear: "Clear",
	dateFormat: "yyyy-mm-dd",
	timeFormat: "hh:ii aa",
	firstDay: 0,
};

$(".date-picker-start").datepicker({
	dateFormat: "yyyy-mm-dd",
	language: "en",
	maxDate: new Date(),
});

$(".date-picker-end").datepicker({
	dateFormat: "yyyy-mm-dd",
	language: "en",
	maxDate: new Date(),
});

$.validator.addMethod(
	"AccountNoRegx",
	function (value, element, regexpr) {
		return regexpr.test(value);
	},
	"帳戶欄位最多限輸入15碼數字"
);

$.validator.addMethod(
	"codeRegx",
	function (value, element, arg) {
		return arg !== value;
	},
	"This field is required."
);

$("#form-get-virtual-currency").validate({
	errorClass: "error",
	errorElement: "div",
	rules: {
		AccountNo: {
			required: true,
			AccountNoRegx: /^[0-9]{0,15}$/,
		},
		AccountNoAgain: {
			required: true,
			equalTo: "#input-accountNo",
		},
		AccountName: "required",
		SwiftCode: { codeRegx: "default" },
	},
	messages: {
		AccountNo: {},
		AccountNoAgain: {
			equalTo: "帳號不一致",
		},
	},
	submitHandler: function (form) {
		$("#btn-get-virtual-currency, #btn-get-vc-back").addClass("disabled");
		$("body").append(
			`<div id="vc-loading" class="mask" style="z-index: 9999; padding-top: 40vh;"><p class="text-center text-white h1">處理中...</p></div>`
		);
		setTimeout(function () {
			$.ajax({
				type: "POST",
				url: API_URL.VC_CASH_IN,
				dataType: "json",
				data: $(form).serialize(),
				xhrFields: {
					withCredentials: false,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					$("#vc-loading").remove();
					if (res.Code === 200) {
						AlertDialog.alert("購物金申請退款成功，我們將盡快為您處理!", function () {
							$("#lb-virtual-currency").modal("hide");
							location.reload();
						});
					} else if (res.Code === 201) {
						AlertDialog.alert("無剩餘的購物金，無法進行結清", function () {
							$("#lb-virtual-currency").modal("hide");
							location.reload();
						});
					} else {
						AlertDialog.alert(res.Message, function () {
							$("#btn-get-virtual-currency").removeClass("disabled");
						});
					}
				},
			});
		}, 1000);
	},
});

$(".withdrawal-bind-bank, .bank-edit").on("click", function (e) {
	e.preventDefault();
	$("#lb-virtual-currency").addClass("show");
	$(".virtual-mask").show();
});

$(".btn-withdraw").on("click", function (e) {
	e.preventDefault();
	$(".bonus-info").hide();
	$("form.panel").hide();
	$("form.bonus-withdraw").show();
});

$(".btn-withdraw-cancel").on("click", function (e) {
	e.preventDefault();
	$(".bonus-info").show();
	$("form.panel").show();
	$("form.bonus-withdraw").hide();
});

$("#lb-virtual-currency .modal-close").on("click", function (e) {
	e.preventDefault();
	$("#lb-virtual-currency").removeClass("show");
	$(".virtual-mask").hide();
});
