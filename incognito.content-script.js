/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
///<reference path="../typings/index.d.ts"/>
var IncognitoContentScript = /** @class */ (function () {
    function IncognitoContentScript() {
        this.browserType = "chrome";
        this.timerExpression = new RegExp(/(?!.*(?:[Aa]|[Pp])[Mm])(\d?\d)\s?(?::|[Mm][Ii][Nn])\s?(\d?\d)/g);
        this.originalTitle = "";
        this.alreadyFound = [];
    }
    IncognitoContentScript.prototype.sendMessage = function (message, callback) {
        if (this.browserType === "firefox" || this.browserType === "edge") {
            browser.runtime.sendMessage(message).then(callback);
        }
        else {
            chrome.runtime.sendMessage(message, callback);
        }
    };
    IncognitoContentScript.prototype.getText = function () {
        if (this.browserType === "firefox") {
            return document.body.innerText;
        }
        return document.body.outerText;
    };
    IncognitoContentScript.prototype.start = function () {
        var _this = this;
        this.sendMessage({ type: 'isTimerEnabled' }, function (response) {
            if (response) {
                _this.originalTitle = document.title;
                var notificationTriggered_1 = false;
                var process_1 = function () {
                    _this.timerExpression.lastIndex = 0;
                    var text = _this.getText();
                    var test;
                    var match;
                    while ((match = _this.timerExpression.exec(text)) != null) {
                        if (!test && _this.alreadyFound.indexOf(match[0]) === -1) {
                            test = match;
                        }
                        if (_this.alreadyFound.indexOf(match[0]) === -1) {
                            _this.alreadyFound.push(match[0]);
                        }
                    }
                    if (test) {
                        var text_1 = test[1] + ":" + ("0" + test[2]).substr(-2);
                        document.title = text_1 + " -  " + _this.originalTitle;
                        try {
                            var minute = parseInt(test[1]);
                            var second = parseInt(test[2]);
                            if (minute < 2) {
                                if (second < 31 && !notificationTriggered_1) {
                                    notificationTriggered_1 = true;
                                    _this.sendMessage({ type: 'sessionWillExpire' }, function () { });
                                }
                                _this.sendMessage({ type: 'timerColor', color: 'red' }, function () { });
                            }
                            else if (minute < 4) {
                                _this.sendMessage({ type: 'timerColor', color: 'yellow' }, function () { });
                            }
                            else {
                                _this.sendMessage({ type: 'timerColor', color: 'green' }, function () { });
                            }
                        }
                        catch (e) { }
                    }
                };
                setInterval(process_1, 500);
            }
        });
    };
    IncognitoContentScript.run = function () {
        var cs = new IncognitoContentScript();
        cs.start();
    };
    return IncognitoContentScript;
}());
IncognitoContentScript.run();

/******/ })()
;