/*
 * create alert or confirm dialog constructor.
 * param {string} type determine whate type to create, alert or confirm.
 */

function Popup(type) {
	let PopupButtons;

	if (nowBrand.popupType === "englishBtn") {
		PopupButtons =
			'<div class="popup__buttons">' +
			'<a href="javascripts:;" class="btn popup__cancel">CANCEL</a>' +
			'<a href="javascripts:;" class="btn popup__ok">OK</a>' +
			"</div>";
	} else {
		PopupButtons =
			'<div class="popup__buttons">' +
			'<a href="javascripts:;" class="btn btn--small popup__cancel">取消</a>' +
			'<a href="javascripts:;" class="btn btn--small popup__ok">確定</a>' +
			"</div>";
	}

	var html =
		'<div class="popup">' +
		'<div class="popup__inner">' +
		'<div class="popup__header"><span></span></div>' +
		'<div class="popup__body"></div>' +
		PopupButtons +
		"</div>" +
		"</div>";

	/*
	 * call alert or confirm dialog
	 * param {string} msg the message to show. required!
	 * param {string} title the title of dialog. can be omitted.
	 * param {function} callback execute when close the dialog. can be omitted.
	 */
	function CreatePopup(msg, title, callback) {
		if (!(this instanceof CreatePopup)) {
			return new CreatePopup(msg, title, callback);
		}

		if (type === "confirm") {
			this.$el = $(html);
			this.type = "confirm";
		} else if (type === "alert") {
			this.$el = $(html);
			this.$el.find(".popup__cancel").remove();
			this.type = "alert";

			if (nowBrand.alertType === "single") {
				this.$el.find(".popup__ok").addClass("btn--single");
			}
		} else {
			this.$el = $(html);
			this.$el.find(".popup__inner").addClass("notice");
			this.$el.find(".popup__buttons").remove();
			this.type = "notice";
		}

		this.init(msg, title, callback);
	}

	CreatePopup.prototype = {
		init: function (msg, title, callback) {
			var self = this;
			var args = Array.prototype.slice.call(arguments);

			this.$el.find(".popup__ok").on("click", function (event) {
				self.close();

				if (typeof args[1] === "function") {
					args[1](true);
				} else if (typeof args[2] === "function") {
					args[2](true);
				}

				if (callback == undefined) return;
				callback();

				event.preventDefault();
			});

			if (this.type === "confirm") {
				this.$el.find(".popup__cancel").on("click", function (event) {
					self.close();

					if (typeof args[1] === "function") {
						args[1](false);
					} else if (typeof args[2] === "function") {
						args[2](false);
					}

					if (callback == undefined) return;
					callback();

					event.preventDefault();
				});
			}

			if (this.type === "notice") {
				const closeTimeout =
					nowBrand.globalConfig && nowBrand.globalConfig.noticeTimeout ? nowBrand.globalConfig.noticeTimeout : 1500;

				setTimeout(function () {
					self.close();
				}, closeTimeout);
			}

			this.open(msg, title);
			this.focus();
		},

		open: function (msg, title) {
			// var self = this
			var $popupInner = this.$el.find(".popup__inner");
			var height;

			if (typeof msg !== "string") {
				throw new Error("no msseges!");
			} else {
				this.$el.find(".popup__body").html(msg);
			}

			if (typeof title === "string") {
				this.$el.find(".popup__header > span").html(title);
			}

			this.$el.appendTo("body");
			$popupInner.css("opacity", 0);

			height = -parseInt($popupInner.outerHeight() / 2, 10) + "px";

			setTimeout(function () {
				$popupInner.css({
					opacity: 1,
					"margin-top": height,
					transform: "scale(1)",
				});
			}, 10);
		},

		close: function () {
			this.$el.remove();
		},

		focus: function () {
			this.$el.find(".popup__ok").focus();
		},
	};

	return CreatePopup;
} // end of Popup

export default Popup;
