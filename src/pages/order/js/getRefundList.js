import REFUND_TMPL from "@page/order/template/refundModal.pug";
import AlertDialog from "@global/helpers/alertDialog";
import modal from "bootstrap/js/dist/modal";
import NewImage from "@global/components/global/image";
import validate from "@global/vendors/jquery.validate.min";
Vue.config.devtools = true;

const refund = {
	template: REFUND_TMPL,
	components: {
		NewImage,
	},
	data() {
		return {
			step: 0,
			transactionID: null,
			data: [],
			selectedItem: [],
			selectedItemReason: [], // user 退貨的理由
			selectedItemType2Reason: [], // user 退貨的第二項說明
			selectedItemOtherReason: [], // user 退貨的第五項其他理由
			dataIsLoad: false,
			isCheckGift: false,
			giftData: [],
			reservedMarkets: [], //剩下未退商品
			reservedUnMatchAddons: [], //剩下未退商品且未符合加價購條件商品
			fillReasonIndex: 0,
			selectedItemDetail: {},
			reasonCheck: [
				{
					code: "a",
					check: false,
					text: "1.商品不符所需(尺寸/版型/材質...等)",
					sub: [
						{ code: "1", check: false, text: "尺寸過小或過短" },
						{ code: "2", check: false, text: "尺寸過大或過長" },
						{ code: "3", check: false, text: "材質不符預期" },
						{ code: "4", check: false, text: "版型不符預期" },
					],
				},
				{
					code: "b",
					check: false,
					text: "2.商品瑕疵問題(破損/污漬/車線...等)",
					sub: [
						{ code: "1", check: false, text: "商品有破損" },
						{ code: "2", check: false, text: "商品有污漬" },
						{ code: "3", check: false, text: "商品有異味" },
						{ code: "4", check: false, text: "商品剪裁瑕疵" },
						{ code: "5", check: false, text: "車線問題" },
						{ code: "6", check: false, text: "商品褪色" },
						{
							code: "7",
							check: false,
							text: "商品功能性配件缺損(如鈕釦/拉鏈...等)",
						},
					],
				},
				{
					code: "c",
					check: false,
					text: "3.商品內容物問題",
					sub: [
						{ code: "1", check: false, text: "商品缺件" },
						{ code: "2", check: false, text: "寄錯商品" },
						{ code: "3", check: false, text: "買錯商品" },
					],
				},
				{
					code: "d",
					check: false,
					text: "4.商品價格問題",
					sub: [
						{
							code: "1",
							check: false,
							text: "部分退貨後整體未達免運/活動門檻",
						},
						{ code: "2", check: false, text: "想參與較晚開始的行銷活動" },
						{ code: "3", check: false, text: "下單後發現沒輸入折扣碼" },
					],
				},
			],
		};
	},
	watch: {
		transactionID(val) {
			if (val === null) return;
			var _this = this;

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
						_this.selectedItemReason.length = _this.data.Markets.length;
						_this.selectedItemOtherReason.length = _this.data.Markets.length;
						_this.selectedItemType2Reason.length = _this.data.Markets.length;

						_this.data.Markets.forEach(function (el, index) {
							_this.$set(el, "openSelect", false);
							_this.$set(el, "refundCount", 1);
							_this.$set(el, "checked", false);
							_this.$set(el, "reasonSelect", []);

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

							// 商品數量
							let countOptions = [];

							for (let i = 1; i < el.Count + 1; i++) {
								countOptions.push({
									value: i,
									text: i.toString(),
								});
							}

							_this.$set(el, "countOptions", countOptions);

							// 給予每一項商品預設空字串理由
							_this.selectedItemReason[index] = "";
							_this.selectedItemOtherReason[index] = "";
							_this.selectedItemType2Reason[index] = "";
						});

						_this.dataIsLoad = true;
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
	computed: {
		type2ReasonOverMax() {
			// 當有選到第二大項的原因

			if (this.data && Object.keys(this.selectedItemDetail).length !== 0) {
				return this.selectedItemType2Reason[this.fillReasonIndex].length > 48;
			}

			return false;
		},
		type5ReasonOverMax() {
			// 要判斷五(其他)是否輸入超過48個字元
			if (this.data && Object.keys(this.selectedItemDetail).length !== 0) {
				return this.selectedItemOtherReason[this.fillReasonIndex].length > 48;
			}

			return false;
		},
		showNextStep() {
			const selectItemIndex = this.selectedItem.findIndex((item) => item.OrderMarketID === this.selectedItemDetail.ID);
			// 最後一項商品
			if (this.selectedItem.length === selectItemIndex + 1) {
				return false;
			}
			return true;
		},
		canMoveNextItem() {
			let result = true;
			const reg = /^b+/gm;

			if (this.selectedItemDetail.reasonSelect.length === 0 || this.type5ReasonOverMax) {
				result = false;
				return result;
			}

			// 有勾選主項目但副項目沒勾選的狀況下，不通過
			this.reasonCheck.forEach((category) => {
				if (category.check) {
					if (category.sub.filter((sub) => sub.check).length === 0) {
						result = false;
					}
				}
			});

			this.selectedItemDetail.reasonSelect.forEach((category) => {
				if (reg.test(category)) {
					// 有勾選第二類大項就必須填寫原因
					if (this.selectedItemType2Reason[this.fillReasonIndex].length === 0) {
						result = false;
					}

					// 有勾選第二類大項，字數就不能大於48
					if (this.type2ReasonOverMax) {
						result = false;
					}
				}
			});

			return result;
		},
		upToTwoSub() {
			return this.reasonCheck.find((e) => e.code === "b").sub.filter((e) => e.check).length === 2;
		},
	},
	methods: {
		onMinus(index) {
			if (this.data.Markets[index].refundCount > 1) {
				this.$set(this.data.Markets[index], "refundCount", this.data.Markets[index].refundCount - 1);
			}
		},
		onPlus(index) {
			if (this.data.Markets[index].refundCount < this.data.Markets[index].Count) {
				this.$set(this.data.Markets[index], "refundCount", this.data.Markets[index].refundCount + 1);
			}
		},
		modalCloseEvent() {
			var _this = this;
			$("#lb-refund").on("hidden.bs.modal", function (e) {
				// 清空modal資訊
				_this.transactionID = null;
				_this.data = [];
				_this.step = 0;
				_this.dataIsLoad = false;
				_this.isCheckGift = false;
				_this.selectedItem = [];
				_this.giftData = [];
				_this.clearReasonCheckbox();
				_this.selectedItemReason = [];
				_this.selectedItemType2Reason = [];
				_this.selectedItemOtherReason = [];
				_this.fillReasonIndex = 0;
			});
		},
		/**
		 * @description 清空退貨原因的多選框
		 */
		clearReasonCheckbox() {
			this.reasonCheck.forEach((category) => {
				category.check = false;
				category.sub.forEach((sub) => {
					sub.check = false;
				});
			});
		},
		/**
		 * @description 將該退貨商品已經勾選的退貨原因進行勾選
		 */
		setReasonCheckbox() {
			this.clearReasonCheckbox();

			if (this.selectedItemDetail.reasonSelect.length === 0) return;

			this.selectedItemDetail.reasonSelect.forEach((code) => {
				this.reasonCheck.forEach((category) => {
					if (category.code === code.substring(0, 1)) {
						category.check = true;
						category.sub.forEach((sub) => {
							if (sub.code === code.substring(1)) {
								sub.check = true;
							}
						});
					}
				});
			});
		},
		/**
		 * @description 勾選退貨商品
		 * @param {Object} item 退貨商品
		 */
		toggleChecked(item) {
			item.checked = !item.checked;
			this.getSelectedItem();
		},
		/**
		 * @description 大項目種類 code
		 * @param {String} categoryCode
		 */
		toggleReasonCategory(categoryCode) {
			this.reasonCheck.forEach((ele) => {
				if (ele.code === categoryCode) {
					ele.check = !ele.check;
					// 大項目種類取消後小項目也必需取消
					if (ele.check === false) {
						ele.sub.forEach((subCode) => {
							subCode.check = false;
							let reasonCodeIndex = this.selectedItemDetail.reasonSelect.indexOf(ele.code + subCode.code);
							if (reasonCodeIndex !== -1) {
								this.selectedItemDetail.reasonSelect.splice(reasonCodeIndex, 1);
							}
						});
						if (ele.code === "b") {
							this.selectedItemType2Reason[this.fillReasonIndex] = "";
						}
					}
				}
			});
		},
		/**
		 * @description 紀錄子項目勾選狀態
		 * @param {number} categoryIndex
		 * @param {number} subCategoryIndex
		 */
		toggleReasonSubCategory(categoryIndex, subCategoryIndex) {
			this.reasonCheck[categoryIndex].sub[subCategoryIndex].check =
				!this.reasonCheck[categoryIndex].sub[subCategoryIndex].check;

			const reasonCode =
				this.reasonCheck[categoryIndex].code + this.reasonCheck[categoryIndex].sub[subCategoryIndex].code;

			const findIndex = this.data.Markets.findIndex((element) => element.ID === this.selectedItemDetail.ID);

			let reasonCodeIndex = this.selectedItemDetail.reasonSelect.indexOf(reasonCode);
			if (this.selectedItemReason[findIndex].length !== 0 && this.selectedItemReason[findIndex].at(-1) !== ",") {
				this.selectedItemReason[findIndex] += ",";
			}
			if (reasonCodeIndex === -1) {
				this.selectedItemDetail.reasonSelect.push(reasonCode);
			} else {
				this.selectedItemDetail.reasonSelect.splice(reasonCodeIndex, 1);
			}
		},
		/**
		 * @description 取得勾選的退貨商品
		 */
		getSelectedItem() {
			this.selectedItem = [];

			this.data.Markets.forEach((element) => {
				if (element.checked) {
					this.selectedItem.push({
						OrderMarketID: element.ID,
						Count: element.refundCount.toString(),
					});
				}
			});
		},
		/**
		 * @description 前往勾選退貨原因
		 */
		goStep2() {
			this.step = 2;

			this.selectedItemDetail = this.data.Markets.find((element) => element.ID == this.selectedItem["0"].OrderMarketID);

			// mapping selectedItemReason array index
			this.fillReasonIndex = this.data.Markets.findIndex((element) => element.ID === this.selectedItemDetail.ID);

			this.setReasonCheckbox();
		},
		/**
		 * @description 勾選多個退貨商品時
		 * @param {Number} dir 上一個/下一個退貨商品
		 */
		loopStep2(dir) {
			let selectItemIndex = this.selectedItem.findIndex((item) => item.OrderMarketID === this.selectedItemDetail.ID);
			// 下一個退貨商品
			if (dir === 1) {
				selectItemIndex++;
			}

			// 上一個退貨商品
			if (dir === -1) {
				// 當只有選一個商品退貨時，或有多項商品退貨但不是從列表中第一項商品退時
				if (selectItemIndex === 0 && this.step !== 3) {
					this.step = 1;
					this.clearReasonCheckbox();
					return;
				}

				// 贈品畫面時
				if (this.step === 3) {
					this.step = 2;
				} else {
					// 返回上一個退貨商品
					selectItemIndex--;
				}
				this.selectedItemReason[selectItemIndex] = "";
			}

			// 上一個 or 下一個的商品 detail
			this.selectedItemDetail = this.data.Markets.find(
				(element) => element.ID == this.selectedItem[selectItemIndex].OrderMarketID
			);

			this.fillReasonIndex = this.data.Markets.findIndex((element) => element.ID === this.selectedItemDetail.ID);

			this.setReasonCheckbox();
		},
		/**
		 * @description 寫入勾選框及輸入框內容
		 * @param {Number} index
		 */
		setOtherReason() {
			this.selectedItem.forEach((item) => {
				const refundItem = this.data.Markets.find((e) => e.ID === item.OrderMarketID);
				const refundItemIndex = this.data.Markets.findIndex((e) => e.ID === item.OrderMarketID);
				refundItem.reasonSelect.forEach((select) => {
					const categoryCode = select.substring(0, 1);
					const subCode = select.substring(1);
					const categoryObj = this.reasonCheck.find((e) => e.code === categoryCode);
					const subObj = categoryObj.sub.find((e) => e.code === subCode);
					this.selectedItemReason[refundItemIndex] +=
						categoryObj.text.substring(0, categoryObj.text.indexOf("、")) + "_" + subObj.text + ",";
				});
				// 寫入五、其他(選填)
				if (this.selectedItemOtherReason[refundItemIndex].length !== 0) {
					this.selectedItemReason[refundItemIndex] += "五_" + this.selectedItemOtherReason[refundItemIndex] + ",";
				}
				// 寫入二的備註說明
				const string2Array = this.selectedItemReason[refundItemIndex].split(",");
				if (this.selectedItemType2Reason[refundItemIndex].length !== 0) {
					string2Array.splice(
						string2Array.findLastIndex((e) => e.includes("二")) + 1,
						0,
						"二_" + this.selectedItemType2Reason[refundItemIndex]
					);
				}
				this.selectedItemReason[refundItemIndex] = string2Array.toString();
			});
		},
		/**
		 * @description 返回第一步
		 */
		returnStep1() {
			this.step = 1;
			this.clearReasonCheckbox();
		},
		/**
		 * @description 退貨試算
		 */
		getReservedMarkets(orderID) {
			var _this = this;
			this.getSelectedItem();
			this.setOtherReason();

			this.selectedItemReason.forEach((itemReason, index) => {
				if (itemReason.substr(-1) === ",") {
					this.selectedItemReason[index] = itemReason.slice(0, -1);
				}
			});

			$.ajax({
				type: "post",
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

			if (this.reservedUnMatchAddons.length > 0) {
				let reservedText = "";
				this.reservedUnMatchAddons.forEach((ele, index) => {
					reservedText += `<p class="mb-1">${index + 1}. ${ele.Name}(${ele.ColorName}${
						ele.Size
					})將以NT$${ele.SellPrice.toLocaleString()}計算</p>`;
				});

				AlertDialog.special(
					`
				<div class="text-left">
					提醒您:<br />您選擇的退貨商品無達到加價購活動門檻<br />
					<span class="text-error">請您勾選是否要將加價購商品一併退回；</span><br />
					若無退回 加價商品將會以商品原價計算 :
				</div>
				<div class="text-left text-error my-4">${reservedText}</div>
				<div class="row">
					<div class="col-12 col-md-6">
						<a id="" class="btn btn-cancel-alert btn-block" href="#">我要退回</a>
					</div>
					<div class="col-12 col-md-6">
						<a id="" class="btn btn-confirm-alert btn-block" href="#">不退回，繼續下一步</a>
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
		/**
		 * @description 確認是否有贈品
		 * @param {Array} remainItems 退貨商品
		 */
		checkRefundGift(remainItems) {
			let giftItems = remainItems.filter((item) => item.Type === 2 && !item.GiftEvent.IsMatch);
			this.isCheckGift = true;
			this.giftData = giftItems;
			if (this.giftData.length === 0) {
				this.$refs.refundForm.submit();
			} else {
				this.step = 3;
			}
		},
		/**
		 * @description 取得商品退貨理由
		 * @param {Object} item 退貨商品
		 */
		getSelectedItemReason(item) {
			const findIndex = this.data.Markets.findIndex((element) => element.ID === item.OrderMarketID);

			return this.selectedItemReason[findIndex];
		},
	},
};

export default refund;
