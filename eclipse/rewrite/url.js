function url(requestURL, url, prefix, baseURL) {
    var fullUrl = requestURL.split(prefix)[1];
    var mainUrl = new URL(requestURL).origin + prefix;
    
    if (url.startsWith("javascript:") || url.startsWith("about:") || url.startsWith("mailto:")|| url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("#")) return url;
    if (url.startsWith(mainUrl)) return url;
    
    try {
    var webbaseurl = new URL(new URL(baseURL).href, new URL(fullUrl).href)
    } catch {
    var webbaseurl = new URL(fullUrl).href
    }
    
    var newurl = new URL(url, webbaseurl).toString()
    
    return decodeURI(mainUrl + newurl)
}
    
export { url as default };