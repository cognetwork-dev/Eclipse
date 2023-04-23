function ecWindow(frame = window) {
    if (!frame.location) {
        return frame;
    }

    var windowProxy = {
                get(target, prop) {
                    if (prop == "location") {
                        return window.$ec.location(target)
                    }

                    if (target[prop] && typeof target[prop] == "object") {
                        return new Proxy(target[prop], windowProxy)
                    } else {
                    var value = Reflect.get(target, prop);

                    if (typeof value == "function") {
                        if (prop == "valueOf") {
                            return value.bind(window.$ec.window(target))
                        }

                        return value.bind(target);
                    } else {
                        return value;
                    }
                    }
                },
                set(obj, prop, value) {
                    return Reflect.set(obj, prop, value);
                }
            }

            return new Proxy(frame, windowProxy)
}

export default ecWindow;