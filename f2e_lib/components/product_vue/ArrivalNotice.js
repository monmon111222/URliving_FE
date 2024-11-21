// 內頁 貨到通知彈跳窗
// 從上層 props 傳入參數:
// barcode (字串 完整品號 如果是空自串表示還沒有選好)

import React from "react";

class ArrivalNotice extends React.Component {
	constructor(props) {
		super(props);

		this.emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
		this.state = { email: "" };

		this.handleChange = this.handleChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({ email: event.target.value });
	}

	handleKeyPress(event) {
		(event.keyCode === 13 || event.which === 13) && this.handleSubmit();
	}

	handleSubmit() {
		const self = this;
		const email = this.state.email;

		if (email.isNaN || email === "") {
			nowBrand.alert("請填寫 E-mail 信箱 !", "提示訊息", () => {
				self.input.focus();
			});
		} else if (!this.emailPattern.test(email)) {
			nowBrand.alert("請填寫有效的 E-mail 信箱 !", "提示訊息", () => {
				self.input.focus();
			});
		} else {
			$.ajax({
				url: "/Product/ArrivalNotice/",
				type: "POST",
				data: {
					barcode: self.props.barcode,
					email: email,
				},
				dataType: "json",
			})
				.done((data) => {
					if (data.result) {
						nowBrand.alert("已加入貨到通知 !", "提示訊息", () => {
							$(window).trigger("lightbox.close");
						});
					} else {
						nowBrand.alert(data.errorMsg, "提示訊息");
					}
				})
				.fail(() => {
					nowBrand.alert("目前無法連接伺服器，請稍候再試！");
				});
		}
	}

	render() {
		return (
			<div className="dialog__content dialog__content--callme">
				<div className="dialog__header">
					<h3>貨到通知</h3>
				</div>
				<div className="dialog--callme__body">
					<label>輸入E-mail信箱</label>
					<input
						ref={(input) => {
							this.input = input;
						}}
						className="email_text"
						type="text"
						value={this.state.email}
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
					/>
					<p>此功能僅為貨到通知，無法保留商品</p>
					<button id="btnCallme" className="btn" onClick={this.handleSubmit}>
						確認
					</button>
				</div>
			</div>
		);
	}
}

module.exports = ArrivalNotice;
