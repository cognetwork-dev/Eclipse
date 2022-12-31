function javascript(code, requestURL, prefix, codec) {
    code = code.replace(/document.location/g, "document.eLocation")
    code = code.replace(/window.location/g, "window.eLocation")
    code = code.replace(/window.oLocation = /g, "window.ELocation = ")
    code = code.replace(/document.oLocation = /g, "document.ELocation = ")
    return code;
}

export { javascript as default };