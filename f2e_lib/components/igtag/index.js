require("historyjs/scripts/compressed/history.adapter.jquery.js");
require("historyjs/scripts/compressed/history.js");
import nanoScroller from "@global/vendors/jquery.nanoscroller.min";
import igPopup from "@global/components/igtag/igPopup";

const IGapp = {
	data: {
		nowPopupID: null, //for popup show/off,
		nowPopupIndex: null,
		popupPost: null,
		popupIsOpen: false,
		nowPage: 1,
		pagePosts: [],
		pageInfo: null,
		posts: [],
		postSize: 20, //一頁幾筆
		isLoading: false,
		runLoading: false,
		dataisload: false,
		removeMoreBtn: false,
		scrollY: 0,
		nowLink: window.location.href,
	},
	components: {
		igPopup,
	},
	created: function () {
		var _this = this;
		var campaignTag = this.getTagName();
		$.ajax({
			type: "GET",
			url: API_URL.IG_STYLE + "?Tag=" + campaignTag,
			dataType: "json",
			xhrFields: {
				withCredentials: true,
			},
			error: function () {
				console.log("error");
			},
			success: function (res) {
				if (res.Code === 200) {
					_this.posts = res.Response.Posts;
					_this.pageInfo = res.Response.Campaign;
					_this.loadPageDatas();
					_this.dataisload = true;
					_this.initPopup();
				} else {
					AlertDialog.alert("系統忙線中，請稍後");
				}
			},
		});
	},
	mounted: function () {
		var _this = this;
		this.bindHistory();
		window.addEventListener("scroll", this.scrollEvent);
	},
	watch: {
		nowPopupIndex: function (index) {
			var _this = this;
			if (this.posts[index] === undefined) {
				this.closePopup();
				return;
			}
			this.popupIsOpen = true;
			this.popupPost = this.posts[index];
			this.setRelatedItemsScroll();
		},
	},
	methods: {
		setRelatedItemsScroll: function () {
			setTimeout(function () {
				$(".nano").css("height", $(".modal-left-column").height() - 138);
			});
			setTimeout(function () {
				$(".nano").nanoScroller({
					contentClass: "nanoscroll__content",
					preventPageScrolling: true,
					disableResize: true,
					flash: true,
				});
			});
		},
		getTagName: function () {
			var pathname = window.location.pathname;
			if (pathname.substring(pathname.indexOf("ig/") + 3, pathname.length).indexOf("/") !== -1) {
				var tagName = pathname.substring(pathname.indexOf("ig/") + 3, pathname.lastIndexOf("/"));
			} else {
				var tagName = pathname.substring(pathname.indexOf("ig/") + 3, pathname.length);
			}
			return tagName;
		},
		initPopup: function () {
			var pathname = window.location.pathname;
			var pathID = pathname.substring(pathname.lastIndexOf("/") + 1, pathname.length);
			var _this = this;
			if (pathname.substring(4, pathname.length).indexOf("/") !== -1) {
				// 有ID編號
				this.posts.forEach(function (el, index) {
					if (el.ID === parseInt(pathID)) {
						_this.openPopup(index, pathID);
					}
				});
			}
		},
		bindHistory: function () {
			var _this = this;

			if (History.Adapter !== undefined) {
				History.Adapter.bind(window, "statechange", function () {
					var pidx = History.getState().data.p_index;
					_this.scrollY = window.scrollY;
					_this.nowPopupIndex = pidx;
					_this.nowLink = window.location.href;
				});
			}
		},
		runScrolling: function () {
			this.removeMoreBtn = true;
			this.runLoading = true;
			this.nowPage++;
			this.loadPageDatas();
		},
		loadPageDatas: function () {
			this.isLoading = true;
			for (var i = (this.nowPage - 1) * this.postSize; i < this.nowPage * this.postSize; i++) {
				if (this.posts[i] !== undefined) this.pagePosts.push(this.posts[i]);
				if (i === this.nowPage * this.postSize - 1) this.isLoading = false;
				if (i === this.posts.length - 1) this.reachLastPage();
			}
		},
		reachLastPage: function () {
			this.runLoading = false;
			this.removeMoreBtn = true;
			window.removeEventListener("scroll", this.scrollEvent);
		},
		scrollEvent: function () {
			var $window = $(window),
				$document = $(document);

			if (!this.isLoading && this.runLoading) {
				var winHeight = window.innerHeight ? window.innerHeight : $window.height(), // iphone fix
					closeToBottom = $window.scrollTop() + winHeight > $document.height() - 1500;
				if (closeToBottom) {
					// Get datas and add them to the bottom of the grid
					this.nowPage++;
					this.loadPageDatas();
				}
			}
		},
		openPopup: function (index, pid) {
			var pathname = window.location.pathname;
			if (pathname.substring(4, pathname.length).indexOf("/") !== -1) {
				// 有ID編號
				History.pushState({ p_index: index, p_id: pid }, $("title").html(), window.location.href);
			} else {
				History.pushState({ p_index: index, p_id: pid }, $("title").html(), window.location.pathname + "/" + pid);
			}
		},
		closePopup: function () {
			this.popupIsOpen = false;
			var id = History.getState().data.p_id;
			History.pushState({ p_index: null, p_id: null }, $("title").html(), window.location.href.replace("/" + id, ""));
		},
		changeNowIndex: function (val) {
			var nextIdx = this.nowPopupIndex + 1;
			var preIdx = this.nowPopupIndex - 1;
			var nowID = this.posts[this.nowPopupIndex].ID;
			var nextIdx = this.nowPopupIndex + 1 == this.posts.length ? this.nowPopupIndex : this.nowPopupIndex + 1;
			var preIdx = this.nowPopupIndex - 1 == -1 ? this.nowPopupIndex : this.nowPopupIndex - 1;
			var nextID = this.posts[this.nowPopupIndex + 1] == undefined ? undefined : this.posts[this.nowPopupIndex + 1].ID;
			var preID = this.posts[this.nowPopupIndex - 1] == undefined ? undefined : this.posts[this.nowPopupIndex - 1].ID;

			if (val === "next" && this.nowPopupIndex + 1 !== this.posts.length) {
				History.pushState(
					{ p_index: nextIdx, p_id: nextID },
					$("title").html(),
					window.location.href.replace("/" + nowID, "/" + nextID)
				);
			} else if (val === "pre" && this.nowPopupIndex - 1 !== -1) {
				History.pushState(
					{ p_index: preIdx, p_id: preID },
					$("title").html(),
					window.location.href.replace("/" + nowID, "/" + preID)
				);
			} else {
				this.closePopup();
			}
		},
	},
	beforeDestroy: function () {
		window.removeEventListener("scroll");
	},
};

export default IGapp;
