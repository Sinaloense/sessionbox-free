(function () {
    //Google Drive Fix
    //Queue XHR requests
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.___SB__url = arguments[1];
        originalOpen.apply(this, arguments);
    };

    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        try {
            if (this.___SB__url.indexOf && this.___SB__url.indexOf('https://clients6.google.com') === 0) {
                var requestId = Math.round(Math.random() * 10000000);
                var args = arguments;
                var that = this;
                var checkerInterval = setInterval(function () {
                    if (that.readyState > 1) {
                        clearInterval(checkerInterval);
                        window.postMessage(JSON.stringify({
                            type: 'FROM_SR_C6_REQUEST_END',
                            id: requestId
                        }), window.location.href);
                    }
                }, 10);
                var messageListener = function (event) {
                    try {
                        var data = JSON.parse(event.data);
                        if (data && data.type === 'FROM_SR_CS_RELEASE_C6_REQUEST' && data.id === requestId) {
                            window.removeEventListener('message', messageListener);
                            originalSend.apply(that, args);
                        }
                    } catch (e) {
                    }
                };
                window.addEventListener('message', messageListener);
                window.postMessage(JSON.stringify({
                    type: 'FROM_SR_PREPARE_C6_REQUEST',
                    id: requestId,
                    url: this.___SB__url
                }), window.location.href);
            } else {
                originalSend.apply(this, arguments);
            }
        } catch (e) {
            originalSend.apply(this, arguments);
        }
    };
}());
