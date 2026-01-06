var version = "V1.0.8 - 27-9-23";//added file name define in Share/Save and also retain Saved template in app
var testing = false;
var isChromium = navigator.userAgent.includes("Chrome");
var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

var doingSAPI = false;

var webViewIOS = false; // true for iOS build, false for everything else
if (window.webkit && window.webkit.messageHandlers) {
    webViewIOS = true;
}
else {
    if (window.chrome.webview != undefined)
        doingSAPI = true;
}
var viewPortHeight = .9; // was .9
var viewPortOffset = .1; // was .1

var SAPInames = "";

function stopSpeech() {
    if (doingSAPI) {
        window.chrome.webview.postMessage("StopSpeech");
    }
    else if (webViewIOS) {
        var message = "Stop";
        window.webkit.messageHandlers.PiCom.postMessage({
                "message": message
            });
    }
    else {
        speech.cancel();
    }
}

function say(s) {
    if (doingSAPI) {
        window.chrome.webview.postMessage("Speak:" + s);
    }
    else if (webViewIOS) {
        var message = "Speak:" + s;
        window.webkit.messageHandlers.PiCom.postMessage({
                "m": message
            });
    }
    else {
        speech.speak(s);
    }
}

function setVersion(s) { // call from system
    version = s;
    var message = "Stop";
    window.webkit.messageHandlers.PiCom.postMessage({
            "m": "Stop"
        });
    versionLbl.innerHTML = version;
}

var showTheMenu = false;
function gotWKWebViewVoices(s) { // for Apple WKWebView
    SAPInames = s;
    setUpGUI();
    doneSettings(showTheMenu);
}

var speech = new p5.Speech(); // new P5.Speech object - put here as fails for wkwebkit
