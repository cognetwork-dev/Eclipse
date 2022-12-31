var codecs = {}

codecs.plain = {
    encode(string) {
        if (!string) return string;
        return encodeURIComponent(string);
    },
    decode(string) {
        if (!string) return string;
        return decodeURIComponent(string);
    }
}

export { codecs }