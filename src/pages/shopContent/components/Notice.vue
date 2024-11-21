<template>
	<div class="modal fade" id="lb-get-product-mail" tabindex="-1">
		<div class="modal-dialog modal-sm" role="document">
			<div class="modal-content">
				<form id="form-instock-mail">
					<div class="modal-header">
						<h4 class="modal-title">貨到通知</h4>
						<a class="close" href="#" data-dismiss="modal" aria-label="Close"><i class="icon-remove-x"></i></a>
					</div>
					<div class="modal-body">
						<input
							v-model.trim="$v.usermail.$model"
							type="email"
							name="mail"
							placeholder="請輸入E-mail"
							class="form-control"
						/>
						<div class="error" v-if="!$v.usermail.required">Field is required</div>
						<div class="error" v-if="!$v.usermail.OnlyDigits">請輸入有效Email</div>
						<p class="mt-1">提醒您，此貨到通知不提供商品保留功能</p>
					</div>
					<div class="modal-footer">
						<div class="w-100">
							<button @click.prevent="getNotice" type="button" class="btn w-100">提交</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, helpers } from "vuelidate/lib/validators";
const OnlyDigits = helpers.regex("onlyDigits", /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("shopContent");
Vue.use(Vuelidate);

export default {
	data: function () {
		return {
			usermail: "",
		};
	},
	computed: {
		...mapState(["CMID"]),
	},
	validations: {
		usermail: {
			required,
			OnlyDigits,
		},
	},
	methods: {
		getNotice() {
			var _this = this;
			if (!this.$v.$invalid) {
				$.ajax({
					type: "POST",
					url: API_URL.IN_STOCK_EMAIL,
					dataType: "json",
					data: { CustomMarketID: _this.CMID, Email: _this.usermail },
					xhrFields: {
						withCredentials: true,
					},
					error: function () {
						console.log("error");
					},
					success: function (res) {
						if (res.Code === 200) {
							AlertDialog.alert("貨到通知索取成功!謝謝您~", function () {
								$("#lb-get-product-mail").modal("hide");
							});
						} else {
							$("#lb-get-product-mail").modal("hide");
						}
					},
				});
			}
		},
	},
};
</script>
