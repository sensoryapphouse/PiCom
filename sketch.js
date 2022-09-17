var testing = true;

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

var gotGIF = false;
var gui;
var guiVisible = false;

var blob; // for loading obz files
var zip;
var zipData;

var showGUI = 0; // count right clicks for showing gui

var theBody = document.getElementById('body');
var picomBar = document.getElementById('picomBar');
var viewport = window.visualViewport;
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
var currentBoardName = "Not yet";
//var highContrast = false;
//var backgroundColour = 'rgb(222,220,220)';

var inputMethod = 'Touch/Mouse';
var highlightRow = -1;
var scanningSpeed = .5;
var splash;
var buttonPanel;
//var started = false;

window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
    viewportHandler();

    function viewportHandler() {
        var layoutViewport = document.getElementById('layoutViewport');
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
            offsetY = viewport.offsetTop - (viewport.scale - 1) * picomBar.getBoundingClientRect().height; // use this for top

        picomBar.style.transform = 'translate(' +
            offsetX + 'px,' +
            offsetY + 'px) ' +
            'scale(' + 1 / viewport.scale + ')'
    }
    window.visualViewport.addEventListener('scroll', viewportHandler);
    window.visualViewport.addEventListener('resize', viewportHandler);

    splash = document.querySelector('splash');
    buttonPanel = document.querySelector('buttonPanel');
    buttonPanel.tabIndex = -1;
    buttonPanel.hidden = true;
    splash.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        setTimeout(function () {
            splash.hidden = true;
        }, params.speed * 200);
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        }
    }
    if (testing) setTimeout(hideSplash, 500);

    function hideSplash() {
        splash.hidden = true;
    }

    document.documentElement.style.overflow = 'hidden'; // hide scroll barsfirefox, chrome
    document.body.scroll = "no"; // ie only

    setUpToolbar();
    setUpPanel();
}

function windowResized() {
    if (params.boardStyle == 'Fullscreen') // full screen
        hWindow = windowHeight;
    else // toolbar
        hWindow = windowHeight * .9;

    var pos = document.getElementById("body");
    resizeCanvas(windowWidth, windowHeight);
    stepx = windowWidth / columns;
    stepy = hWindow / rows;
    refreshBoard++;

    if (params.boardStyle == 'ToolbarTop')
        offsetForBoard = windowHeight * .1;
    else
        offsetForBoard = 0;

    //    cvs.canvas.clientTop = windowHeight * .1;
}


function preload() {
    loadParams();
    if (params.boardStyle == 'Fullscreen')
        hWindow = windowHeight;
    else
        hWindow = windowHeight * .9;
    //    loadBoard('boards/' + params.boardName);
    document.getElementById("body").style.z = 800;
}

function LOADJSON(s, callback) { // need this and brdLoaded as loadJSON seems to get an array, not an object

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', s, true); // Replace 'appDataServices' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
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

function loadBoard(s) {
    currentBoardName = s.substring(s.indexOf('/') + 1);
    if (s.includes(".obf"))
        boardDiskFormat = 0;
    else if (s.includes(".obz"))
        boardDiskFormat = 2;
    else
        boardDiskFormat = 1; // folder
    if (boardDiskFormat == 0) { // just one board
        //        myBoard = loadJSON(s, jsonLoaded);
        myBoard = LOADJSON(s, brdLoaded);
        currentBoardName = s.substring(s.indexOf('/') + 1);
    } else if (boardDiskFormat == 1) // folder
        manifestInfo = loadJSON(boardsFolderName + 'manifest.json', manifestLoaded);
    else // obz
        getZip(s);
    //    started = true;
    refreshBoard++;
}

async function getZip(s) {
    //    s = "boards/zip.zip";
    blob = await fetch(s).then(r => r.blob());
    zip = new JSZip();
    zip.loadAsync(blob).then(function (zipinfo) {
        console.log(zipinfo);
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
    if (currentZipBoard == s)
        return;
    currentZipBoard = s;
    zipData.file(s).async("string").then(function (data2) {
        //        console.log(data2);
        myBoard = JSON.parse(data2);
        jsonLoaded();
        // now read images
    }).catch(function (err) {
        console.error("Failed to open file:", err);
    })
}

function manifestLoaded() {
    try {
        homeBoardName = boardsFolderName + manifestInfo.root;
        myBoard = loadJSON(homeBoardName, jsonLoaded);
    } catch (error) {

    }
}

var re = /(?:\.([^.]+))?$/;
var counter;
//var toConvert = [];
var tmrTransparent;
async function jsonLoaded() {
    gotGIF = false;
    //    toConvert = [];
    try {
        for (i = 0; i < myBoard.images.length; i++) {
            counter = i;
            imgs[i] = null;
            var im = myBoard.images[i];
            if (im.hasOwnProperty('data'))
                imgs[i] = loadImage(myBoard.images[i].data, imageLoaded);
            else if (im.hasOwnProperty('path')) {
                if (boardDiskFormat == 1)
                    imgs[i] = loadImage(boardsFolderName + myBoard.images[i].path, imageLoaded);
                else { // now read images from zip
                    var ext = re.exec(myBoard.images[i].path)[1];
                    if (ext == 'svg') {
                        //                        console.log(counter + " " + myBoard.images[i].path)
                        const fileStr2 = await zipData.file(myBoard.images[i].path).async('base64').then(function (data) {
                            imgs[counter] = loadImage("data:image/svg+xml;base64," + data);
                            //                            imgs[counter].width = 250;
                            //                            imgs[counter].height = 250;
                        }).catch(function (err) {
                            console.error("Failed to open file:", err);
                        })
                    } else {
                        const fileStr = await zipData.file(myBoard.images[i].path).async('base64').then(function (data) {
                            imgs[counter] = loadImage("data:image/" + ext + ";base64," + data);
                        }).catch(function (err) {
                            console.error("Failed to open file:", err);
                        })
                    }
                }
                if (myBoard.images[i].path.toLowerCase().includes(".gif")) {
                    gotGIF = true;
                }
            } else if (im.hasOwnProperty('url'))
                imgs[i] = loadImage(myBoard.images[i].url, imageLoaded);
            else
                imgs[i] = null;
        }
        rows = myBoard.grid.rows;
        columns = myBoard.grid.columns;
        refreshBoard++;
        //imgs[0] = null

    } catch (error) {
        for (i = 0; i < myBoard.images.length; i++) {
            imgs[i] = null;
        }
    }

    //   refreshBoard = 1;
    //   if (boardDiskFormat == 2)
    setTimeout(windowResized, 100);

    function imageLoaded() {
        refreshBoard++;
    }
}

function makeTransparent() {
    return;
    var i = 0;
    for (j = 0; j < toConvert.length; j++) {
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
    cvs = createCanvas(windowWidth, hWindow);
    stepx = windowWidth / columns;
    stepy = hWindow / rows;
    setTimeout(setUpGUI, 250);
    frameRate(10);
    window.setInterval(function () { //refresh every five seconds if not done already
        refreshBoard++;
    }, 5000);
}

var busy = false;

function draw() {
    //    if (!started)
    //        return;
    if (busy)
        return;
    if (gotGIF)
        refreshBoard = 1;
    if (refreshBoard > 0) {
        refreshBoard--;
        clear();
        if (params.highContrast)
            background(32);
        else
            background(params.backgroundColour);
        //        offsetForBoard = 0;

        // invert highlight row
        //               var c = tinycolor(params.backgroundColour).spin(180).toRgbString();
        if (highlightRow >= 0 && highLightingRow && buttonPanel.hidden) {
            if (highlightRow == rows) {
                backgroundButton.style.backgroundColor = params.highlightColour;
            } else {
                backgroundButton.style.backgroundColor = params.backgroundColour;
                stroke(params.highlightColour);
                fill(params.highlightColour);
                rect(0, offsetForBoard + highlightRow * stepy, windowWidth, stepy);
            }
        }
        textSize(stepy / 10);
        try {
            for (i = 0; i < rows; i++)
                for (j = 0; j < columns; j++) {
                    drawGrid(i, j, myBoard.grid.order[i][j]);
                }
        } catch (err) {}
    }
    busy = false;
}

function drawGrid(i, j, btnId) {
    //    if (btnId == null) {
    //        btnOrder[i * columns + j] = null;
    //        return;
    //    }
    var btnIndex = buttonIndexFromId(btnId);
    btnOrder[i * columns + j] = btnIndex;
    if (btnIndex >= 0) {
        drawButton(i, j, btnIndex);
    } else
        drawButton(i, j, -1);
}

function drawButton(i, j, btnIndex) {
    try {
        var offset = 0; // offset and hightlight current button
        var imgIndex = -1;
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
        if (imgIndex >= 0) {
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
                            fill(c.darken(12).toRgbString());

                    } else
                        fill(myBoard.buttons[btnIndex].background_color)
                }
            } else
                fill(127);

            var xShrink = 0; // 10 and 20
            var yShrink = 0;
            switch (params.buttonSpacing) {
                case 'small':
                    break;
                case 'medium':
                    xShrink = stepx / 20;
                    yShrink = stepy / 20;
                    break;
                case 'large':
                    xShrink = stepx / 10;
                    yShrink = stepy / 10;
                    break;
            }
            if (myBoard.buttons[btnIndex].hasOwnProperty('load_board'))
                rect(stepx / 40 + j * stepx + xShrink, stepy / 40 + i * stepy + offsetForBoard + yShrink, stepx * .95 - 2 * xShrink, stepy * .95 - 2 * yShrink, 0, stepx / 8, 0, 0);
            else
                rect(stepx / 40 + j * stepx + xShrink, stepy / 40 + i * stepy + offsetForBoard + yShrink, stepx * .95 - xShrink * 2, stepy * .95 - 2 * yShrink);
            textSize(stepy / 10);
            var txt;
            if (myBoard.buttons[btnIndex].hasOwnProperty('label'))
                txt = myBoard.buttons[btnIndex].label;
            else
                txt = "";
            if (params.highContrast) {
                stroke(255);
                fill(255);
            } else {
                stroke(0);
                fill(0);
            }
            strokeWeight(0);
            switch (params.textPos) {
                case 'top': // text at top
                    if (imgs[imgIndex] != null)
                        image(imgs[imgIndex],
                            stepx / 8 + j * stepx + offset + xShrink,
                            stepy / 5.5 + i * stepy + offset + offsetForBoard + yShrink,
                            stepx * .75 - 2 * xShrink,
                            stepy * .75 - 2 * yShrink);
                    textAlign(CENTER, TOP);
                    text(txt, offset + stepx / 40 + j * stepx + xShrink,
                        offset + stepy / 40 + i * stepy + stepy / 40 + offsetForBoard + yShrink,
                        stepx * .95 - 2 * xShrink, stepy / 10);
                    break;
                case 'bottom': // text at bottom
                    textAlign(CENTER, BOTTOM);
                    text(txt, offset + stepx / 40 + j * stepx + xShrink, offset + stepy / 40 + i * stepy + stepy * .925 - yShrink + offsetForBoard, stepx * .95 - 2 * xShrink);
                    if (imgs[imgIndex] != null)
                        image(imgs[imgIndex],
                            stepx / 8 + j * stepx + offset + xShrink,
                            stepy / 15 + i * stepy + offset + offsetForBoard + yShrink,
                            stepx * .75 - xShrink * 2,
                            stepy * .75 - yShrink * 2);
                    break;
                case 'none': // no text
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

function justSelected(x, y) {
    var txt = "";
    var tts = true;
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
                goHome()
            }
            if (act.includes(":speak")) {
                doSpeak();
            }
            if (act.includes(":clear")) {
                doClear();
            }
            if (act.includes(":backspace")) {
                doBackspace();
            }
        } else if (myBoard.buttons[btnIndex].hasOwnProperty('action')) {
            var act = myBoard.buttons[btnIndex].action;
            if (act.includes(":home")) {
                goHome()
            } else if (act.includes(":speak")) {
                doSpeak();
            } else if (act.includes(":clear")) {
                doClear();
            } else if (act.includes(":backspace")) {
                doBackspace();
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
            txt = myBoard.buttons[btnIndex].label;
            if (!myBoard.buttons[btnIndex].hasOwnProperty('load_board'))
                textToSpeak += " | " + txt;
        }

        if (myBoard.buttons[btnIndex].hasOwnProperty('load_board')) {
            if (params.vocaliseLinkButtons) {
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
        } else { // add info to message area
            if (buttonCount >= 10) {
                ctx.fillStyle = "#FFFFFF";
                buttonCount = 0;
                for (j = 0; j < 10; j++) {
                    ctx.fillRect(j * 100, 0, 100, 150);
                    btnsLabels[j].textContent = "";
                }
            }

            btnsLabels[buttonCount].textContent = myBoard.buttons[btnIndex].label;
            var imgIndex = imageIndexFromId(myBoard.buttons[btnIndex].image_id);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(buttonCount * 100, 0, 100, 150);
            ctx.drawImage(imgs[imgIndex].canvas, 2 + buttonCount * 100, 2, 96, 120);
            buttonCount++;
            if (tts && params.vocaliseEachButton) // vocaliseLinkButtons
                speech.speak(txt);
            if (homeBoardName != currentBoardName && params.autoReturnToHome)
                if (boardDiskFormat == 2)
                    loadZipBoard(homeBoardName);
                else
                    myBoard = loadJSON(homeBoardName, jsonLoaded);
        }
        if (params.boardStyle == 'Fullscreen') // don't build up dispay if no toolbar
            doClear();
    } catch (e) {}

    function soundLoaded() {
        snd.play();
    }

}
