/* @param periods:array, dom: dom selector
 ** periods => [
 ** 	{date: [2020,4,9,10,0,0,0]},
 **	{date: [2020,4,9,14,0,0,0]}
 ** ]
 ** dom => document.getElementsByClassName()
 */

const promoFunc = (periods, appendDom, domStyle, txt) => {
	// 取現在時間
	function getServerTime() {
		var nowDate = new Date();
		// 取國際時間UTC
		var serverTime = new Date(
			nowDate.getUTCFullYear(),
			nowDate.getUTCMonth(),
			nowDate.getUTCDate(),
			nowDate.getUTCHours() + 8, // 換台灣時間+8
			nowDate.getMinutes(),
			nowDate.getUTCSeconds(),
			nowDate.getUTCMilliseconds()
		).getTime();

		return serverTime;
	}

	// 取顯示區間時間
	function getPeriodTime() {
		var P = [];

		for (let i = 0; i < periods.length; i++) {
			P.push(
				new Date(
					periods[i].date[0],
					periods[i].date[1] - 1, // 月份要-1
					periods[i].date[2],
					periods[i].date[3],
					periods[i].date[4],
					periods[i].date[5],
					periods[i].date[6]
				).getTime()
			);
		}

		return P;
	}

	// render 行銷文案
	function appendPromoTxt() {
		let p = document.createElement("p");
		p.innerHTML = txt;

		domStyle.forEach(function(element, index) {
			p.classList.add(element);
		});

		appendDom.appendChild(p);
	}

	if (getServerTime() > getPeriodTime()[0] && getServerTime() <= getPeriodTime()[1]) {
		appendPromoTxt();
	}
};

export default promoFunc;
