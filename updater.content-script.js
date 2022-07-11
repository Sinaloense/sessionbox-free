/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
///<reference path="../typings/index.d.ts"/>
var ContentScripts;
(function (ContentScripts) {
    var Updater;
    (function (Updater_1) {
        var Updater = /** @class */ (function () {
            function Updater() {
            }
            Updater.prototype._changeFavicon = function (dataUrl) {
                var link = document.querySelectorAll("link[rel~='icon']");
                if (link.length === 0) {
                    var newLink = document.createElement("link");
                    newLink.setAttribute("rel", "icon");
                    newLink.setAttribute("href", dataUrl);
                    document.head.appendChild(newLink);
                }
                else {
                    for (var i = 0, len = link.length; i < len; i++) {
                        link[i].type = "image/x-icon";
                        link[i].href = dataUrl;
                    }
                }
                var shortcutIcon = document.querySelectorAll("link[rel='shortcut icon']");
                for (var i = 0, len = shortcutIcon.length; i < len; i++) {
                    shortcutIcon[i].type = "image/x-icon";
                    shortcutIcon[i].href = dataUrl;
                }
            };
            Updater.prototype.run = function () {
                var _this = this;
                chrome.runtime.onMessage.addListener(function (message) {
                    if (message.type === 'changeFavicon') {
                        setTimeout(function () {
                            _this._changeFavicon(message.payload);
                        }, 500);
                    }
                    else if (message.type === 'changeTitle') {
                        setTimeout(function () {
                            document.title = message.payload;
                        }, 500);
                    }
                });
            };
            return Updater;
        }());
        function run() {
            var script = new Updater();
            script.run();
        }
        Updater_1.run = run;
    })(Updater = ContentScripts.Updater || (ContentScripts.Updater = {}));
})(ContentScripts || (ContentScripts = {}));
ContentScripts.Updater.run();

/******/ })()
;