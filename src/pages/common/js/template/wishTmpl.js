module.exports = `
<div class="item-wish">
	<a @click.prevent="addToWish" v-if="wishactive === 'False'" class="btn-wish" href="#">
		<i class="icon-heart"></i>
	</a>
	<a @click.prevent="removeWish" v-else class="btn-wish" href="#">
		<i class="icon-heart-active"></i>
	</a>
</div>
`;
