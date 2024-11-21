const preloadimages = imgArr => {
  var newimages = []
  var loadedimages = 0
  var postaction = function () {}
  imgArr = (typeof imgArr !== 'object') ? [imgArr] : imgArr

  function imageloaded () {
    loadedimages++
    if (loadedimages === imgArr.length) {
      postaction(newimages) // call postaction and pass in newimages array as parameter
    }
  }

  for (var i = 0; i < imgArr.length; i++) {
    newimages[i] = new Image()

    newimages[i].onload = function () {
      imageloaded()
    }

    newimages[i].onerror = function () {
      imageloaded()
      // console.log('image not found.' + i)
    }

    newimages[i].src = imgArr[i]
  }

  return { // return blank object with done() method
    done: function (f) {
      postaction = f || postaction // remember user defined callback functions to be called when images load
    }
  }
}

export default preloadimages
