export default (function () {
	/**
	 * Helper function to extract the coordinates from an event, whether the
	 * event is a mouse or touch.
	 */
	function getEventCoords(ev) {
		var first;
		var coords = {};
		var origEv = ev.originalEvent; // get from jQuery

		if (origEv.changedTouches !== undefined) {
			first = origEv.changedTouches[0];
			coords.pageX = first.pageX;
			coords.pageY = first.pageY;
		} else {
			coords.pageX = ev.pageX;
			coords.pageY = ev.pageY;
		}

		return coords;
	}

	/**
	 * Helper function to get the local coords of an event in an element.
	 *
	 * @param elem element in question
	 * @param ev the event
	 */
	function getLocalCoords(elem, coords) {
		var offset = $(elem).offset();
		return {
			x: coords.pageX - offset.left,
			y: coords.pageY - offset.top,
		};
	}

	/**
	 * Construct a new scratcher object
	 *
	 * @param canvasId [string] the canvas DOM ID, e.g. 'canvas2'
	 * @param backImage [string, optional] URL to background (bottom) image
	 * @param frontImage [string, optional] URL to foreground (top) image
	 */
	function Scratcher(canvasId, backImage) {
		this.canvas = {
			main: $("#" + canvasId).get(0),
		};

		this.fresh = true;

		this.mouseDown = true;

		this.canvasId = canvasId;

		this._setupCanvases(); // finish setup from constructor now

		this.setImages(backImage);

		this._eventListeners = {};
	}

	/**
	 * Set the images to use
	 */
	Scratcher.prototype.setImages = function (backImage, w, h) {
		this.image = {
			back: { url: backImage, img: null },
		};

		if (backImage) {
			this._loadImages(w, h); // start image loading from constructor now
		}
	};

	/**
	 * Returns how scratched the scratcher is
	 *
	 * By adjusting the stride, you get a less accurate result, but it is
	 * quicker to compute (pixels are skipped)
	 *
	 * @param stride [optional] pixel step value, default 1
	 *
	 * @return the fraction the canvas has been scratched (0.0 -> 1.0)
	 */
	Scratcher.prototype.fullAmount = function (stride) {
		var i, l;
		var can = this.canvas.main;
		var ctx = can.getContext("2d");
		var count, total;
		var pixels, pdata;

		if (!stride || stride < 1) {
			stride = 1;
		}

		stride *= 4; // 4 elements per pixel

		pixels = ctx.getImageData(0, 0, can.width, can.height);
		pdata = pixels.data;
		l = pdata.length; // 4 entries per pixel

		total = (l / stride) | 0;

		for (i = count = 0; i < l; i += stride) {
			if (pdata[i] !== 0) {
				count++;
			}
		}

		return count / total;
	};

	/**
	 * Recomposites the canvases onto the screen
	 *
	 * Note that my preferred method (putting the background down, then the
	 * masked foreground) doesn't seem to work in FF with "source-out"
	 * compositing mode (it just leaves the destination canvas blank.)  I
	 * like this method because mentally it makes sense to have the
	 * foreground drawn on top of the background.
	 *
	 * Instead, to get the same effect, we draw the whole foreground image,
	 * and then mask the background (with "source-atop", which FF seems
	 * happy with) and stamp that on top.  The final result is the same, but
	 * it's a little bit weird since we're stamping the background on the
	 * foreground.
	 *
	 * OPTIMIZATION: This naively redraws the entire canvas, which involves
	 * four full-size image blits.  An optimization would be to track the
	 * dirty rectangle in scratchLine(), and only redraw that portion (i.e.
	 * in each drawImage() call, pass the dirty rectangle as well--check out
	 * the drawImage() documentation for details.)  This would scale to
	 * arbitrary-sized images, whereas in its current form, it will dog out
	 * if the images are large.
	 */
	Scratcher.prototype.recompositeCanvases = function (w, h) {
		var can = this.canvas.main;
		var ctx = can.getContext("2d");
		ctx.globalCompositeOperation = "copy";
		ctx.drawImage(this.image.back.img, 0, 0, w, h);
		ctx.globalCompositeOperation = "destination-out";
	};

	/**
	 * Draw a scratch line
	 *
	 * Dispatches the 'scratch' event.
	 *
	 * @param x,y the coordinates
	 * @param fresh start a new line if true
	 */
	Scratcher.prototype.scratchLine = function (x, y) {
		var can = this.canvas.main;
		var ctx = can.getContext("2d");
		ctx.lineWidth = 100; // 刮除的寬
		ctx.lineCap = ctx.lineJoin = "round";
		ctx.strokeStyle = "rgba(0,0,0,1)"; // can be any opaque color
		if (this.fresh) {
			ctx.beginPath();
			this.fresh = false;
			// this +0.01 hackishly causes Linux Chrome to draw a
			// "zero"-length line (a single point), otherwise it doesn't
			// draw when the mouse is clicked but not moved:
			ctx.moveTo(x + 0.01, y);
		}
		ctx.lineTo(x, y);
		ctx.stroke();

		// call back if we have it
		this.dispatchEvent(this.createEvent("scratch"));
	};

	/**
	 * Set up the main canvas and listeners
	 */
	Scratcher.prototype._setupCanvases = function () {
		var c = this.canvas.main;

		// create the temp and draw canvases, and set their dimensions
		// to the same as the main canvas:

		/**
		 * On mouse move, if mouse down, draw a line
		 *
		 * We do this on the window to smoothly handle mousing outside
		 * the canvas
		 */
		function mousemoveHandler(e) {
			if (!this.mouseDown) {
				return true;
			}
			var local = getLocalCoords(c, getEventCoords(e));

			this.scratchLine(local.x, local.y);

			return false;
		}

		$(document).on("mousemove", mousemoveHandler.bind(this));
		$(document).on("touchmove.game", mousemoveHandler.bind(this));
	};
	/**
	 * Reset the scratcher
	 *
	 * Dispatches the 'reset' event.
	 *
	 */
	Scratcher.prototype.reset = function () {
		// clear the draw canvas
		this.fresh = true;
		this.recompositeCanvases();

		// call back if we have it
		this.dispatchEvent(this.createEvent("reset"));
	};

	/**
	 * returns the main canvas jQuery object for this scratcher
	 */
	Scratcher.prototype.mainCanvas = function () {
		return this.canvas.main;
	};

	/**
	 * Handle loading of needed image resources
	 *
	 * Dispatches the 'imagesloaded' event
	 */
	Scratcher.prototype._loadImages = function (w, h) {
		var loadCount = 0;

		// callback for when the images get loaded
		function imageLoaded(e) {
			loadCount++;

			if (loadCount >= 1) {
				// call the callback with this Scratcher as an argument:
				this.dispatchEvent(this.createEvent("imagesloaded"));
				this.recompositeCanvases(w, h);
			}
		}

		// load BG and FG images
		for (var k in this.image) {
			if (this.image.hasOwnProperty(k)) {
				this.image[k].img = document.createElement("img"); // image is global
				$(this.image[k].img).on("load", imageLoaded.bind(this));
				this.image[k].img.src = this.image[k].url;
			}
		}
	};

	/**
	 * Create an event
	 *
	 * Note: not at all a real DOM event
	 */
	Scratcher.prototype.createEvent = function (type) {
		var ev = {
			type: type,
			target: this,
			currentTarget: this,
		};

		return ev;
	};

	/**
	 * Add an event listener
	 */
	Scratcher.prototype.addEventListener = function (type, handler) {
		var el = this._eventListeners;

		type = type.toLowerCase();

		if (!el.hasOwnProperty(type)) {
			el[type] = [];
		}

		if (el[type].indexOf(handler) === -1) {
			el[type].push(handler);
		}
	};

	/**
	 * Remove an event listener
	 */
	Scratcher.prototype.removeEventListener = function (type, handler) {
		var el = this._eventListeners;
		var i;

		type = type.toLowerCase();

		if (!el.hasOwnProperty(type)) {
			return;
		}

		if (handler) {
			if ((i = el[type].indexOf(handler)) !== -1) {
				el[type].splice(i, 1);
			}
		} else {
			el[type] = [];
		}
	};

	/**
	 * Dispatch an event
	 */
	Scratcher.prototype.dispatchEvent = function (ev) {
		var el = this._eventListeners;
		var i, len;
		var type = ev.type.toLowerCase();

		if (!el.hasOwnProperty(type)) {
			return;
		}

		len = el[type].length;

		for (i = 0; i < len; i++) {
			el[type][i].call(this, ev);
		}
	};

	/**
	 * Set up a bind if you don't have one
	 *
	 * Notably, Mobile Safari and the Android web browser are missing it.
	 * IE8 doesn't have it, but <canvas> doesn't work there, anyway.
	 *
	 * From MDN:
	 *
	 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
	 */
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			// eslint-disable-line
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal
				// IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1);
			var fToBind = this;
			var FNOP = function () {};
			var fBound = function () {
				return fToBind.apply(
					this instanceof FNOP ? this : oThis || window,
					aArgs.concat(Array.prototype.slice.call(arguments))
				);
			};

			FNOP.prototype = this.prototype;
			fBound.prototype = new FNOP();

			return fBound;
		};
	}

	return Scratcher;
})();
