<template>
	<div class="select-style">
		<a
			@click.prevent.stop="openSelector"
			class="select-btn"
			:class="{
				isopen: selectIsOpen,
				soldout: selected !== null && defaultTxt == '尺寸' && selected.Stock === 0,
			}"
			>{{ selected.Name }} {{ selected.PreOrder ? "(Pre-order)" : "" }}</a
		>
		<ul class="select-opts" :class="{ isopen: selectIsOpen, mobileOpts: isMobile }">
			<li
				v-for="opt in options"
				@click.prevent="changeSelect(opt)"
				:key="opt.Key"
				:data-value="opt.Key"
				:class="{ soldout: opt.Stock === 0 }"
			>
				{{ opt.Name }} <span v-if="opt.PreOrder">(Pre-order)</span>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "Select",
	props: {
		options: Object,
		defaultTxt: String,
		selected: Object,
		isMobile: {
			type: "Boolean",
			default: false,
		},
	},

	data() {
		return {
			selectIsOpen: false,
			slectHeight: 0,
		};
	},
	mounted() {
		const _this = this;
		$(window).click(function (event) {
			_this.selectIsOpen = false;
		});
	},
	methods: {
		openSelector() {
			if (this.isMobile) {
				// 手機版選單往上長
				this.slectHeight = $(".select-opts").eq(1).height();
				$(".select-opts").css("top", -this.slectHeight);
			}
			this.selectIsOpen = !this.selectIsOpen;
		},
		changeSelect(opt) {
			this.selectIsOpen = false;
			this.$emit("cb", opt);
		},
	},
};
</script>
