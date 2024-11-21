// @param (start, end) type:array
// ex: [2020,12,12,13,59,59,59]

const checkEventPeriod = function(start, end){ 
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
	function getPeriodTime(time) {
		return new Date(
			  time[0],
			  time[1] - 1, // 月份要-1
			  time[2],
			  time[3],
			  time[4],
			  time[5],
			  time[6]
		).getTime();
	}

	let nowTime = getServerTime();
	let startTime = getPeriodTime(start);
	let endTime = getPeriodTime(end);

	return nowTime <= endTime && nowTime >= startTime;
}

module.exports = checkEventPeriod;