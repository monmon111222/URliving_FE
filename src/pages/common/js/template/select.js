const selectTmpl = `
<div class="select-style ">
	<a class="select-btn" @click.prevent.stop="openSelector" href="#" :class="{'isopen': selectIsOpen, 'soldout': selected!==null && defaultTxt == '尺寸' && selected.Stock === 0}">{{selected.Name}} {{selected.PreOrder?'預購':''}}</a>

	<ul class="select-opts" :class="{'isopen': selectIsOpen}">
		<li @click.prevent="changeSelect({Name:defaultTxt,Key:'default'})">{{defaultTxt}}</li>
		<li @click.prevent="changeSelect(opt, $event)" v-for="(opt, index) in options" :data-value="opt.Key" :class="{'soldout': opt.Stock === 0}">{{opt.Name}} {{opt.PreOrder?'預購':''}}</li>
	</ul>
</div>
`;

const selector = {
	template: selectTmpl,
	data: function () {
		return {
			opts: this.options,
			selectedOptTxt: this.defaultTxt,
			selectIsOpen: false,
			selected: null,
		};
	},
	props: ["options", "defaultTxt", "selected", "stock"],
	computed: {
		datak: function () {
			return this.options.find((i) => i.Key === this.selected.Key);
		},
	},
	methods: {
		openSelector: function () {
			this.selectIsOpen = !this.selectIsOpen;
		},
		changeSelect: function (opt, e) {
			this.selectedOptTxt =
				opt.Description !== undefined && opt.Description.length !== 0 ? `${opt.Name} (${opt.Description})` : opt.Name;
			this.selectIsOpen = false;
			this.selected = opt;
			this.$emit("cb", opt);
		},
	},
	created: function () {},
	mounted: function () {
		const _this = this;
		$(window).click(function (event) {
			_this.selectIsOpen = false;
		});
	},
};

export default selector;
