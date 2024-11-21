module.exports = /*html*/ `
<div class="wishlist-content">
  <ul class="tabs__nav">
    <li>
      <a class="tab_product">商品收藏</a>
    </li>
    <li>
      <a class="tab_brand">追蹤品牌</a>
    </li>
  </ul>
  <div class="tab_content product_content">
    <favoriteTable :datas="datas" v-if="dataIsLoad" v-on:delete="cancelFavorite"></favoriteTable>
  </div>
  <div class="tab_content brand_content hide">
    123
  </div>
</div>
`;
