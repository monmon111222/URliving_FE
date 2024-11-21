import Cookies from "js-cookie";

function detectUtmK(itemSpecInfo) {
  let KOLValue = "";
  let utmData = "";

  if (Cookies.get("Cookie_KOLSales")) {
    KOLValue = JSON.parse(Cookies.get("Cookie_KOLSales"));
  }

  if (KOLValue && KOLValue.CMIDs.includes(itemSpecInfo)) {
    utmData = KOLValue.Name;
  }

  return utmData ? utmData : null;
}

export default detectUtmK;
