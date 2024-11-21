// **
// @param
// inputFile[selector string] targetImg[selector string]
// **


// import $ from 'jquery';
import AlertDialog from '@global/helpers/alertDialog';

var ImgUpload = function (options) {

    var _that = this;
    var inputUpload = document.getElementById(options.inputFile);
    var init = function (options) {
        this.$targetImg = $(options.targetImg);        
        if (inputUpload !== null) {
            inputUpload.addEventListener('change', handleFiles, false);
        }
    }

    var handleFiles = function () {
        var files = this.files;
        var file = files[0];
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            return;
        }
        if (file.size > 2000000) {
            AlertDialog.alert('圖片檔案大小超過 2M 限制，請重新選擇圖片');
            this.value = '';
            return;
        }
        var reader = new FileReader();

        reader.onload = function(e) {
            var formData = new FormData();
            formData.append('file',  $('#input-upload-img')[0].files[0]);
            var opts = {
                url: API_URL.UPLOAD_IMAGE + '?Type=2',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                error: function() {
                    console.log('error');
                },
                success: function(res){
                    if (res.Code === 200) {
                         _that.$targetImg.attr('src',res.Response+'?h=100&w=100&mode=crop');
                         $('#input-value-img').val(res.Response);
                    } else {
                        AlertDialog.alert('系統忙線中,請稍後在試');
                    }
                }
            };
            $.ajax(opts);            
        };
        reader.readAsDataURL(file);
    }
    init.call(this, options);
}

export default ImgUpload;