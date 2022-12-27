function request(headers, requestURL, prefix) {
    var link = requestURL.split(prefix)[1]
    console.log(prefix)
    console.log(requestURL)
    
    delete headers["Host"]
    delete headers["Accept-Encoding"]
    delete headers["Cache-Control"]
    delete headers["Upgrade-Insecure-Requests"]
    
    headers["Host"] = new URL(link).hostname
    headers["Origin"] = new URL(link).origin
    headers["Referrer"] = new URL(link).href
    return headers;
}
    
function response(headers) {
    delete headers['Content-Length']
    delete headers['Content-Security-Policy']
    delete headers['Content-Security-Policy-Report-Only']
    delete headers['Strict-Transport-Security']
    delete headers['X-Frame-Options']
    delete headers['X-Content-Type-Options']
    return headers;
}
    
export { request, response };