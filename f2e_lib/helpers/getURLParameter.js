const getURLParameter = key => {
  var reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
  var result = window.location.search.substr(1).match(reg)

  return result !== null ? decodeURIComponent(result[2]) : ''
}

export default getURLParameter;
