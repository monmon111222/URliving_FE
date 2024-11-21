import common from "@page/common/js/common";
import modal from "bootstrap/js/dist/modal";
import setEnv from "@global/helpers/setEnv";
import corpPage from "@global/components/global/staticInfoPage";
import axios from "axios";

corpPage();

$(document).ready(function () {
	$.validator.addMethod(
		"mobileRegx",
		function (value, element, regexpr) {
			return regexpr.test(value);
		},
		"請輸入正確手機格式"
	);

	$("#form-fa-bind").validate({
		errorClass: "error",
		errorElement: "div",
		rules: {
			mobile: {
				required: true,
				mobileRegx: /^[0-9]{5,15}$/,
			},
		},
		messages: {
			mobile: {
				required: "手機號碼為必填",
			},
		},
		errorPlacement: function (error, element) {
			element.parent().append(error);
		},
		submitHandler(form) {
			if ($("#fa-privacy:checked").length === 0) {
				AlertDialog.alert("請勾選同意接受服務條款");
				return;
			}
			if ($('input[name="code"]').val().length === 0) {
				AlertDialog.alert("請填寫驗證碼");
				return;
			}
			if ($('input[name="code"]').val().length !== 6) {
				AlertDialog.alert("請確認驗證碼");
				return;
			}
			$(".btn-submit").addClass("disabled");
			form.submit();
		},
	});
});

function getVerify() {
	axios
		.get(API_URL.VERIFY_FA_POINTS, {
			params: {
				CellPhone: $('input[name="mobile"]').val(),
				CountryCode: $("select[name=countryCode] option").filter(":selected").val(),
			},
		})
		.then((res) => {
			if (res.data.Code === 200) {
				$('input[name="stamp"]').val(res.data.Response.Stamp);
			}
		})
		.catch(function (error) {
			console.log(error);
		});
}

var timerId;
function startTimer() {
	var timer = 300,
		minutes,
		seconds;
	timerId = setInterval(function () {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		$(".fa-verify-count").text("※有效時間 " + minutes + ":" + seconds);

		if (--timer < 0) {
			clearInterval(timerId);
		}
	}, 1000);
}

$(".btn-get-verify").on("click", function (e) {
	if ($("#form-fa-bind").valid()) {
		e.preventDefault();
		getVerify();
		clearInterval(timerId);
		startTimer();
		$(".btn-get-verify").addClass("disabled");

		// 讓輸入框跟時間一起出現
		window.setTimeout(function () {
			$(".fa-verify").css("justify-content", "space-between");
			$("#input-code").css("display", "flex");
			$(".btn-get-verify").css({ "background-color": "lightgray", color: "#fff", "border-width": "0px" });
			$(".btn-get-verify").text("已獲得驗證碼");
			$("#vcode").focus();
		}, 1000);

		// 20秒後可再次取得驗證碼
		window.setTimeout(function () {
			$(".btn-get-verify").removeClass("disabled");
			$(".btn-get-verify").text("獲得手機驗證碼");
			$(".btn-get-verify").css({ "background-color": "#f6f6f5", color: "#000", "border-width": "1px" });
		}, 21000);
	}
});

new Vue({
	el: "#input-wrap",
	data: {
		code: "", // input value
		codeLength: 6, // 验证码长度
		telDisabled: false, // 判断是否输入完
		focused: false, // 让input焦点, 决定光标显示所在的位置
	},
	computed: {
		codeArr() {
			// 将 input value 分隔数组 [1, 2, 3]
			return this.code.split("");
		},
		cursorIndex() {
			// 判断code输入长度，光标显示在对应label上
			return this.code.length;
		},
	},
	watch: {
		code(newVal) {
			//限制 非数字
			this.code = newVal.replace(/[^\d]/g, "");
			$('input[name="code"]').val(this.code);
		},
	},
	beforeCreate: function () {},
	created: function () {},
	mounted: function () {},
	components: {},
	methods: {},
	template: `<div id="input-code">
		<input
		ref="vcode"
		id="vcode"
		type="tel"
		maxlength="6"
		v-model="code"
		@focus="focused = true"
		@blur="focused = false"
		:disabled="telDisabled">

		<label
			for="vcode"
			class="line"
			v-for="item,index in codeLength"
			:class="{'animated': focused && cursorIndex === index}"
			v-text="codeArr[index]"
		>
		</label>
	</div>
`,
});
