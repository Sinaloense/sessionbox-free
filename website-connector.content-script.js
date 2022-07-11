/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3414:
/***/ (() => {


;// CONCATENATED MODULE: ./config/production.json
const production_namespaceObject = JSON.parse('{"firebase":{"apiKey":"AIzaSyBrTiCAwny2KKqF98GUhLWKKXXSFqFb-U0","authDomain":"sessionbox.firebaseapp.com","databaseURL":"https://sessionbox.firebaseio.com","projectId":"project-8351859482577382977","storageBucket":"project-8351859482577382977.appspot.com","messagingSenderId":"65292386078","appId":"1:65292386078:web:f97aef99ccf7b5694a130f"},"sentry":{"dsn":"https://4af856d0eff3424099668ca0e14a8461@sentry.io/107368"},"foxyProxy":{"url":"https://reseller.api.foxyproxy.com"},"logLevel":"nothing","debugMode":"false","environmentTag":"production","siteUrl":"https://sessionbox.io","jumpUrl":"https://sessionbox.io/_jump","enabledLanguages":"en,hu,es,pt_PT,de,ru,fr,zh_CN","services":{"directory":"https://sessionbox-directory.herokuapp.com/api","api":"https://api.sessionbox.io/","backendServices":"https://backend-services.sessionbox.io/","statisticsService":"https://statistics-service.sessionbox.io"},"pages":{"purchase":"https://sessionbox.io/plans","feedback":"https://sessionbox.io/help","showIdeas":"https://sessionbox.io/help","knowledgeBase":"https://sessionbox.io/help","bugReport":"https://sessionbox.io/help","rate":"https://chrome.google.com/webstore/detail/sessionbox-beta/megbklhjamjbcafknkgmokldgolkdfig/reviews?hl=en","twitter":"https://twitter.com/session_box","facebook":"https://www.facebook.com/SessionBoxTeam/","billing":"https://sessionbox.io/account/billing","editBillingInfo":"https://sessionbox.io/account-billing-info","lostAuthenticator":"https://sessionbox.io/account/lost-authenticator","setUpTwoFactor":"https://sessionbox.io/account/setup-two-factor","securityCenter":"https://sessionbox.io/account/security","buyProxies":"https://sessionbox.io/account/proxies"},"trackingId":"UA-73814357-1","planNames":{"free":"Free","supporter":"Supporter","basic":"Basic","premium":"Premium","incognito":"Incognito"},"features":{"proxyServers":"disabled"},"limits":{"freeSyncedSessions":"1"},"debugScriptSrc":"https://sessionbox.io"}');
;// CONCATENATED MODULE: ./config/config.ts

var config = production_namespaceObject;

;// CONCATENATED MODULE: ./content-scripts/website-connector.content-script.ts
///<reference path="../typings/index.d.ts"/>

chrome.runtime.sendMessage({ type: "getUid" }, function (response) {
    window.addEventListener("DOMContentLoaded", function () {
        if (response) {
            document.body.setAttribute("data-sb-uid", response.uid);
            document.body.setAttribute("data-sb-email", response.email);
        }
        document.body.setAttribute("data-sb-version", "1.8.3");
    });
});
var port = chrome.runtime.connect({ name: 'websiteBridge' });
var tokenPort = chrome.runtime.connect({ name: 'tokenBridge' });
tokenPort.onMessage.addListener(function (message) {
    window.postMessage({
        type: 'messageBridge',
        bridge: 'tokenBridge',
        content: message
    }, document.location.origin);
});
var lastMessage;
port.onMessage.addListener(function (message) {
    lastMessage = message;
    window.postMessage({
        type: 'messageBridge',
        bridge: 'websiteBridge',
        content: message
    }, document.location.origin);
});
window.addEventListener("message", function (event) {
    if (event.origin !== config.siteUrl)
        return;
    if (event.data && event.data.type && event.data.type === 'postBridge') {
        if (event.data.bridge === 'websiteBridge') {
            port.postMessage(event.data.content);
        }
        else if (event.data.bridge === 'tokenBridge') {
            tokenPort.postMessage(event.data.content);
        }
    }
    else if (event.data && event.data.type && event.data.type === 'connectedBridge' && event.data.bridge === 'websiteBridge') {
        window.postMessage({
            type: 'messageBridge',
            bridge: 'websiteBridge',
            content: lastMessage
        }, document.location.origin);
    }
}, false);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module doesn't tell about it's top-level declarations so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[3414]();
/******/ 	
/******/ })()
;