import pazzoAlertInfo from "@global/components/global/template/pazzoAlertInfo.pug";
import pazzoAlertConfirm from "@global/components/global/template/pazzoAlertConfirm.pug";
import pazzoAlertSpecial from "@global/components/global/template/pazzoAlertSpecial.pug";
import globalAlertInfo from "@global/components/global/template/globalAlertInfo.pug";
import globalAlertConfirm from "@global/components/global/template/globalAlertConfirm.pug";
import globalAlertSpecial from "@global/components/global/template/globalAlertSpecial.pug";
import squarebearAlertInfo from "@global/components/global/template/squarebearAlertInfo.pug";
import commonCartDelete from "@global/components/global/template/commonCartDelete.pug";

export async function brandAlertTemplate(brandName) {
	let alertInfoTemplate = "";
	let alertConfirmTemplate = "";
	let alertSpecialTemplate = "";
	let squarebearAlertInfoTemplate = "";
	let commonCartDeleteTemplate = "";

	switch (brandName) {
		case "pazzo-t":
		case "pazzo":
			alertInfoTemplate = pazzoAlertInfo;
			alertConfirmTemplate = pazzoAlertConfirm;
			alertSpecialTemplate = pazzoAlertSpecial;
			break;
		case "squarebear-t":
		case "squarebear":
			alertInfoTemplate = globalAlertInfo;
			alertConfirmTemplate = globalAlertConfirm;
			alertSpecialTemplate = globalAlertSpecial;
			squarebearAlertInfoTemplate = squarebearAlertInfo;
			break;
		default:
			alertInfoTemplate = globalAlertInfo;
			alertConfirmTemplate = globalAlertConfirm;
			alertSpecialTemplate = globalAlertSpecial;
			squarebearAlertInfoTemplate = squarebearAlertInfo;
			commonCartDeleteTemplate = commonCartDelete;
			break;
	}

	return {
		alertInfoTemplate,
		alertConfirmTemplate,
		alertSpecialTemplate,
		squarebearAlertInfoTemplate,
		commonCartDeleteTemplate,
	};
}

export function removeAlertStyle(brand) {
	switch (brand) {
		case "pazzo":
		case "pazzo-t":
			$(this).parents(".pz-alert-modal-style").remove();
			break;
		default:
			$(this).parents(".alert-modal-style").remove();
			break;
	}
}
