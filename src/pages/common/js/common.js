// var object = require('lodash/fp/object');
import nanoScroller from "@global/vendors/jquery.nanoscroller.min";
import Vue from "vue";
import cartNotification from "@global/components/cart/cartNotification";
import AlertDialog from "@global/helpers/alertDialog";
import messageBox from "@global/helpers/messageBox";
import modal from "bootstrap/js/dist/modal";
import validate from "@global/vendors/jquery.validate.min";
import Collapse from "bootstrap/js/dist/collapse";
import globalCtrl from "@page/common/js/globalCtrl";
import NewImage from "@global/components/global/image";
import store from "@global/components/store/index.js";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapGetters } = createNamespacedHelpers("miniCartModule");

global.$ = global.jQuery = require("jquery"); // fix can't use JQ in inline script

globalCtrl();

if ($("#app-mini-cart").length > 0) {
	window.appNotificationCart = new Vue({
		el: "#app-mini-cart",
		store,
		computed: {
			...mapState([
				"totalCount",
				"generalCount",
				"refrigerationCount",
				"freezingCount",
				"dataIsLoad",
				"generalMarketProducts",
				"count",
			]),
			...mapGetters(["isOnlyOneTemp"]),
		},
		components: { NewImage },
		created() {
			this.getCartInfo();
		},
		methods: {
			...mapActions(["getCartInfo"]),
			customCount(count) {
				if (count < 10) {
					return "0" + count.toString();
				} else {
					return count.toString();
				}
			},
		},
	});
}

if ($("#bottom-bar").length > 0) {
	window.appNotificationCart = new Vue({
		el: "#bottom-bar",
		store,
		computed: {
			...mapState(["totalCount"]),
		},
		created() {},
		methods: {},
	});
}

// fix when mutiple inputs with same name always validate the first item.
$.validator.prototype.checkForm = function () {
	//overriden in a specific page
	this.prepareForm();
	for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
		if (this.findByName(elements[i].name).length !== undefined && this.findByName(elements[i].name).length > 1) {
			for (var cnt = 0; cnt < this.findByName(elements[i].name).length; cnt++) {
				this.check(this.findByName(elements[i].name)[cnt]);
			}
		} else {
			this.check(elements[i]);
		}
	}
	return this.valid();
};

// 電子報
const mailValidate = {
	errorClass: "error",
	errorElement: "div",
	rules: {
		newsletter: {
			required: true,
			email: true,
		},
	},
	messages: {},
	errorPlacement: function (error, element) {
		element.parent().append(error);
	},
	submitHandler: function (form) {
		const $input = $(form).find(".input-newsletter");
		$.ajax({
			type: "POST",
			url: "/api/v1/Subscribe/Apply",
			dataType: "json",
			data: { Email: $input.val() },
			xhrFields: {
				withCredentials: false,
			},
			error: function () {
				AlertDialog.alertBear(res.Message);
			},
			success: function (res) {
				AlertDialog.alertBear(res.Message, function () {});
			},
		});
	},
};
$("#form-newsletter-signup").validate(mailValidate);
$("#form-newsletter-signup-mobile").validate(mailValidate);

// 全域方法前後端使用
window.AlertDialog = AlertDialog;
window.Vue = Vue;
window.messageBox = messageBox;

$("body").on("click", ".cart-mask", function (e) {
	e.preventDefault();
	var $el = $(this),
		target = $el.data("sidebar"),
		mask = $el.data("mask");
	$(mask).css({ right: "290px", "z-index": "1030" });
});

$("body").on("click", "#bottom-more", function (e) {
	e.preventDefault();
	var $el = $(this),
		target = $el.data("sidebar"),
		closeBtn = $el.data("close"),
		defaultType = $el.data("type"),
		defaultList = $el.data("list");
	$(target).toggleClass("active");
	$el.toggleClass("active");
	if ($el.hasClass("active")) {
		$("body").addClass("lock-page");
	} else {
		$("body").removeClass("lock-page");
	}
	$(closeBtn).css("display", "inline-block");
	$(closeBtn).css("margin-right", "0px");
	$(closeBtn).css("margin-left", "15px");
	$(defaultType).addClass("active");
	$(defaultList).css("display", "inline-block");
});

$("body").on("click", "#header-close", function (e) {
	e.preventDefault();
	var $el = $(this),
		target = $el.data("sidebar");
	$(target).removeClass("active");
	$("body").removeClass("lock-page");
	$el.css("display", "none");
});

$(".sidebar-main-type").click(function (e) {
	e.preventDefault();
	var $el = $(this),
		target = $el.data("list");
	$(".sidebar-main-type").removeClass("active");
	$(".level2-list").css("display", "none");
	$el.toggleClass("active");
	$(target).css("display", "inline-block");
});

const $btnTop = $("#top-btn");

$btnTop.click(function (e) {
	e.preventDefault();
	$("html,body").animate({ scrollTop: 0 }, 300);
	return false;
});

// search
const gotosearch = function (inputVal) {
	if (inputVal === "") {
		AlertDialog.alert("請輸入關鍵字");
	} else {
		window.location.href = "/search?Keyword=" + inputVal;
	}
};

$(".search-form").on("submit", function (event) {
	event.preventDefault();
	gotosearch($(this).find("input").val());
});

$(".btn-search-m").click(function (event) {
	event.preventDefault();
	gotosearch($(this).parents("form").find("input").val());
});

$(document).ready(function () {
	const $header = $(".header");
	let headerHight = $header.height();
	let headerPaddingTop = 0;
	headerPaddingTop = parseInt($header.css("padding-top").replace("px", ""));
	$(".detail-block").css("top", headerHight + headerPaddingTop + "px");

	if ($header.length < 1) return;

	function windowSize() {
		if ($(window).width() < 1200) {
			return true;
		}
	}

	$(window).resize(function () {
		windowSize();
	});

	let isMobile = windowSize();

	$(window).scroll(function () {
		if (!isMobile) {
			$(window).scrollTop() > headerHight ? $header.addClass("active") : $header.removeClass("active");
			headerHight = $header.height();
			headerPaddingTop = parseInt($header.css("padding-top").replace("px", ""));
			$(".detail-block").css("top", headerHight + headerPaddingTop + "px");
		}
	});
});
