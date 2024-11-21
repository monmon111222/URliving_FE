import CARTPAY_TMPL from "@page/cart/js/cartPayTmpl";
import Cookies from "js-cookie";

module.exports = {
	name: "CartPay",
	template: CARTPAY_TMPL,
	props: [
		"dataisload",
		"datas",
		"autocouponcode",
		"isfriend",
		"isemployee",
		"memo",
		"coupon",
		"region",
		"paytype",
		"deliverytype",
		"province",
		"cvscode",
		"cvsname",
		"cvsaddress",
		"isforeign",
		"canpay",
		"candelivery",
		"isoffshoreisland",
		"installment",
	],
	data() {
		return {
			selectedPayType: this.paytype,
			payTypes: [
				{
					name: "信用卡線上刷卡",
					eName: "Credit card",
					value: 1,
					enabled: !this.isforeign,
				},
				{
					name: "貨到付款(超商)",
					eName: "Cash on delivery(cvs)",
					value: 3,
					enabled: false,
				}, // 暫不開放
				{
					name: "ATM轉帳",
					value: 5,
					eName: "ATM transfer",
					enabled: !this.isforeign,
				},
				{
					name: "銀聯卡",
					value: 4,
					eName: "UnionPay card",
					enabled: !this.isforeign,
				},
				{
					name: '<div class="d-inline-block align-middle lh-15"><span>Fasney後支付</span><img class="d-inline-block align-middle" style="width: 20px;" class="mr-2" src="https://s.azurecdns.com/sff/common/stylesheets/icons/fasney-logo.png"><br><span>(免卡/免手續費/最晚45天繳款)</span></div>',
					value: 9,
					enabled: false,
				},
			],
			selectedRegion: this.region,
			regions: [],
			selectedProvince: this.province,
			provinces: [],
			roleEmployee: {
				payType: [
					{
						name: "信用卡線上刷卡",
						eName: "Credit card",
						value: 1,
						enabled: false,
					},
					{ name: "ATM轉帳", eName: "ATM transfer", value: 5, enabled: false },
					{ name: "銀聯卡", eName: "银联卡", value: 4, enabled: false },
					{ name: "街口支付", eName: "JKOPAY", value: 6, enabled: false },
					{ name: "LinePay", eName: "LinePay", value: 7, enabled: false },
					// {
					//   name:
					//     '<div class="d-inline-block align-middle lh-15"><span>Fasney後支付</span><img class="d-inline-block align-middle" style="width: 20px;" class="mr-2" src="https://s.azurecdns.com/sff/common/stylesheets/icons/fasney-logo.png"><br><span>(免卡/免手續費/最晚45天繳款)</span></div>',
					//   value: 9,
					//   enabled: false,
					// },
				],
				deliverType: [{ name: "員購自取", value: 5, enabled: true }],
			},
			roleForeigner: {
				payType: [
					{
						name: "信用卡線上刷卡",
						eName: "Credit card",
						value: 1,
						enabled: false,
					},
					{ name: "ATM轉帳", eName: "ATM transfer", value: 5, enabled: false },
					{ name: "銀聯卡", eName: "UnionPay card", value: 4, enabled: false },
					{ name: "街口支付", eName: "JKOPAY", value: 6, enabled: false },
					{ name: "LinePay", eName: "LinePay", value: 7, enabled: false },
					// {
					//   name:
					//     '<div class="d-inline-block align-middle lh-15"><span>Fasney後支付</span><img class="d-inline-block align-middle" style="width: 20px;" class="mr-2" src="https://s.azurecdns.com/sff/common/stylesheets/icons/fasney-logo.png"><br><span>(免卡/免手續費/最晚45天繳款)</span></div>',
					//   value: 9,
					//   enabled: false,
					// },
				],
				deliverType: [
					{
						name: "海外運送",
						value: 4,
						enabled: true,
						eName: "Overseas delivery",
					},
				],
			},
			roleGeneral: {
				payType: [
					{
						name: "信用卡線上刷卡",
						eName: "Credit card",
						value: 1,
						enabled: false,
					},
					{
						name: "貨到付款(宅配)",
						eName: "Cash on delivery(Home delivery)",
						value: 2,
						enabled: false,
					},
					{
						name: "貨到付款(超商)",
						eName: "Cash on delivery(cvs)",
						value: 3,
						enabled: false,
					},
					{ name: "ATM轉帳", eName: "ATM transfer", value: 5, enabled: false },
					{ name: "銀聯卡", eName: "UnionPay card", value: 4, enabled: false },
					{ name: "街口支付", eName: "JKOPAY", value: 6, enabled: false },
					{ name: "LinePay", eName: "LinePay", value: 7, enabled: false },
					// {
					//   name:
					//     '<div class="d-inline-block align-middle lh-15"><span>Fasney後支付</span><img class="d-inline-block align-middle" style="width: 20px;" class="mr-2" src="https://s.azurecdns.com/sff/common/stylesheets/icons/fasney-logo.png"><br><span>(免卡/免手續費/最晚45天繳款)</span></div>',
					//   value: 9,
					//   enabled: false,
					// },
				],
				deliverType: [
					{ name: "宅配", eName: "Home delivery", value: 1, enabled: false },
					{
						name: "全家、OK、萊爾富取貨",
						eName: "CVS delivery",
						value: 3,
						enabled: false,
					},
					{
						name: "7-11超商取貨",
						eName: "7-11 store",
						value: 2,
						enabled: false,
					},
					{
						name: "全家超商取貨",
						eName: "Familymart store",
						value: 7,
						enabled: false,
					},
				],
			},
			employeeRegions: [{ name: "台灣及離島", eName: "Taiwan", value: 1 }],
			selectedDeliveryType: this.deliverytype,
			isForeign: this.isforeign,
			deliveryTypes: [
				{
					name: "宅配",
					eName: "Home delivery",
					value: 1,
					enabled: !this.isforeign && this.paytype !== 3 && !this.isemployee,
				},
				{
					name: "全家、OK、萊爾富取貨",
					eName: "CVS delivery",
					value: 3,
					enabled: false,
				},
				{
					name: "7-11超商取貨",
					eName: "7-11 store",
					value: 2,
					enabled: !this.isforeign && !this.isemployee,
				},
				{
					name: "海外運送",
					eName: "Overseas delivery",
					value: 4,
					enabled: this.isforeign && !this.isemployee,
				},
				{
					name: "全家超商取貨",
					eName: "Familymart store",
					value: 7,
					enabled: !this.isforeign && !this.isemployee,
				},
			],
			selectedCvsCode: this.cvscode,
			selectedCvsName: this.cvsname,
			selectedCvsAddress: this.cvsaddress,
			myCoupon: [],
			isEmployee: this.isemployee,
			selectedInstallmentPlan: "",
		};
	},
	computed: {
		couponCode() {
			return this.coupon;
		},
		getFasneyPayment() {
			return this.memo.PayMemo.CanUseFasneyInstallmentPlan;
		},
	},
	watch: {
		dataisload(val) {
			if (val) {
				this.getInitRoleType();
				this.getSitePayType();
				this.getSiteDelevery();
				this.getInitRegion();
			}
		},
		isemployee(val) {
			if (val) {
				this.selectedDeliveryType = 5;
				this.$emit("deliverytype", 5);
			}
		},
		selectedPayType(val) {
			var delivery711 = this.deliveryTypes.find((obj) => obj.value == 2);
			var deliveryCvs = this.deliveryTypes.find((obj) => obj.value == 3);
			var deliveryCat = this.deliveryTypes.find((obj) => obj.value == 1);
			var deliveryFamily = this.deliveryTypes.find((obj) => obj.value == 7);

			if (this.selectedPayType === 2 && this.selectedRegion == 1) {
				// 貨到宅配
				deliveryFamily !== undefined ? (deliveryFamily.enabled = false) : "";
				delivery711 !== undefined ? (delivery711.enabled = false) : "";
				deliveryCvs !== undefined ? (deliveryCvs.enabled = false) : "";
				deliveryCat !== undefined ? (deliveryCat.enabled = true) : "";
				this.selectedDeliveryType = 1;
				this.$emit("deliverytype", 1);
			} else if (this.selectedPayType === 3 && this.selectedRegion == 1) {
				// 貨到超商
				deliveryFamily !== undefined ? (deliveryFamily.enabled = true) : "";
				delivery711 !== undefined ? (delivery711.enabled = true) : "";
				deliveryCvs !== undefined ? (deliveryCvs.enabled = true) : "";
				deliveryCat !== undefined ? (deliveryCat.enabled = false) : "";
				this.selectedDeliveryType = 2;
				this.$emit("deliverytype", 2);
			} else if (this.selectedRegion === 1) {
				deliveryFamily !== undefined ? (deliveryFamily.enabled = true) : "";
				delivery711 !== undefined ? (delivery711.enabled = true) : "";
				deliveryCvs !== undefined ? (deliveryCvs.enabled = true) : "";
				deliveryCat !== undefined ? (deliveryCat.enabled = true) : "";
			}

			if (this.selectedPayType !== 9) {
				this.selectedInstallmentPlan = "";
			}

			this.$emit("paytype", val);
		},
		selectedRegion(val) {
			this.getInitRoleType();
			this.getSitePayType();
			this.getSiteDelevery();
			if (val === 1) {
				// 國內
				this.selectedDeliveryType = this.deliveryTypes[0].value;
				this.$emit("deliverytype", this.deliveryTypes[0].value);
			} else {
				this.selectedDeliveryType = 4; //預設海外運送
				this.selectedPayType = 1; //預設信用卡支付
				this.$emit("paytype", 1);
				this.$emit("deliverytype", 4);
				this.$emit("province", "");
			}

			if (val !== 17) {
				this.selectedProvince = "";
				this.$emit("province", "");
			}
			this.$emit("region", val);
		},
		selectedProvince(val) {
			if (val == "") {
				this.selectedProvince = "";
			}
			this.$emit("province", val);
		},
		selectedDeliveryType(val) {
			if (val !== 2 || val !== 3 || val !== 7) {
				this.selectedCvsCode = "";
				this.selectedCvsName = "";
				this.selectedCvsAddress = "";
			}
			this.$emit("deliverytype", val);
		},
	},
	created() {
		if (this.dataisload) {
			this.getInitRoleType();
			this.getSitePayType();
			this.getSiteDelevery();
			this.getInitRegion();
		}
	},
	mounted() {
		if (this.installment && this.paytype === 9) {
			this.changeInstallmentPlan(this.installment);
			window.setTimeout(() => {
				document.getElementById(`fasneyPay${this.installment}`).checked = true;
			}, 1000);
		}
	},
	methods: {
		getInitRegion() {
			const arr = JSON.parse(window.shippingRegion);

			arr.forEach((element) => {
				let cName = "";
				let eName = "";

				switch (element.ChineseName) {
					case "台灣及離島":
						cName = "台灣本島及離島";
						eName = element.EnglishName;
						break;
					case "中國":
						cName = "中國大陸";
						eName = element.EnglishName;
						break;
					case "香港":
						cName = "香港SAR";
						eName = element.EnglishName + " " + "SAR";
						break;
					case "澳門":
						cName = "澳門SAR";
						eName = element.EnglishName + " " + "SAR";
						break;
					default:
						cName = element.ChineseName;
						eName = element.EnglishName;
				}

				this.regions.push({
					name: cName + " " + eName,
					value: element.ID,
					eName: eName,
				});
			});

			this.provinces.push({ name: "請選擇省份", value: "" });

			arr[1].Province.forEach((element) => {
				this.provinces.push({
					name: element.SimpleChineseName,
					value: element.ID,
				});
			});
		},
		getInitRoleType() {
			if (this.isemployee) {
				this.payTypes = this.roleEmployee.payType;
				this.deliveryTypes = this.roleEmployee.deliverType;
				this.selectedDeliveryType = 5;
				this.$emit("deliverytype", 5);
			} else if (this.selectedRegion !== 1) {
				this.payTypes = this.roleForeigner.payType;
				this.deliveryTypes = this.roleForeigner.deliverType;
			} else {
				this.payTypes = this.roleGeneral.payType;
				this.deliveryTypes = this.roleGeneral.deliverType;
			}
		},
		getSiteDelevery() {
			let siteDelevery = [];

			this.deliveryTypes.forEach((ele) => {
				if (this.memo.DeliveryMemo.AllDelivery.includes(ele.value)) {
					ele.enabled = true;
					siteDelevery.push(ele);
				}
			});

			this.deliveryTypes = siteDelevery;
			if (this.selectedPayType === 2 && this.selectedRegion == 1) {
				this.deliveryTypes.find((obj) => obj.value == 2) !== undefined
					? (this.deliveryTypes.find((obj) => obj.value == 2).enabled = false)
					: "";
				this.deliveryTypes.find((obj) => obj.value == 3) !== undefined
					? (this.deliveryTypes.find((obj) => obj.value == 3).enabled = false)
					: "";
				this.deliveryTypes.find((obj) => obj.value == 7) !== undefined
					? (this.deliveryTypes.find((obj) => obj.value == 7).enabled = false)
					: "";
			} else if (this.selectedPayType === 3 && this.selectedRegion == 1) {
				this.deliveryTypes.find((obj) => obj.value == 1).enabled = false;
			}
		},
		getSitePayType() {
			this.payTypes.forEach((ele) => {
				if (this.memo.PayMemo.AllPayType.includes(ele.value)) {
					ele.enabled = true;
				}
			});
		},
		getCoupon() {
			this.$emit("openpopup");
		},
		checkCoupon(val) {
			this.$emit("coupon", val);
			this.couponCode = val;
		},
		choseCVS() {
			if (this.deliverytype === 2) {
				var url = "/ConvenienceStore/Choose?type=1";
			} else if (this.deliverytype === 3) {
				var url = "/ConvenienceStore/Choose?type=2";
			} else if (this.deliverytype === 7) {
				var url = "/ConvenienceStore/Choose?type=3";
			}
			if (this.coupon.length !== 0) {
				Cookies.set("coupon", this.couponCode);
			}
			window.location.href =
				url +
				"&ShippingRegion=" +
				this.region +
				"&PayType=" +
				this.paytype +
				"&DeliveryType=" +
				this.deliverytype +
				"&Coupon=" +
				this.coupon +
				"&IsOffshoreIsland=" +
				this.isoffshoreisland +
				"&InstallmentPlan=" +
				this.selectedInstallmentPlan;
		},
		changeInstallmentPlan(fasneyPayValue) {
			this.selectedInstallmentPlan = Number(fasneyPayValue);
			this.selectedPayType = 9;
		},
	},
};
