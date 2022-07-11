/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
(function () {
    // Emulate local storage
    if (window['__sblinit'])
        return;
    window['__sblinit'] = true;
    var storageScript = "(function() {\n       function getSid(key) {\n            if (location.href.indexOf('https://portal.azure.') === 0 || location.href.indexOf('accounts.google.com') !== -1) {\n                return '';\n            } else {\n                return '__$SESSION_ID$__';\n            }\n       }\n       if (Proxy) {\n        function StorageProxy(origin) {\n            function getKeys() {\n                var keys = [];\n                for (var i = 0; i < origin.length; i++){\n                    if (origin.key(i).indexOf('__$SESSION_ID$__') === 0) {\n                        keys.push(origin.key(i));\n                    }\n                }\n                return keys;\n            }\n            var storage = {\n                _length: function () {\n                    return getKeys().length;\n                },\n                getItem: function (sKey) {\n                    return origin.getItem(getSid(sKey) + sKey);\n                },\n                key: function (idx) {\n                    var key = getKeys()[idx];\n                    if (key) {\n                        return key.replace('__$SESSION_ID$__', '');\n                    } else {\n                        return undefined;\n                    }\n                },\n                setItem: function (sKey, sValue) {\n                    if (sKey && sValue && sValue.indexOf && sKey.indexOf && (sKey.indexOf(\"FROM_SR_\") !== -1 || sValue.indexOf(\"FROM_SR_\") !== -1)) {\n                        return;\n                    }\n                    return origin.setItem(getSid(sKey) + sKey, sValue);\n                },\n                removeItem: function (sKey) {\n                    return origin.removeItem(getSid(sKey) + sKey);\n                },\n                clear: function () {\n                    var keys = getKeys();\n                    for (var i in keys) {\n                        origin.removeItem(keys[i]);\n                    }\n                },\n                toString: function () {\n                    return '[object Storage]';\n                },\n                toLocaleString: function () {\n                    return '[object Storage]';\n                }\n            };\n\n            try {\n                if (location.host === 'www.socialtrade.biz' || location.host === 'socialtrade.biz') {\n                    //Fix for socialtrade.biz\n                    storage.setObj = function (key, obj) {\n                        return this.setItem(key, JSON.stringify(obj));\n                    };\n\n                    storage.getObj = function (key) {\n                        return JSON.parse(this.getItem(key));\n                    };\n\n                    storage.removeObj = function (key) {\n                        return JSON.parse(this.removeItem(key));\n                    };\n                }\n            } catch (e) {\n            }\n\n            var storageHandler = {\n                get: function (target, name) {\n                    try {\n                        if (name === 'length') {\n                            return target._length();\n                        }\n                        if (target[name]) {\n                            return target[name];\n                        }\n                        var item = target.getItem(name);\n                        return item ? item : undefined;\n                    } catch (e) {\n                        return undefined;\n                    }\n\n                },\n                set: function (target, property, value) {\n                    target.setItem(property, value);\n                    return value;\n                },\n                deleteProperty: function (target, property) {\n                    target.removeItem(property);\n                    return true;\n                },\n                has: function (target, prop) {\n                    try {\n                        if (target[prop]) {\n                            return true;\n                        }\n                        return !!target.getItem(prop);\n                    } catch (e) {\n                        return false;\n                    }\n                }\n            };\n\n            return new Proxy(storage, storageHandler);\n        }\n\n        var localProxy = new StorageProxy(localStorage);\n        var sessionProxy = new StorageProxy(sessionStorage);\n        Object.defineProperty(window, \"localStorage\", new (function () {\n            this.get = function () {\n                return localProxy;\n            };\n            this.configurable = false;\n            this.enumerable = true;\n        })());\n\n        Object.defineProperty(window, \"sessionStorage\", new (function () {\n            this.get = function () {\n                return sessionProxy;\n            };\n            this.configurable = false;\n            this.enumerable = true;\n        })());\n    }\n        })();";
    var b = document.createElement("script");
    b.appendChild(document.createTextNode(storageScript));
    (document.head || document.documentElement).appendChild(b);
    b.parentNode.removeChild(b);
})();

/******/ })()
;