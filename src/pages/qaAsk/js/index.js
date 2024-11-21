import common from "@page/common/js/common";
import collapse from "bootstrap/js/dist/collapse";
import validate from "@global/vendors/jquery.validate.min";

$("form.form-style").validate({
	errorClass: "text-danger h6 pt-2",
	errorElement: "div",
	rules: {
		content: {
			required: {
				depends: function () {
					$(this).val($.trim($(this).val()));
					return true;
				},
			},
			maxlength: 250,
		},
	},
	messages: {
		content: {
			required: "請輸入內容",
			maxlength: "內容過長，請重新輸入",
		},
	},
	errorPlacement: function (error, element) {
		element.after(error);
	},
	submitHandler: function (form) {
		form.submit();
	},
});
