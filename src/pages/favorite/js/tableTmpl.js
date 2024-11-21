module.exports = `
	<div class="fav-list">
		<favoriteItem v-for="(item, index) in datas" :key="item.Colors[0].CustomMarketID" :data="item" :idx="index" v-on:delete="cancelFavorite(index)"></favoriteItem>
	</div>
`;
