import * as CryptoJS from 'crypto-js';

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

codecs.base64 = {
    encode(string) {
        if (!string) return string;
        string = string.toString();
        const b64chs = Array.from(
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        );
        let u32;
        let c0;
        let c1;
        let c2;
        let asc = '';
        let pad = string.length % 3;

        for (let i = 0; i < string.length; ) {
            if (
                (c0 = string.charCodeAt(i++)) > 255 ||
                (c1 = string.charCodeAt(i++)) > 255 ||
                (c2 = string.charCodeAt(i++)) > 255
            )
                throw new TypeError('invalid character found');
            u32 = (c0 << 16) | (c1 << 8) | c2;
            asc +=
                b64chs[(u32 >> 18) & 63] +
                b64chs[(u32 >> 12) & 63] +
                b64chs[(u32 >> 6) & 63] +
                b64chs[u32 & 63];
        }

        return encodeURIComponent(
            pad ? asc.slice(0, pad - 3) + '==='.substr(pad) : asc
        );
    },
    decode(string) {
        if (!string) return string;
        string = decodeURIComponent(string.toString());
        const b64tab = {
            0: 52,
            1: 53,
            2: 54,
            3: 55,
            4: 56,
            5: 57,
            6: 58,
            7: 59,
            8: 60,
            9: 61,
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
            G: 6,
            H: 7,
            I: 8,
            J: 9,
            K: 10,
            L: 11,
            M: 12,
            N: 13,
            O: 14,
            P: 15,
            Q: 16,
            R: 17,
            S: 18,
            T: 19,
            U: 20,
            V: 21,
            W: 22,
            X: 23,
            Y: 24,
            Z: 25,
            a: 26,
            b: 27,
            c: 28,
            d: 29,
            e: 30,
            f: 31,
            g: 32,
            h: 33,
            i: 34,
            j: 35,
            k: 36,
            l: 37,
            m: 38,
            n: 39,
            o: 40,
            p: 41,
            q: 42,
            r: 43,
            s: 44,
            t: 45,
            u: 46,
            v: 47,
            w: 48,
            x: 49,
            y: 50,
            z: 51,
            '+': 62,
            '/': 63,
            '=': 64,
        };
        string = string.replace(/\s+/g, '');
        string += '=='.slice(2 - (string.length & 3));
        let u24;
        let bin = '';
        let r1;
        let r2;

        for (let i = 0; i < string.length; ) {
            u24 =
                (b64tab[string.charAt(i++)] << 18) |
                (b64tab[string.charAt(i++)] << 12) |
                ((r1 = b64tab[string.charAt(i++)]) << 6) |
                (r2 = b64tab[string.charAt(i++)]);
            bin +=
                r1 === 64
                    ? String.fromCharCode((u24 >> 16) & 255)
                    : r2 === 64
                    ? String.fromCharCode((u24 >> 16) & 255, (u24 >> 8) & 255)
                    : String.fromCharCode(
                          (u24 >> 16) & 255,
                          (u24 >> 8) & 255,
                          u24 & 255
                      );
        }
        return bin;
    }
}

codecs.xor = {
    encode(string){
        if (!string) return string;
        return encodeURIComponent(string.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
    },
    decode(string){
        if (!string) return string;
        return decodeURIComponent(string).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join('');
    }
}

codecs.random = {
    encode(string, randomString) {
        if (!string) return string;
        return encodeURIComponent(CryptoJS.AES.encrypt(string, "test").toString());
    },
    decode(string, randomString) {
        if (!string) return string;
        return CryptoJS.AES.decrypt(decodeURIComponent(string), "test").toString(CryptoJS.enc.Utf8);
    }
}

export default codecs;