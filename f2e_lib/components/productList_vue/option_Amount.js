let Amount = {
	data: function () {
		return {};
	},
	props: {
		tgQtyTags: {},
		newUrl: {},
	},
	methods: {},
	created: function () {},
	mounted: function () {},
	template: `
    <div class='list-options__set-amount'>
      <p>VIEW</p>
      <ul>
        <li
          :class="tgQtyTags[0] ? 'active' : null" >
          <a :href="newUrl+'qty=30'">30</a>
        </li>
        <li
          :class="tgQtyTags[1] ? 'active' : null" >
          <a :href="newUrl+'qty=60'">60</a>
        </li>
        <li
          :class="tgQtyTags[2] ? 'active' : null" >
          <a :href="newUrl+'page=0'">ALL</a>
        </li>
      </ul>
    </div>
  `,
};

module.exports = Amount;
