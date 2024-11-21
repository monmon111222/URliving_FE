import Clipboard from "clipboard";

function popupAD() {
	const $body = $("body");
	const popupPrefix = "popupAD_";
	const popupPrefixID = `#${popupPrefix}`;

	function initClipboard(paramPopupAD) {
		const clipboard = new Clipboard(`${popupPrefixID}${paramPopupAD.popupID} .btn-clipboard`);
		clipboard.on("success", () => {
			$(`${popupPrefixID}${paramPopupAD.popupID} .btn-clipboard`).html("代碼已複製！");
		});
	}

	function closePopup(paramPopupAD) {
		$(`${popupPrefixID}${paramPopupAD.popupID} .popup_content`).fadeOut();
		clearTimeout(paramPopupAD.popupTimeout);

		// 如果 cycle 為 0 表示不紀錄 cookie，清掉 cookie
		if (paramPopupAD.cycle) {
			$.cookie(`${popupPrefix}${paramPopupAD.popupID}`, true, { expires: paramPopupAD.cycle });
		} else {
			$.removeCookie(`${popupPrefix}${paramPopupAD.popupID}`);
		}
	}

	function clickClose(paramPopupAD, targetName, isBgClose) {
		const popupContent = `${popupPrefixID}${paramPopupAD.popupID} .popup_content_init`;
		const eventTarget = `${popupPrefixID}${paramPopupAD.popupID} ${targetName}`;

		let mobileTouching;

		// 判斷是否符合關閉條件
		const checkTarget = ($target) => {
			// 如果有設定 bgClose 就要排除點到 popup content 的情形
			// 無論有沒有設定 bgClose 都必須點到對應的 event target
			return (
				(!isBgClose || !($target.is(popupContent) || $target.closest(popupContent).length)) &&
				($target.is(eventTarget) || $target.closest(eventTarget).length)
			);
		};

		$body.on("click", (e) => {
			// 如果點擊的目標符合關閉條件，就忽略 dom 預設事件並且關閉 popup
			if (checkTarget($(e.target))) {
				e.preventDefault();
				closePopup(paramPopupAD);
			}
		});

		// fix mobile webkit browser onclick bug
		$body.on("touchstart", (e) => {
			// 如果觸碰開始的目標符合關閉條件，就設定為 "觸碰開始""
			if (checkTarget($(e.target))) {
				mobileTouching = true;
			}
		});

		$body.on("touchend", (e) => {
			// 如果已經 "觸碰開始" 且觸碰結束的目標符合關閉條件，就關閉 popup
			// 無論如何都設定為觸碰結束
			const changedTouch = e.originalEvent.changedTouches[0];
			const $target = $(document.elementFromPoint(changedTouch.clientX, changedTouch.clientY));
			if (mobileTouching && checkTarget($target)) {
				closePopup(paramPopupAD);
			}
			mobileTouching = false;
		});
	}

	const effect = {
		show: (paramPopupAD) => {
			// console.log('一般show執行了')
			$(`${popupPrefixID}${paramPopupAD.popupID}`).show();
		},

		fadeInAll: (paramPopupAD) => {
			// console.log('fadeInAll執行了')
			$(`${popupPrefixID}${paramPopupAD.popupID}`).fadeIn();
			$(`${popupPrefixID}${paramPopupAD.popupID} .popup_content_init`).css("margin-top", 0);
		},

		fadeDown: (paramPopupAD) => {
			effect.fadeInAll(paramPopupAD);
		},

		fadeIn: (paramPopupAD) => {
			// console.log('fadeIn執行了')
			$(`${popupPrefixID}${paramPopupAD.popupID}`).show(300, () => {
				$(`${popupPrefixID}${paramPopupAD.popupID} .popup_content_init`).css({ "margin-top": 0, opacity: 1 });
			});
		},

		bgClose: (paramPopupAD) => {
			clickClose(paramPopupAD, "", true);
		},

		mHide: (paramPopupAD) => {
			$(`${popupPrefixID}${paramPopupAD.popupID}`).addClass("mHide");
		},

		timer: (paramPopupAD, dayTimer) => {
			const endTime = paramPopupAD.popupAdEnd;
			const serverTime = paramPopupAD.serverTime;
			let newServerTime = serverTime;

			let endDate = new Date();
			endDate.setFullYear(endTime[0], endTime[1] - 1, endTime[2]);
			endDate.setHours(endTime[3], endTime[4], endTime[5], endTime[6]);
			// 使用來自參數的結束時間做為倒數計時器結束時間

			/** * 期間內事件 ***/
			// setInterval要過1000毫秒才會執行第一次，所以再外部我先跑一次
			const timeBetweenDates = (dateEntered) => {
				const difference = dateEntered.getTime() - newServerTime;
				// difference=差異時間
				if (difference <= 0) {
					// 如果差異時間是負值 等於計時結束TimerFunction done
					clearInterval(timerFunction);
				} else {
					let seconds = Math.floor(difference / 1000);
					let minutes = Math.floor(seconds / 60);
					let hours = Math.floor(minutes / 60);
					let days;

					if (dayTimer) {
						days = Math.floor(hours / 24);
						document.getElementById("days").innerHTML = days;

						hours %= 24;
					}

					minutes %= 60;
					seconds %= 60;

					document.getElementById("hours").innerHTML = hours;
					document.getElementById("minutes").innerHTML = minutes;
					document.getElementById("seconds").innerHTML = seconds;

					newServerTime = newServerTime + 1000;
				}
			};

			timeBetweenDates(endDate);
			const timerFunction = setInterval(() => {
				timeBetweenDates(endDate);
			}, 1000);
		},

		dayTimer: (paramPopupAD) => {
			effect.timer(paramPopupAD, true);
		},
	};

	$.ajax({
		url: "/TimeZone.json",
		type: "GET",
		cache: false,
		dataType: "json",
	}).success((dataTimeZone) => {
		$.ajax({
			url: "/Home/GetTime",
			type: "GET",
			cache: false,
		}).success((dataGetTime) => {
			const serverTime = new Date(
				dataGetTime.year,
				dataGetTime.month - 1, // 月份要-1
				dataGetTime.day,
				dataGetTime.hour,
				dataGetTime.minute,
				dataGetTime.second,
				dataGetTime.millisecond
			).getTime();

			const dataPopupAD = dataTimeZone["popupAD"]; // 只使用 popupAD 段

			for (let i = 0; i < dataPopupAD.length; i++) {
				if (!dataPopupAD[i].note) {
					// 排除筆記
					const startTime = new Date(
						dataPopupAD[i].start[0],
						dataPopupAD[i].start[1] - 1, // 月份要-1
						dataPopupAD[i].start[2],
						dataPopupAD[i].start[3],
						dataPopupAD[i].start[4],
						dataPopupAD[i].start[5],
						dataPopupAD[i].start[6]
					).getTime();

					const endTime = new Date(
						dataPopupAD[i].end[0],
						dataPopupAD[i].end[1] - 1, // 月份要-1
						dataPopupAD[i].end[2],
						dataPopupAD[i].end[3],
						dataPopupAD[i].end[4],
						dataPopupAD[i].end[5],
						dataPopupAD[i].end[6]
					).getTime();

					// 區間正確且不在cookie記錄內的popup
					const dataPopupID = dataPopupAD[i].popupID;
					const popupADCookie = $.cookie(`${popupPrefix}${dataPopupID}`);

					if (startTime < serverTime && endTime > serverTime && !popupADCookie) {
						// 設定 popup 參數
						const cycle = dataPopupAD[i].cycle / 24;
						const delay = dataPopupAD[i].delay * 1000;

						// 加上時間戳避免暫存，以popupID對應內容
						const content = `/homePopup.html?${serverTime} #${dataPopupID}`;

						// 如果autoClose不為零，須加上延遲載入的秒數
						const autoClose = dataPopupAD[i].autoClose ? (dataPopupAD[i].autoClose + dataPopupAD[i].delay) * 1000 : 0;

						// 填入內容
						const popupWrapID = `${popupPrefixID}${dataPopupID}`;

						$body.prepend(`<div id="${popupPrefix}${dataPopupID}" style="display: none;"></div>`);

						setTimeout(() => {
							// 如果有設定 zIndex，設定新的 z-index 為原來 css 中的 z-index 加上 zIndex 值
							const zIndex = dataPopupAD[i].zIndex
								? parseInt($(popupWrapID).css("z-index")) + dataPopupAD[i].zIndex
								: "";

							$(popupWrapID)
								.css("z-index", zIndex)
								.load(content, () => {
									// load 無法傳入參數，從載入物件取得 popupID
									const popupID = $(".popup_box").attr("id");

									// popup 參數
									let paramPopupAD = {
										cycle: cycle,
										popupID: popupID,
										serverTime: serverTime,
										popupAdEnd: dataPopupAD[i].end,
									};

									/** * 自動關閉 ***/
									// 如果有設定自動關閉，在時間到的時候執行關閉 popup
									// 因為不是使用者自己點關閉，當作不是使用者自己想關閉的，所以清除阻擋再顯示的 cookie
									if (autoClose !== 0) {
										const popupTimeout = setTimeout(() => {
											closePopup(paramPopupAD);
											$.removeCookie(`${popupPrefix}${popupID}`);
										}, autoClose);

										paramPopupAD.popupTimeout = popupTimeout;
									}

									/** * 執行效果 ***/
									// 使用效果陣列
									const effections = $(`#${popupID}`).data("effect").split(" ");

									// 將 "使用效果陣列" 與 "所有效果陣列 (effect)" 匹配，判斷執行那些效果
									// 在執行效果的時候，多傳入 paramPopupAD 做為參數
									for (let i = 0, ilen = effections.length; i < ilen; i++) {
										for (let v in effect) {
											if (v === effections[i]) {
												effect[v](paramPopupAD);
											}
										}
									}

									/** * 兩種預設關閉方式 ***/
									// 關閉按鈕
									clickClose(paramPopupAD, ".closeMepopup");
									// 沒有連結
									clickClose(paramPopupAD, ".noLink");

									/** * 初始化複製剪貼簿功能 ***/
									initClipboard(paramPopupAD);
								});
						}, delay);
					}
				}
			}
		});
	});
}

module.exports = popupAD;
