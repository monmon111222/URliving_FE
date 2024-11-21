// helpers
import setEnv from "@global/helpers/setEnv";
import ignoreByDom from "@global/helpers/ignoreByDom";
import excuteByDom from "@global/helpers/excuteByDom";

// globalUI
import { initButton as gotop } from "@global/components/global/gotop";
import accordion from "@global/components/global/accordion";
import hashAccordion from "@global/components/global/hashAccordion";
import floatLabel from "@global/components/global/floatLabel";
import focusInput from "@global/components/global/focusInput";
import formInputOrder from "@global/components/global/formInputOrder";
import Popup from "@global/components/global/popup";

//import Lightbox from '@global/components/global/Lightbox'

// promotion
import FooterNotice from "@global/components/promotion/footerNotice";
import navigation from "@page/common/js/template/navigation";

// expose functions to Global namespace
window.pazzo = window.pazzo || {};
window.nowEnv = window.nowEnv || {};
window.nowBrand = window.pazzo;

pazzo.constants = {
	addToCartUrl: "/Shopping/MiniCart/",
	addToCartUrl_Pre: "/Shopping/ReservationMiniCart/",
	addToWishList: "/Member/AddWishList/",
	todayViewImg: "/Product/DetailByBarcode",
	todayViewImgType: "POST",
	GetBanners: "/Home/GetBanners",
	IgTag: "/alittlemorepazzo/GetHomeCarouselData",
};

pazzo.miniCartConfig = {
	cartCookieName: "minicart",
	preCartCookieName: "reservationcart",
	wishlistProductName: ".info a > p:first-of-type",
};

pazzo.globalConfig = {
	id: "pazzo",
	name: "pazzo",
	notAllHttps: true,
	devPort: "82",
	host: "www.pazzo.com.tw",
};

// 每個區塊的預設圖片路徑
pazzo.imagePlaceholder = {
	default: "/static/img/inf_573x730.jpg",
};

function globalCtrl() {
	// environment
	nowEnv.NowIsDev = setEnv.isDev(); // 得知是否為本機開發環境
	nowEnv.NowIsTest = setEnv.isTest(); // 得知是否為測試環境
	nowEnv.NowMyEquipment = setEnv.myEquipment(); // 得知現在的裝置類型
	nowEnv.NowIsLogin = setEnv.isLogin(); // 得知是否登入
	nowEnv.NowMyCookie = setEnv.myCookie(); // 得知目前裝置是否允許Cookie
	nowEnv.NowMyStorage = setEnv.myStorage(); // 得知目前裝置是否允許Storage

	// scripts ignore
	ignoreByDom(setEnv.windowReload, ["#KrispyKreme"]);

	// require component

	// daisy const miniCart = require('@page/common/js/cart/miniCart')
	// const navigation = require('@page/common/js/template/navigation')

	// daisy miniCart.init()

	// globalUI
	gotop(".footer", { toggle: { target: 0, timeout: 0, duration: 250 } });
	accordion(".order-accordion");
	hashAccordion();
	floatLabel();
	focusInput(".footer__newsletter__txt");
	formInputOrder({
		inputArray: [".footer__newsletter__txt"],
		submitButton: "#btnNewletter",
	});
	// formInputOrder({
	//   inputArray: [
	//     '#account, #username',
	//     '#password',
	//     '#captchaTxt, #LoginCode'
	//   ],
	//   submitButton: '#btnLogin, #btnShoppingLogin'
	// })
	formInputOrder({
		inputArray: ["#accountForgot", "#ForgetCode"],
		submitButton: "#btnSend",
	});

	// daisy Lightbox.init()

	// loginSlider
	$(".btn-forgot-pwd, .btn-back").on("click", function () {
		$(this).closest("li").toggle();
		$(this).closest("li").siblings("li").fadeToggle();
	});

	// condition
	if (nowEnv.NowMyEquipment) {
		// 手機版
		// template
		navigation.navMobile();
		navigation.subnavMobile();
		navigation.globalSearch(".mobile-global-search");

		// promotion
		excuteByDom(() => {
			const footerNotice = new FooterNotice();
			footerNotice.init();
		}, ["#home-content-women"]);
	} else {
		// 我是電腦版
		// template
		navigation.navDesktop();
		navigation.subnavDesktop();
		navigation.globalSearch(".global-search");

		// daisy miniCart.render()
	}

	// expose functions to Global namespace
	// daisy pazzo.miniCart = miniCart

	pazzo.alert = Popup("alert");
	pazzo.confirm = Popup("confirm");
}

export default globalCtrl;
