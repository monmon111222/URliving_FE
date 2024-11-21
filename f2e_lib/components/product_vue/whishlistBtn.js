// 內頁 加入我的願望清單
// 從上層props傳入參數:
// nowColorAndSize (字串 完整品號 如果是空自串表示還沒有選好)

import React from "react";

const NowIsLogin = nowEnv.NowIsLogin;

class WhishlistBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isAlreadySaved: false };
		this.checkSavedState = this.checkSavedState.bind(this);
		this.updateWishListCookie = this.updateWishListCookie.bind(this);
		this.addToWishList = this.addToWishList.bind(this);
	}

	checkSavedState() {
		const myWishList = $.cookie("myWishList").split(",");

		for (let i = 0, len = myWishList.length; i < len; i++) {
			if (myWishList[i] === this.props.nowColorAndSize) {
				this.setState({ isAlreadySaved: true });
				return;
			}
		}

		this.setState({ isAlreadySaved: false });
	}

	updateWishListCookie(wishListDetails) {
		// 瀏覽器支援 cookie 才執行
		if (nowEnv.NowMyCookie) {
			let wishListItems = [];

			for (let i = 0, len = wishListDetails.length; i < len; i++) {
				wishListItems.push(wishListDetails[i].LinkUrl.split("/")[2]);
			}

			$.cookie("myWishList", wishListItems.toString(), { path: "/" });
		}
	}

	addToWishList() {
		// 加過了就不能用啦 跳出涵式
		if (this.state.isAlreadySaved) return;

		// 如果還沒登入 不可以加願望清單
		if (!NowIsLogin) {
			nowBrand.alert("您尚未登入會員");
			return;
		}

		// 如果還沒選好完整的尺寸 不可以加願望清單
		if (!this.props.nowColorAndSize) {
			nowBrand.alert("請選擇商品尺寸！");
			return;
		}

		$.ajax({
			url: nowBrand.constants.addToWishList,
			type: "POST",
			data: { barcode: this.props.nowColorAndSize },
			dataType: "json",
		})
			.done((data) => {
				const strErrorCode = data.ErrorCode;
				if (strErrorCode === "") {
					// 更新 wishlist cookie
					this.updateWishListCookie(data.WishList.Details);

					// 更新 wishlist 數量
					nowBrand.miniCart.changeItemNumberWishList(data.WishList.ItemCount);

					// 設成已經加入 wishlist
					this.setState({ isAlreadySaved: true });
				} else if (strErrorCode === "NOT_LOGGED_IN") {
					nowBrand.alert("您尚未登入會員 !");
				}
			})
			.fail(function () {
				nowBrand.alert("目前無法連接伺服器，請稍候再試！");
			});
	}

	componentWillMount() {
		if (NowIsLogin) {
			// 已登入
			// 還沒有 cookie 就初始化資料
			if (typeof $.cookie("myWishList") === "undefined" || $.cookie("myWishList") === "null") {
				// 有兩支 API 操作方式稍微不一樣，回傳資料一樣
				const req = nowBrand.constants.initWishList
					? {
							// MQ 系列
							url: nowBrand.constants.initWishList,
							type: "POST",
							dataType: "json",
					  }
					: {
							// PZ 系列
							url: nowBrand.constants.addToWishList,
							type: "POST",
							data: { barcode: "init" },
							dataType: "json",
					  };

				$.ajax(req)
					.done((data) => {
						const strErrorCode = data.ErrorCode;

						if (strErrorCode === "" && data.WishList != null) {
							// 更新 wishlist cookie
							this.updateWishListCookie(data.WishList.Details);
						} else if (strErrorCode === "NOT_LOGGED_IN") {
							// console.error('尚未登入會員 !')
						}
					})
					.fail(() => {
						// console.error('無法連接伺服器，請稍候再試！')
					});
			}
		} else {
			// 未登入清除 cookie
			$.cookie("myWishList", null, { path: "/" });
		}
	}

	componentDidMount() {
		// 有登入才檢查
		if (NowIsLogin) this.checkSavedState();
	}

	componentDidUpdate(prevProps) {
		// 有登入且 barcode 不一樣才檢查
		if (NowIsLogin && prevProps.nowColorAndSize !== this.props.nowColorAndSize) {
			this.checkSavedState();
		}
	}

	render() {
		let btnClass = "product-btn-whishlist";
		if (this.state.isAlreadySaved) btnClass += " done";

		return (
			<div>
				<a className={btnClass} href="javascript:;" onClick={this.addToWishList}>
					WISH LIST
				</a>
			</div>
		);
	}
}

module.exports = WhishlistBtn;
