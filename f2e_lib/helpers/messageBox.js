import $ from 'jquery';

/**
* MessageBox func
* MessageBox.success(msg, callback)
**/
var MessageBox = (function($, o){

    var msgInfo = function(msg, icon_class, callback){
        var icon = icon_class;
        var txt = msg;
        var tmpl = `<div class="info-reminder">
                    <div class="text-center">${txt}</div>
                    </div>`;
        
        var $tmpl = $(tmpl);
        $('body').append($tmpl);

        setTimeout(function(){
            if(txt.includes("FA POINTS")) {
                $tmpl.addClass('active');
            }
            setTimeout(function(){
                setTimeout(function(){
                    $tmpl.remove();
                    if(callback == undefined) return;
                    callback();
                }, 300);
            }, 2000);
        });
    }

    o.success = function(msg, callback){
        msgInfo(msg, 'icon-reminder-ok', callback);
    }
    o.warning = function(msg, callback){
        msgInfo(msg, 'icon-reminder-info', callback);
    }
    o.cart = function(msg, callback){
        msgInfo(msg, 'icon-reminder-cart', callback);
    }

    return o;

})($, window.MessageBox || {});


export default MessageBox;