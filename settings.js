var speech = new p5.Speech(); // new P5.Speech object
var jsonString;
var boardsJson;
var boardNames = [];
var switchInput = "Press"; // save "Press", "Release" or "Hover" for params.selectWith and params.selectWithSwitchScan (later is for scanning and Cursor Keys/Dpad)

var defaultParams = {
    //    isFullscreen: false,
    boardName: "communikate-20.obz",
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
    backgroundImage: null
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
    boardsJson = loadJSON("boards/boards.json", boardsLoaded);
}

function loadParams() {
    try {
        //        throw "null";
        var s = newObject = window.localStorage.getItem("PiCom");
        if (s == null)
            throw "null";
        params = JSON.parse(s);
        loadFileObj();
        boardsJson = loadJSON("boards/boards.json", boardsLoaded);
    } catch (e) {
        resetParams();
    };
}

var saveFile;

async function doSaveFile() {
    const fileHandleOrUndefined = await get("file");
    var name = "MyPicomBoard.obf";
    if (boardDiskFormat == 2)
        name = "MyPicomBoard.obz";
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
                var myJSON = JSON.stringify(myBoard, null, ' ');
                await writable.write(myJSON);
                await writable.close();
            } else { // obz
                zip.generateAsync({
                        type: "blob"
                    })
                    .then(async function (content) {
                        await writable.write(content);
                        await writable.close();
                    });
            }
        }
    }
    //    }
}


var fileObj;
async function loadIt() {
    if (fileObj.name.includes(".obf")) { // single file
        boardDiskFormat = 0;
        let reader = new FileReader();
        reader.addEventListener('load', function (e) {
            //                let text = e.target.result;
            //                document.querySelector("#file-contents").textContent = text;
            myBoard = JSON.parse(e.target.result);
            currentBoardName = fileObj.name.substring(fileObj.name.indexOf('/') + 1);
            jsonLoaded();
            //                    started = true;
        });
        reader.readAsText(fileObj);
    } else { // obz zip file
        boardDiskFormat = 2;
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

async function loadFileObj() {
    //    await idbKeyval.set("file", obj);
    try {
        fileObj = await idbKeyval.get("file");
        if (fileObj == null || fileObj == undefined)
            loadBoard('boards/' + params.boardName);
        else {
            loadIt();
        }

    } catch (e) {
        console.log(e);
    }
}

async function saveFileObj(obj) {
    await idbKeyval.set("file", obj);
}

function showEdit() {
    //    return;
    showTabs(1);
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
    if (currentY == rows) {
        currentY = 0;
        removeToolbarHighlight();
        refreshBoard++;
    }
    buttonPanel.hidden = false;
    updateEditPanel();
}

function showSettings() {
    showTabs(1);
    if (!buttonPanel.hidden)
        closeEdit();
    gui.width = window.innerWidth * .32;
    gui.show();
    guiVisible = true;
}

function setUpGUI() {
    setUpPanel();

    gui = new dat.GUI({
        //        autoPlace: false,
        width: 350
    });
    gui.domElement.id = 'gui';
    gui_container.appendChild(gui.domElement);
    var close = {
        X: function () {
            showTabs(0);
            gui.hide();
            setTimeout(hideSettings, 500);

            function hideSettings() {
                guiVisible = false;
                showGUI = 0;
            }
            saveParams();
        }
    };


    var load = {
        Load_Board_From_File: function () {
            gui.hide();
            setTimeout(hideSettings, 500);

            function hideSettings() {
                guiVisible = false;
                showGUI = 0;
            }
            saveParams();
            var fileLoad = document.getElementById('file-input').click();
        }
    };

    var editButton = {
        Edit_Button: function () {
            showEdit();
        }
    };


    document.getElementById('file-input').addEventListener('change', function (evt) {
        //        var tgt = evt.target || window.event.srcElement,
        //            files = tgt.files;

        fileObj = document.getElementById('file-input').files[0];
        //                loadBoard(fileObj.name,fileObj);
        saveFileObj(fileObj); // remember file object
        loadIt();
    });

    var save = {
        Save_Board_To_File: function () {
            gui.hide();
            setTimeout(hideSettings, 500);

            function hideSettings() {
                guiVisible = false;
                showGUI = 0;
            }
            saveParams();
            if (boardDiskFormat == 0) // obf
                boardDiskFormat = 0;
            else if (boardDiskFormat == 2) // obz
                boardDiskFormat = 2;
            doSaveFile();
        }
    };

    var c = gui.add(close, 'X');
    gui.__closeButton.hidden = true;

    function setOptions() {
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

    var boards = gui.add(params, 'boardName', boardNames).name(strPiComBoards).onChange(function () {
        loadBoard('boards/' + params.boardName);
        saveFileObj(null);
    });
    var inputOptions = gui.addFolder(strInputOptions);
    var inputMethod = inputOptions.add(params, 'inputMethod', ['Touch/Mouse', 'Touchpad', 'Analog Joystick', 'Cursor Keys/Dpad', 'MouseWheel', 'Switches', strFace, strFaceExpressions
                                   // , 'Face', 'Eyes'
                                   ]).name(strInputMethod).onChange(setOptions);

    var enableZoom = inputOptions.add(params, 'allowZoom').name(strAllowZoom);

    var touchpadMode = inputOptions.add(params, 'touchpadMode', ['Absolute', 'Joystick']).name(strTouchpadMode).onChange(touchpadOptions);


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
    visual.add(params, 'boardStyle', ['Fullscreen', 'ToolbarTop', 'ToolbarBottom']).name(strToolbar).onChange(toolbarPos);

    function toolbarPos() {
        switch (params.boardStyle) {
            case 'Fullscreen':
                picomBar.hidden = true;
                gui_container.style.top = '0vh';
                break;
            case 'ToolbarTop':
                picomBar.hidden = false;
                picomBar.style.top = '0vh';
                picomBar.style.bottom = '90vh';
                gui_container.style.top = '0vh';
                break;
            case 'ToolbarBottom':
                picomBar.hidden = false;
                picomBar.style.top = '90vh';
                picomBar.style.bottom = '0vh';
                gui_container.style.top = '0vh';
                break;
        }
        if (params.boardStyle == 'Fullscreen') // full screen
            hWindow = windowHeight;
        else // toolbar
            hWindow = windowHeight * .9;
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

    var speechList = [];
    for (i = 0; i < speech.voices.length; i++)
        speechList[i] = speech.voices[i].name + ": " + speech.voices[i].lang;

    speechSettings.add(params, 'currentVoice', speechList).name(strVoice).onChange(
        function () {
            changeVoice(params.currentVoice);
            speech.stop();
            speech.speak("Hello");
            //            speechSettings.close();
        });
    var pitch = speechSettings.add(params, 'voicePitch', 0.1, 2.0, .1).name(strPitch).onChange(
        function () {
            speech.stop();
            speech.setPitch(params.voicePitch);
            speech.speak("Hello");
        });;
    var rate = speechSettings.add(params, 'voiceRate', 0.1, 2.0, .1).name(strRate).onChange(
        function () {
            speech.stop();
            speech.setRate(params.voiceRate);
            speech.speak("Hello");
        });;
    var volume = speechSettings.add(params, 'voiceVolume', 0.0, 1.0, .1).name(strVolume).onChange(
        function () {
            speech.stop();
            speech.setVolume(params.voiceVolume);
            speech.speak("Hello");
        });;

    speechSettings.add(params, 'vocaliseEachButton').name(strSpeakOnSelect);
    speechSettings.add(params, 'vocaliseLinkButtons').name(strSpeakOnLink);
    var advancedSettings = gui.addFolder(strAdvanced);
    advancedSettings.add(params, 'autoReturnToHome').name(strAutoHome);
    setOptions();
    gui.hide();
    guiVisible = false;

    advancedSettings.add(load, 'Load_Board_From_File').name(strLoadBoard);
    advancedSettings.add(save, 'Save_Board_To_File').name(strSaveBoard);
    //    advancedSettings.add(editButton, 'Edit_Button').name(strEditButton);

    document.oncontextmenu = function (e) { // three right clicks to show menu
        e.preventDefault();
        e.stopPropagation();
        currentX = floor(map(event.x, 0, windowWidth, 0, columns));
        currentY = floor(map(event.y, offsetForBoard, windowHeight, 0, rows));

        if (event.x < windowWidth / 4 && event.y < windowHeight / 4) {
            showGUI++;
            console.log("Right clicks: ", showGUI)
            if (showGUI > 2) {
                closeEdit(); // hide button editor if showing
                showSettings();
                showGUI++;
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
