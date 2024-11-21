const excuteByDom = (method, domArray) => {
  for (let i = 0, len = domArray.length; i < len; i++) {
    if ($(domArray[i]).length > 0) {
      method()
      break
    }
  }
}

module.exports = excuteByDom
