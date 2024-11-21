import common from "@page/common/js/common";
import axios from "axios";

Vue.config.devtools = true;

new Vue({
	name: "Member",
	el: "#member-app",
	data: {
		showPopup: false,
		mobile: "",
		countryCode: "886",
		showPhoneWarning: false,
		step: 1,
		stamp: "",
		verifyCode: "",
		countDownSecond: 300,
		canResendCode: false,
		countdownID: null,
		showCodeWarning: false,
		tipObj: {
			clickCount: false,
			orderCount: false,
		},
	},
	methods: {
		showVerifyPopup() {
			this.showPopup = true;
		},
		closeVerifyPopup() {
			this.showPopup = false;
			this.step = 1;
			this.mobile = "";
			this.showPhoneWarning = false;
			this.canResendCode = false;
			clearInterval(this.countdownID);
			this.countDownSecond = 300;
		},
		getVerifyCode() {
			if (this.mobile === "") {
				this.showPhoneWarning = true;
				return;
			}

			axios
				.get(API_URL.VERIFY_PHONE, {
					params: {
						CellPhone: this.mobile,
						CountryCode: this.countryCode,
					},
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.stamp = res.data.Response.Stamp;
						this.step = 2;
						this.countDown();
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		resendCode() {
			this.canResendCode = false;

			axios
				.get(API_URL.VERIFY_PHONE, {
					params: {
						CellPhone: this.mobile,
						CountryCode: this.countryCode,
					},
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.stamp = res.data.Response.Stamp;
						this.countDown();
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		countDown() {
			let countdownCount = 300;

			this.countdownID = setInterval(() => {
				this.countDownSecond = countdownCount;

				countdownCount--;

				if (countdownCount < 0) {
					clearInterval(this.countdownID);
					this.canResendCode = true;
				}
			}, 1000);
		},
		handleSubmit() {
			if (this.verifyCode === "") {
				this.showCodeWarning = true;
				return;
			}

			const form = this.$refs.formRef;

			form.submit();
		},
		showTip(type, isOpen) {
			this.tipObj[type] = isOpen;
		},
	},
});
