<template>
	<div>
		<a class="item-share" @click.prevent="share" href="#">
			<i class="icon-share"></i>
		</a>
		<!-- mb版 上滑popup -->
		<transition name="slideup">
			<div v-if="link && isOpen" id="dialog-share" :class="{ active: isOpen }" class="dialog-bottom">
				<div @click="closeSelf" class="mask" data-target="#dialog-share"></div>
				<div class="share-content">
					<div class="slide-content">
						<a @click.prevent="closeSelf" class="btn-delete">
							<i class="icon-close"></i>
						</a>
						<div class="icon-wrap">
							<a href="#"><i class="icon-ig"></i></a>
							<a class="btn-share-this" data-social="fb" href="#"><i class="icon-fb"></i></a>
							<a class="btn-share-this" data-social="line" href="#"><i class="icon-line"></i></a>
							<a href="#"><i class="icon-twitter"></i></a>
							<a href="#"><i class="icon-wechat"></i></a>
							<a href="#"><i class="icon-whatsapp"></i></a>
						</div>
						<div class="link-wrap">
							<input id="share-link" class="share-link-hidden" type="text" :value="link" />
							<a id="copyLink" class="btn-share-this" data-social="link" data-clipboard-target="#share-link">
								複製連結
							</a>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<!-- pc版 model -->
		<div v-if="link" id="modal-share" ref="vuemodal" class="modal fade">
			<div @click.prevent="closeSelf" class="mask" data-target="#dialog-share"></div>
			<div class="modal-dialog share-dialog">
				<div class="share-content modal-content">
					<a data-dismiss="modal" class="btn-delete" href="#"><i class="icon-close"></i></a>
					<div class="icon-wrap">
						<a href="#"><i class="icon-ig"></i></a>
						<a class="btn-share-this" data-social="fb" href="#"><i class="icon-fb"></i></a>
						<a class="btn-share-this" data-social="line" href="#"><i class="icon-line"></i></a>
						<a href="#"><i class="icon-twitter"></i></a>
						<a href="#"><i class="icon-wechat"></i></a>
						<a href="#"><i class="icon-whatsapp"></i></a>
					</div>
					<div class="link-wrap">
						<input id="share-link" class="share-link-hidden" type="text" :value="link" />
						<a id="copyLink" class="btn-share-this" data-social="link" data-clipboard-target="#share-link">
							複製連結
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Share from "@page/common/js/share.js";
import setEnv from "@global/helpers/setEnv";
import axios from "axios";
export default {
	name: "ShareModal",
	data() {
		return {
			isOpen: false,
			link: "",
		};
	},
	props: ["marketid"],
	methods: {
		share() {
			axios
				.get(API_URL.SHARE, {
					marketid: this.marketid,
				})
				.then((res) => {
					if (res.data.Code === 200) {
						this.link = res.data.Response.Link;
						this.$nextTick(() => {
							if (!setEnv.myEquipment()) {
								$("#modal-share").modal("show");
							} else {
								this.isOpen = true;
							}
						});
					} else {
						AlertDialog.alert("系統忙線中,請稍後再試");
					}
				});
		},
		closeSelf() {
			this.isOpen = false;
		},
	},
};
</script>
