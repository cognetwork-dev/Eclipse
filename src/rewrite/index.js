import url from './url.js'
import html from './html.js'
import javascript from './javascript.js'
import css from './css.js'
import codecs from './codecs.js'
import { request, response } from './headers.js'

var rewrite = {
    url: url,
    html: html,
    javascript: javascript,
    css: css,
    codecs: codecs,
    headers: {
        request, 
        response
    } 
}

export default rewrite;