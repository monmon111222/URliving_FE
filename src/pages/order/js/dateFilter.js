import Vue from "vue";
import DATEFILTER_TMPL from "@page/order/template/dateFilter.pug";

const dateFilter = {
	template: DATEFILTER_TMPL,
	data: function () {
		return {
			nowDate: "",
			preDate: "",
			nextDate: "",
			startDate: "",
			endDate: "",
		};
	},
	mounted: function () {
		// 取當前日期
		this.nowDate = new Date();
		// 取下個月份末日
		if (window.orderType === "online") {
			this.nextDate = window.EndTimeStamp
				? new Date(window.EndTimeStamp)
				: new Date(this.nowDate.getFullYear(), this.nowDate.getMonth() + 2, 0);
			// 取上個月份首日
			this.preDate = window.StartTimeStamp
				? new Date(window.StartTimeStamp)
				: new Date(this.nowDate.getFullYear(), this.nowDate.getMonth() - 5);
		} else {
			this.nextDate = window.StoreEndTimeStamp
				? new Date(window.StoreEndTimeStamp)
				: new Date(this.nowDate.getFullYear(), this.nowDate.getMonth() + 2, 0);
			// 取上個月份首日
			this.preDate = window.StoreStartTimeStamp
				? new Date(window.StoreStartTimeStamp)
				: new Date(this.nowDate.getFullYear(), this.nowDate.getMonth() - 5);
		}

		this.validateNext();
	},
	methods: {
		validateNext() {
			if (
				this.nextDate.getFullYear() >= this.nowDate.getFullYear() &&
				this.nextDate.getMonth() >= this.nowDate.getMonth()
			) {
				this.setDate(
					this.preDate.getFullYear(),
					this.preDate.getMonth(),
					this.nowDate.getFullYear(),
					this.nowDate.getMonth()
				);
				document.getElementById("btn-date-next").classList.add("disabled");
				this.nextDate = this.nowDate;
			} else {
				this.setDate(
					this.preDate.getFullYear(),
					this.preDate.getMonth(),
					this.nextDate.getFullYear(),
					this.nextDate.getMonth()
				);
				document.getElementById("btn-date-next").classList.remove("disabled");
			}
			document.getElementById("orderStartTimeStamp").value = this.preDate.getTime();
			document.getElementById("orderEndTimeStamp").value = this.nextDate.getTime();
		},
		setDate(year1, month1, year2, month2) {
			month1++;
			month2++;
			if (month1 < 10) {
				this.startDate = year1 + "/0" + month1;
			} else {
				this.startDate = year1 + "/" + month1;
			}
			if (month2 < 10) {
				this.endDate = year2 + "/0" + month2;
			} else {
				this.endDate = year2 + "/" + month2;
			}
		},
		preMonth() {
			// 取區間起始月份首日
			this.preDate = new Date(this.preDate.getFullYear(), this.preDate.getMonth() - 5);
			// 取區間結束月份末日
			this.nextDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth() - 4, 0);
			this.validateNext();
			document.getElementById("from-order-date").submit();
		},
		nextMonth() {
			// 取區間起始月份首日
			this.preDate = new Date(this.preDate.getFullYear(), this.preDate.getMonth() + 5, 1);
			// 取區間結束月份末日
			this.nextDate = new Date(this.nextDate.getFullYear(), this.nextDate.getMonth() + 6, 0);
			this.validateNext();
			document.getElementById("from-order-date").submit();
		},
	},
};

export default dateFilter;
