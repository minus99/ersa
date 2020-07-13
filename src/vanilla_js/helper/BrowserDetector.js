/* 
    https://www.digitalminds.io/blog/detecting-outdated-browsers-in-vanilla-javascript
*/
function BrowserDetector() {
    this.browser = {};
    this.unsupportedBrowsers = {
        Chrome: 70,
        Firefox: 60,
        IE: 10,
        Edge: 15,
        Opera: 50,
        Safari: 12
    };

    this._detectBrowser();
}

BrowserDetector.prototype = {

    constructor: BrowserDetector,

    _detectBrowser: function () {
        this.browser = (function () {
            var ua = navigator.userAgent,
                tem,
                M =
                    ua.match(
                        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
                    ) || [];

            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return { name: "IE", version: tem[1] || "" };
            }

            if (M[1] === "Chrome") {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) {
                    return { name: tem[1].replace("OPR", "Opera"), version: tem[2] };
                }
            }

            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];

            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }

            return { name: M[0], version: M[1] };
        })();
    },


    isIE: function () {
        return this.browser.name === 'IE';
    },


    isEdge: function () {
        return this.browser.name === 'Edge';
    },

    isMicrosoft: function () {
        return this.isIE() || this.isEdge();
    },

    isFirefox: function () {
        return this.browser.name === 'Firefox';
    },

    isChrome: function () {
        return this.browser.name === 'Chrome';
    },

    isSafari: function () {
        return this.browser.name === 'Safari';
    },

    isAndroid: function () {
        return /Android/i.test(navigator.userAgent);
    },

    isBlackBerry: function () {
        return /BlackBerry/i.test(navigator.userAgent);
    },

    isWindowsMobile: function () {
        return /IEMobile/i.test(navigator.userAgent);
    },

    isIOS: function () {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },

    isMobile: function () {
        return (
            this.isAndroid() || this.isBlackBerry() || this.isWindowsMobile() || this.isIOS()
        );
    },

    isSupported: function () {
        if (this.unsupportedBrowsers.hasOwnProperty(this.browser.name)) {
            if (+this.browser.version > this.unsupportedBrowsers[this.browser.name]) {
                return true;
            }
        }

        return false;
    }
};

// global variable
var isMobile = new BrowserDetector().isMobile();
