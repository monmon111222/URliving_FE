import NewImage from "@global/components/global/image";
import utmKDetect from "@global/helpers/utmKDetect";
import dialogTmpl from "@page/onePage/js/dialogTmpl";
import store from "@global/components/store/index.js";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("miniCartModule");

const productDialog = {
	template: dialogTmpl,
	store,
	props: ["alldatas", "selected", "hasstock", "dataisload", "isopen", "btnlock"],
	components: { NewImage },
	data: function () {
		return {
			selectedSpec: null,
			selectedSpecID: null,
			selectedSpecKey: null,
			counter: 1,
			btnStyle: "disabled",
			btnDescription: "請選擇尺寸",
			checkisopen: false,
		};
	},
	computed: {
		btnStyleGenerate: {
			get: function () {
				if (this.alldatas.IsPreShow) {
					this.btnStyle = "disabled";
				}
				return this.btnStyle;
			},
			set: function (newVal) {
				this.btnStyle = newVal;
			},
		},
		btnDescriptionGenerate: {
			get: function () {
				if (this.alldatas.IsPreShow) {
					this.btnDescription = "COMING SOON";
				}

				return this.btnDescription;
			},
			set: function (newVal) {
				this.btnDescription = newVal;
			},
		},
	},
	watch: {
		dataisload: function (val) {
			if (val) this.pickSize(this.alldatas.ColorID);
		},
	},
	methods: {
		...mapActions(["getCartInfo"]),
		pickSize: function (colorID) {
			let data = this.alldatas.Colors.find((element) => element.ID === colorID);
			if (data.Specs.length === 1 && data.Specs[0].Name === "F") {
				this.selectSpec(data.Specs[0]);
			}
		},
		closeSelf: function () {
			this.$emit("close", false);
			this.btnReset();
			this.clearSpec();
		},
		selectSpec: function (spec) {
			this.selectedSpec = spec;
			this.selectedSpecID = spec.ID;
			this.selectedSpecKey = spec.Key;
			this.resetCounter();
			this.getBtnStatus(spec.Stock, spec.IsOutOfStock, spec.PreOrder);
		},
		clearSpec: function () {
			this.selectedSpec = null;
			this.selectedSpecID = null;
			this.selectedSpecKey = null;
		},
		addCount: function (maxCount, limit) {
			if (this.counter >= maxCount || this.counter >= 20) return;
			if (this.counter >= limit && limit !== 0) return;
			this.counter++;
		},
		reduceCount: function () {
			if (this.counter <= 1) return;
			this.counter--;
		},
		resetCounter: function () {
			this.counter = 1;
		},
		changeImg: function (colorID) {
			if (this.selected.ID === colorID) return;
			this.selectedSpec = null;
			this.btnReset();
			this.clearSpec();
			this.resetCounter();
			this.$emit("change-selected", colorID);
			this.pickSize(colorID);
		},
		getBtnStatus: function (stock, isSoldOut, isPreOrder) {
			if (stock === 0 && isSoldOut && !isPreOrder) {
				// 現貨無庫存且斷貨
				this.btnStyleGenerate = "disabled";
				this.btnDescriptionGenerate = "暫無庫存";
			} else if (stock === 0 && !isPreOrder) {
				// 現貨無庫存
				this.btnStyleGenerate = "disabled";
				this.btnDescriptionGenerate = "暫無庫存";
			} else if (stock === 0 && isPreOrder) {
				// 預購無庫存
				this.btnStyleGenerate = "disabled";
				this.btnDescriptionGenerate = "暫無庫存";
			} else {
				this.btnStyleGenerate = "active";
				this.btnDescriptionGenerate = "加入購物車";
			}
		},
		btnReset: function () {
			this.btnStyleGenerate = "disabled";
			this.btnDescriptionGenerate = "請選擇規格";
		},
		addToCart: function (stock, isOutOfStock, isPreOrder) {
			let _this = this;
			let custommarketid = this.alldatas.CustomMarketID;
			let itemSpecInfo =
				custommarketid.substring(0, custommarketid.indexOf("CL")) +
				"CL" +
				this.selected.ID +
				"SZ" +
				this.selectedSpecKey;
			let utmData = utmKDetect(itemSpecInfo) === null ? null : utmKDetect(itemSpecInfo);
			let count = _this.counter;

			if (stock === 0 && isOutOfStock && !isPreOrder) return;
			if (this.alldatas.IsPreShow) return;

			$.ajax({
				type: "POST",
				url: "/api/v1/ShoppingCart",
				dataType: "json",
				data: {
					CustomMarketID: itemSpecInfo,
					Count: count,
					UtmTag: utmData,
				},
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200 || res.Code === 406) {
						_this.closeSelf();
						_this.getCartInfo();
					} else if (res.Code === 205) {
						AlertDialog.alert("商品已售完");
						_this.closeSelf();
					} else {
						AlertDialog.alert(res.Message);
						_this.closeSelf();
					}
				},
			});
		},
	},
};

new Vue({
	el: "#app-market",
	template: `<div class="container">
				<div class="row">
					<div class="col-12 col-lg-8 offset-lg-2 p-0" style="line-height: 0;">

					  <a @click.prevent="handleDialog(true)" href="#" class="font-weight-bold btn-fixed style1 custom-bg-color custom-txt-color">立即選購</a>
					  <a href="#" @click.prevent="scrollToTop" class="font-weight-bold btn-fixed custom-bg-color custom-txt-color custom-border-color style2"><span class="custom-bg-color"></span><span class="custom-bg-color"></span></a>
					  <div id="block-buy" class="my-4">
					  	<a @click.prevent="handleDialog(true)" class="btn w-100 btn-main btn-block font-weight-bold" href="#">立即選購</a>
					  </div>
					</div>
					<product-dialog
						:selected="selectedData"
						:alldatas="itemDatas"
						:dataisload="dataIsLoad"
						:isopen="dialogIsOpen"
						:btnlock="isRunning"
						v-on:close="handleDialog"
						v-on:change-selected="changeSelected"
					></product-dialog>
				</div>	
			  </div>`,
	components: { productDialog, NewImage },
	data: {
		itemDatas: {},
		selectedDataID: null,
		selectedData: {},
		dataIsLoad: false,
		shoppingDataIsLoad: false,
		dialogIsOpen: false,
		shoppingDatas: [],
		memo: {},
		userSelect: {
			region: 1,
			province: "",
			payType: 1,
			deliveryType: 1,
			coupon: "",
			cvsCode: "",
			cvsName: "",
			cvsAddress: "",
			autoPickCoupon: 0,
		},
		isRunning: false,
		eventEndTime: null,
	},
	watch: {
		selectedDataID: function () {
			this.getSelectedData();
		},
	},
	created: function () {
		let _this = this;
		// 商品資訊
		$.ajax({
			type: "GET",
			url: API_URL.MARKET_CONTENT + "?CustomMarketID=" + window.CustomMarketID,
			dataType: "json",
			xhrFields: {
				withCredentials: true,
			},
			error: function () {
				console.log("error");
			},
			success: function (res) {
				if (res.Code === 200) {
					_this.dataIsLoad = true;
					_this.itemDatas = res.Response;
					_this.selectedDataID = res.Response.ColorID;
					_this.eventEndTime = res.Response.SellEnd;
					_this.refinedStyle();
					window.addEventListener("scroll", _this.handleScroll);
					_this.countDown();
				} else {
					// 導回首頁 ?
					AlertDialog.alert("系統忙線中,請稍後再試");
				}
			},
		});
	},
	methods: {
		refinedStyle: function () {
			setTimeout(() => {
				if ($(".btn-fixed.style3").length < 1) {
					$(".btn-fixed.style2").css("bottom", "149px");
				}
			}, 600);
		},
		countDown: function () {
			setTimeout(() => {
				if ($(".countdown-bar").length > 0) {
					// $("body").css('padding-top', '49px');
					$(".countdown-bar").fadeIn("fast");
					this.timer();
				}
			}, 600);
		},
		timer: function () {
			let self = this;
			console.log(self.getEventTime());
			console.log(self.getNowTime());
			if (self.getEventTime() - self.getNowTime() < 0) return;
			const x = setInterval(function () {
				// Get today's date and time

				// Find the distance between now and the count down date
				let distance = self.getEventTime() - self.getNowTime();

				// Time calculations for days, hours, minutes and seconds
				let days = Math.floor(distance / (1000 * 60 * 60 * 24));
				let hours =
					days > 0
						? (days * 24 + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).toString()
						: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
				let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString();
				let seconds = Math.floor((distance % (1000 * 60)) / 1000).toString();

				// Display the result in the element
				$(
					"#time-countdown"
				).html(`${hours.length > 2 ? '<span class="time-hr time-block">' + hours.charAt(0) + "</span>" : '<span class="time-hr time-block">0</span>'}
			  	${
						hours.length > 1
							? '<span class="time-hr time-block">' + hours.charAt(hours.length - 2) + "</span>"
							: '<span class="time-hr time-block">0</span>'
					}
			  	<span class="time-hr time-block">${hours.charAt(hours.length - 1)}</span>
			  	<span class="countdown-txt-color">:</span>
			  	${
						minutes.length > 1
							? '<span class="time-hr time-block">' + minutes.charAt(0) + "</span>"
							: '<span class="time-hr time-block">0</span>'
					}
			  	<span class="time-hr time-block">${minutes.charAt(minutes.length - 1)}</span>
			  	<span class="countdown-txt-color">:</span>
			  	${
						seconds.length > 1
							? '<span class="time-hr time-block">' + seconds.charAt(0) + "</span>"
							: '<span class="time-hr time-block">0</span>'
					}
			  	<span class="time-hr time-block">${seconds.charAt(seconds.length - 1)}</span>`);
				// If the count down is finished, write some text
				if (distance < 0) {
					clearInterval(x);
					$("#time-countdown").html(
						`<span class="time-hr time-block">0</span><span class="time-hr time-block">0</span><span class="time-hr time-block">0</span><span>:</span><span class="time-min time-block">0</span><span class="time-min time-block">0</span><span>:</span><span class="time-s time-block">0</span><span class="time-s time-block">0</span>`
					);
					// document.getElementById("demo").innerHTML = "EXPIRED";
				}
			}, 1000);
		},
		getNowTime: function () {
			const nowDate = new Date();
			// 取國際時間UTC
			return new Date(
				nowDate.getUTCFullYear(),
				nowDate.getUTCMonth() + 1,
				nowDate.getUTCDate(),
				nowDate.getUTCHours() + 8, // 換台灣時間+8
				nowDate.getUTCMinutes(),
				nowDate.getUTCSeconds(),
				nowDate.getUTCMilliseconds()
			).getTime();
		},
		getEventTime: function () {
			let self = this;
			const eventTime = new Date(self.eventEndTime);
			console.log("403-self.eventEndTime:" + self.eventEndTime);
			console.log("404eventEndTime:" + eventTime);
			console.log(
				"405:" +
					eventTime.getFullYear() +
					(eventTime.getMonth() + 1) +
					eventTime.getDate() +
					eventTime.getHours() +
					eventTime.getMinutes() +
					eventTime.getSeconds() +
					eventTime.getMilliseconds()
			);
			return new Date(
				eventTime.getFullYear(),
				eventTime.getMonth() + 1,
				eventTime.getDate(),
				eventTime.getHours(),
				eventTime.getMinutes(),
				eventTime.getSeconds(),
				eventTime.getMilliseconds()
			).getTime();
		},
		changeSelected: function (val) {
			this.selectedDataID = val;
		},
		scrollToTop: function () {
			$("html,body").animate({ scrollTop: 0 }, 300);
		},
		handleScroll(event) {
			let wh = $(window).height();
			setTimeout(function () {
				if ($(window).scrollTop() > $("#block-buy").offset().top - wh - 50 - 80) {
					$(".btn-fixed.style1, .countdown-bar").fadeOut("fast");
				} else {
					$(".btn-fixed.style1, .countdown-bar").fadeIn("fast");
				}
				if ($(window).scrollTop() > 0 && $(window).scrollTop() < $("#block-buy").offset().top - wh - 50 - 80) {
					$(".btn-fixed.style2, .btn-fixed.style3").fadeIn("fast");
				} else {
					$(".btn-fixed.style2, .btn-fixed.style3").fadeOut("fast");
				}
			}, 300);
		},
		getSelectedData: function () {
			var _this = this;
			this.itemDatas.Colors.forEach(function (element, index) {
				if (element.ID === _this.selectedDataID) {
					_this.selectedData = element;
				}
			});
			// this.checkHasStock();
		},
		handleDialog: function (val) {
			this.dialogIsOpen = val;
		},
		getShoppingDatas: function () {
			let _this = this;
			let userSelect = this.userSelect;

			this.isRunning = true;

			$.ajax({
				type: "GET",
				url:
					"/api/v1/ShoppingCart" +
					"?ShippingRegion=" +
					userSelect.region +
					"&PayType=" +
					userSelect.payType +
					"&DeliveryType=" +
					userSelect.deliveryType +
					"&Coupon=" +
					userSelect.coupon +
					"&Province=" +
					userSelect.province +
					"&AutoPickCoupon=" +
					userSelect.autoPickCoupon +
					"&SortOut=1",
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.showShoppingList(res);
					} else if (res.Code === 205) {
						_this.showShoppingList(res);
					} else if (res.Code === 206) {
						_this.showShoppingList(res);
					} else if (res.Code === 406) {
						_this.showShoppingList(res);
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試");
					}
					_this.isRunning = false;
				},
			});
		},
		showShoppingList: function (res) {
			var _this = this;
			_this.checkIfSoldout(res.Response.Memo.SortOutMemo);
			_this.shoppingDatas = res.Response.ShoppingCart.Markets;
			_this.memo = res.Response.Memo;
			_this.shoppingDataIsLoad = true;
		},
		checkIfSoldout: function (sortOutMemo) {
			if (sortOutMemo.Message !== "") {
				AlertDialog.alert(sortOutMemo.Message);
			}
		},
		updataShoppingDatas: function (data) {
			var _this = this;
			$.ajax({
				type: "PUT",
				url: "/api/v1/ShoppingCart",
				dataType: "json",
				data: { CustomMarketID: data.id, Count: data.count },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200 || res.Code === 409) {
						_this.getShoppingDatas(_this.userSelect);
					} else {
						AlertDialog.alert("系統忙線中，請稍後再試");
					}
				},
			});
		},
	},
});
