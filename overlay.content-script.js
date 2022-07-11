/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
///<reference path="../typings/index.d.ts"/>
var ContentScripts;
(function (ContentScripts) {
    var Overlay;
    (function (Overlay) {
        var OverlayInjector = /** @class */ (function () {
            function OverlayInjector() {
                this.injectedFrames = [];
                this.injectedOverlays = [];
            }
            OverlayInjector.prototype.inject = function (url) {
                var iframe = document.createElement('iframe');
                iframe.style.position = "fixed";
                iframe.style.top = "0";
                iframe.style.left = "0";
                iframe.style.right = "0";
                iframe.style.bottom = "0";
                iframe.style.zIndex = "10000000000";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                document.body.appendChild(iframe);
                iframe.src = url;
                window.addEventListener('message', function (event) {
                    if (event.data === "FROM_SR_REMOVE_IFRAME") {
                        chrome.runtime.sendMessage({ type: 'newSessionFlowFinished' });
                        document.body.removeChild(iframe);
                    }
                });
                this.injectedFrames.push(iframe);
            };
            OverlayInjector.prototype.run = function () {
                var _this = this;
                chrome.runtime.onMessage.addListener(function (message) {
                    if (message.type === 'showOverlay' && _this.injectedOverlays.indexOf(message.payload) === -1) {
                        _this.injectedOverlays.push(message.payload);
                        _this.inject(chrome.runtime.getURL(message.payload));
                    }
                    else if (message.type === 'removeOverlay') {
                        _this.injectedFrames.forEach(function (frame) {
                            document.body.removeChild(frame);
                        });
                        _this.injectedFrames.length = 0;
                        _this.injectedOverlays.length = 0;
                    }
                    else if (message.type === 'promptForTemporary') {
                        var num = prompt("How many temporary session would you like to open?", message.defaultNum);
                        if (num != null && !isNaN(parseInt(num))) {
                            chrome.runtime.sendMessage({ type: 'openBulkTemporary', num: parseInt(num) });
                        }
                    }
                });
            };
            return OverlayInjector;
        }());
        function run() {
            var script = new OverlayInjector();
            script.run();
        }
        Overlay.run = run;
    })(Overlay = ContentScripts.Overlay || (ContentScripts.Overlay = {}));
})(ContentScripts || (ContentScripts = {}));
ContentScripts.Overlay.run();

/******/ })()
;