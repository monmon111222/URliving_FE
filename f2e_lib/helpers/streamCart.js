const streamApp = new Vue({
    el: '#app-stream-cart',
    template: `<div style="position: fixed; z-index: 9999; top: 0; left:0; right:0; bottom: 0; color: white; background: rgba(0,0,0,1); font-size: 24px; text-align: center; line-height: 100vh;"><div style="display: inline-block; vertical-align: middle; line-height: 1.5;"><h1>處理中, 請稍後</h1><h3>(請勿關閉頁面)</h3></div></div>` ,
    created: function(){
        this.checkout();
    },
    methods: {
        checkout: function(){
            const _this = this;
            let idx = 0;
            var total = window.preloadData.Cart.length;
            const datas = window.preloadData.Cart;

            if (total === 0) {
                AlertDialog.alert("直播商品僅限於特定時間，商品目前已下架", function(){
                    window.location.href="/";
                })
                return;
            }

            callCart();
            
            function callCart(){
                $.ajax({
                    url: API_URL.SHOPPING_CART,
                    type: 'POST',
                    dataType: 'JSON',
                    data: 'CustomMarketID=' + datas[idx].CustomMarketID + '&Count=' + datas[idx].Amount + '&LiveShowID=' + window.preloadData.LiveShowID + '&Channel=Facebook'
                })
                .done(function() {
                    if (idx<total-1) {
                        idx ++;
                        callCart();
                    } else {
                        window.location.href = '/checkout';
                    }
                    
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
            }
            
            
        }
    }
});