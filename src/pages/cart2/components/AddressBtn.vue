<template>
	<div>
		<a class="btn btn-primary btn-block btn-recipient" @click.prevent="getAddress">常用收件人通訊錄</a>
		<address-popup :popupData="detailData" @useAddress="useBtnAddress"></address-popup>
	</div>
</template>

<script>
import axios from "axios";
import AddressPopup from "@page/cart2/components/AddressPopup";

export default {
	components: {
		AddressPopup,
	},
	data() {
		return {
			detailData: null,
		};
	},
	methods: {
		getAddress() {
			axios
				.get(`${API_URL.ADDRESS_BOOK}`)
				.then((res) => {
					if (res.data.Code === 200) {
						this.detailData = res.data.Response.Data;
						$("#address-popup").appendTo("body").modal("show");
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		useBtnAddress(data) {
			this.$emit("use-btn", data);
		},
	},
};
</script>
