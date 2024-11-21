// import addressBtn from "@page/cart2/js/addressBtn";
import addressBtn from "@page/cart2/components/AddressBtn";

const addressBook = {
	data: {
		phoneData: {},
		shippingRegion: window.shippingRegion,
	},
	components: {
		addressBtn,
	},
	methods: {
		useRecipientAddress(data) {
			this.phoneData = data;

			let recipientName = $('input[name="recipientName"]');
			let recipientCountryCode = $('select[name="recipientCountryCode"]');
			let recipientPhone = $('input[name="recipientMobile"]');

			recipientName.val(data.Name);
			recipientCountryCode.val(data.PhoneCountryCode);
			recipientPhone.val(data.PhoneNumber);

			if (this.shippingRegion === "台灣及離島") {
				this.$refs.c_areatw.seletedCounty = data.City;
				this.$refs.c_areatw.selectedZipcode = data.District;
				this.$refs.c_areatw.selectedAddress = data.Address;
			} else if (this.shippingRegion === "中國") {
				let recipientCustomsID = $("input[name='RecipientCustomsID']");
				recipientCustomsID.val(data.CustomsClearanceID);

				this.$refs.c_areacn.selectedAddress = data.Address;
			} else if (this.shippingRegion === "香港" || this.shippingRegion === "澳門") {
				this.$refs.c_areaother.userAddress = data.Address;
			} else {
				this.$refs.c_areaother.userAddress = data.Address;
				let userAddress2 = $('input[name="recipientAddress2"]');
				userAddress2.val(data.Address2);

				let userAddress3 = $('input[name="recipientAddress3"]');
				userAddress3.val(data.Address3);

				let recipientCity = $('input[name="recipientCity"]');
				recipientCity.val(data.City);

				let recipientZipCode = $('input[name="recipientZipCode"]');
				recipientZipCode.val(data.Zip);
			}

			$("#address-popup").modal("hide");
		},
	},
};

export default addressBook;
