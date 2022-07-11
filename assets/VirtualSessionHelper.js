(function () {
    var cookie = "";
    let dsw = [];
    var scriptTag = document.querySelector('script[data-sb-script=true]');
    if (scriptTag) {
        cookie = scriptTag.getAttribute('data-sb-init');
        dsw = JSON.parse(scriptTag.getAttribute('data-sb-dsw'));
    }

/*    var originalIndexedDbOpen = indexedDB.open;
    indexedDB.open = function (name, version) {
        var prefixedName = 'sb-' + name;
        return originalIndexedDbOpen(prefixedName, version);
    };*/


    window.addEventListener('message', function (event) {
        if (window.location.href.indexOf(event.origin) === 0 && event.source === window) {
            try {
                var data = JSON.parse(event.data);
                if (data.type && data.type === 'FROM_SR_CS_COOKIE_CHANGE') {
                    cookie = data.cookie;
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }

            } catch (e) {
            }
        }
        return true;
    });

    window.postMessage(JSON.stringify({
        type: 'FROM_SR_HELPER_INITIALIZED'
    }), window.location.href);

    Object.defineProperty(document, 'cookie', {
        get: function () {
            return cookie;
        },
        set: function (value) {
            if (value && value.indexOf && value.indexOf("FROM_SR_") !== -1) {
                return;
            }
            try {
                var firstItem = value.split(';')[0].trim();
                var parsedValue = [firstItem.substr(0,firstItem.indexOf('=')), firstItem.substr(firstItem.indexOf('=')+1)];
                var originalCookies = cookie.split(';');
                var cookieFound = false;
                for (var i = 0, len = originalCookies.length; i < len; i++) {
                    if (originalCookies[i].trim().indexOf(parsedValue[0] + '=') === 0) {
                        originalCookies[i] = parsedValue[0] + '=' + parsedValue[1];
                        cookieFound = true;
                    } else {
                        originalCookies[i] = originalCookies[i].trim();
                    }
                }
                if (!cookieFound) {
                    originalCookies.push(parsedValue[0] + '=' + parsedValue[1]);
                }
                cookie = originalCookies.join('; ');
            } catch (e) {
                //console.error(e);
            }
            window.postMessage(JSON.stringify({
                type: 'FROM_SR_IS_COOKIE_SET',
                cookie: value
            }), window.location.href);
        }
    });

    if (scriptTag) {
        scriptTag.removeAttribute('data-sb-init');
        scriptTag.removeAttribute('data-sb-script');
        scriptTag.removeAttribute('data-sb-dsw');
    }

    // Handle CORS
    var proxied = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        this.___arguments = arguments;
        return proxied.apply(this, [].slice.call(arguments));
    };
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        try {
            window.postMessage(JSON.stringify({
                type: 'FROM_SR_XHR_CONFIG',
                args: this.___arguments,
                withCredential: this.withCredentials,
                origin: document.location.href
            }), window.location.href);
        } catch (e) {
        }
        send.call(this, data);
    };

    // Disable service workers
    if (
        dsw.some(url => location.href.includes(url))
    ) {
        if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
            try {
                navigator.serviceWorker.getRegistrations().then(function (registrations) {
                    for (var i in registrations) {
                        try {
                            registrations[i].unregister();
                        } catch (e) {
                        }
                    }
                });
            } catch (e) {
            }
        }

        if (navigator.serviceWorker && Promise) {
            try {
                Object.defineProperty(navigator.serviceWorker, "register", new (function () {
                    this.get = function () {
                        return function () {
                            return new Promise(function (resolve, reject) {
                                reject();
                            });
                        };
                    };
                    this.configurable = false;
                    this.enumerable = true;
                })());
            } catch (e) {
            }
        }
    }
}());
