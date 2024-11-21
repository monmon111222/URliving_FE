import common from "@page/common/js/common";
import datepicker from "@global/vendors/datepicker.min";
import ImgUpload from "@global/helpers/imgUpload";
import address from "@global/components/account/address";

new Vue(
	Object.assign(
		{
			el: "#app-address",
		},
		address
	)
);

$.validator.addMethod(
	"mobileRegx",
	function (value, element, regexpr) {
		return regexpr.test(value);
	},
	"請輸入正確手機格式"
);
$.validator.addMethod(
	"passwordRegx",
	function (value, element, regexpr) {
		return regexpr.test(value);
	},
	"請設定6碼至15碼英數字"
);
$.validator.addMethod(
	"regionRegx",
	function (value, element, arg) {
		return arg !== value;
	},
	"請選擇地區"
);
$.validator.addMethod(
	"countrycodeRegx",
	function (value, element, arg) {
		return arg !== value;
	},
	"This field is required."
);
$.validator.addMethod(
	"codeRegx",
	function (value, element, arg) {
		return arg !== value;
	},
	"請選擇銀行"
);
$.validator.addMethod(
	"AccountNoRegx",
	function (value, element, regexpr) {
		return regexpr.test(value);
	},
	"帳戶欄位最多限輸入15碼數字"
);

$("#form-modify").validate({
	errorClass: "error",
	errorElement: "div",
	rules: {
		name: {
			required: true,
			maxlength: 25,
		},
		region: { regionRegx: "default" },
		countrycode: { countrycodeRegx: "default" },
		mobile: {
			required: true,
			mobileRegx: /^[0-9]{5,15}$/,
		},
		address: {
			required: true,
			maxlength: 300,
		},
		mail: {
			email: true,
			maxlength: 100,
		},
		city: "required",
		district: "required",
	},
	messages: {
		name: {
			maxlength: "姓名過長，請重新輸入",
		},
		mobile: {},
		address: {
			maxlength: "地址過長，請重新輸入",
		},
		mail: {
			maxlength: "email過長，請重新輸入",
		},
		city: {},
		district: {},
	},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		form.submit();
	},
});

$("#form-reset-password").validate({
	errorClass: "error",
	errorElement: "div",
	rules: {
		originpassword: {
			required: true,
		},
		password: {
			required: true,
			passwordRegx: /^(?=.*\d)(?=.*[A-Za-z])[^\s]{6,15}$/,
		},
		checkpassword: {
			required: true,
			equalTo: "#new-password",
		},
	},
	messages: {
		originpassword: {},
		password: {},
		checkpassword: {
			equalTo: "The passwords entered are not the same.",
		},
	},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		form.submit();
	},
});

// 生日datepicker
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

if ($(".date-picker-birth").data("value")) {
	$(".date-picker-birth").val($(".date-picker-birth").data("value"));
} else {
	$(".date-picker-birth").datepicker({
		dateFormat: "yyyy-mm-dd",
		language: "en",
		maxDate: new Date(),
	});

	var getBirthDate = function () {
		var $inputDate = $(".date-picker-birth");
		var defaultDate = $inputDate.data("value");
		var birthDatepicker = $inputDate.datepicker().data("datepicker");
		if (defaultDate !== undefined) {
			birthDatepicker.selectDate(new Date(defaultDate));
		}
	};
	getBirthDate();
}

// 大頭貼更換
new ImgUpload({
	inputFile: "input-upload-img",
	targetImg: "#user-avatar",
});
