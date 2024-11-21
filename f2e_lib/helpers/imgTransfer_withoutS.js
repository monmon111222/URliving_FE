const newImage = (imgUrl, sizeStr) => {
	if (imgUrl == null || imgUrl.length === 0) return;

    var imgName = imgUrl.substring(imgUrl.lastIndexOf("/")+1, imgUrl.length-4);
    var imgExtension = imgUrl.substring(imgUrl.length-4, imgUrl.length);
    var splitArr = imgUrl.split('/');
    var folderName = splitArr[4];
    var pictureContainer = splitArr[3];

    if (imgUrl.indexOf("gif") !== -1) {
    	// gif不近縮圖
        return `https://${window.StaticImgDomain}/${pictureContainer}/${folderName}/${imgName}${imgExtension}`;
    } else {
    	return `https://${window.StaticImgDomain}/${pictureContainer}/${folderName}/${imgName}${sizeStr}${imgExtension}`;
    }
    
}

module.exports = newImage;