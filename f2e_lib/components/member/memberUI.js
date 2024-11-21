module.exports = {
	printCarrierNote: function () {
		var $el = $(".section-return-process");

		function openWindow() {
			var printWindow = window.open("", "printWindow", "height=800,width=980");
			var $linkCss = $('link[rel="stylesheet"]');
			var brandName =
				nowBrand.globalConfig && nowBrand.globalConfig.name
					? nowBrand.globalConfig.name // 新的指定方法
					: nowBrand.name; // 舊的指定方法
			var nowBrandName = brandName.toUpperCase();

			printWindow.document.write("<html><head><title>" + nowBrandName + "</title>");
			$linkCss.each(function (index, elm) {
				printWindow.document.write('<link rel="stylesheet" href="' + $(elm).attr("href") + '">');
			});
			printWindow.document.write('</head><body onload="print()" class="print">');
			printWindow.document.write('<div class="section-return-process section-return-process--print">');
			printWindow.document.write($el.html());
			printWindow.document.write("</div>");
			printWindow.document.write("</body></html>");

			printWindow.document.close();
			printWindow.focus();
			// printWindow.print()
			// printWindow.close()

			return true;
		}

		if ($el.length > 0) {
			$(".order-return-note .btn").on("click", function (event) {
				event.preventDefault();
				openWindow();
			});
		}
	},

	editMemberBirth: function () {
		var $birthdayY = $(".birthdayY");
		var $birthdayM = $(".birthdayM");
		var $birthdayD = $(".birthdayD");
		var userBirthYear = null;
		var userBirthMonth = null;

		function createYears() {
			var today = new Date().getFullYear();
			var startDay = today - 100;
			var output = '<option value="">--請選擇--</option>';

			for (var i = startDay; i <= today; i++) {
				output += '<option value="' + i + '">' + i + "</option>";
			}

			return output;
		}

		function createMonths(option) {
			var output = '<option value="">--請選擇--</option>';

			if (option === "clear") return output;

			for (var i = 1; i <= 12; i++) {
				output += '<option value="' + i + '">' + i + "</option>";
			}

			return output;
		}

		function createDays(option) {
			var isFullMonth = [true, false, true, false, true, false, true, true, false, true, false, true];
			var isLeapYear = new Date(userBirthYear, 1, 29).getMonth() === 1;
			var output = '<option value="">--請選擇--</option>';
			var days;

			if (option === "clear") return output;

			if (userBirthMonth === 2) {
				days = isLeapYear ? 29 : 28;
			} else {
				days = isFullMonth[userBirthMonth - 1] ? 31 : 30;
			}

			for (var i = 1; i <= days; i++) {
				output += '<option value="' + i + '">' + i + "</option>";
			}

			return output;
		}

		if ($birthdayY.length > 0) {
			$birthdayY.html(createYears());

			$birthdayY.on("change", function () {
				userBirthYear = this.options[this.selectedIndex].value;

				if (userBirthYear === "") {
					$birthdayM.html(createMonths("clear")).trigger("change");
				} else {
					$birthdayM.html(createMonths()).trigger("change");
				}
			});

			$birthdayM.on("change", function () {
				userBirthMonth = this.options[this.selectedIndex].value;

				if (userBirthMonth === "") {
					$birthdayD.html(createDays("clear"));
				} else {
					$birthdayD.html(createDays());
				}
			});
		}
	},

	toggleBankManual: function () {
		$(".btn-toggle-bankid").on("click", function (event) {
			var $this = $(this);
			var $bankId = $(".bank-id");
			var toggleClassName = "show-manual";
			var manualString = "手動輸入銀行代碼";
			var selectString = "選擇銀行代碼";
			var isManual = $bankId.hasClass(toggleClassName);

			if (isManual) {
				$bankId.removeClass(toggleClassName);
				$this.html(manualString);
			} else {
				$bankId.addClass(toggleClassName);
				$bankId.find("input").focus();
				$this.html(selectString);
			}
		});
	},
};
