import common from "@page/common/js/common";
import tab from "@global/helpers/tab";
import Pagination from "@global/components/global/Pagination";

$("#btn-get-vc-back").click(function (e) {
	e.preventDefault();
	if ($("select[name=SwiftCode] option").filter(":selected").val() === "default") {
		$("#SwiftCode").css("color", "#afafaf");
	}
});

$("#SwiftCode").click(function (e) {
	e.preventDefault();
	$("#SwiftCode").css("color", "#000");
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

// 結清購物金檢查
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
		AccountNo: { required: "必填" },
		AccountNoAgain: { required: "必填", equalTo: "帳號不一致" },
		AccountName: { required: "必填" },
		SwiftCode: { required: "必填" },
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

const p = new Vue({
	el: "#pagination",
	data: {},
	components: {
		Pagination,
	},
	template: `<div>
  <Pagination :onepageqty="15"></Pagination>
  </div>`,
});
