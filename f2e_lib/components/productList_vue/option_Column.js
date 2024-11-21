let Column = {
	data: function () {
		return {};
	},
	props: {
		nowColumn: {
			type: Number,
		},
	},
	methods: {
		onChangeColumn(e) {
			console.log("onChangeColumn", e);
			this.$emit("onChangeColumn", e);
		},
	},
	created: function () {},
	mounted: function () {},
	template: `
    <ul class='list-options__column'>
      <li :class="{active:(nowColumn===2), 'list-options__btn-2col':true}">
        <a
          href='javascript:;'
          data-col='2'
          @click=onChangeColumn
          >2欄</a>
      </li>
      <li :class="{active:(nowColumn===4), 'list-options__btn-3col':true}">
        <a
          href='javascript:;'
          data-col='4'
          @click=onChangeColumn
          >3欄</a>
      </li>
    </ul>
  `,
};

export default Column;
