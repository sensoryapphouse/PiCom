var speech = new p5.Speech(); // new P5.Speech object
var jsonString;
var boardsJson;
var boardNames = [];
var switchInput = "Press"; // save "Press", "Release" or "Hover" for params.selectWith and params.selectWithSwitchScan (later is for scanning and Cursor Keys/Dpad)
var guiBoardName;

Notiflix.Confirm.init({
    className: 'notiflix-confirm',
    width: '300px',
    zindex: 19003,
    position: 'center',
    distance: '10px',
    backgroundColor: '#f8f8f8', //'#f8f8f8',
    borderRadius: '25px',
    backOverlay: true,
    backOverlayColor: 'rgba(0,0,0,0.5)',
    rtl: false,
    fontFamily: 'Quicksand',
    cssAnimation: true,
    cssAnimationDuration: 300,
    cssAnimationStyle: 'fade',
    plainText: true,
    titleColor: 'black', // #32c682',
    titleFontSize: '24px', //'16px',
    titleMaxLength: 34,
    messageColor: '#1e1e1e',
    messageFontSize: '14px',
    messageMaxLength: 110,
    buttonsFontSize: '15px',
    buttonsMaxLength: 34,
    okButtonColor: '#f8f8f8',
    okButtonBackground: '#32c682',
    cancelButtonColor: '#f8f8f8',
    cancelButtonBackground: '#a9a9a9',
});
var defaultParams = {
    //    isFullscreen: false,
    boardName: "quick-core-24.obz",
    boardStyle: 'ToolbarBottom', // 0: no toolbar. 1: gap at top. 2: gap at bottom.
    toolbarSize: 'medium',
    textPos: 'top', // 0: text at top. 1: text at bottom. 2: no text
    buttonSpacing: 'medium',
    backgroundColour: 'rgb(180,222,222)',
    highlightColour: 'rgb(255,255,0)',
    highContrast: false,
    inputMethod: 'Touch/Mouse',
    allowZoom: true,
    selectWith: 'Release',
    selectWithSwitchScan: 'Press',
    acceptanceDelay: 0.0,
    acceptanceDelayHover: 1.0,
    touchpadMode: 'Absolute',
    touchpadSize: 3,
    mouseWheel: "Row/Column",
    switchStyle: 'Two switch step',
    speed: 1.0, // on press, on release, on hold for time, no short presses
    vocaliseEachButton: true,
    vocaliseLinkButtons: true,
    autoReturnToHome: false,
    currentVoice: 'Fiona: en',
    voiceRate: 1,
    voicePitch: 1,
    voiceVolume: 1,
    backgroundImage: null,
    tooltips: true,
    buttonEditor: false,
    chkHideSettings: true
};
var params = defaultParams;
var gotOBF = false;

function saveParams() {
    try {
        window.localStorage.setItem("PiCom", JSON.stringify(params));
    } catch (e) {
        localStorage.clear();
    };
}

function boardsLoaded() {
    try {
        for (i = 0; i < boardsJson.count; i++) {
            boardNames[i] = boardsJson.boards[i];
        }
    } catch (error) {}
}

function resetParams() {
    localStorage.clear();
    params = defaultParams;
    loadFileObj();
    setTimeout(function () {
        boardsJson = loadJSON("boards/boards.json", boardsLoaded);
    }, 50);
}

function loadParams() {
    try {
        //        throw "null";
        var s = window.localStorage.getItem("PiCom");
        if (s == null)
            throw "null";
        params = JSON.parse(s);
        boardsJson = loadJSON("boards/boards.json", boardsLoaded);
        loadFileObj();
        if (params.tooltips == null) {
            throw "null";
        }
        if (params.buttonEditor == null || params.chkHideSettings == null) {
            throw "null";
        }
    } catch (e) {
        resetParams();
    };
    //    if (smallPortrait) {
    //        if (params.boardStyle == 'ToolbarBottom')
    //            params.boardStyle = 'ToolbarTop';
    //        params.inputMethod = 'Touch/Mouse';
    //    }
}

var saveFile;

async function doSaveFile() {
    //    const fileHandleOrUndefined = await get("file");
    console.log("Do save file");
    communicatorChanged = false;
    var name = currentCommunicatorName;
    if (boardDiskFormat == 2) {
        var text = JSON.stringify(manifestInfo, null, ' ')
        zip.file("manifest.json", text);
    }
    if (typeof showSaveFilePicker === 'function') {
        saveFile = await window.showSaveFilePicker({
            suggestedName: name,
            startIn: 'downloads',
            types: [{
                accept: {
                    'text/plain': ['.obf', '.obz'],
                }
            }],
        });
    } else {
        saveFileObj(null);
        var text = "";
        if (name.includes(".obf")) {
            text = JSON.stringify(myBoard, null, ' ');
            var file2 = new Blob([text], {
                type: "text/plain"
            });
            var a = document.createElement("a"),
                url = URL.createObjectURL(file2);
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();

            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                idbKeyval.set("type", 'obf');
            }, 0);
        } else { // obz
            zip.generateAsync({
                    type: "blob"
                })
                .then(async function (content) {
                    var file2 = new Blob([content], {
                        type: "text/plain"
                    });
                    var a = document.createElement("a"),
                        url = URL.createObjectURL(file2);
                    a.href = url;
                    a.download = name;
                    document.body.appendChild(a);
                    a.click();

                    setTimeout(function () {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
                        var transaction = db.transaction(["PiComFileStore"], readWriteMode);
                        var put = transaction.objectStore("PiComFileStore").put(content, 'blob');
                        put.onerror = function (event) {
                            console.log("Error csaving object in IndexedDB database");
                        };
                        idbKeyval.set("type", 'obz');
                    }, 0);
                });
        }
        return;
    }

    const file = await saveFile.getFile();
    if (typeof saveFile !== "undefined") {
        if ((await saveFile.queryPermission()) === 'granted') {
            const writable = await saveFile.createWritable();
            //  myBoard.buttons[0].label = "Abc"; // chaamge button text
            if (saveFile.name.includes(".obf")) {
                saveFileObj(null);
                var myJSON = JSON.stringify(myBoard, null, ' ');
                await writable.write(myJSON);
                await writable.close();
                await idbKeyval.set("type", 'obf');
                var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
                var transaction = db.transaction(["PiComFileStore"], readWriteMode);
                var put = transaction.objectStore("PiComFileStore").put(myJSON, 'string');
                put.onerror = function (event) {
                    console.log("Error saving obf in IndexedDB database");
                };
                nowLoad();
            } else { // obz
                zip.generateAsync({
                        type: "blob"
                    })
                    .then(async function (content) {
                        saveFileObj(null);
                        await writable.write(content);
                        await writable.close();
                        var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
                        var transaction = db.transaction(["PiComFileStore"], readWriteMode);
                        var put = transaction.objectStore("PiComFileStore").put(content, 'blob');
                        put.onerror = function (event) {
                            console.log("Error csaving obz in IndexedDB database");
                        };
                        await idbKeyval.set("type", 'obz');
                        nowLoad();
                    });
            }
        }
    }
    //    }
}

function nowLoad() {
    console.log("Now load", nowLoadFile);
    if (nowLoadFile) {
        Notiflix.Confirm.show('Picom', 'Now choose file to import?', 'yes', 'no', function () {
            nowLoadFile = false;
            var fileLoad1 = document.getElementById('file-input').click();
        }, function () {});
        //        alert("Now choose file to import");
    } else
        loadBoard(saveName);
    saveName = "";
}

function showSplashButtons() {
    if (!splash.hidden) {
        settingsSplash.hidden = false;
        startSplash.hidden = false;
        guideSplash.hidden = false;
        helpSplash.hidden = false;
    }
}

var fileObj;
async function loadIt() {
    console.log("Load it");
    showSplashButtons();
    try {
        if (fileObj != null)
            currentCommunicatorName = fileObj.name.substring(fileObj.name.indexOf('/') + 1);
    } catch (e) {
        currentCommunicatorName = "Export";
    }
    try {
        guiBoardName.name = "Current File: " + currentCommunicatorName;
    } catch (e) {}
    if (fileObj.name.includes(".obf")) { // single file
        boardDiskFormat = 0;
        let reader = new FileReader();
        reader.addEventListener('load', function (e) {
            //                let text = e.target.result;
            //                document.querySelector("#file-contents").textContent = text;
            myBoard = JSON.parse(e.target.result);
            jsonLoaded();
            showTabs(0);
            //                    started = true;
        });
        reader.readAsText(fileObj);
    } else { // obz zip file
        boardDiskFormat = 2;
        zip = null;
        zip = new JSZip();
        zip.loadAsync(fileObj).then(function (zipinfo) {
            console.log(zipinfo);
            zipData = zipinfo;
            zipData.file("manifest.json").async("string").then(function (data) {
                manifestInfo = JSON.parse(data);
                homeBoardName = manifestInfo.root;
                currentBoardName = homeBoardName;
                loadZipBoard(homeBoardName);
                //                        started = true;
            }).catch(function (err) {
                console.error("Failed to open OBZ file:", err);
            })

        }).catch(function (err) {
            console.error("Failed to open");
        })
    }
}

function blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

async function loadFileObj() {
    //    await idbKeyval.set("file", obj);
    try {
        fileObj = await idbKeyval.get("file");
        if (fileObj == -1) {
            loadBoard('boards/' + params.boardName);
            console.log("Loading from default communicators");
        } else if (fileObj == null || fileObj == undefined) {
            var filetype = await idbKeyval.get("type");
            var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
            var transaction = db.transaction(["PiComFileStore"], readWriteMode);
            if (filetype == 'obz') {
                transaction.objectStore("PiComFileStore").get("blob").onsuccess = function (event) {
                    if (event.target.result == undefined) {
                        loadBoard('boards/' + params.boardName);
                        console.log("Loading from default communicators as no indexedDb version");
                    } else {
                        console.log("Loading obz from indexedDb");
                        var obzFile = event.target.result;
                        fileObj = blobToFile(event.target.result, "Test.obz");
                        loadIt();
                    }
                };
            } else {
                transaction.objectStore("PiComFileStore").get("string").onsuccess = function (event) {
                    showSplashButtons();
                    if (event.target.result == undefined) {
                        loadBoard('boards/' + params.boardName);
                        console.log("Loading from default communicators as no indexedDb version");
                    } else {
                        console.log("Loading obf from indexedDb");
                        myBoard = JSON.parse(event.target.result);
                        jsonLoaded();
                        showTabs(0);
                    }
                };
            }
            //            loadBoard('boards/' + params.boardName);
        } else {
            console.log("Loading from fileObject (exported one)");
            loadIt();
        }
        //        showTabs(0);
        communicatorChanged = false;
    } catch (e) {
        console.log(e);
    }
}

async function saveFileObj(obj) {
    await idbKeyval.set("file", obj);
}

function showEdit() {
    //    return;
    showTabs(lastTab);
    if (currentY == rows)
        currentY--;
    gui.hide();
    setTimeout(hideSettings, 500);

    function hideSettings() {
        guiVisible = false;
        showGUI = 0;
    }
    saveParams();
    clearTimeout(tmrRepeat);
    if (currentY == maxRow()) {
        currentY = 0;
        removeToolbarHighlight();
        refreshBoard++;
    }
    //    buttonPanel.hidden = false;
    updateEditPanel();
}

function showSettings() {
    showTabs(lastTab);
    if (!buttonPanel.hidden)
        closeEdit();
    if (smallPortrait) {
        gui.width = window.innerWidth;
    } else {
        gui.width = window.innerWidth * .319;
    }
    gui.show();
    guiVisible = true;
}

var nowLoadFile = false;

function askToSave2(s) {
    saveName = "";
    if (communicatorChanged) {
        Notiflix.Confirm.show('Picom', 'Save changed communicator?', 'yes', 'no', function () {
            nowLoadFile = true;
            needToSave();
            saveFileObj(null);
        }, function () {
            nowLoadFile = false;
            saveFileObj(null);
            var fileLoad1 = document.getElementById('file-input').click();
        });
    } else {
        loadBoard(s);
        saveFileObj(-1);
        nowLoadFile = false;
    }
    communicatorChanged = false;
}

var share = {
    Share_Board: async function () {
        console.log("Share now")
        gui.hide();
        setTimeout(hideSettings, 500);

        function hideSettings() {
            showGUI = 0;
        }
        //        const shareData = {
        //            title: 'MDN',
        //            text: 'Learn web development on MDN!',
        //            url: 'https://developer.mozilla.org'
        //        }
        //        try {
        //            await navigator.share(shareData);
        //            //                resultPara.textContent = 'MDN shared successfully';
        //        } catch (err) {
        //            console.log("Error: ", err);
        //
        //        }

        var name = currentCommunicatorName;
        var text = "";
        if (name.includes(".obf")) {
            text = JSON.stringify(myBoard, null, ' ');
            var file2 = new Blob([text], {
                type: "text/plain",
                name: name
            });
            await shareFile(file2);
            nowLoad();
        } else { // obz
            zip.generateAsync({
                    type: "blob"
                })
                .then(async function (content) {
                    var myBlob = new Blob([content], {
                        type: "text/plain"
                    });
                    var file2 = new File([myBlob], name);
                    await shareFile(file2);
                    communicatorChanged = false;
                    saveFileObj(null);
                    var readWriteMode = typeof IDBTransaction.READ_WRITE == "undefined" ? "readwrite" : IDBTransaction.READ_WRITE;
                    var transaction = db.transaction(["PiComFileStore"], readWriteMode);
                    var put = transaction.objectStore("PiComFileStore").put(content, 'blob');
                    put.onerror = function (event) {
                        console.log("Error csaving object in IndexedDB database");
                    };
                    nowLoad();
                });
        }

        showTabs(0);
    }
};



async function shareFile(file) {
    const files = [];
    files.push(file);
    if (navigator.canShare({
            files
        })) {
        try {
            await navigator.share({
                files,
                title: 'PiCom',
                text: 'Share communicator board(s)'
            })
            //            output.textContent = 'Shared!'
        } catch (error) {
            //            output.textContent = `Error: ${error.message}`
        }
    } else {
        //        output.textContent = `Your system doesn't support sharing these files.`
    }
}

function setUpGUI() {
    setUpGUI2();
    setUpPanel();
    //    showSettings2();

    gui = new dat.GUI({
        //        autoPlace: false,
        width: 350
    });
    gui.domElement.id = 'gui';
    gui_container.appendChild(gui.domElement);
    var close = {
        X: function () {
            showTabs(0);
            saveParams();
        }
    };

    //    var c = gui.add(close, 'X').name("🅇");
    gui.__closeButton.hidden = true;

    function setOptions() {
        crosshairs.hidden = true;
        clearTimeout(tmrAccept);
        clearTimeout(tmrHover);
        hoverCount = 0;
        clearTimeout(tmrRepeat);
        switchInput = params.selectWith;
        toolbarPos();
        setTouchpadSize();
        removeToolbarHighlight();
        currentX = 0;
        currentY = 0;
        highLightingRow = false;
        highlightRow = -1;
        switch (params.inputMethod) {
            case 'Touch/Mouse':
                enableZoom.__li.style.display = "";
                touchpadMode.__li.style.display = "none";
                touchpadSize.__li.style.display = "none";
                switchStyle.__li.style.display = "none";
                selectOn.__li.style.display = "";
                selectOnSwitches.__li.style.display = "none";
                speed.__li.style.display = "none";
                mouseWheel.__li.style.display = "none";
                setupToolbarDefault();
                setSelectOptions();
                break;
            case 'Touchpad':
                speed.__min = 0;
                if (params.speed == .2)
                    speed.setValue(0);
                enableZoom.__li.style.display = "none";
                touchpadMode.__li.style.display = "";
                touchpadSize.__li.style.display = "";
                switchStyle.__li.style.display = "none";
                selectOn.__li.style.display = "none";
                selectOnSwitches.__li.style.display = "";
                speed.__li.style.display = "none";
                mouseWheel.__li.style.display = "none";
                setUpForTouchpad();
                setSelectOptions();
                touchpadOptions();
                break;
            case 'Analog Joystick':
                speed.__min = 0;
                if (params.speed == .2)
                    speed.setValue(0);
                enableZoom.__li.style.display = "none";
                touchpadMode.__li.style.display = "none";
                touchpadSize.__li.style.display = "none";
                switchStyle.__li.style.display = "none";
                selectOn.__li.style.display = "";
                selectOnSwitches.__li.style.display = "none";
                speed.__li.style.display = "";
                mouseWheel.__li.style.display = "none";
                setupToolbarDefault();
                setSelectOptions();
                break;
            case 'MouseWheel':
                enableZoom.__li.style.display = "none";
                touchpadMode.__li.style.display = "none";
                touchpadSize.__li.style.display = "none";
                switchStyle.__li.style.display = "none";
                speed.__li.style.display = "none";
                selectOn.__li.style.display = "";
                selectOnSwitches.__li.style.display = "none";
                mouseWheel.__li.style.display = "";
                setupToolbarDefault();
                setSelectOptions();
                mouseWheelChange();
                break;
            case 'Cursor Keys/Dpad':
                enableZoom.__li.style.display = "none";
                touchpadMode.__li.style.display = "none";
                touchpadSize.__li.style.display = "none";
                switchStyle.__li.style.display = "none";
                speed.__li.style.display = "none";
                selectOn.__li.style.display = "none";
                selectOnSwitches.__li.style.display = "";
                mouseWheel.__li.style.display = "none";
                setupToolbarDefault();
                setSelectSwitchOptions();
                highlightRow = -1;
                break;
            case 'Switches':
                speed.__min = .2;
                if (params.speed < .2) // don't allow speed 0 for switches
                    speed.setValue(0.2);
                enableZoom.__li.style.display = "none";
                touchpadMode.__li.style.display = "none";
                touchpadSize.__li.style.display = "none";
                switchStyle.__li.style.display = "";
                speed.__li.style.display = "";
                selectOn.__li.style.display = "none";
                selectOnSwitches.__li.style.display = "";
                mouseWheel.__li.style.display = "none";
                switchInput = params.selectWithSwitchScan;
                setUpForButtons();
                setSelectSwitchOptions();
                switchStyleOptions();
                break;
            case strFace:
                crosshairs.hidden = false;
                speed.__min = 0;
                if (params.speed == .2)
                    speed.setValue(0);
                enableZoom.__li.style.display = "none";
                touchpadMode.__li.style.display = "none";
                touchpadSize.__li.style.display = "none";
                switchStyle.__li.style.display = "none";
                selectOn.__li.style.display = "";
                selectOnSwitches.__li.style.display = "none";
                speed.__li.style.display = "";
                mouseWheel.__li.style.display = "none";
                setSelectOptions();
                setUpForFace();
                initialiseFace();
                break;
            case strFaceExpressions:
                crosshairs.hidden = false;
                speed.__min = 0;
                if (params.speed == .2)
                    speed.setValue(0);
                enableZoom.__li.style.display = "none";
                touchpadMode.__li.style.display = "none";
                touchpadSize.__li.style.display = "none";
                switchStyle.__li.style.display = "none";
                selectOn.__li.style.display = "none";
                selectOnSwitches.__li.style.display = "";
                speed.__li.style.display = "";
                mouseWheel.__li.style.display = "none";
                setSelectSwitchOptions();
                setUpForFace();
                initialiseFace();
                break;
        }
        refreshBoard = 1;
    }

    guiBoardName = gui.addFolder("Current file: " + currentCommunicatorName);
    var boards = guiBoardName.add(params, 'boardName', boardNames).name(strPiComBoards).onChange(function () {
        askToSave('boards/' + params.boardName);
        //        loadBoard();
        //        saveFileObj(null);
    });
    guiBoardName.open();

    var inputOptions = gui.addFolder(strInputOptions);
    var inputMethod;
    if (webViewIOS) //webViewIOS
        inputMethod = inputOptions.add(params, 'inputMethod', ['Touch/Mouse', 'Touchpad', 'Analog Joystick', 'Cursor Keys/Dpad', 'MouseWheel', 'Switches'
                                   // , 'Face', 'Eyes'
                                   ]).name(strInputMethod).onChange(setOptions);
    else
        inputMethod = inputOptions.add(params, 'inputMethod', ['Touch/Mouse', 'Touchpad', 'Analog Joystick', 'Cursor Keys/Dpad', 'MouseWheel', 'Switches', strFace, strFaceExpressions
                                   // , 'Face', 'Eyes'
                                   ]).name(strInputMethod).onChange(setOptions);

    var enableZoom = inputOptions.add(params, 'allowZoom').name(strAllowZoom);

    var touchpadMode = inputOptions.add(params, 'touchpadMode', ['Absolute', 'Joystick']).name(strTouchpadMode).onChange(touchpadOptions);
    //    if (smallPortrait) {
    //        inputMethod.__li.style.display = "none";
    //    }

    function touchpadOptions() {
        currentX = floor(columns / 2);
        currentY = floor(rows / 2);
        switch (params.touchpadMode) {
            case 'Absolute':
                speed.__li.style.display = "none";
                break;
            case 'Joystick':
                speed.__li.style.display = "";
                break;
        }
    }

    var touchpadSize = inputOptions.add(params, 'touchpadSize', 1, 3, 1).name(strTouchpadSize).onChange(setTouchpadSize);

    function setTouchpadSize() {
        switch (params.touchpadSize) {
            case 1:
                leftButton.style.height = "7vh";
                leftButton.style.width = "7vw";
                rightButton.style.height = "7vh";
                rightButton.style.width = "7vw";
                break;
            case 2:
                leftButton.style.height = "8.5vh";
                leftButton.style.width = "8.5vw";
                rightButton.style.height = "8.5vh";
                rightButton.style.width = "8.5vw";
                break;
            case 3:
                leftButton.style.height = "10vh";
                leftButton.style.width = "10vw";
                rightButton.style.height = "10vh";
                rightButton.style.width = "10vw";
                break;
        }
    }

    var mouseWheel = inputOptions.add(params, 'mouseWheel', ['Row/Column', 'Step']).name(strWheelScan).onChange(mouseWheelChange);

    function mouseWheelChange() {
        switch (params.mouseWheel) {
            case 'Row/Column':
                highLightingRow = true;
                highlightRow = 0;
                currentX = -1;
                break;
            case 'Step':
                highLightingRow = false;
                highlightRow = -1;
                currentX = 0;
                currentY = 0;
                break;
        }
        refreshBoard++;
    }

    var switchStyle = inputOptions.add(params, 'switchStyle', ['Two switch step', 'Two switch row/column', 'One switch step', 'One switch row/column', 'One switch overscan']).name(strSwitchStyle).onChange(switchStyleOptions);

    function switchStyleOptions() {
        switchInput = params.selectWithSwitchScan;
        if (params.switchStyle == 'Two switch step' || params.switchStyle == 'Two switch row/column')
            speed.__li.style.display = "none";
        else
            speed.__li.style.display = "";
        switch (params.selectWithSwitchScan) {
            case strPress:
                acceptanceDelay.__li.style.display = "";
                break;
            case strRelease:
                acceptanceDelay.__li.style.display = "none";
                break;
        }
        setRowHighlight();
    }

    var speed = inputOptions.add(params, 'speed', 0.0, 3.0, .2).name(strSpeed);

    var selectOn = inputOptions.add(params, 'selectWith', [strPress, strRelease, strHover]).name(strSelectOn).onChange(setSelectOptions);

    var selectOnSwitches = inputOptions.add(params, 'selectWithSwitchScan', [strPress, strRelease]).name(strSelectOn).onChange(setSelectSwitchOptions);

    function setSelectOptions() {
        switchInput = params.selectWith;
        switch (params.selectWith) {
            //            case 'Click':
            //                acceptanceDelay.__li.style.display = "none";
            //                acceptanceDelayHover.__li.style.display = "none";
            //                break;

            case strPress:
                acceptanceDelay.__li.style.display = "";
                acceptanceDelayHover.__li.style.display = "none";
                if (params.inputMethod == 'Cursor Keys/Dpad')
                    speed.__li.style.display = "none";
                break;
            case strRelease:
                acceptanceDelay.__li.style.display = "none";
                acceptanceDelayHover.__li.style.display = "none";
                if (params.inputMethod == 'Cursor Keys/Dpad')
                    speed.__li.style.display = "none";
                break;
            case strHover:
                acceptanceDelay.__li.style.display = "none";
                acceptanceDelayHover.__li.style.display = "";
                if (params.inputMethod == 'Cursor Keys/Dpad')
                    speed.__li.style.display = "none";
                break;
        }
    }

    function setRowHighlight() {
        clearTimeout(tmrAccept);
        clearTimeout(tmrHover);
        hoverCount = 0;
        clearTimeout(tmrRepeat);
        switch (params.switchStyle) {
            case 'Two switch step':
                highLightingRow = false;
                highlightRow = -1;
                currentX = 0;
                currentY = 0;
                break;
            case 'Two switch row/column':
                highLightingRow = true;
                highlightRow = 0;
                currentX = -1;
                break;
            case 'One switch step':
                highLightingRow = false;
                highlightRow = -1;
                currentX = 0;
                currentY = 0;
                break;
            case 'One switch row/column':
                highLightingRow = true;
                highlightRow = 0;
                currentX = -1;
                startGoingDown()
                break;
            case 'One switch overscan':
                highLightingRow = false;
                highlightRow = -1;
                currentX = 0;
                currentY = 0;
                startGoingFastRight();
                break;
        }
        refreshBoard++;
    }

    function setSelectSwitchOptions() {
        switchInput = params.selectWithSwitchScan;
        switch (params.selectWithSwitchScan) {
            //            case 'Click':
            //                acceptanceDelay.__li.style.display = "none";
            //                acceptanceDelayHover.__li.style.display = "none";
            //                break;
            case strPress:
                acceptanceDelay.__li.style.display = "";
                acceptanceDelayHover.__li.style.display = "none";
                break;
            case strRelease:
                acceptanceDelay.__li.style.display = "none";
                acceptanceDelayHover.__li.style.display = "none";
                break;
        }
    }
    var acceptanceDelay = inputOptions.add(params, 'acceptanceDelay', 0., 2.0, .1).name(strAcceptTimer);
    var acceptanceDelayHover = inputOptions.add(params, 'acceptanceDelayHover', 0.3, 3.0, .1).name(strHoverTimer);

    var visual = gui.addFolder(strVisual);
    //    if (smallPortrait) {
    //        visual.add(params, 'boardStyle', ['Fullscreen', 'ToolbarTop']).name(strToolbar).onChange(toolbarPos);
    //    } else {
    visual.add(params, 'boardStyle', ['Fullscreen', 'ToolbarTop', 'ToolbarBottom']).name(strToolbar).onChange(toolbarPos);
    //    }

    function toolbarPos() {
        switch (params.boardStyle) {
            case 'Fullscreen':
                picomBar.hidden = true;
                gui_container.style.top = '5vh';
                break;
            case 'ToolbarTop':
                picomBar.hidden = false;
                picomBar.style.top = '0vh';
                picomBar.style.bottom = '90vh';
                gui_container.style.top = '5vh';
                break;
            case 'ToolbarBottom':
                picomBar.hidden = false;
                picomBar.style.top = '90vh';
                picomBar.style.bottom = '0vh';
                gui_container.style.top = '5vh';
                break;
        }
        if (params.boardStyle == 'Fullscreen') // full screen
            hWindow = viewport.height;
        else // toolbar
            hWindow = viewport.height * .9;
        windowResized();
        refreshBoard = 1;
    }
    visual.add(params, 'textPos', ['top', 'bottom', 'none']).name(strLabelPosition).onChange(
        function () {
            refreshBoard = 1;
        });
    visual.add(params, 'buttonSpacing', ['small', 'medium', 'large']).name(strSpacing).onChange(
        function () { // grey out background colour if high contrast
            refreshBoard = 1;
        });
    var hc = visual.add(params, 'highContrast').name(strHighContrast).onChange(
        function () { // grey out background colour if high contrast
            if (params.highContrast)
                bcol.__li.style = "opacity: 1.0; filter: grayscale(100%) blur(1px); pointer-events: none;";
            else
                bcol.__li.style = "opacity: 1.0";
            refreshBoard = 1;
        });

    var bcol = visual.addColor(params, 'backgroundColour').name(strBackground).onChange(
        function () {
            backgroundButton.style.backgroundColor = params.backgroundColour;
            homeBtn.style.backgroundColor = params.backgroundColour;
            backspace.style.backgroundColor = params.backgroundColour;
            clearDisplay.style.backgroundColor = params.backgroundColour;
            refreshBoard = 1;
        });

    var highlightColour = visual.addColor(params, 'highlightColour').name(strHighlight).onChange(
        function () {
            refreshBoard = 1;
        });

    changeVoice(params.currentVoice);
    var speechSettings = gui.addFolder(strSpeech);

    const voices = speechSynthesis.getVoices()
    var speechList = [];
    for (i = 0; i < voices.length; i++)
        speechList[i] = voices[i].name + ": " + voices[i].lang;

    speechSettings.add(params, 'currentVoice', speechList).name(strVoice).onChange(
        function () {
            changeVoice(params.currentVoice);
            speech.cancel();
            speech.speak("Hello");
            //            speechSettings.close();
        });
    var pitch = speechSettings.add(params, 'voicePitch', 0.1, 2.0, .1).name(strPitch).onChange(
        function () {
            speech.cancel();
            speech.setPitch(params.voicePitch);
            speech.speak("Hello");
        });;
    var rate = speechSettings.add(params, 'voiceRate', 0.1, 2.0, .1).name(strRate).onChange(
        function () {
            speech.cancel();
            speech.setRate(params.voiceRate);
            speech.speak("Hello");
        });;
    var volume = speechSettings.add(params, 'voiceVolume', 0.0, 1.0, .1).name(strVolume).onChange(
        function () {
            speech.cancel();
            speech.setVolume(params.voiceVolume);
            speech.speak("Hello");
        });

    speechSettings.add(params, 'vocaliseEachButton').name(strSpeakOnSelect);
    speechSettings.add(params, 'vocaliseLinkButtons').name(strSpeakOnLink);
    var advancedSettings = gui.addFolder(strAdvanced);
    advancedSettings.add(params, 'autoReturnToHome').name(strAutoHome);
    advancedSettings.add(params, 'tooltips').name("Show Tooltips").onChange(function () {
        if (params.tooltips)
            root.style.setProperty('--change', 70);
        else
            root.style.setProperty('--change', 0);
    });

    advancedSettings.add(params, 'buttonEditor').name("Button Editor").onChange(function () {
        editButton.hidden = !params.buttonEditor;
    });

    advancedSettings.add(params, 'chkHideSettings').name("Hide Settings Button").onChange(function () {
        settingsSplash.hidden = params.chkHideSettings;
    });

    setOptions();
    gui.hide();
    guiVisible = false;

    document.oncontextmenu = function (e) { // three right clicks to show menu
        e.preventDefault();
        e.stopPropagation();
        currentX = floor(map(event.x, 0, viewport.width, 0, columns));
        currentY = floor(map(event.y, offsetForBoard, viewport.height, 0, rows));

        if (event.x < viewport.width / 4 && event.y < viewport.height / 4) {
            showGUI++;
            console.log("Right clicks: ", showGUI)
            if (showGUI > 2) {
                if (lastTab == 1) // open last tab used
                    showSettings();
                else
                    showEdit();
                showGUI = 0;


                //                buttonPanel.hidden = false; // button to allow editing menu etc
            }
        } else
            showGUI = 0;
    }
}

function changeVoice(name) {
    var s = name;
    s = s.substr(0, s.indexOf(':'));
    // params.currentVoice.substr(params.currentVoice.indexOf(":'));
    speech.setVoice(s);
}
