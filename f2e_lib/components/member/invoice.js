const invoice = {
	template: "#invoice-template",
};

const invoiceMobile = {
	template: "#invoiceMobile-template",
};

const invoiceDonate = {
	template: "#invoiceDonate-template",
};

const invoiceTax = {
	template: "#invoiceTax-template",
};

const invoiceApp = {
	components: {
		invoice,
		invoiceMobile,
		invoiceDonate,
		invoiceTax,
	},
	data: {
		selectedInvoice: 1,
		invoiceArray: [
			{ key: 1, name: "電子發票 E-invoice" },
			{ key: 2, name: "電子發票(手機載具) E-Invoice carrier" },
			{ key: 3, name: "捐贈發票 Donation Invoice" },
			{ key: 4, name: "統編(公司戶)發票 Company Tax ID number Invoice" },
		],
		openEInvioceRegister: window.openEInvioceRegister,
		datas: [
			{ name: "電子發票", City: "臺北市", District: "", Address: "" },
			{ name: "電子發票(手機載具)", MobileCode: "" },
			{ name: "捐贈發票", Donate: 1 },
			{ name: "統編(公司戶)發票", Title: "", TaxID: "", City: "臺北市", District: "中正區", Address: "" },
		],
		dataIsLoad: false,
	},
	created() {
		this.getLastInvoiceSetting();
	},
	methods: {
		openInvoiceWindow: function () {
			var config =
				"width=1024,height=600,status=0,scrollbars=1,left=" +
				(window.screen.availWidth - 10 - 1024) / 2 +
				",top=" +
				(window.screen.availHeight - 30 - 600) / 2;
			var myWindow = window.open("/api/v1/einvoice/login", "_blank", config);
		},
		getLastInvoiceSetting() {
			// 取得最近一次載具資料
			var _this = this;
			$.ajax({
				type: "GET",
				url: API_URL.LAST_INVOICE_SETTING,
				success: function (res) {
					_this.dataIsLoad = true;
					if (res.Code === 200) {
						var invoiceDatas = res.Response;
						if (invoiceDatas !== null) {
							switch (invoiceDatas.Type) {
								case 1:
									_this.selectedInvoice = 1;
									_this.datas[0].City = invoiceDatas.City || "臺北市";
									_this.datas[0].District = invoiceDatas.District || "中正區";
									_this.datas[0].Address = invoiceDatas.Address || "";
									break;
								case 2:
									_this.selectedInvoice = 2;
									_this.datas[1].MobileCode = invoiceDatas.MobileCode || "";
									break;
								case 3:
									_this.selectedInvoice = 3;
									_this.datas[2].Donate = invoiceDatas.Donate || 1;
									break;
								case 4:
									_this.selectedInvoice = 4;
									_this.datas[3].Title = invoiceDatas.Title || "";
									_this.datas[3].TaxID = invoiceDatas.TaxID || "";
									_this.datas[3].City = invoiceDatas.City || "臺北市";
									_this.datas[3].District = invoiceDatas.District || "中正區";
									_this.datas[3].Address = invoiceDatas.Address || "";
									break;
							}
						} else {
							_this.selectedInvoice = 1;
							_this.datas[0].City = "臺北市";
							_this.datas[0].District = "中正區";
							_this.datas[0].Address = "";
						}
					}
				},
			});
		},
	},
};

export default invoiceApp;
