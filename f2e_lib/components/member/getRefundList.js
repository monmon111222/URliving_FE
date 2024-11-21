import Vue from "vue";
import validate from "@global/vendors/jquery.validate.min";
import REFUND_TMPL from "@page/order/js/refundModal";
import AlertDialog from "@global/helpers/alertDialog";
import modal from "bootstrap/js/dist/modal";

const refund = {
	template: REFUND_TMPL,
	data: function () {
		return {
			transactionID: null,
			data: [],
			selectedItem: [],
			dataisload: false,
			isCheckGift: false,
			giftData: [],
			isConfirm: false,
			reservedMarkets: [], //剩下未退商品
			reservedUnMatchAddons: [], //剩下未退商品且未符合加價購條件商品
		};
	},
	watch: {
		transactionID: function (val) {
			var _this = this;
			if (val === null) return;
			$.ajax({
				type: "GET",
				url: API_URL.ORDER,
				dataType: "json",
				data: { OnlyRefundData: 1, TransactionID: val },
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.data = res.Response;
						_this.data.Markets.forEach(function (el) {
							_this.$set(el, "checked", false);
							// 正常商品才會有行銷活動，加價購不會有
							// 行銷活動退貨邏輯CanScatteredRefund是false就必須一起退
							if (el.Events.length && el.Events[0].CanScatteredRefund === false) {
								_this.$set(el, "selectCount", el.Count);
							} else if (el.Type === 3) {
								// 加價購退貨必須全退
								_this.$set(el, "selectCount", el.Count);
							} else {
								_this.$set(el, "selectCount", el.ID + "_" + 1);
							}

							_this.$set(el, "remark", "");
							_this.$set(el, "reasonSelect", "default");
						});
						_this.dataisload = true;
						_this.validateForm();
					} else if (res.Code === 401) {
						AlertDialog.alert("請先登入");
					} else {
						AlertDialog.alert("系統忙線中");
					}
				},
			});
		},
	},
	mounted() {
		this.modalCloseEvent();
	},
	methods: {
		modalCloseEvent: function () {
			var _this = this;
			$("#lb-refund").on("hidden.bs.modal", function (e) {
				// 清空modal資訊
				_this.transactionID = null;
				_this.data = [];
				_this.dataisload = false;
				_this.isCheckGift = false;
				_this.selectedItem = [];
				_this.giftData = [];
			});
		},
		/**
		 * @ description 勾選退貨商品
		 * @param {Object} item 退貨商品
		 */
		toggleChecked(item) {
			item.checked = !item.checked;
		},
		validateForm: function () {
			var _this = this;

			// render 後 綁訂檢查事件
			this.$nextTick(function () {
				$("[name^=selectReason]").each(function () {
					$(this).rules("add", {
						selectMustChose: "default",
					});
				});

				$("[name^=remarkReason]").each(function () {
					$(this).rules("add", {
						checkRemarkLength: 30,
						required: true,
						messages: {
							required: "請輸入退貨原因",
						},
					});
				});

				$("[name^=cRemarkReason]").each(function () {
					$(this).rules("add", {
						checkRemarkLength150: 150,
						required: true,
						messages: {
							required: "請輸入退貨原因",
						},
					});
				});
				$.validator.addMethod(
					"selectMustChose",
					function (value, element, arg) {
						return arg !== value;
					},
					"請選擇退貨原因"
				);

				$.validator.addMethod(
					"checkRemarkLength",
					function (value, element, arg) {
						return arg > $(element).val().length;
					},
					"超過限制字數(30字內)"
				);

				$.validator.addMethod(
					"checkRemarkLength150",
					function (value, element, arg) {
						return arg > $(element).val().length;
					},
					"超過限制字數(150字內)"
				);
			});

			$("#form-return-products").validate({
				errorClass: "text-danger h6 pt-1 text-left",
				errorElement: "div",
				rules: {},
				messages: {},
				submitHandler: function (form) {
					// 更新取得選取商品
					_this.getSelectedItem();

					if (_this.selectedItem.length === 0) {
						AlertDialog.alert("請勾選需退貨商品");
						return;
					}
					// lock btn
					_this.isConfirm = true;

					form.submit();
				},
			});
		},
		checkHasEvent: function (events, elID) {
			// 若勾選商品有活動, 需一併退回該活動所有商品(連動checked)
			var eventid_arr = [];
			events.forEach(function (el, index) {
				eventid_arr.push(el.ID);
			});
			if (eventid_arr.length === 0) return;
			this.data.Markets.forEach(function (el, index) {
				el.Events.forEach(function (element, index) {
					eventid_arr.forEach(function (eventID, index) {
						if (element.ID == eventID && el.ID !== elID) {
							el.checked = !el.checked;
						}
					});
				});
			});
		},
		/**
		 * @description 取得勾選的退貨商品
		 */
		getSelectedItem() {
			this.selectedItem = [];
			let count = 0;
			this.data.Markets.forEach((element) => {
				if (typeof element.selectCount === "string") {
					let str_pos = element.selectCount.indexOf("_");
					let len = element.selectCount.length;
					count = element.selectCount.substr(str_pos + 1, len - 1);
				} else {
					count = element.selectCount;
				}

				if (element.checked)
					this.selectedItem.push({
						OrderMarketID: element.ID,
						Count: count,
					});
			});
		},
		getReservedMarkets(orderID) {
			var _this = this;

			this.getSelectedItem();

			if (this.selectedItem.length === 0) {
				AlertDialog.alert("請勾選欲退貨商品");
				return;
			}

			$.ajax({
				type: "POST",
				url: API_URL.refundcalculate,
				data: { TransactionID: orderID, RefundMarkets: _this.selectedItem },
				dataType: "json",
				xhrFields: {
					withCredentials: true,
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.reservedMarkets = res.Response.ReservedMarkets;
						_this.checkRemainItemIfMatchAddon();
					} else {
						AlertDialog.alert("系統忙線中");
					}
				},
			});
		},
		/**
		 * @description 檢查剩下商品是否有加價購且是否符合條件, 若無跳警告視窗提醒
		 */
		checkRemainItemIfMatchAddon() {
			let _this = this;
			this.reservedUnMatchAddons = [];

			if (this.reservedMarkets.length) {
				this.reservedMarkets.forEach((remainItem) => {
					if (remainItem.Type === 3 && !remainItem.AddOnEvent.IsMatch) {
						this.reservedUnMatchAddons.push(remainItem);
					}
				});
			}

			if (this.reservedUnMatchAddons.length) {
				let reservedText = "";
				this.reservedUnMatchAddons.forEach((ele, index) => {
					reservedText += `<p class="mb-1">${index + 1}. ${ele.Name}(${ele.ColorName}${
						ele.Size
					})將以NT$${ele.SellPrice.toLocaleString()}計算</p>`;
				});

				AlertDialog.special(
					`
			<div class="text-left">
				  提醒您:<br/>您選擇的退貨商品無達到加價購活動門檻<br/>
				  <span class="text-danger h5">請您勾選是否要將加價購商品一併退回</span>；<br/>
				  若無退回 加價商品將會以商品原價計算 :
				</div>
						  <div class="text-left text-danger my-4">${reservedText}</div>
						  <div class="row">
					<div class="col">
						<a id="" class="btn-confirm-alert btn btn-outline-secondary btn-block" href="#">不退回，繼續下一步</a>
					</div>
					<div class="col">
						<a id="" class="btn-cancel-alert btn btn-secondary btn-block" href="#">我要退回</a>
					</div>
				</div>
					  `,
					function () {
						_this.checkRefundGift(_this.reservedMarkets);
					}
				);
			} else {
				_this.checkRefundGift(_this.reservedMarkets);
			}
		},
		getRefundGift(orderID) {
			var _this = this;

			this.getSelectedItem();

			if (this.selectedItem.length === 0) {
				AlertDialog.alert("請勾選欲退貨商品");
				return;
			}

			$.ajax({
				type: "POST",
				url: API_URL.ORDER_GIFT,
				data: { TransactionID: orderID, RefundMarkets: _this.selectedItem },
				dataType: "json",
				// processData: false,
				xhrFields: {
					withCredentials: true,
				},
				error: function () {
					console.log("error");
				},
				success: function (res) {
					if (res.Code === 200) {
						_this.isCheckGift = true;
						_this.giftData = res.Response;
					} else if (res.Code === 400) {
						AlertDialog.alert(res.Message);
					} else {
						AlertDialog.alert("系統忙線中");
					}
				},
			});
		},
		checkRefundGift(remainItems) {
			let giftItems = remainItems.filter((item) => item.Type === 2 && !item.GiftEvent.IsMatch);
			this.isCheckGift = true;
			this.giftData = giftItems;
		},
	},
};

module.exports = refund;
