<template>
	<div class="modal fade" id="address-popup" tabindex="-1">
		<div class="modal-dialog modal-md tab-action" role="document">
			<div class="modal-content tab-wrap" v-if="popupData">
				<div class="modal-header">
					<div class="modal-title">ADDRESS BOOK</div>
					<a class="modal-close" data-dismiss="modal"><i class="icon-close" @click="closePopup"></i></a>
				</div>
				<div class="modal-body">
					<div class="card" v-for="(data, index) in popupData">
						<div class="cart-info" :class="chooseID === data.ID ? 'active' : ''" @click.prevent="changeData(data)">
							<div class="card-info-name">{{ data.Name }}</div>
							<div class="card-info-content">
								<p class="card-info-phone">{{ data.PhoneCountryCode }} {{ data.PhoneNumber }}</p>
								<p class="card-info-address">
									{{ shippingRegion }}
									{{ data.Province }}
									{{ data.City }}
									{{ data.District }}
									{{ data.Address }}
								</p>
								<p class="card-info-mail" v-if="data.Email">{{ data.Email }}</p>
							</div>
						</div>
						<div class="delete-address">
							<a @click.prevent="deleteAddress(data.ID)">
								<i class="icon-delete"></i>
							</a>
						</div>
					</div>
				</div>
				<div class="modal-footer"><a class="btn btn-block btn-primary use-address" @click="use">確定</a></div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";

export default {
	data() {
		return {
			chooseData: {},
			chooseID: "",
			shippingRegion: "",
		};
	},
	props: ["popupData"],
	mounted() {
		this.shippingRegion = window.shippingRegion;
		$("#address-popup").on("hide.bs.modal	", function (e) {
			$(".cart-info").removeClass("active");
		});
	},
	methods: {
		deleteAddress(id) {
			axios
				.delete(`${API_URL.ADDRESS_BOOK}/${id}`)
				.then((res) => {
					if (res.data.Code === 200) {
						let findDataIndex = this.popupData.findIndex((ele) => {
							return ele.ID === id;
						});
						this.popupData.splice(findDataIndex, 1);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		},
		changeData(data) {
			this.chooseData = data;
			this.chooseID = data.ID;
		},
		use() {
			this.$emit("useAddress", this.chooseData);
		},
		closePopup() {
			$("#address-popup").modal("hide");
		},
	},
};
</script>
