import addonDetailPopup from "@page/cart/template/addonDetailPopup.pug";

const addonDetail = {
	template: addonDetailPopup,
	props: {
		popupData: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	watch: {
		showImage(value) {
			if (value) return;

			this.$nextTick(() => {
				const btnCollapse = $("#popup-addon-detail .size-guide__section > h2");

				btnCollapse.on("click", function (e) {
					const $selfContent = $(this).parent().find(".size-guide__content");
					if ($(this).hasClass("show")) return;

					btnCollapse.removeClass("show");
					$(this).addClass("show");
					$(".size-guide__content").slideUp("400");
					$selfContent.slideDown("400");
				});
			});
		},
	},
	data() {
		return {
			selectedImgIndex: 0,
			showImage: true,
		};
	},
	methods: {
		changePicIdx(idx) {
			this.selectedImgIndex = idx;
		},
		changeContent() {
			this.showImage = !this.showImage;
		},
	},
};

export default addonDetail;
