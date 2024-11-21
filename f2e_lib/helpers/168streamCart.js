const streamApp = new Vue({
    el: '#app-stream-cart',
    template: `<div style="position: fixed; z-index: 9999; top: 0; left:0; right:0; bottom: 0; color: white; background: rgba(0,0,0,1); font-size: 24px; text-align: center; line-height: 100vh;"><div style="display: inline-block; vertical-align: middle; line-height: 1;">
        <h1>商品已加入購物車</h1>
        <h3 v-if="errorMsg.length > 0" v-html="errorMsg" style="margin: 25px 0; line-height: 1.5;"></h3>
        <a class="btn btn-primary" style="margin: 50px 0px;
                                            padding: 20px 50px;
                                            font-size: 18px;
                                            border-radius: 48px;" href="/checkout">前往結帳</a>
    </div>
    </div>` ,
    data: {
        errorMsg: window.preloadData.ErrorMessage
    },
    created: function(){
        // this.redirectCart();
    },
    methods: {
        redirectCart: function(){
            setTimeout(function(){
                window.location.href = '/checkout';
            },3000)
        },
    }
});

module.exports = streamApp;