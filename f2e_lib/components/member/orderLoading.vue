<template>
	<div id="lb-order-loading" class="modal fade" tabindex="-1">
		<div class="modal-dialog modal-sm h5" role="document">
			<div class="modal-content">
				<div class="modal-body text-center">
					<p style="color: #3b3a39">系統作業中，請稍後</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "OrderLoading",
	props: {
		ShowLoadingModel: false,
	},
	mounted() {
		$("#lb-order-loading").modal({
			backdrop: "static",
			keyboard: false,
			show: false,
		});
	},
	watch: {
		ShowLoadingModel(val) {
			if (!val) {
				window.setTimeout(function () {
					$("#lb-order-loading").modal("hide");
				}, 1000);
			}
		},
	},
};
</script>
