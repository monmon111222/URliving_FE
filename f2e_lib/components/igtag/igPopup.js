import IGPOPUP_TMPL from "@page/alittlemorepazzo/js/igPopupTmpl";
import NewImage from "@global/components/global/image";

const igPopup = {
	template: IGPOPUP_TMPL,
	props: ["item", "tagname", "isopen", "stop", "link"],
	components: {
		NewImage,
	},
	methods: {
		closePopup: function () {
			this.$emit("close");
		},
		goPost: function (val) {
			this.$emit("gopost", val);
		},
	},
};

export default igPopup;
