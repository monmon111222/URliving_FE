const aqTrace = {
	addedToWishlist: function (data) {
		qg("event", "product_added_to_wishlist", {
			product_id: data.id,
			product_color: data.color,
			product_price: data.price,
			product_name: data.name,
			product_image_url: data.imgUrl,
			product_url: data.url,
		});
	},
	addToCart: function (data) {
		qg("event", "product_added_to_cart", {
			product_id: data.id,
			product_color: data.color,
			product_size: data.size,
			product_price: data.price,
			product_name: data.name,
			product_image_url: data.imgUrl,
			product_url: data.url,
			cart_type: data.type,
		});
	},
	removeFromCart: function (data) {
		qg("event", "product_removed_from_cart", {
			product_id: data.id,
			product_color: data.color,
			product_size: data.size,
			product_price: data.price,
			product_name: data.name,
			product_image_url: data.imgUrl,
			product_url: data.url,
			cart_type: data.type,
		});
	},
	cancelOrder: function (data) {
		qg("event", "refunded", {
			order_id: data.id,
		});
	},
	subscribedMail: function (data) {
		qg("event", "subscribed");
		qg("identify", { email: data.mail });
		dataLayer.push({ subscribe: data.mail });
	},
	checkSizeChart: function (data) {
		qg("event", "view_size_table", {
			product_id: data.id,
			product_price: data.price,
			product_name: data.name,
			product_image_url: data.imgUrl,
			product_url: data.url,
		});
	},
	deliveryNotification: function () {
		qg("event", "confirm_delivery_notification");
	},
};

module.exports = aqTrace;
