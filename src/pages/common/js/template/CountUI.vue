<template>
	<div class="quantity">
		<a class="quantity-btn-minus" @click="onMinus">–</a>
		<input :value="nowValue.Name" class="quantity-text" type="text" readonly />
		<a class="quantity-btn-plus" @click="onPlus">＋</a>
	</div>
</template>

<script>
export default {
	name: "CountUI",
	props: ["limit", "nowValue"],
	data() {
		return {
			setValue: {
				Key: this.nowValue.Key,
				Name: this.nowValue.Name,
			},
		};
	},
	watch: {
		limit() {
			this.setValue.Key = this.nowValue.Key;
			this.setValue.Name = this.nowValue.Name;
		},
	},
	computed: {
		disabledLink() {
			return this.limit.key === "default";
		},
	},

	methods: {
		onMinus() {
			if (this.disabledLink) return;
			if (this.setValue.Key <= 1) return;

			this.setValue.Key -= 1;
			this.setValue.Name -= 1;
			this.$emit("cb", this.setValue);
		},
		onPlus() {
			if (this.disabledLink) return;
			if (this.setValue.Key >= this.limit.key) return;

			this.setValue.Key += 1;
			this.setValue.Name += 1;
			this.$emit("cb", this.setValue);
		},
	},
};
</script>
