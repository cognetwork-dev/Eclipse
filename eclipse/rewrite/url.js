import { codecs } from "./index.js"


function url(requestURL, url, prefix, codec, baseURL) {
    var fullUrl = requestURL.split(prefix)[1];
    fullUrl = codecs[codec].decode(fullUrl)
    var mainUrl = new URL(requestURL).origin + prefix;
    
    if (url.startsWith("javascript:") || url.startsWith("about:") || url.startsWith("mailto:")|| url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("#")) return url;
    if (url.startsWith(mainUrl)) return url;
    
    try {
    var webbaseurl = new URL(new URL(baseURL).href, new URL(fullUrl).href)
    } catch {
    var webbaseurl = new URL(fullUrl).href
    }
    
    var newurl = new URL(url, webbaseurl).toString()
    
    return mainUrl + codecs[codec].encode(newurl)
}
    
export { url as default };