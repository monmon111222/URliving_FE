const recommend = {
	rMode: "",
	datas: null,
	getSelfApiData: (mode, productId) => {
		let id = window.CustomMarketID || productId;
		return new Promise((resolve, reject) => {
			if (mode === 0) {
				if (window.CategoryIDs === undefined) reject("Err");
				$.ajax({
					type: "GET",
					url:
						"/api/v1/recommendation/getrelatedcategory" +
						"?CategoryIDs=" +
						window.CategoryIDs.toString() +
						"&CustomMarketID=" +
						id,
					dataType: "json",
					xhrFields: {
						withCredentials: true,
					},
					error: function () {
						console.log("error");
					},
					success: function (res) {
						if (res.Code === 200) {
							resolve(res.Response);
						} else {
							reject("Err");
						}
					},
				});
			} else {
				id = id.indexOf("SZ") === -1 ? id + "SZ_" : id;
				$.ajax({
					type: "GET",
					url: "/api/v1/recommendation/getbarcodecategory" + "?CustomMarketID=" + id + "&Model=" + mode,
					dataType: "json",
					xhrFields: {
						withCredentials: true,
					},
					error: function () {
						console.log("error");
					},
					success: function (res) {
						if (res.Code === 200) {
							resolve(res.Response);
						} else {
							reject("Err");
						}
					},
				});
			}
		});
	},
	checkLibExist: (checkLib, lib) => {
		let s = 0;
		let libName;

		function fireLib() {
			if (checkLib === "qg") {
				libName = window.qg;
			} else if (checkLib === "rosetta") {
				libName = window.rosetta;
			}

			if (typeof libName === "undefined") {
				if (s <= 20) {
					s++;

					setTimeout(function () {
						fireLib();
					}, 100);
				} else {
					// 回應過長
					lib(false);
				}
			} else {
				// lib true
				lib(true);
			}
		}

		fireLib();
	},
	checkVarible: () => {
		return new Promise((resolve, reject) => {
			let s = 0;
			function fireVarible() {
				if (window.recommendMode === undefined) {
					if (s <= 20) {
						s++;
						setTimeout(function () {
							fireVarible();
						}, 100);
					} else {
						// 回應過長
						resolve();
					}
				} else {
					// 已取到值
					resolve();
				}
			}

			fireVarible();
		});
	},
	init: (productId, brand) => {
		return new Promise((resolve, reject) => {
			recommend.checkVarible().then(() => {
				if (window.recommendMode !== undefined) {
					let queryStr = window.recommendMode.queryStr;
					let appierModel = window.recommendMode.model;
					let mode = window.recommendMode.mode;

					if (mode === "appier") {
						const appierFunc = function (loadSuccess) {
							if (!loadSuccess) {
								recommend.getSelfApiData(0, productId).then((data) => {
									recommend.datas = data;
									recommend.rMode = "self";
									resolve({
										data: data.map(function (item) {
											return {
												url: item.MarketUrl + "&page=product&source=ur&recommend=related_to_category",
												image: item.PictureUrl,
											};
										}),
										mode: recommend.rMode,
									});
								});
							} else {
								qg(
									"getRecommendation",
									appierModel,
									{ datafeedId: brand, productId: productId },
									function (err, recommendation) {
										if (err !== null) {
											// aq碼有錯呼叫舊有推薦API
											recommend.getSelfApiData(0, productId).then((data) => {
												recommend.datas = data;
												recommend.rMode = "self";
												resolve({
													data: data.map(function (item) {
														return {
															url: item.MarketUrl + "&page=product&source=ur&recommend=related_to_category",
															image: item.PictureUrl,
														};
													}),
													mode: recommend.rMode,
												});
											});
										} else {
											recommend.datas = recommendation;
											recommend.rMode = "appier";
											resolve({
												data: recommendation.map(function (item) {
													return { url: item.url + queryStr, image: item.image };
												}),
												mode: recommend.rMode,
											});
										}
									}
								);
							}
						};
						recommend.checkLibExist("qg", appierFunc);
					} else if (mode === "rosetta") {
						const rosettaFunc = function (loadSuccess) {
							if (!loadSuccess) {
								recommend.getSelfApiData(0, productId).then((data) => {
									recommend.datas = data;
									recommend.rMode = "self";
									resolve({
										data: data.map(function (item) {
											return {
												url: item.MarketUrl + "&page=product&source=ur&recommend=related_to_category",
												image: item.PictureUrl,
											};
										}),
										mode: recommend.rMode,
									});
								});
							} else {
								rosetta(
									"query",
									{
										container: window.recommendMode.container,
										item: productId,
									},
									function (res, err) {
										if (err === "success") {
											recommend.datas = res.data;
											recommend.rMode = "rosetta";
											resolve({
												data: res.data.map(function (item) {
													return { url: item.property.link + queryStr, image: item.property.image_link };
												}),
												mode: recommend.rMode,
											});
										} else {
											recommend.getSelfApiData(0, productId).then((data) => {
												recommend.datas = data;
												recommend.rMode = "self";
												resolve({
													data: data.map(function (item) {
														return {
															url: item.MarketUrl + "&page=product&source=ur&recommend=related_to_category",
															image: item.PictureUrl,
														};
													}),
													mode: recommend.rMode,
												});
											});
										}
									}
								);
							}
						};
						recommend.checkLibExist("rosetta", rosettaFunc);
					} else if (mode === "self") {
						recommend.getSelfApiData(window.recommendMode.model, productId).then((data) => {
							recommend.datas = data;
							recommend.rMode = "self";
							resolve({
								data: data.map(function (item) {
									return { url: item.MarketUrl + window.recommendMode.queryStr, image: item.PictureUrl };
								}),
								mode: recommend.rMode,
							});
						});
					}
				} else {
					recommend.getSelfApiData(0, productId).then((data) => {
						recommend.datas = data;
						recommend.rMode = "self";

						resolve({
							data: data.map(function (item) {
								return {
									url: item.MarketUrl + "&page=product&source=ur&recommend=related_to_category",
									image: item.PictureUrl,
								};
							}),
							mode: recommend.rMode,
						});
					});
				}
			});
		});
	},
};

export default recommend.init;
