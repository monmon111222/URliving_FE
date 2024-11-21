// 下拉選單
// options 選項資料(如果是尺寸的下拉選單，還需要再整理)
// change_nowColorAndSize 修改上層完整八扣

import React from "react";

// 外框
class UiSelect extends React.Component {
	constructor(props) {
		super(props);
		// 如果-1就是SIZE 如果不是-1就是SML 找不到也是SIZE
		var nowSizeIs;

		if (this.props.sizeIndex === -1) {
			nowSizeIs = "SIZE";
		} else {
			if (
				this.props.options[this.props.sizeIndex].IsPreOrderProduct &&
				this.props.options[this.props.sizeIndex].Inventory <= 0
			) {
				nowSizeIs = this.props.options[this.props.sizeIndex].Size + "(預)";
			} else {
				nowSizeIs = this.props.options[this.props.sizeIndex].Size;
			}
		}

		this.state = {
			isOpen: false, // 是否開開關關
			nowSize: nowSizeIs, // 預設當前文字
		};
		this.onHideOption = this.onHideOption.bind(this);
		this.onToggleOption = this.onToggleOption.bind(this);
		this.onChangeValue = this.onChangeValue.bind(this);
	}

	componentDidMount() {
		document.body.addEventListener("click", this.onHideOption);
	}
	componentWillUnmount() {
		document.body.removeEventListener("click", this.onHideOption);
	}
	onHideOption(event) {
		if (!$(event.target).is(".product-size *")) {
			this.setState({ isOpen: false });
		}
	}

	componentDidUpdate(nextProps) {
		// Props更新後第一步觸發這裡，這此再設定一些State
		if (nextProps.options !== this.props.options) {
			// 如果options更新前後不相同表示顏色被切換
			// 必須將當前呈現的選中文字替換掉
			let nowSizeTex;
			if ($.isEmptyObject(this.props.options[this.props.sizeIndex]) || !this.props.options[this.props.sizeIndex]) {
				nowSizeTex = "SIZE";
			} else {
				if (
					this.props.options[this.props.sizeIndex].IsPreOrderProduct &&
					this.props.options[this.props.sizeIndex].Inventory <= 0
				) {
					nowSizeTex = this.props.options[this.props.sizeIndex].Size + "(預)";
				} else {
					// 沒有預購
					nowSizeTex = this.props.options[this.props.sizeIndex].Size;
				}
			}
			this.setState({ nowSize: nowSizeTex });
		}
	}

	onToggleOption() {
		// 下拉選單切換展開關閉 使用在上邊的選單以機選項內以及打開的時候的周邊範圍
		if (this.props.options.length > 0) {
			this.setState({ isOpen: !this.state.isOpen });
		}
	}
	onChangeValue(OptionText, OptionBarcode, sizeIndex, thisTag) {
		this.onToggleOption();
		this.setState({ nowSize: OptionText });
		this.props.change_nowColorAndSize(OptionBarcode, sizeIndex);
		var $nowLi = $(thisTag.target).parents("li");
		$nowLi.siblings().removeClass("selected");
		$nowLi.addClass("selected");
	}

	render() {
		var options = [];
		let liList;

		for (var i = 0; i < this.props.options.length; i++) {
			if (!this.props.options[i].IsPreOrderProduct) {
				if (this.props.options[i].Inventory > 0) {
					// 沒預購 正常賣
					options.push({
						OptionText: this.props.options[i].Size,
						OptionStyle: true,
						OptionBarcode: this.props.options[i].Barcode,
					});
				} else {
					// 沒預購 賣完了
					options.push({
						OptionText: this.props.options[i].Size,
						OptionStyle: false,
						OptionBarcode: this.props.options[i].Barcode,
					});
				}
			} else {
				if (this.props.options[i].Inventory > 0) {
					// 有預購 但是正常貨還有 正常賣
					options.push({
						OptionText: this.props.options[i].Size,
						OptionStyle: true,
						OptionBarcode: this.props.options[i].Barcode,
					});
				} else if (this.props.options[i].PreOrderProductInventory) {
					// 有預購 預購也還還有貨
					options.push({
						OptionText: this.props.options[i].Size + "(預)",
						OptionStyle: true,
						OptionBarcode: this.props.options[i].Barcode,
					});
				} else {
					// 有預購 但是預購也沒貨了
					options.push({
						OptionText: this.props.options[i].Size + "(預)",
						OptionStyle: false,
						OptionBarcode: this.props.options[i].Barcode,
					});
				}
			}
		}

		if (!nowEnv.NowMyEquipment) {
			liList = options.map((node, index) => {
				var LiStyle;
				if (!node.OptionStyle) {
					// 要變灰色
					LiStyle = "callme";
				}
				return (
					<li key={index}>
						<a
							href="javascript:;"
							className={LiStyle}
							onClick={this.onChangeValue.bind(this, node.OptionText, node.OptionBarcode, index)}
						>
							{node.OptionText}
						</a>
					</li>
				);
			});
			let ulCalssName = this.state.isOpen ? "ui-select__options open" : "ui-select__options";
			return (
				<div className="product-size ui-select">
					<div className="ui-select__txt">
						<a href="javascript:;" onClick={this.onToggleOption}>
							{this.state.nowSize}
						</a>
					</div>
					<ul className={ulCalssName}>{liList}</ul>
				</div>
			);
		} else {
			liList = options.map((node, index) => {
				var LiStyle;
				if (!node.OptionStyle) {
					// 要變灰色
					LiStyle = "callme";
				}

				return (
					<li
						ref={index}
						key={index}
						onClick={this.onChangeValue.bind(this, node.OptionText, node.OptionBarcode, index)}
						className={LiStyle}
					>
						<a href="javascript:;" className={LiStyle}>
							{node.OptionText}
						</a>
					</li>
				);
			});

			return (
				<div className="product-size ui-select">
					<ul className="ui-select__options">{liList}</ul>
				</div>
			);
		}
	}
}
module.exports = UiSelect;
