function getMarketID(fullID) {
	return fullID.substring(0, fullID.indexOf("CL"));
}

const mappingSpec = function (addonCheckArray) {
	let nowIndex = 0;
	let newAddonArray = [];

	specCheck();

	function specCheck() {
		if (!addonCheckArray[nowIndex].isCheck) {
			let tempSpec = {
				Name: addonCheckArray[nowIndex].Name,
				CustomMarketID_withoutSize: addonCheckArray[nowIndex].CustomMarketID.substring(
					0,
					addonCheckArray[nowIndex].CustomMarketID.indexOf("SZ")
				),
				OriginPrice: addonCheckArray[nowIndex].OriginPrice,
				SellPrice: addonCheckArray[nowIndex].SellPrice,
				Cover: addonCheckArray[nowIndex].Cover,
				Specs: [
					{
						CustomMarketID: addonCheckArray[nowIndex].CustomMarketID,
						ColorName: addonCheckArray[nowIndex].ColorName,
						Size: addonCheckArray[nowIndex].Size,
						HasStock: addonCheckArray[nowIndex].HasStock,
						Stock: addonCheckArray[nowIndex].Stock,
						Pattern: addonCheckArray[nowIndex].Pattern,
						Series: addonCheckArray[nowIndex].Series,
					},
				],
			};

			for (let i = 0; i < addonCheckArray.length; i++) {
				if (
					nowIndex !== i &&
					getMarketID(addonCheckArray[nowIndex].CustomMarketID) === getMarketID(addonCheckArray[i].CustomMarketID)
				) {
					tempSpec.Specs.push({
						CustomMarketID: addonCheckArray[i].CustomMarketID,
						ColorName: addonCheckArray[i].ColorName,
						Size: addonCheckArray[i].Size,
						HasStock: addonCheckArray[i].HasStock,
						Stock: addonCheckArray[i].Stock,
						Pattern: addonCheckArray[i].Pattern,
						Series: addonCheckArray[i].Series,
					});
					addonCheckArray[i].isCheck = true;
				}
			}

			addonCheckArray[nowIndex].isCheck = true;
			newAddonArray.push(tempSpec);
			nowIndex++;

			if (nowIndex < addonCheckArray.length) {
				specCheck();
			}
		} else {
			nowIndex++;

			if (nowIndex < addonCheckArray.length) {
				specCheck();
			}
		}

		return newAddonArray;
	}

	return newAddonArray;
};

export default mappingSpec;
