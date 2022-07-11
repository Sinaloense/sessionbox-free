/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
///<reference path="../typings/index.d.ts"/>
var ContentScripts;
(function (ContentScripts) {
    var VirtualSession = /** @class */ (function () {
        function VirtualSession() {
            var _this = this;
            this.browserType = "chrome";
            this.sendMessage({ type: 'isVirtualSessionC6' }, function (response) {
                if (response.virtual) {
                    _this.init = response.init;
                    _this.c6FixRequired = response.c6FixRequired;
                    _this.activate(response.config.disableServiceWorker);
                }
            });
        }
        VirtualSession.prototype.sendMessage = function (message, callback) {
            if (this.browserType === "firefox" || this.browserType === "edge") {
                browser.runtime.sendMessage(message).then(callback);
            }
            else {
                chrome.runtime.sendMessage(message, callback);
            }
        };
        VirtualSession.prototype.connect = function (config) {
            if (this.browserType === "firefox" || this.browserType === "edge") {
                return browser.runtime.connect(config);
            }
            else {
                return chrome.runtime.connect(config);
            }
        };
        VirtualSession.prototype.getURL = function (file) {
            if (this.browserType === "firefox" || this.browserType === "edge") {
                return browser.runtime.getURL(file);
            }
            else {
                return chrome.runtime.getURL(file);
            }
        };
        VirtualSession.prototype.updateCookies = function () {
            var _this = this;
            this.sendMessage({
                type: 'getClientCookieString',
                payload: window.location.href
            }, function (cookie) {
                _this.triggerCookieChange(cookie);
            });
        };
        VirtualSession.prototype.updateStorages = function () {
            var _this = this;
            this.sendMessage({ type: 'getStores', payload: window.location.href }, function (stores) {
                for (var i in stores) {
                    _this.triggerStoreChange(i, stores[i].keys, stores[i].items);
                }
            });
        };
        VirtualSession.prototype.activate = function (disableServiceWorkers) {
            var _this = this;
            if (document.location.href.indexOf && document.location.href.indexOf('https://id.atlassian.com/') === 0)
                return;
            this.port = this.connect({ name: 'engineBridge' });
            this.port.onMessage.addListener(function (message) {
                if (message.type === 'storageUpdated') {
                    _this.triggerStoreChange(message.payload.storageName, message.payload.keys, message.payload.items);
                }
                else if (message.type === 'updateClientCookies') {
                    _this.triggerCookieChange(message.payload);
                }
                else if (message.type === 'afterActivate') {
                    _this.triggerCookieChange(message.clientCookieString);
                    var stores = message.stores;
                    for (var i in stores) {
                        _this.triggerStoreChange(i, stores[i].keys, stores[i].items);
                    }
                }
                else if (message.type === 'releaseC6') {
                    window.postMessage(JSON.stringify({
                        type: 'FROM_SR_CS_RELEASE_C6_REQUEST',
                        id: message.id
                    }), document.location.href);
                }
            });
            //Inject helper
            var scriptTag = document.createElement('script');
            scriptTag.src = this.getURL('assets/VirtualSessionHelper.js');
            scriptTag.setAttribute('data-sb-init', this.init);
            scriptTag.setAttribute('data-sb-dsw', disableServiceWorkers);
            scriptTag.setAttribute('data-sb-script', 'true');
            if (document.head) {
                document.head.appendChild(scriptTag);
            }
            else {
                document.documentElement.appendChild(scriptTag);
            }
            if (this.browserType === 'chrome' && this.c6FixRequired) {
                var scriptTagC6 = document.createElement('script');
                scriptTagC6.src = this.getURL('assets/C6Fix.js');
                (document.head || document.documentElement).appendChild(scriptTagC6);
            }
            //Temporary gmail workaround
            if (document.location.href.indexOf('mail.google.com') !== -1) {
                setInterval(function () {
                    var fixAuth = document.getElementById('link_fix_auth');
                    if (fixAuth) {
                        fixAuth.parentElement.parentElement.parentElement.style.visibility = 'hidden';
                    }
                }, 100);
            }
            //Hide initial gdrive error
            if (document.location.href.indexOf('drive.google.com') !== -1 && this.browserType === 'chrome' && this.c6FixRequired) {
                var driveStyle = document.createElement('style');
                var css = ".lb-k-Qc {display:none;} .lb-k.tn-Wn-k.Hb-ja-hc {display:none;}";
                driveStyle.type = "text/css";
                if (driveStyle.styleSheet) {
                    driveStyle.styleSheet.cssText = css;
                }
                else {
                    driveStyle.appendChild(document.createTextNode(css));
                }
                (document.head || document.documentElement).appendChild(driveStyle);
            }
            window.addEventListener('message', function (data) {
                if (window.location.href.indexOf(data.origin) === 0 && data.source === window) {
                    try {
                        var parsedData = JSON.parse(data.data);
                        if (parsedData.type && parsedData.type === 'FROM_SR_IS_COOKIE_SET') {
                            _this.cookieSet(parsedData.cookie);
                        }
                        else if (parsedData.type && parsedData.type === 'FROM_SR_IS_STORAGE_SET') {
                            _this.storageSet(parsedData.storageType, parsedData.keys, parsedData.items);
                        }
                        else if (parsedData.type && parsedData.type === 'FROM_SR_HELPER_INITIALIZED') {
                            _this.port.postMessage({ type: 'activate', payload: document.location.href });
                        }
                        else if (parsedData.type && parsedData.type === 'FROM_SR_PREPARE_C6_REQUEST' && _this.c6FixRequired) {
                            _this.port.postMessage({ type: 'prepareC6', payload: parsedData.id, url: parsedData.url });
                        }
                        else if (parsedData.type && parsedData.type === 'FROM_SR_C6_REQUEST_END' && _this.c6FixRequired) {
                            _this.port.postMessage({ type: 'endC6', payload: parsedData.id });
                        }
                        else if (parsedData.type && parsedData.type === 'FROM_SR_XHR_CONFIG') {
                            _this.xhrConfig(parsedData);
                        }
                    }
                    catch (e) {
                    }
                }
            });
        };
        VirtualSession.prototype.cookieSet = function (cookie) {
            this.port.postMessage({
                type: 'setCookie',
                payload: {
                    cookie: cookie,
                    url: document.location.href
                }
            });
        };
        VirtualSession.prototype.xhrConfig = function (args) {
            this.port.postMessage({
                type: 'xhrConfig',
                payload: args
            });
        };
        VirtualSession.prototype.storageSet = function (storageName, keys, items) {
            this.port.postMessage({
                type: 'storageChange',
                payload: {
                    storageName: storageName,
                    keys: keys,
                    items: items,
                    url: document.location.href
                }
            });
        };
        VirtualSession.prototype.triggerCookieChange = function (newCookie) {
            window.postMessage(JSON.stringify({
                type: 'FROM_SR_CS_COOKIE_CHANGE',
                cookie: newCookie
            }), document.location.href);
        };
        VirtualSession.prototype.triggerStoreChange = function (storeName, storeKeys, storeItems) {
            window.postMessage(JSON.stringify({
                type: 'FROM_SR_CS_STORAGE_CHANGE',
                storageType: storeName,
                items: storeItems,
                keys: storeKeys
            }), document.location.href);
        };
        return VirtualSession;
    }());
    ContentScripts.virtualSession = new VirtualSession();
})(ContentScripts || (ContentScripts = {}));

/******/ })()
;