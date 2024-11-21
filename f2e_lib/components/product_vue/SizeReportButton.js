// 內頁 尺寸表按鈕
// 從上層props傳入參數
// text 字串 尺寸表按鈕呈現文字
// ShowSizeReport 涵式 第一次呈現尺寸表內容
// sizeReportShow 布林值 呈現=true

import React from "react";

class SizeReportButton extends React.Component {
	render() {
		return (
			<a id="SizeReportUrl" href="javascript:;" onClick={this.props.ShowSizeReport}>
				{this.props.text}
			</a>
		);
	}
}

module.exports = SizeReportButton;
