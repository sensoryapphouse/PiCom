var smallPortrait = false;
var NotiflixLoadingTmr = null;
var myBoard = {};;
var imgs = [];
var btnOrder = [];
var columns;

var rows;
var stepx;
var stepy;
var refreshBoard = 1; // redraw board
var manifestInfo;
var offsetForBoard = 0;

var crosshairs;

var gotGIF = false;
var gui;
var guiVisible = false;

var blob; // for loading obz files
var zip;
var zipData;
var symbolZip;
var symbolZipData;

var showGUI = 0; // count right clicks for showing gui

var theBody = document.getElementById('body');
var picomBar = document.getElementById('picomBar');
var viewport = window.visualViewport;
var layoutViewport;
var settingsButton;
var editButton;
var closeButton;
var boardButton;

var boardDiskFormat = 0; // 0: just one board. 1: folder of boards. 2: obz file (zip) 2 is not working yet

var cvs;
var hWindow;

var currentX = -1;
var currentY = -1;
var lastX = -1;
var lastY = -1;

var boardSetName = 'boards/project-core.obf';
var boardsFolderName = 'boards/communikate-20/';
var homeBoardName;
var currentBoardName = "board";
var currentCommunicatorName = "communicator";
//var highContrast = false;
//var backgroundColour = 'rgb(222,220,220)';

var inputMethod = 'Touch/Mouse';
var highlightRow = -1;
var scanningSpeed = .5;
var splash;
var settingsSplash;
var toggleSwitch;
var startSplash;
var guideSplash;
var helpSplash;
var buttonPanel;

window.addEventListener('beforeunload', function (e) {
    if (communicatorChanged) {
        askToSave();
        e.preventDefault();
        e.returnValue = '';
    }
});

function doSettingsSplash() {
    if (startSplash.hidden)
        settingsSplash.hidden = params.chkHideSettings;
}

window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator && !testing) {
        navigator.serviceWorker
            .register('./sw.js');
    }
    viewportHandler();

    function viewportHandler() {
        layoutViewport = document.getElementById('layoutViewport');
        layoutViewport.tabIndex = -1;
        // Since the bar is position: fixed we need to offset it by the visual
        // viewport's offset from the layout viewport origin.
        var offsetX = viewport.offsetLeft;
        var offsetY;
        if (params.boardStyle == 'ToolbarBottom') {
            offsetY = viewport.height -
                layoutViewport.getBoundingClientRect().height +
                viewport.offsetTop;
        } else
            offsetY = viewport.offsetTop - (viewport.scale - 1) * picomBar.getBoundingClientRect().height * 1.05; // use this for top

        picomBar.style.transform = 'translate(' +
            offsetX + 'px,' +
            offsetY + 'px) ' +
            'scale(' + 1 / viewport.scale + ')'
    }
    window.visualViewport.addEventListener('scroll', viewportHandler);
    window.visualViewport.addEventListener('resize', viewportHandler);
    initSymbolsZip();
    splash = document.querySelector('splash');
    startSplash = document.querySelector('startSplash');
    settingsSplash = document.querySelector('settingsSplash');
    toggleSwitch = document.querySelector('toggleSwitch');
    guideSplash = document.querySelector('guideSplash');

    toggleSwitch.onclick = function (e) {
        params.chkHideSettings = !params.chkHideSettings;
        if (params.chkHideSettings)
            toggleSwitch.style.backgroundImage = "url('images/off.svg')";
        else
            toggleSwitch.style.backgroundImage = "url('images/on.svg')";
        e.stopPropagation();
        e.preventDefault();
    }
    guideSplash.onclick = function (e) {
        window.open("https://www.sensoryapphouse.com/picom-help-faq/", "Sensory App House", "toolbar=yes,scrollbars=yes,resizable=yes");
        showSplashButtons();
        e.stopPropagation();
        e.preventDefault();
    }
    helpSplash = document.querySelector('helpSplash');
    helpSplash.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        showSplashButtons();
        window.location.assign("picomhelp.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500");
    }

    crosshairs = document.querySelector('crosshairs');
    crosshairs.style.left = window.innerWidth / 2 + "px";
    crosshairs.style.top = window.innerHeight / 2 + "px";
    closeButton = document.querySelector('closeButton');
    editButton = document.querySelector('editButton');
    settingsButton = document.querySelector('settings');
    boardButton = document.querySelector('boardButton');
    buttonPanel = document.querySelector('buttonPanel');
    buttonPanel.tabIndex = -1;
    buttonPanel.hidden = true;

    //    setTimeout(function () {
    //        settingsSplash.hidden = false;
    //        startSplash.hidden = false;
    //    }, 500);

    function startCommunicator(showMenu) {
        setUpGUI();
        lastTab = 1;
        startSplash.hidden = true;
        splash.hidden = true;
        guideSplash.hidden = true;
        helpSplash.hidden = true;
        toggleSwitch.hidden = true;
        doSettingsSplash();
        if (showMenu)
            showSettings();
        //        showTabs(1);
        windowResized();
    }

    settingsSplash.onmousedown = function (e) {
        e.stopPropagation();
        e.preventDefault();
        startCommunicator(true);
    }

    settingsSplash.onmouseup = function (e) {
        e.stopPropagation();
        e.preventDefault();
    }

    settingsSplash.ontouchstart = function (e) {
        e.stopPropagation();
        e.preventDefault();
        startCommunicator(true);
    };
    settingsSplash.ontouchend = function (e) {
        e.stopPropagation();
        e.preventDefault();
    }

    startSplash.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        startCommunicator(false);
    }

    startSplash.onmouseup = function (e) {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    settingsButton.onclick = function (e) {
        lastTab = 1;
        showSettings();
        showTabs(1);
        e.stopPropagation();
        e.preventDefault();
    }

    editButton.onclick = function (e) {
        lastTab = 2;
        showEdit();
        settingsButton.style.zIndex = "1500";
        //        showTabs(2);
        e.stopPropagation();
        e.preventDefault();
    }

    boardButton.onclick = function (e) {
        lastTab = 3;
        showSettings2();
        showTabs(3);
        e.stopPropagation();
        e.preventDefault();
    }

    closeButton.onclick = function (e) {
        showTabs(0);
        e.stopPropagation();
        e.preventDefault();
    }

    if (testing) setTimeout(hideSplash, 500);

    function hideSplash() {
        splash.hidden = true;
        settingsSplash.hidden = true;
        startSplash.hidden = true;
        guideSplash.hidden = true;
        helpSplash.hidden = true;
    }

    document.documentElement.style.overflow = 'hidden'; // hide scroll barsfirefox, chrome
    document.body.scroll = "no"; // ie only
    jeelizCanvas = document.getElementById('jeelizFaceExpressionsCanvas');
    jeelizCanvas.hidden = false;
    setUpToolbar();
    //    initLanguages();
}

async function initSymbolsZip() {
    let blob = await fetch("./SAHsymbols.zip").then(r => r.blob());
    symbolZip = new JSZip();
    symbolZip.loadAsync(blob).then(function (symbolzipinfo) {
        console.log("SAH symbols loaded");
        symbolZipData = symbolzipinfo;
        initLanguages();
    }).catch(function (err) {
        console.error("Failed to open");
    })
}

window.addEventListener("orientationchange", function () {
    windowResized();
}, false);

function windowResized() {
    //    var layoutViewport = document.getElementById('layoutViewport');
    smallPortrait = (layoutViewport.offsetHeight > layoutViewport.offsetWidth);
    if (params.boardStyle == strFullscreen) // full screen
        hWindow = layoutViewport.offsetHeight;
    else // toolbar
        hWindow = layoutViewport.offsetHeight * .9;

    var pos = document.getElementById("body");
    resizeCanvas(layoutViewport.offsetWidth, layoutViewport.offsetHeight);
    if (smallPortrait) {
        stepx = layoutViewport.offsetWidth / rows;
        stepy = hWindow / columns;
        splash.style.backgroundImage = "url('images/PiComPortrait.jpg')";
    } else {
        stepx = layoutViewport.offsetWidth / columns;
        stepy = hWindow / rows;
        splash.style.backgroundImage = "url('images/splash.jpg')";
    }
    refreshBoard++;

    if (params.boardStyle == 'ToolbarTop')
        offsetForBoard = viewport.height * .1;
    else
        offsetForBoard = 0;

    try {
        if (smallPortrait) {
            if (startSplash.hidden) {
                settingsSplash.style.top = "1.7vh";
                settingsSplash.style.right = "1.5vw";
            } else {
                settingsSplash.style.top = "2vw";
            }
            settingsSplash.style.width = "10vw";
            settingsSplash.style.height = "10vw";
            settingsSplash.style.backgroundSize = "10vw 10vw";

            guideSplash.style.left = "2vw";
            guideSplash.style.width = "15vw";
            guideSplash.style.height = "15vw";
            guideSplash.style.backgroundSize = "15vw 15vw";
            helpSplash.style.left = "2vw";
            helpSplash.style.width = "15vw";
            helpSplash.style.height = "15vw";
            helpSplash.style.backgroundSize = "15vw 15vw";
            startSplash.style.width = "15vw";
            startSplash.style.height = "15vw";
            startSplash.style.backgroundSize = "15vw 15vw";

            toggleSwitch.style.width = "10vw";
            toggleSwitch.style.height = "5vw";
            toggleSwitch.style.top = "13vw";
            toggleSwitch.style.backgroundSize = "10vw 5vw";
            gui.width = window.innerWidth * .9;
            gui2.width = window.innerWidth * .9;
            closeButton.style.left = "1vw";
            closeButton.style.width = "9vw";
            settingsButton.style.left = "9vw";
            settingsButton.style.width = "14vw";
            boardButton.style.left = "22vw";
            boardButton.style.width = "14vw";
            editButton.style.left = "35vw";
            editButton.style.width = "14vw";
            buttonPanel.style.left = "0vw";
            buttonPanel.style.width = "100vw";
            //        titleLbl.style.width = "99vw";
            buttonNoLbl.style.width = "37.14vw";
            buttonNoLbl.style.left = "60vw";
            lblText.style.width = "31.4vw";
            lblText.style.left = "3vw";
            lblVocal.style.width = "31.4vw";
            lblVocal.style.left = "3vw";
            lblLink.style.width = "31.4vw";
            lblLink.style.left = "3vw";
            txtText.style.width = "50vw";
            txtText.style.left = "34.3vw";
            btnSearch.style.width = "9vw";
            btnSearch.style.left = "86.5vw";
            txtVocal.style.width = "60vw";
            txtVocal.style.left = "34.3vw";
            txtLink.style.width = "61.5vw";
            txtLink.style.left = "34.3vw";
            lblInstant.style.width = "83vw";
            lblInstant.style.left = "11.4vw";
            upArrow.style.width = "17.14vw";
            upArrow.style.left = "70vw";
            downArrow.style.width = "17.14vw";
            downArrow.style.left = "70vw";
            leftArrow.style.width = "17.14vw";
            leftArrow.style.left = "60vw";
            rightArrow.style.width = "17.14vw";
            rightArrow.style.left = "80vw";
            instantMsg.style.width = "5.7vw";
            instantMsg.style.left = "1.43vw";
            homeChk.style.width = "5.7vw";
            homeChk.style.left = "7.14vw";
            backChk.style.width = "5.7vw";
            backChk.style.left = "30vw";
            clearChk.style.width = "5.7vw";
            clearChk.style.left = "50vw";
            speakChk.style.width = "5.7vw";
            speakChk.style.left = "75.7vw";
            btnLoadPic.style.width = "14.3vw";
            btnLoadPic.style.left = "40vw";
            btnDeletePic.style.width = "14.3vw";
            btnDeletePic.style.left = "40vw";
            btnPlay.style.width = "14.3vw";
            btnPlay.style.left = "5.7vw";
            btnRecSnd.style.width = "14.3vw";
            btnRecSnd.style.left = "24.3vw";
            btnStopRec.style.width = "14.3vw";
            btnStopRec.style.left = "42.9vw";
            btnDeleteSnd.style.width = "14.3vw";
            btnDeleteSnd.style.left = "80vw";
            btnLoadSnd.style.width = "14.3vw";
            btnLoadSnd.style.left = "61.4vw";
            btnEdgeCol.style.width = "22.8vw";
            btnEdgeCol.style.left = "31.7vw";
            btnFillCol.style.width = "22.8vw";
            btnFillCol.style.left = "4.3vw";
            imgCurrentImg.style.width = "31.4vw";
            imgCurrentImg.style.left = "4.3vw";
            imgUparrow.style.width = "4vw";
            imgUparrow.style.left = "14vw";
        } else {
            if (startSplash.hidden) {
                settingsSplash.style.top = "2vh";
                settingsSplash.style.right = "1.5vw";
            } else {
                settingsSplash.style.top = "2vw";
            }
            guideSplash.style.left = "2vw";
            guideSplash.style.width = "10vw";
            guideSplash.style.height = "10vw";
            guideSplash.style.backgroundSize = "10vw 10vw";
            helpSplash.style.left = "2vw";
            helpSplash.style.width = "10vw";
            helpSplash.style.height = "10vw";
            helpSplash.style.backgroundSize = "10vw 10vw";
            startSplash.style.width = "10vw";
            startSplash.style.height = "10vw";
            startSplash.style.backgroundSize = "10vw 10vw";

            settingsSplash.style.width = "5vw";
            settingsSplash.style.height = "5vw";
            settingsSplash.style.backgroundSize = "5vw 5vw";
            toggleSwitch.style.width = "5vw";
            toggleSwitch.style.height = "4vw";
            toggleSwitch.style.top = "7vw";
            toggleSwitch.style.backgroundSize = "5vw 5vw";
            gui.width = window.innerWidth * .319;
            gui2.width = window.innerWidth * .319;
            closeButton.style.left = "1vw";
            closeButton.style.width = "4vw";
            settingsButton.style.left = "4.3vw";
            settingsButton.style.width = "7vw";
            boardButton.style.left = "11vw";
            boardButton.style.width = "7vw";
            editButton.style.left = "17.7vw";
            editButton.style.width = "7vw";
            buttonPanel.style.left = "1vw";
            buttonPanel.style.width = "35vw";
            titleLbl.style.width = "33vw";
            buttonNoLbl.style.width = "13vw";
            buttonNoLbl.style.left = "21vw";
            lblText.style.width = "11vw";
            lblText.style.left = "1vw";
            lblVocal.style.width = "11vw";
            lblVocal.style.left = "1vw";
            lblLink.style.width = "11vw";
            lblLink.style.left = "1vw";
            txtText.style.width = "16.2vw";
            txtText.style.left = "12vw";
            btnSearch.style.width = "4.5vw";
            btnSearch.style.left = "29.3vw";
            txtVocal.style.width = "21.2vw";
            txtLink.style.width = "21.2vw";
            txtLink.style.left = "12vw";
            txtVocal.style.left = "12vw";
            lblInstant.style.width = "29vw";
            lblInstant.style.left = "4vw";
            upArrow.style.width = "6vw";
            upArrow.style.left = "24.5vw";
            downArrow.style.width = "6vw";
            downArrow.style.left = "24.5vw";
            leftArrow.style.width = "6vw";
            leftArrow.style.left = "21vw";
            rightArrow.style.width = "6vw";
            rightArrow.style.left = "28vw";
            instantMsg.style.width = "2vw";
            instantMsg.style.left = ".5vw";
            homeChk.style.width = "2vw";
            homeChk.style.left = "2.5vw";
            backChk.style.width = "2vw";
            backChk.style.left = "10.5vw";
            clearChk.style.width = "2vw";
            clearChk.style.left = "17.5vw";
            speakChk.style.width = "2vw";
            speakChk.style.left = "26.5vw";
            btnLoadPic.style.width = "5vw";
            btnLoadPic.style.left = "14vw";
            btnDeletePic.style.width = "5vw";
            btnDeletePic.style.left = "14vw";
            btnPlay.style.width = "5vw";
            btnPlay.style.left = "2vw";
            btnRecSnd.style.width = "5vw";
            btnRecSnd.style.left = "8.5vw ";
            btnStopRec.style.width = "5vw";
            btnStopRec.style.left = "15vw";
            btnDeleteSnd.style.width = "5vw";
            btnDeleteSnd.style.left = "28vw";
            btnLoadSnd.style.width = "5vw";
            btnLoadSnd.style.left = "21.5vw";
            btnEdgeCol.style.width = "8vw";
            btnEdgeCol.style.left = "11.1vw";
            btnFillCol.style.width = "8vw";
            btnFillCol.style.left = "1.5vw";
            imgCurrentImg.style.width = "11vw";
            imgCurrentImg.style.left = "1.5vw";
            imgUparrow.style.width = "1.4vw";
            imgUparrow.style.left = "4.9vw";
        }
    } catch (e) {}
    //    cvs.canvas.clientTop = viewport.height * .1;
}


function preload() {
    //    loadParams();
    //    loadBoard('boards/' + params.boardName);
    document.getElementById("body").style.z = 800;
}

function LOADJSON(s, callback) { // need this and brdLoaded as loadJSON seems to get an array, not an object
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', s, true); // Replace 'appDataServices' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) { // && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function brdLoaded(s) {
    myBoard = JSON.parse(s);
    jsonLoaded();
}

var tmrNotiflix;

function loadBoard(s) {
    console.log("Load board: ", s);
    currentCommunicatorName = s.substring(s.indexOf('/') + 1);
    try {
        guiBoardName.name = "Current File: " + currentCommunicatorName;
    } catch (e) {}
    if (s.includes(".obf")) {
        boardDiskFormat = 0;
        currentZipBoard = "";
    } else if (s.includes(".obz"))
        boardDiskFormat = 2;
    else
        boardDiskFormat = 1; // folder
    if (boardDiskFormat == 0) { // just one board
        //        myBoard = loadJSON(s, jsonLoaded);
        myBoard = LOADJSON(s, brdLoaded);
        //        currentBoardName = s.substring(s.indexOf('/') + 1);
    } else if (boardDiskFormat == 1) // folder
        manifestInfo = loadJSON(boardsFolderName + 'manifest.json', manifestLoaded);
    else { // obz 
        NotiflixLoadingTmr = setTimeout(function () {
            Notiflix.Loading.arrows();
            tmrNotiflix = setTimeout(function () {
                clearTimeout(NotiflixLoadingTmr);
                NotiflixLoadingTmr = null;
                Notiflix.Loading.remove();
            }, 30000);
        }, 200);

        getZip(s);
    }
    //    started = true;
    refreshBoard++;
}

function setFaceSpeed(i) {
    try { // 2000 to slow things down if loading file, 80 normally
        if (faceInitialised)
            JEELIZFACEEXPRESSIONS.set_animateDelay(i);
    } catch (e) {}
}

async function getZip(s) {
    //    s = "boards/zip.zip";
    console.log("Get zip: ", s);
    setFaceSpeed(2000);
    blob = await fetch(s)
        .then(r => r.blob())
        .catch(error => {
            clearTimeout(tmrNotiflix);
            clearTimeout(NotiflixLoadingTmr);
            NotiflixLoadingTmr = null;
            Notiflix.Loading.remove();
            alert(strFileNotLoad);
            console.log("Load error");
            return;
        });
    zip = null;
    currentZipBoard = "";
    zip = new JSZip();
    zip.loadAsync(blob).then(function (zipinfo) {
        showSplashButtons();
        clearTimeout(tmrNotiflix);
        if (NotiflixLoadingTmr != null) {
            clearTimeout(NotiflixLoadingTmr);
            NotiflixLoadingTmr = null;
            Notiflix.Loading.remove();
        } else {
            NotiflixLoadingTmr = null;
            Notiflix.Loading.remove();
        }
        //        console.log(zipinfo);
        zipData = zipinfo;
        zipData.file("manifest.json").async("string").then(function (data) {
            //            console.log(data);
            manifestInfo = JSON.parse(data);
            homeBoardName = manifestInfo.root;
            currentBoardName = homeBoardName;
            loadZipBoard(homeBoardName);
        }).catch(function (err) {
            console.error("Failed to open OBZ file:", err);
        })

    }).catch(function (err) {
        console.error("Failed to open");
    })
}

var currentZipBoard = "";

function loadZipBoard(s) {
    console.log("Load zip board: ", s);
    if (currentZipBoard == s)
        return;
    currentZipBoard = s;
    loadingboard = true;
    console.log("Loading board: ", s);
    zipData.file(s).async("string").then(function (data2) {
        //        console.log(data2);
        console.log("Got board: ", s);
        myBoard = JSON.parse(data2);
        jsonLoaded();
        // now read images
    }).catch(function (err) {
        console.error("Failed to open file:", err);
        loadingboard = false;
    })
}

function manifestLoaded() {
    try {
        homeBoardName = boardsFolderName + manifestInfo.root;
        myBoard = loadJSON(homeBoardName, jsonLoaded);
    } catch (error) {}
}

var re = /(?:\.([^.]+))?$/;
var counter;
async function jsonLoaded() {
    let loadedZipfile = false;
    let loadedZipcount = 0;
    console.log("Json loaded");
    gotGIF = false;
    setFaceSpeed(1000);
    loadingBoard = true;
    imgs.length = 0;
    rows = myBoard.grid.rows;
    columns = myBoard.grid.columns;
    //    toConvert = [];
    let cBoard = false; // cBoard doesn't seem to include images at thart of path so fix it
    try {
        cBoard = (myBoard.url.includes("app.cboard") > 0);
    } catch (e) {}
    try {
        for (let i = 0; i < myBoard.images.length; i++) {
            if (cBoard)
                myBoard.images[i].path = "images" + myBoard.images[i].path;
            counter = i;
            loadedZipcount = 0;
            loadedZipfile = false;
            imgs[i] = null;
            var im = myBoard.images[i];
            if (im.hasOwnProperty('data'))
                imgs[i] = await loadImage(myBoard.images[i].data, imageLoaded);
            else if (im.hasOwnProperty('path')) {
                if (myBoard.images[i].path.includes('SAHsymbols')) {
                    //                    imgs[i] = await loadImage(myBoard.images[i].path, imageLoaded);
                    let s1 = myBoard.images[i].path.replace(/^.*[\\\/]/, '');
                    symbolZip.file(s1).async('base64').then(function (data) {
                        imgs[counter] = loadImage("data:image/svg+xml;base64," + data, imageLoaded);
                        loadedZipfile = true;
                    }).catch(function (err) {
                        console.error("Failed to open file:", err);
                        loadedZipfile = true;
                    })
                    while (!loadedZipfile) {
                        await timer(1);
                        loadedZipcount++;
                        if (loadedZipcount > 200)
                            break;
                        console.log(loadedZipcount);
                    }
                } else {
                    if (boardDiskFormat == 1) {
                        imgs[i] = await loadImage(boardsFolderName + myBoard.images[i].path, imageLoaded);
                        loadedZipfile = true;
                    } else { // now read images from zip
                        var ext = re.exec(myBoard.images[i].path)[1];
                        if (ext == 'svg') {
                            //                        console.log(counter + " " + myBoard.images[i].path)
                            const fileStr2 = await zipData.file(myBoard.images[i].path).async('base64').then(function (data) {
                                imgs[counter] = loadImage("data:image/svg+xml;base64," + data, imageLoaded);
                                loadedZipfile = true;
                                //                            imgs[counter].width = 250;
                                //                            imgs[counter].height = 250;
                            }).catch(function (err) {
                                //                                console.error("Failed to open file:", err);
                                //                                loadedZipfile = true;
                            })
                        } else {
                            const fileStr = await zipData.file(myBoard.images[i].path).async('base64').then(function (data) {
                                imgs[counter] = loadImage("data:image/" + ext + ";base64," + data, imageLoaded);
                                loadedZipfile = true;
                            }).catch(function (err) {
                                console.error("Failed to open file:", err);
                                loadedZipfile = true;
                            })
                        }
                    }
                    await timer(1);
                    loadedZipcount++;
                    if (loadedZipcount > 200)
                        break;
                    console.log(loadedZipcount);
                }
                if (myBoard.images[i].path.toLowerCase().includes(".gif")) {
                    gotGIF = true;
                }
            } else if (im.url == null)
                continue;
            else if (im.hasOwnProperty('url'))
                imgs[i] = await loadImage(myBoard.images[i].url, imageLoaded);
            else
                imgs[i] = null;
        }

        refreshBoard++;
        //imgs[0] = null
        setTimeout(function () {
            setFaceSpeed(0);
            loadingBoard = false;
        }, 50);

    } catch (e) {
        console.log(e);
        for (var i = 0; i < myBoard.images.length; i++) {
            imgs[i] = null;
        }
        loadingBoard = false;
        console.log("Image load error");
    }

    setTimeout(windowResized, 50);

    function imageLoaded() {
        clearTimeout(tmrLoad);
        tmrLoad = setTimeout(function () {
            loadingBoard = false;
        }, 50);
        refreshBoard++;
    }
}
var tmrLoad = null;

function makeTransparent() {
    return;
    var i = 0;
    for (var j = 0; j < toConvert.length; j++) {
        i = toConvert[j];
        imgs[i].loadPixels();
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var index = (width * y + x) * 4;
                if (imgs[i].pixels[index] == 255 && imgs[i].pixels[index + 1] == 255 && imgs[i].pixels[index + 2] == 255) {
                    //                    imgs[i].pixels[index] = 0;
                    imgs[i].pixels[index + 3] = 0;
                }
            }
        }
        imgs[i].updatePixels();
    }
    refreshBoard++;
}

var someNumber = 0;

function setup() {
    //  gui.hide();
    //    p5.disableFriendlyErrors = true;
    cvs = createCanvas(viewport.width, viewport.height); //hWindow);
    stepx = viewport.width / columns;
    stepy = hWindow / rows;
    frameRate(10);
    window.setInterval(function () { //refresh every five seconds if not done already
        refreshBoard++;
    }, 5000);
}

function doToggle() {
    if (params.boardStyle == strFullscreen)
        hWindow = viewport.height;
    else
        hWindow = viewport.height * .9;
    toggleSwitch.hidden = false;
    if (params.chkHideSettings)
        toggleSwitch.style.backgroundImage = "url('images/off.svg')";
    else
        toggleSwitch.style.backgroundImage = "url('images/on.svg')";
}

var busy = false;

var loadingBoard = true;
var txtSize;

function draw() {
    txtSize = stepy / 10;
    //    if (!started)
    //        return;
    //    loadingboard = false;
    if (params.highContrast)
        background(32);
    else
        background(params.backgroundColour);
    if (loadingBoard)
        return;
    if (busy)
        return;
    busy = true;
    //    if (gotGIF)
    //    refreshBoard = 1;
    //    if (refreshBoard > 0) {
    //        refreshBoard--;
    try {
        //        clear();
        if (params.highContrast)
            background(32);
        else
            background(params.backgroundColour);
        //        offsetForBoard = 0;

        // invert highlight row
        //               var c = tinycolor(params.backgroundColour).spin(180).toRgbString();
        if (highlightRow >= 0 && highLightingRow && buttonPanel.hidden) {
            if (highlightRow == maxRow()) {
                backgroundButton.style.backgroundColor = params.highlightColour;
            } else {
                backgroundButton.style.backgroundColor = params.backgroundColour;
                stroke(params.highlightColour);
                fill(params.highlightColour);
                rect(0, offsetForBoard + highlightRow * stepy, viewport.width, stepy);
            }
        }
        textSize(txtSize);
    } catch (err) {}
    for (i = 0; i < rows; i++)
        for (j = 0; j < columns; j++) {
            try {
                //                if (loadingBoard) {
                //                    busy = false;
                //                    return;
                // 
                if (smallPortrait) {
                    drawGrid(j, i, myBoard.grid.order[i][j]);
                } else
                    drawGrid(i, j, myBoard.grid.order[i][j]);
            } catch (err) {}
        }
    //    }
    busy = false;
}

function drawGrid(i, j, btnId) {
    var btnIndex = buttonIndexFromId(btnId);
    //    btnOrder[i * columns + j] = btnIndex;
    if (btnIndex >= 0) {
        drawButton(i, j, btnIndex);
    } else {
        drawButton(i, j, -1);
    }
}

function drawButton(i, j, btnIndex) {
    try {
        var offset = 0; // offset and hightlight current button
        var imgIndex = -1;
        var nullImage = false;
        if (btnIndex >= 0) { // in case I've deleted image and set to null
            if (myBoard.buttons[btnIndex].image_id == null)
                nullImage = true;
        }
        if (btnIndex >= 0) {
            imgIndex = imageIndexFromId(myBoard.buttons[btnIndex].image_id);
            if (myBoard.buttons[btnIndex].border_color == null)
                myBoard.buttons[btnIndex].border_color = "rgb(0,0,0)";
            if (myBoard.buttons[btnIndex].background_color == null)
                myBoard.buttons[btnIndex].background_color = "rgb(255,255,255)";
        }
        strokeWeight(stepx / 100);
        if (j == currentX && i == currentY) { // current button
            offset = stepy / 100;
            strokeWeight(stepx / 60);
        }
        if (offset > 0) {
            stroke(params.highlightColour);
            fill(params.highlightColour);
            if (btnIndex < 0)
                fill(params.backgroundColour)
            rect(j * stepx, offsetForBoard + i * stepy, stepx, stepy);
        }
        if (btnIndex >= 0) {
            if (myBoard.buttons[btnIndex].hasOwnProperty('border_color')) {
                if (offset > 0) {
                    if (params.highContrast)
                        stroke(255);
                    else
                        stroke(myBoard.buttons[btnIndex].border_color);
                } else if (params.highContrast)
                    stroke(127);
                else {
                    stroke(myBoard.buttons[btnIndex].border_color);
                }
                //                stroke(myBoard.buttons[btnIndex].border_color);
            } else
                stroke(127);
            if (myBoard.buttons[btnIndex].hasOwnProperty('background_color')) {
                if (params.highContrast)
                    fill(0);
                else {
                    if (offset > 0) {
                        var c = tinycolor(myBoard.buttons[btnIndex].background_color);

                        if (c.isDark())
                            fill(c.lighten(10).toRgbString());
                        else
                            fill(c.darken(10).toRgbString());

                    } else
                        fill(myBoard.buttons[btnIndex].background_color)
                }
            } else
                fill(127);

            var xShrink = 0; // 10 and 20
            var yShrink = 0;
            switch (params.buttonSpacing) {
                case strSmall:
                    break;
                case strMedium:
                    xShrink = stepx / 20;
                    yShrink = stepy / 20;
                    break;
                case strLarge:
                    xShrink = stepx / 10;
                    yShrink = stepy / 10;
                    break;
            }

            if (myBoard.buttons[btnIndex].hasOwnProperty('load_board')) {
                if (myBoard.buttons[btnIndex].load_board.path != "")
                    rect(stepx / 40 + j * stepx + xShrink, stepy / 40 + i * stepy + offsetForBoard + yShrink, stepx * .95 - 2 * xShrink, stepy * .95 - 2 * yShrink, 0, stepx / 8, 0, 0);
                else
                    rect(stepx / 40 + j * stepx + xShrink, stepy / 40 + i * stepy + offsetForBoard + yShrink, stepx * .95 - xShrink * 2, stepy * .95 - 2 * yShrink);
            } else
            if (myBoard.buttons[btnIndex].label == "Top Page") {
                rect(stepx / 40 + j * stepx + xShrink, stepy / 40 + i * stepy + offsetForBoard + yShrink, stepx * .95 - 2 * xShrink, stepy * .95 - 2 * yShrink, 0, stepx / 8, 0, 0);
            } else
                rect(stepx / 40 + j * stepx + xShrink, stepy / 40 + i * stepy + offsetForBoard + yShrink, stepx * .95 - xShrink * 2, stepy * .95 - 2 * yShrink);
            textSize(txtSize);
            var txt;
            if (myBoard.buttons[btnIndex].hasOwnProperty('label')) {
                txt = myBoard.buttons[btnIndex].label;
                if (myBoard.buttons[btnIndex].label == null) {
                    txt = "";
                    myBoard.buttons[btnIndex].border_color = params.backgroundColour;
                    myBoard.buttons[btnIndex].background_color = params.backgroundColour;
                }
            } else
                txt = "";
            if (params.highContrast) {
                stroke(255);
                fill(255);
            } else {
                stroke(0);
                fill(0);
            }
            var c = tinycolor(myBoard.buttons[btnIndex].background_color);
            if (c.getBrightness() < 110) {
                stroke(255);
                fill(255);
            }
            strokeWeight(0);
            switch (params.textPos) {
                case strTop: // text at top
                    if (imgs[imgIndex] != null)
                        image(imgs[imgIndex],
                            stepx / 8 + j * stepx + offset + xShrink,
                            stepy / 5.5 + i * stepy + offset + offsetForBoard + yShrink,
                            stepx * .75 - 2 * xShrink,
                            stepy * .75 - 2 * yShrink);
                    textAlign(CENTER, TOP);
                    text(txt, offset + stepx / 40 + j * stepx + xShrink,
                        offset + stepy / 40 + i * stepy + stepy / 40 + offsetForBoard + yShrink,
                        stepx * .95 - 2 * xShrink, stepy / 5);
                    break;
                case strBottom: // text at bottom
                    textAlign(CENTER, BOTTOM);
                    text(txt, offset + stepx / 40 + j * stepx + xShrink, offset + stepy / 40 + i * stepy + stepy * .925 - yShrink + offsetForBoard, stepx * .95 - 2 * xShrink);
                    if (imgs[imgIndex] != null)
                        image(imgs[imgIndex],
                            stepx / 8 + j * stepx + offset + xShrink,
                            stepy / 15 + i * stepy + offset + offsetForBoard + yShrink,
                            stepx * .75 - xShrink * 2,
                            stepy * .75 - yShrink * 2);
                    break;
                case strNone: // no text
                    if (imgs[imgIndex] != null)
                        image(imgs[imgIndex], stepx / 8 + j * stepx + xShrink, stepy / 8 + i * stepy + offsetForBoard + yShrink, stepx * .75 - 2 * xShrink, stepy * .75 - 2 * yShrink);
                    break;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function buttonIndexFromId(btnId) {
    try {
        if (btnId == null)
            return -1;
        if (Number.isInteger(btnId))
            if (btnId < myBoard.buttons) // check if the same to speed up seach in most cases
                if (myBoard.buttons[btnId - 1].id == btnId)
                    return btnId - 1;
        for (idx = 0; idx < myBoard.buttons.length; idx++) {
            if (myBoard.buttons[idx].id == btnId)
                return idx;
        }
        return -1;
    } catch (error) {
        return -1;
    }
}

function imageIndexFromId(imgId) {
    try {
        if (imgId == null)
            return -1;
        for (idx = 0; idx < myBoard.images.length; idx++) {
            if (myBoard.images[idx].id == imgId)
                return idx;
        }
        return -1;
    } catch (error) {
        return -1;
    }
}

function soundIndexFromId(sndId) {
    try {
        if (sndId == null)
            return -1;
        for (idx = 0; idx < myBoard.buttons.length; idx++) {
            if (myBoard.sounds[idx].id == sndId)
                return idx;
        }
        return -1;
    } catch (error) {
        return -1;
    }
}

var snd = -1;
var imageObj = new Image();

function justSelected(x1, y1) {
    var x = x1;
    var y = y1;
    if (smallPortrait) {
        x = y1;
        y = x1;
    }
    var txt = "";
    var tts = true;
    var instant = false;
    let allowMute = true;
    try {
        if (y == rows) {
            switch (x) {
                case 0:
                    goHome();
                    break;
                case 1:
                    doSpeak();
                    break;
                case 2:
                    doBackspace();
                    break;
                case 3:
                    doClear();
                    break;
            }
            return;
        }
        var btnId = myBoard.grid.order[y][x];

        if (btnId == null) {
            return;
        }
        var btnIndex = buttonIndexFromId(btnId);

        if (myBoard.buttons[btnIndex].hasOwnProperty('actions')) {
            var act = myBoard.buttons[btnIndex].actions;
            if (act.includes(":home")) {
                goHome();
                instant = true;
            }
            if (act.includes(":speak")) {
                doSpeak();
                allowMute = false;
                instant = true;
            }
            if (act.includes(":clear")) {
                doClear();
                instant = true;
            }
            if (act.includes(":backspace")) {
                doBackspace();
                instant = true;
            }
        } else if (myBoard.buttons[btnIndex].hasOwnProperty('action')) {
            var act = myBoard.buttons[btnIndex].action;
            if (act.includes(":home")) {
                goHome();
                return;
                instant = true;
            } else if (act.includes(":speak")) {
                doSpeak();
                allowMute = false;
                instant = true;
            } else if (act.includes(":clear")) {
                doClear();
                instant = true;
            } else if (act.includes(":backspace")) {
                doBackspace();
                instant = true;
            }
        }

        if (myBoard.buttons[btnIndex].hasOwnProperty('vocalization')) {
            txt = myBoard.buttons[btnIndex].vocalization;
            textToSpeak += " | " + txt;
        } else if (myBoard.buttons[btnIndex].hasOwnProperty('sound_id')) {
            tts = false;
            snd = myBoard.buttons[btnIndex].sound_id;
            if (snd != -1) {
                var i = soundIndexFromId(snd);
                var is = myBoard.sounds[i];
                if (is.hasOwnProperty('data'))
                    snd = loadSound(is.data, soundLoaded);
                else if (is.hasOwnProperty('path'))
                    snd = loadSound(boardsFolderName + is.path, soundLoaded);
                else if (is.hasOwnProperty('url'))
                    snd = loadSound(is.url, soundLoaded);
                else
                    tts = true;;
            }
        } else if (myBoard.buttons[btnIndex].hasOwnProperty('label')) {
            if (myBoard.buttons[btnIndex].label.includes("https")) {
                var theURL = myBoard.buttons[btnIndex].label.match(/\bhttps?:\/\/\S+/gi);
                window.open(theURL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500");
                return;
            }
            txt = myBoard.buttons[btnIndex].label;
            if (!myBoard.buttons[btnIndex].hasOwnProperty('load_board'))
                textToSpeak += " | " + txt;
        }

        if (myBoard.buttons[btnIndex].hasOwnProperty('load_board')) {
            if (params.vocaliseLinkButtons) {
                if (allowMute)
                    speech.cancel();
                speech.speak(txt);
            }
            //document.body.style.transform = 'scale(' + (window.innerWidth / window.outerWidth) + ')';
            if (myBoard.buttons[btnIndex].load_board.hasOwnProperty('path')) {
                currentBoardName = myBoard.buttons[btnIndex].load_board.path
                var s = boardsFolderName + myBoard.buttons[btnIndex].load_board.path;
                console.log(s);
                refreshBoard = 0;
                if (boardDiskFormat == 2)
                    loadZipBoard(myBoard.buttons[btnIndex].load_board.path);
                else
                    myBoard = loadJSON(s, jsonLoaded);
            }

            //       speech.speak("load board");
        } else { // add info to message area - also do righttoleft
            if (myBoard.buttons[btnIndex].label == "Top Page") {
                goHome();
            } else {
                if (myBoard.buttons[btnIndex].hasOwnProperty('ext_instant')) {
                    instant = myBoard.buttons[btnIndex].ext_instant
                }

                if (!instant) {
                    if (buttonCount >= 10) {
                        ctx.fillStyle = "#FFFFFF";
                        buttonCount = 0;
                        for (j = 0; j < 10; j++) {
                            ctx.fillRect(j * 100, 0, 100, 150);
                            btnsLabels[j].textContent = "";
                        }
                    }

                    var imgIndex = imageIndexFromId(myBoard.buttons[btnIndex].image_id);
                    if (rightToLeft) {
                        let bc = 9 - buttonCount;
                        if (params.textPos != strNone)
                            btnsLabels[bc].textContent = myBoard.buttons[btnIndex].label;
                        if (imgIndex >= 0) {
                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(bc * 100, 0, 100, 150);
                            if (params.textPos == strNone)
                                ctx.drawImage(imgs[imgIndex].canvas, 2 + bc * 100, 2, 96, 148);
                            else
                                ctx.drawImage(imgs[imgIndex].canvas, 2 + bc * 100, 2, 96, 120);
                        }
                    } else {
                        if (params.textPos != strNone)
                            btnsLabels[buttonCount].textContent = myBoard.buttons[btnIndex].label;
                        if (imgIndex >= 0) {
                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(buttonCount * 100, 0, 100, 150);
                            if (params.textPos == strNone)
                                ctx.drawImage(imgs[imgIndex].canvas, 2 + buttonCount * 100, 2, 96, 148);
                            else
                                ctx.drawImage(imgs[imgIndex].canvas, 2 + buttonCount * 100, 2, 96, 120);
                        }
                    }
                    buttonCount++;
                }
                if (tts && params.vocaliseEachButton) { // vocaliseLinkButtons
                    if (allowMute)
                        speech.cancel();
                    speech.speak(txt);
                }
                if (homeBoardName != currentBoardName && params.autoReturnToHome)
                    if (boardDiskFormat == 2)
                        loadZipBoard(homeBoardName);
                    else
                        myBoard = loadJSON(homeBoardName, jsonLoaded);
            }
        }
        if (params.boardStyle == strFullscreen) // don't build up dispay if no toolbar
            doClear();
    } catch (e) {}
}

function soundLoaded() {
    var s = new Audio(snd.file);
    //    snd.play();//    var d = snd.duration();
    //    console.log(d);
    s.play();
}

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
    dbVersion = 1.0;

// Create/open database
var request = indexedDB.open("PiComFileStore", dbVersion);
var db;
var createObjectStore = function (dataBase) {
    // Create an objectStore
    console.log("Creating objectStore")
    dataBase.createObjectStore("PiComFileStore");
};
request.onerror = function (event) {
    console.log("Error creating/accessing IndexedDB database");
};

request.onsuccess = function (event) {
    console.log("Success creating/accessing IndexedDB database");
    db = request.result;
    db.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };

    // Interim solution for Google Chrome to create an objectStore. Will be deprecated
    if (db.setVersion) {
        if (db.version != dbVersion) {
            var setVersion = db.setVersion(dbVersion);
            setVersion.onsuccess = function () {
                createObjectStore(db);
                getImageFile();
            };
        }
    }
}

request.onupgradeneeded = function (event) {
    createObjectStore(event.target.result);
};
