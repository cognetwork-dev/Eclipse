function request(headers, link) {    
    delete headers['Host']
    delete headers['Accept-Encoding']
    delete headers['Cache-Control']
    delete headers['Upgrade-Insecure-Requests']
    
    headers['Host'] = new URL(link).hostname
    headers['Origin'] = new URL(link).origin
    headers['Referrer'] = new URL(link).href
    return headers;
}
    
function response(headers) {
    delete headers['Content-Length']
    delete headers['Content-Security-Policy']
    delete headers['Content-Security-Policy-Report-Only']
    delete headers['Strict-Transport-Security']
    delete headers['X-Frame-Options']
    delete headers['X-Content-Type-Options']
    delete headers['Cache-Control']
    delete headers['Cross-Origin-Opener-Policy']
    delete headers['Cross-Origin-Opener-Policy-Report-Only']
    delete headers['Report-To']
    delete headers['Access-Control-Allow-Origin']
    return headers;
}
    
export { request, response };