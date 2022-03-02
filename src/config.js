let href = location.href
let cutTag = 'admin'

export function setBaseUrl(state) {

  let apiUrl = ''
  if (process.env.NODE_ENV == 'production') {
    let localHref = href.substring(0, href.indexOf(cutTag))
    apiUrl = process.env.baseUrl == '' ? localHref : process.env.baseUrl
  } else {
    let localHref = href.substring(0, href.indexOf(cutTag));
        apiUrl = process.env.baseUrl == '' ? localHref : process.env.baseUrl;//判断是否分离部署
  }
  return apiUrl;
}
