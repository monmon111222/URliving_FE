const gtmTrace = {
	addToCart: function (data) {
		dataLayer.push({
			'event': 'addToCart',
			'ecommerce': {
				'currencyCode': 'TWD',
				'add': {                            
					'products': [{                       
						'name': typeof(htmlDecode) !== 'undefined' ? htmlDecode(data.name): data.name,
						'id': data.id,
						'price': data.price,
						'sale_price': data.sale_price,
						'img_url': data.img_url,
						'product_url': data.product_url,
						'variant': data.color,
						'quantity': data.count
					}]
				}
			}
		});
	},
	removeFromCart: function(data){
		dataLayer.push({
			'event': 'removeFromCart',
			'ecommerce': {
				'remove': {                            
					'products': [{                       
						'name': typeof(htmlDecode) !== 'undefined' ? htmlDecode(data.name): data.name,
						'id': data.id,
						'price': data.price,
						'sale_price': data.sale_price,
						'img_url': data.img_url,
						'product_url': data.product_url,
						'variant': data.color,
						'quantity': data.count
					}]
				}
			}
		});
	},
	checkout: function(data){
		dataLayer.push({
			'event': 'checkout',
			'ecommerce': {
				'checkout': {                            
					'products': [{                       
						'name': typeof(htmlDecode) !== 'undefined' ? htmlDecode(data.name): data.name,
						'id': data.id,
						'price': data.price,
						'sale_price': data.sale_price,
						'img_url': data.img_url,
						'product_url': data.product_url,
						'variant': data.color,
						'quantity': data.count
					}]
				}
			}
		});
	}
}

export default gtmTrace;