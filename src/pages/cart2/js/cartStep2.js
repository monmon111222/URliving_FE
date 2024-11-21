import validate from "@global/vendors/jquery.validate.min";
import address from "@global/components/member/address";
import invoice from "@global/components/member/invoice";
import checkShippingAddress from "@global/components/cart/checkShippingAddress";
import checkMobileCode from "@global/components/cart/checkMobileCode";
import Cookies from "js-cookie";
import detectLang from "@global/helpers/detectLang";
import addressBook from "@page/cart2/js/addressBook";
import shoppingWrap from "@page/cart2/js/shoppingWrap";

window.detectLang = detectLang();

const app = function (options) {
	const _self = this;

	const init = function (options) {
		_self.appShopping2 = new vueApp();

		domCache();
		_self.methods = methods;
		bindEvent();
	};

	const vueApp = function () {
		// 地址綁訂&發票綁訂
		const mergeApp = $.extend(true, {}, address.app, invoice, addressBook, shoppingWrap);
		mergeApp.data.isCVS = window.isCVS;
		mergeApp.data.isOverSeaMode = window.isOverSeaMode;
		mergeApp.data.isEmployee = window.isEmployee;

		const appShopping2 = new Vue(
			Object.assign(
				{
					el: "#app-shopping2",
				},
				mergeApp
			)
		);

		return appShopping2;
	};

	const domCache = function () {
		_self.$bookingName = $('input[name="name"]');
		_self.$bookingPhone = $('input[name="mobile"]');
		_self.$bookingAddress = $('input[name="address"]');
		_self.$bookingCounty = $('select[name="city"]');
		_self.$bookingCountrycode = $('select[name="countryCode"]');
		_self.$bookingDistrict = $('select[name="district"]');
		_self.$bookingZipcode = $(".twzipcode_1");
		_self.$recipientName = $('input[name="recipientName"]');
		_self.$recipientPhone = $('input[name="recipientMobile"]');
		_self.$recipientCountrycode = $('select[name="recipientCountryCode"]');
		_self.$recipientAddress = $('input[name="recipientAddress"]');
		_self.$invoiceAddress = $('input[name="InvoiceAddress"]');
		$('input[name="mail"]').on("input", function () {
			$("#update-info").prop("checked", true);
			$("#update-info").prop("readonly", true);
		});
		$("#update-info").on("input", function () {
			if ($("#update-info").prop("readonly")) {
				$("#update-info").prop("checked", true);
			}
		});
	};

	const methods = {
		stringBytes: function (s) {
			var arr = s.match(/[^\x00-\xff]/gi);
			return arr == null ? s.length : s.length + arr.length;
		},
		validateRegx: function () {
			$.validator.addMethod(
				"RecipientCustomsIDRegex",
				function (value, element, regexpr) {
					if ($("select[name='ischinacitizen']").val() === "true" && value.length !== 18) {
						// 中國公民驗證中國公民身分證長度為18碼
						return false;
					} else {
						return true;
					}
				},
				"請輸入18碼中國公民身分證"
			);
			$.validator.addMethod(
				"enAddress",
				function (value, element, regexpr) {
					if (
						window.shippingRegion === "中國" ||
						window.shippingRegion === "台灣及離島" ||
						window.shippingRegion === "香港" ||
						window.shippingRegion === "澳門"
					) {
						return true;
					} else {
						return regexpr.test(value) || value.length === 0;
					}
				},
				"請輸入英文或數字符號 (please enter English or digital)"
			);
			$.validator.addMethod(
				"enName",
				function (value, element, regexpr) {
					if (
						window.shippingRegion === "中國" ||
						window.shippingRegion === "台灣及離島" ||
						window.shippingRegion === "香港" ||
						window.shippingRegion === "澳門"
					) {
						return true;
					} else {
						return regexpr.test(value);
					}
				},
				"請輸入英文 (please enter English name)"
			);
			$.validator.addMethod(
				"addressRegx",
				function (value, element, regexpr) {
					var bool = true;
					regexpr.forEach(function (el, idx) {
						if (value.indexOf(el) !== -1) bool = false;
					});
					return bool;
				},
				window.detectLang === "tw" ? "請輸入正確地址格式" : "wrong format"
			);
			$.validator.addMethod(
				"regx",
				function (value, element, regexpr) {
					return regexpr.test(value);
				},
				window.detectLang === "tw" ? "請輸入正確手機格式" : "wrong format"
			);
			$.validator.addMethod(
				"countrycodeRegx",
				function (value, element, arg) {
					return arg !== value;
				},
				window.detectLang === "tw" ? "請選擇國碼" : "This field is required."
			);
			$.validator.addMethod(
				"recipientCountrycodeRegx",
				function (value, element, arg) {
					return arg !== value;
				},
				window.detectLang === "tw" ? "請選擇國碼" : "This field is required."
			);
			$.validator.addMethod(
				"regionRegx",
				function (value, element, arg) {
					return arg !== value;
				},
				window.detectLang === "tw" ? "請選擇地區" : "This field is required."
			);

			$.validator.addMethod(
				"nameRegx",
				function (value, element, arg) {
					if (value.indexOf(",") !== -1 || value.indexOf("，") !== -1) {
						// 包含逗號
						return false;
					} else {
						return true;
					}
					return arg !== value;
				},
				window.detectLang === "tw"
					? "姓名不得含有逗號(,) 請重新輸入"
					: "Name must not contain a comma(,), please re-enter"
			);

			$.validator.addMethod(
				"minByteRegx",
				function (value, element, arg) {
					return _self.methods.stringBytes(value) >= 4;
				},
				window.detectLang === "tw" ? "姓名過短，請重新輸入" : "Name is too short, please re-enter"
			);

			$.validator.addMethod(
				"maxByteRegx",
				function (value, element, arg) {
					if (window.DeliveryType === "OverSea" || window.DeliveryType === "HomeDelivery") {
						return _self.methods.stringBytes(value) <= 25;
					} else {
						return _self.methods.stringBytes(value) <= 10;
					}
					// return _self.methods.stringBytes(value) <= 25;
				},
				window.detectLang === "tw" ? "姓名過長，請重新輸入" : "Name is too long, please re-enter"
			);
			$.validator.addMethod(
				"InvoiceTaxRegx",
				function (value, element, arg) {
					var cx = [1, 2, 1, 2, 1, 2, 4, 1];
					var SUM = 0;
					var cnum = value.split("");
					for (var i = 0; i <= 7; i++) {
						SUM += cc(cnum[i] * cx[i]);
					}
					if (SUM % 10 == 0) {
						return true;
					} else if (cnum[6] == 7 && (SUM + 1) % 10 == 0) {
						return true;
					} else {
						return false;
					}

					function cc(n) {
						if (n > 9) {
							var s = n + "";
							var n1 = s.substring(0, 1) * 1;
							var n2 = s.substring(1, 2) * 1;
							n = n1 + n2;
						}
						return n;
					}
				},
				window.detectLang === "tw"
					? "統一編號有誤，請輸入8碼數字"
					: "The invoice tax number is incorrect. Please enter the 8 code number"
			);

			$.validator.addMethod(
				"InvoiceMobileCodeRegx",
				function (value, element, regexpr) {
					return regexpr.test(value);
				},
				window.detectLang === "tw" ? "條碼格式有誤，請重新輸入" : "wrong format"
			);
		},
		getBuyerInfo: function () {
			var obj = {
				name: _self.$bookingName.val(),
				phone: _self.$bookingPhone.val(),
				countrycode: _self.$bookingCountrycode.find("option:selected").attr("value"),
				county: _self.$bookingCounty.length > 0 ? _self.$bookingCounty.find("option:selected").val() : "",
				zipcode: _self.$bookingDistrict.length > 0 ? _self.$bookingDistrict.find("option:selected").val() : "",
				address: _self.$bookingAddress.length > 0 ? _self.$bookingAddress.val() : "",
			};
			return obj;
		},
		fillInRecipient: function (data) {
			if (data !== null) {
				_self.$recipientName.val(data.name);
				_self.$recipientPhone.val(data.phone);
				_self.$recipientCountrycode.val(data.countrycode);
				_self.appShopping2.$refs.c_areatw.seletedCounty = data.county;
				_self.appShopping2.$refs.c_areatw.selectedZipcode = data.zipcode;
				_self.appShopping2.$refs.c_areatw.selectedAddress = data.address;
			} else {
				_self.$recipientName.val("");
				_self.$recipientPhone.val("");
				_self.$recipientCountrycode.val("+886");
				if (window.isEmployee === "False") {
					_self.appShopping2.$refs.c_areatw.seletedCounty = "臺北市";
					_self.appShopping2.$refs.c_areatw.selectedZipcode = "中正區";
					_self.appShopping2.$refs.c_areatw.selectedAddress = "";
				}
			}
		},
	};

	const bindEvent = function () {
		// 中國公民下拉
		const $RecipientCustomsID = $("input[name='RecipientCustomsID']");

		$("select[name='ischinacitizen']").change(function (e) {
			if (e.target.value === "true") {
				$RecipientCustomsID.attr("placeholder", "請輸入中國公民身分證號碼 Citizen ID number");
			} else {
				$RecipientCustomsID.attr("placeholder", "請輸入護照號碼或台胞證號碼 Passport number or MTP number");
			}
		});

		// 縮合明細
		$(".btn-collapsed").click(function (e) {
			e.preventDefault();
			var target = $(this).attr("href");
			$(this).toggleClass("collapsed");
			$(target).slideToggle("fast");
		});

		// 收件人地址同/不同購買人
		$(".radio-recipient").change(function (e) {
			if ($("#not-same-as-buyer:checked").length == 1) {
				$("#collapseRecipient-1").slideDown("fast");
				_self.methods.fillInRecipient(null);
			} else {
				_self.methods.fillInRecipient(_self.methods.getBuyerInfo());
				$("#collapseRecipient-1").slideUp("fast");
			}
		});
		$(".check-recipient").change(function (e) {
			if ($(".check-recipient").is(":checked")) {
				_self.methods.fillInRecipient(_self.methods.getBuyerInfo());
				$("#collapseRecipient-1").slideUp("fast");
			} else {
				$("#collapseRecipient-1").slideDown("fast");
				_self.methods.fillInRecipient(null);
			}
		});
		// 發票地址同/不同購買人
		$("body").on("change", "#same-as-transfer", function (e) {
			var buyerData = _self.methods.getBuyerInfo();

			if (e.target.checked === undefined) return;

			if (e.target.checked) {
				$('input[name="InvoiceAddress"]').val($('input[name="address"]').val());

				_self.appShopping2.$refs.invoice_address.seletedCounty = buyerData.county;
				_self.appShopping2.$refs.invoice_address.selectedZipcode = buyerData.zipcode;
				_self.appShopping2.$refs.invoice_address.selectedAddress = buyerData.address;
			} else {
				$('input[name="InvoiceAddress"]').val("");

				_self.appShopping2.$refs.invoice_address.seletedCounty = "臺北市";
				_self.appShopping2.$refs.invoice_address.selectedZipcode = "中正區";
				_self.appShopping2.$refs.invoice_address.selectedAddress = "";
			}
		});

		// 檢查是否可離島
		function checkIfAllowShoreIsland() {
			var bool = true;

			if ($("select[name='recipientDistrict']").length > 0 && !window.isOffshoreIsland) {
				// 配送區域為台灣及離島 且 此單不能寄送離島
				var recipientDistrictVal = $("select[name='recipientDistrict'] >option:selected").text();
				var shoreIslandZipcodes = [
					"209",
					"209",
					"211",
					"212",
					"880",
					"881",
					"882",
					"883",
					"884",
					"885",
					"890",
					"891",
					"892",
					"893",
					"894",
					"896",
					"951",
					"952",
				];

				for (let el of shoreIslandZipcodes) {
					if (recipientDistrictVal.indexOf(el) > -1) {
						bool = false;
						break;
					}
				}
			} else {
				bool = true;
			}

			return bool;
		}

		// 服務條款檢查
		function checkPrivacy(form) {
			if ($("#agree-privacy:checked").length > 0) {
				if ($("#same-as-buyer:checked").length > 0 || window.isEmployee === "True") {
					var buyer_info = _self.methods.getBuyerInfo();
					_self.methods.fillInRecipient(buyer_info);
				}

				if (!checkIfAllowShoreIsland()) {
					AlertDialog.alert(
						window.detectLang === "tw"
							? "Oops！您的商品超過此運送方式限制，請更改配送方式或分開訂購喔！"
							: "Oops！Your item exceeds this shipping method limit."
					);
				} else {
					$(".change-pay-btn").addClass("disabled");

					Cookies.remove("coupon");
					Cookies.remove("autocoupon");
					Cookies.remove("preOrder");
					Cookies.remove("basket");
					Cookies.remove("temperature");

					form.submit();
				}
			} else {
				AlertDialog.alert(
					window.detectLang === "tw"
						? "請勾選同意接受服務條款"
						: "Please check to agree with the terms of use and privacy policy.",
					function () {
						$("input[type='submit'], button[type='submit']").removeClass("disabled");
					}
				);
			}
		}

		function addAddressBook() {
			// 檢查是否有勾選常用收件人地址並新增
			if ($("#add-recipient").is(":checked")) {
				let city = ""; // 縣市
				let district = ""; // 行政區
				let address = "";
				let address2 = "";
				let address3 = "";
				let zip = "";
				let customsClearanceID = "";

				if (window.shippingRegion === "台灣及離島") {
					city = $('select[name="recipientCity"]').val();
					district = $('select[name="recipientDistrict"]').val();
					address = $('input[name="recipientAddress"]').val();
				} else if (window.shippingRegion === "香港" || window.shippingRegion === "澳門") {
					address = $('input[name="recipientAddress"]').val();
				} else if (window.shippingRegion === "中國") {
					customsClearanceID = $("input[name='RecipientCustomsID']").val();
				} else {
					address = $('input[name="recipientAddress"]').val();
					address2 = $('input[name="recipientAddress2"]').val();
					address3 = $('input[name="recipientAddress3"]').val();
					city = $('input[name="recipientCity"]').val();
					zip = $('input[name="recipientZipCode"]').val();
				}

				$.ajax({
					type: "post",
					url: API_URL.ADDRESS_BOOK,
					data: {
						Name: _self.$recipientName.val(),
						PhoneNumber: _self.$recipientPhone.val(),
						CountryCode: _self.$recipientCountrycode.val(),
						Country: window.shippingRegion,
						Province: window.shippingProvince ? window.shippingProvince : "",
						City: city,
						District: district,
						Address: address,
						Address2: address2,
						Address3: address3,
						Zip: zip,
						CustomsClearanceID: customsClearanceID,
					},
					dataType: "json",
					xhrFields: {
						withCredentials: true,
					},
					error: function () {
						AlertDialog.alert("系統忙線中,請稍後再試", function () {});
					},
					success: function (res) {
						console.log(res);
					},
				});
			}
		}

		// 表單綁訂檢查
		_self.methods.validateRegx();
		$("#form-booking-info").validate({
			errorClass: "error",
			errorElement: "div",
			rules: {
				name: {
					required: true,
					minByteRegx: true,
					maxByteRegx: true,
					nameRegx: true,
				},
				mobile: {
					required: true,
					regx: /^[0-9]{5,15}$/,
				},
				address: {
					required: true,
					maxlength: 200,
					addressRegx: ["@"],
				},
				mail: {
					email: true,
					maxlength: 100,
				},
				city: "required",
				district: "required",
				recipientName: {
					required: true,
					minByteRegx: true,
					maxByteRegx: true,
					nameRegx: true,
					enName: /^[A-Za-z0-9\s\.]+$/,
				},
				recipientMobile: {
					required: true,
					regx: /^[0-9]{5,15}$/,
				},
				recipientAddress: {
					required: true,
					maxlength:
						window.shippingRegion === "中國" ||
						window.shippingRegion === "台灣及離島" ||
						window.shippingRegion === "香港" ||
						window.shippingRegion === "澳門"
							? 200
							: 45,
					addressRegx: ["@"],
					enAddress: /^[A-Za-z0-9\s\-\,\.\'\"\’\(\)\#\/]+$/,
				},
				recipientAddress2: {
					maxlength:
						window.shippingRegion === "中國" ||
						window.shippingRegion === "台灣及離島" ||
						window.shippingRegion === "香港" ||
						window.shippingRegion === "澳門"
							? 200
							: 45,
					addressRegx: ["@"],
					enAddress: /^[A-Za-z0-9\s\-\,\.\'\"\’\(\)\#\/]+$/,
				},
				recipientAddress3: {
					maxlength:
						window.shippingRegion === "中國" ||
						window.shippingRegion === "台灣及離島" ||
						window.shippingRegion === "香港" ||
						window.shippingRegion === "澳門"
							? 200
							: 45,
					addressRegx: ["@"],
					enAddress: /^[A-Za-z0-9\s\-\,\.\'\"\’\(\)\#\/]+$/,
				},
				recipientZipCode: {
					enAddress: /^[A-Za-z0-9\s\-\,\.\'\"\’\(\)\#\/]+$/,
					maxlength: 10,
				},
				recipientCity: {
					enAddress: /^[A-Za-z0-9\s\-\,\.\'\"\’\(\)\#\/]+$/,
					required: true,
					maxlength: 35,
				},
				recipientDistrict: "required",
				InvoiceCity: "required",
				InvoiceDistrict: "required",
				InvoiceAddress: {
					required: true,
					maxlength: 200,
				},
				InvoiceMobileCode: {
					required: true,
					// maxlength: 16,
					InvoiceMobileCodeRegx: /^\/{1}[0-9A-Z\+\-\.]{7}$/,
				},
				InvoiceTaxID: {
					required: true,
					number: true,
					InvoiceTaxRegx: "custom",
				},
				InvoiceCompanyTitle: {
					required: true,
					maxlength: 50,
				},
				InvoiceTaxCity: "required",
				InvoiceTaxDistrict: "required",
				InvoiceTaxAddress: {
					required: true,
					maxlength: 200,
				},
				region: { regionRegx: "default" },
				countrycode: { countrycodeRegx: "default" },
				recipientCountrycode: { recipientCountrycodeRegx: "default" },
				RecipientCustomsID: {
					required: true,
					RecipientCustomsIDRegex: true,
				},
			},
			messages: {
				name: {
					required: window.detectLang === "tw" ? "請輸入訂購人姓名" : "This field is required.",
					maxlength: window.detectLang === "tw" ? "姓名過長，請重新輸入" : "Name is too long, please re-enter",
				},
				mobile: {
					required: window.detectLang === "tw" ? "請輸入訂購人手機" : "This field is required.",
				},
				address: {
					required: window.detectLang === "tw" ? "請輸入地址" : "This field is required.",
					maxlength: window.detectLang === "tw" ? "地址過長，請重新輸入" : "The address is too long, please re-enter",
				},
				mail: {
					required: window.detectLang === "tw" ? "請輸入email" : "This field is required.",
					email: window.detectLang === "tw" ? "請輸入正確email格式" : "Please enter correct email format.",
					maxlength: window.detectLang === "tw" ? "email過長，請重新輸入" : "Email is too long, please re-enter",
				},
				city: {
					required: window.detectLang === "tw" ? "請選擇縣市區域" : "This field is required.",
				},
				district: {
					required: window.detectLang === "tw" ? "請選擇鄉鎮市區域" : "This field is required.",
				},
				recipientName: {
					required: window.detectLang === "tw" ? "請輸入收件人姓名" : "This field is required.",
					maxlength: window.detectLang === "tw" ? "姓名過長，請重新輸入" : "Name is too long, please re-enter",
				},
				recipientMobile: {
					required: window.detectLang === "tw" ? "請輸入收件人手機" : "This field is required.",
				},
				recipientAddress: {
					required: window.detectLang === "tw" ? "請輸入收件地址" : "This field is required.",
				},
				recipientCity: {
					required: window.detectLang === "tw" ? "請選擇/輸入縣市區域" : "This field is required.",
				},
				recipientDistrict: {
					required: window.detectLang === "tw" ? "請選擇鄉鎮市區域" : "This field is required.",
				},
				InvoiceCity: {
					required: window.detectLang === "tw" ? "請選擇縣市區域" : "This field is required.",
				},
				InvoiceDistrict: {
					required: window.detectLang === "tw" ? "請選擇鄉鎮市區域" : "This field is required.",
				},
				InvoiceAddress: {
					required: window.detectLang === "tw" ? "請輸入發票寄送地址" : "This field is required.",
					maxlength: window.detectLang === "tw" ? "地址過長，請重新輸入" : "The address is too long, please re-enter",
				},
				InvoiceMobileCode: {
					required: window.detectLang === "tw" ? "請輸入手機載具條碼" : "This field is required.",
					// maxlength: "手機載具條碼過長，請重新輸入"
				},
				InvoiceTaxID: {
					required: window.detectLang === "tw" ? "請輸入統一編號" : "This field is required.",
					number: window.detectLang === "tw" ? "請輸入數字格式" : "Please enter a number format",
				},
				InvoiceCompanyTitle: {
					required: window.detectLang === "tw" ? "請輸入發票抬頭" : "This field is required.",
					maxlength:
						window.detectLang === "tw" ? "發票抬頭過長，請重新輸入" : "Invoice title is too long, please re-enter",
				},
				InvoiceTaxCity: {
					required: window.detectLang === "tw" ? "請選擇縣市區域" : "This field is required.",
				},
				InvoiceTaxDistrict: {
					required: window.detectLang === "tw" ? "請選擇鄉鎮市區域" : "This field is required.",
				},
				InvoiceTaxAddress: {
					required: window.detectLang === "tw" ? "請輸入發票寄送地址" : "This field is required.",
					maxlength: window.detectLang === "tw" ? "地址過長，請重新輸入" : "The address is too long, please re-enter",
				},
				RecipientCustomsID: {
					required: window.detectLang === "tw" || window.detectLang === "cn" ? "此欄位必填" : "This field is required.",
					maxlength:
						window.detectLang === "tw" || window.detectLang === "cn" ? "請輸入18碼" : "Please enter 18 characters",
					minlength:
						window.detectLang === "tw" || window.detectLang === "cn" ? "請輸入18碼" : "Please enter 18 characters",
				},
			},
			errorPlacement: function (error, element) {
				element.parent().append(error);
			},
			submitHandler: function (form) {
				$("input[type='submit'], button[type='submit']").addClass("disabled");

				checkShippingAddress(_self.appShopping2)
					.then(() => {
						checkMobileCode(_self.appShopping2)
							.then(() => {
								addAddressBook();
								checkPrivacy(form);
							})
							.catch((error) => {
								console.warn(error);
							});
					})
					.catch((error) => {
						console.warn(error);
					});

				return false;
			},
		});
	};

	init.call(this, options);
};

export default app;
