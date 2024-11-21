const ignoreByDom = (method, domArray) => {
  let isIgnore = false

  for (let i = 0, len = domArray.length; i < len; i++) {
    if ($(domArray[i]).length > 0) {
      isIgnore = true
      break
    }
  }

  if (!isIgnore) {
    method()
  }
}

module.exports = ignoreByDom
