// 內頁 貨到通知彈跳窗
// 從上層 props 傳入參數:
// barcode (字串 完整品號 如果是空自串表示還沒有選好)

import axios from "axios";
import qs from "Qs";

let ArrivalNotice = {
	data: function () {
		return {
			email: "",
			emailPattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i,
		};
	},
	props: {
		CustomMarketID: {
			type: String,
			required: true,
		},
	},
	computed: {},
	methods: {
		closeArrivalNotice() {
			this.$emit("closeArrivalNotice");
		},
		handleChange(event) {
			// this.setState({email: event.target.value})
			// this.email = event.target.value
		},
		handleKeyPress(event) {
			(event.keyCode === 13 || event.which === 13) && this.handleSubmit();
		},
		handleSubmit() {
			const self = this;
			const email = this.email;
			if (email.isNaN || email === "") {
				nowBrand.alert("請填寫 E-mail 信箱 !", "提示訊息", () => {
					// self.input.focus()
				});
			} else if (!this.emailPattern.test(email)) {
				nowBrand.alert("請填寫有效的 E-mail 信箱 !", "提示訊息", () => {
					// self.input.focus()
				});
			} else {
				// $.ajax({
				//   url: '/Product/ArrivalNotice/',
				//   type: 'POST',
				//   data: {
				//     barcode: self.props.barcode,
				//     email: email
				//   },
				//   dataType: 'json'
				// }).done(data => {
				//   if (data.result) {
				//     nowBrand.alert('已加入貨到通知 !', '提示訊息', () => {
				//       $(window).trigger('lightbox.close')
				//     })
				//   } else {
				//     nowBrand.alert(data.errorMsg, '提示訊息')
				//   }
				// }).fail(() => {
				//   nowBrand.alert('目前無法連接伺服器，請稍候再試！')
				// })
				let url = API_URL.IN_STOCK_EMAIL;

				axios
					.post(
						url,
						qs.stringify({
							Email: self.email,
							CustomMarketID: self.CustomMarketID,
						})
					)
					.then(function (res) {
						console.log(res);
						self.closeArrivalNotice();
						nowBrand.alert("貨到通知索取成功!", "提示訊息");
					})
					.catch(function (error) {});
			}
		},

		brandAlert(msg) {
			nowBrand.alert(msg, nowBrand.globalConfig.alertTitle || null);
		},
	},
	components: {},
	mounted: function () {},
	template: `
  <div class="popup">
    <div class="popup__inner" style="opacity: 1; margin-top: -60px; transform: scale(1);">
      <div class='dialog__content dialog__content--callme'>
        <div class='dialog__header'>
          <h3>貨到通知</h3>
        </div>
        <div class='dialog--callme__body'>
          <label>輸入E-mail信箱</label>
          <input
            ref="theInput"
            class='email_text'
            type='text'
            v-model="email"
            @keyPress=handleKeyPress
          />
          <p>此功能僅為貨到通知，無法保留商品</p>
          <div class="btnWrap" style="text-align: center">
            <button style="display: inline-block"
              id='btnCallme'
              class='btn'
              @click=handleSubmit
            >確認</button>
            <button style="display: inline-block"
              class='btn'
              @click=closeArrivalNotice
            >取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
};

export default ArrivalNotice;
