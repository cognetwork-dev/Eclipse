import rewrite from "../../rewrite/index.js";

function fetch(args) {
    if (args) {
        args = rewrite.url(window.$ec.config.requestURL, args, window.$ec.config.prefix, window.$ec.config.codec, window.$ec.config.randomString)
    }
    return window.$ec.api.fetch(args)
}

export { fetch as default };