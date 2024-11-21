// 內頁 產品注意事項說明
// 從上層props傳入參數:
// infoData 物件 注意事項的陣列

const Preoderday = (props) => {
	// 有日期的寫法:
	/*
	 * const data = props.data.split(',')
	 * {`預計出貨日:${data[1]}/${data[2]}`}
	 */
	return (
		<div>
			<div className="product-PreoderDAY">
				{props.longer ? (
					<span className="date">預購商品追加到貨約45-60個工作日</span>
				) : (
					<span className="date">預購商品追加到貨約14-30個工作日</span>
				)}
			</div>
			<div className="product-PreoderDAY--info">
				*預訂及現貨商品，系統將自動分開成立訂單；運費及組合優惠皆不合併計算。
			</div>
		</div>
	);
};

module.exports = Preoderday;
