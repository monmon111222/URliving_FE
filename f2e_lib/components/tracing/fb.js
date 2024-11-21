const fbTrace = {
	addToCart: function (data) {
		fbq("track", "AddToCart", {
			content_ids: [data.id],
			content_type: "product",
			value: data.price,
			currency: "TWD",
		});
	},
};

module.exports = fbTrace;
