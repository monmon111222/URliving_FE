import excuteByDom from "helpers/excuteByDom";

import {
	updateStorage,
	sendStorage,
	setStorage,
	addToStorage,
	wishlistToStorage,
} from "components/cart/miniCartStorage";

// react mini cart
import ReactMiniCart from "components/cart/ReactMiniCart";
import MiniCartContent from "./MiniCartContent";

let playAnimateTimeout;

function playAnimate($target) {
	const cssAnimateClass = "js-changing";

	$target.removeClass(cssAnimateClass);
	setTimeout(function () {
		$target.addClass(cssAnimateClass);
	}, 30);

	clearTimeout(playAnimateTimeout);
	playAnimateTimeout = setTimeout(function () {
		$target.removeClass(cssAnimateClass);
	}, 1000);
}

function changeItemNumberWishList(amount) {
	const $counter = $(".secnav-right__wish-list .secnav-right__item-count span");
	$counter.html(amount);
	nowEnv.NowMyEquipment || playAnimate($counter.parent());
}

function initMiniCart() {
	ReactMiniCart({
		cartWrap: ".subnav--cart__items",
		MiniCartContent: MiniCartContent,
		cartDoms: {
			container: ".subnav--cart-bag",
			cartAmount: ".secnav-right__bag .secnav-right__item-count span",
		},
		cartName: {
			cookieCart: pazzo.miniCartConfig.cartCookieName,
			cookieCartPre: pazzo.miniCartConfig.preCartCookieName,
			storageCart: "cartData",
		},
		cartStyle: {
			topOffset: 74,
			topHeight: 26,
			bottomHeight: 54,
			baseHeight: 75,
			listViewAmountMax: 3,
		},
		after: () => {
			updateStorage();
			sendStorage();
		},
	});
}

function render() {
	$(window).trigger("minicart.render");
}

function init() {
	// mini cart
	excuteByDom(initMiniCart, [".subnav--cart__items"]);

	// mini cart storage
	excuteByDom(setStorage, ["#SetStorage"]);
}

module.exports = {
	addToStorage,
	wishlistToStorage,
	changeItemNumberWishList,
	render,
	init,
};
