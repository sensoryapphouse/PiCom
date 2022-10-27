var close;
var instantMsg;
var homeChk;
var backChk;
var clearChk;
var speakChk;
var titleLbl;
var buttonNoLbl;
var upArrow;
var downArrow;
var leftArrow;
var rightArrow;
var btnDeletePic;
var btnLoadPic;
var btnDeleteSnd;
var btnLoadSnd;
var btnStopRec;
var btnRecSnd;
var btnPlay;
var btnFillCol;
var btnEdgeCol;
var imgUparrow;
var imgCurrentImg;
var lblText;
var lblVocal;
var lblLink;
var lblInstant;
var txtText;
var txtVocal;
var txtLink;
var btnIndex;
var buttonsChanged = false;
var communicatorChanged = false;
var options = []; // select options

var lastTab = 1;

function showTabs(i) {
    if (buttonsChanged) {
        communicatorChanged = true;
        buttonsChanged = false;
    }
    if (i >= 1) {
        settingsSplash.hidden = true;
        settingsButton.hidden = false;
        editButton.hidden = !params.buttonEditor;
        closeButton.hidden = false;
        boardButton.hidden = false;
    } else {
        saveParams();
        settingsButton.hidden = true;
        editButton.hidden = true;
        closeButton.hidden = true;
        boardButton.hidden = true;
        buttonPanel.hidden = true;
        if (gui != null) {
            gui.hide();
            gui2.hide();
        }
        setTimeout(hideSettings, 500);
        closeEdit();

        function hideSettings() {
            doSettingsSplash();
            guiVisible = false;
            showGUI = 0;
        }
    }
    switch (i) {
        case 0: // close
            break;
        case 1: // settings
            gui.show();
            gui2.hide();
            buttonPanel.hidden = true;
            settingsButton.style.zIndex = "6002";
            settingsButton.style.backgroundColor = "rgb(240, 240, 240)";
            editButton.style.zIndex = "6001";
            editButton.style.backgroundColor = "rgb(200, 200, 200)";
            boardButton.style.zIndex = "6000";
            boardButton.style.backgroundColor = "rgb(200, 200, 200)";
            break;
        case 2: // button
            gui.hide();
            gui2.hide();
            buttonPanel.hidden = false;
            settingsButton.style.zIndex = "6000";
            settingsButton.style.backgroundColor = "rgb(200, 200, 200)";
            editButton.style.zIndex = "6001";
            editButton.style.backgroundColor = "rgb(240, 240, 240)";
            boardButton.style.zIndex = "6000";
            boardButton.style.backgroundColor = "rgb(200, 200, 200)";
            break;
        case 3: //board
            gui.hide();
            gui2.show();
            buttonPanel.hidden = true;
            settingsButton.style.zIndex = "6000";
            settingsButton.style.backgroundColor = "rgb(200, 200, 200)";
            editButton.style.zIndex = "6001";
            editButton.style.backgroundColor = "rgb(200, 200, 200)";
            boardButton.style.zIndex = "6002";
            boardButton.style.backgroundColor = "rgb(240, 240, 240)";
            break;
    }
}

function closeEdit() {
    if (boardDiskFormat == 2) {
        var text = JSON.stringify(myBoard, null, ' ');
        zip.file(currentBoardName, text);
    }
    buttonPanel.hidden = true;
    stopRecording();
}

function removeOptions(obj) {
    while (obj.options.length) {
        obj.remove(0);
    }
}

function setOptions(obj) {
    var s = manifestInfo.paths.boards;
    var j = 0;
    options[j] = document.createElement("option");
    options[j].text = "";
    options[j].value = j;
    try {
        obj.add(options[j]); //Standard 
    } catch (error) {
        obj.add(options[j]); // IE only
    }
    for (var propt in s) {
        j++
        //        console.log(propt + ': ' + s[propt]);
        options[j] = document.createElement("option");
        options[j].text = s[propt];
        options[j].value = j;
        try {
            obj.add(options[j]); //Standard 
        } catch (error) {
            obj.add(options[j]); // IE only
        }
    }
}

function updateEditPanel() {
    var m = manifestInfo;
    if (buttonPanel.hidden)
        return;
    removeOptions(txtLink);
    titleLbl.innerHTML = currentBoardName.substring(currentBoardName.indexOf('/') + 1);; // myBoard.name
    buttonNoLbl.innerHTML = "(" + (currentX + 1) + ", " + (currentY + 1) + ")";
    if (currentY < 0) {
        currentX = currentY = 0;
    }
    if (smallPortrait) {
        btnIndex = buttonIndexFromId(myBoard.grid.order[currentX][currentY]);
    } else {
        btnIndex = buttonIndexFromId(myBoard.grid.order[currentY][currentX]);
    }
    if (btnIndex < 0) { // everything blank
        imgCurrentImg.src = "";
        imgCurrentImg.style.borderColor = params.backgroundColour; //"rgb(0,0,0)";
        imgCurrentImg.style.backgroundColor = params.backgroundColour; //"rgb(255,255,255)";
        btnFillCol.value = tinyColor(params.backgroundColour).toHexString();
        //'#FFFFFF';
        btnEdgeCol.value = tinyColor(params.backgroundColour).toHexString();
        //'#000000'
        txtText.value = "";
        txtVocal.value = "";
        txtLink.value = "";
        homeChk.checked = false;
        backChk.checked = false;
        speakChk.checked = false;
        clearChk.checked = false;
        instantMsg.checked = false;
        imgCurrentImg.style.backgroundImage = null;
        imgCurrentImg.style.backgroundColor = 'grey';
        var tmp = "PiCom" + currentX.toString() + currentY.toString();
        myBoard.grid.order[currentY][currentX] = tmp;
        myBoard.buttons[myBoard.buttons.length] = { // initialise new button
            "id": tmp,
            "label": "",
            "image_id": null
        };
    } else {
        var imgIndex = imageIndexFromId(myBoard.buttons[btnIndex].image_id);
        if (imgIndex >= 0) {
            var im = imgs[imgIndex].canvas.toDataURL();
            imgCurrentImg.src = im; //'url(' + im + ')';
        } else
            imgCurrentImg.src = "";
        imgCurrentImg.style.borderColor = myBoard.buttons[btnIndex].border_color;
        var c = tinycolor(myBoard.buttons[btnIndex].border_color);
        btnEdgeCol.value = '#' + c.toHex();
        imgCurrentImg.style.backgroundColor = myBoard.buttons[btnIndex].background_color;
        c = tinycolor(myBoard.buttons[btnIndex].background_color);
        btnFillCol.value = '#' + c.toHex();
        lblText.value = myBoard.buttons[btnIndex].text;
        if (myBoard.buttons[btnIndex].hasOwnProperty('label'))
            txtText.value = myBoard.buttons[btnIndex].label;
        else
            txtText.value = "";
        if (myBoard.buttons[btnIndex].hasOwnProperty('vocalization'))
            txtVocal.value = myBoard.buttons[btnIndex].vocalization;
        else
            txtVocal.value = "";

        setOptions(txtLink);
        if (myBoard.buttons[btnIndex].hasOwnProperty('load_board')) {
            for (i = 0; i < options.length; i++)
                if (options[i].text == myBoard.buttons[btnIndex].load_board.path) {
                    txtLink.selectedIndex = i;
                    break;
                }
        } else
            txtLink.selectedIndex = -1;
        //        removeOptions(txtLink);

        homeChk.checked = false;
        backChk.checked = false;
        speakChk.checked = false;
        clearChk.checked = false;

        if (myBoard.buttons[btnIndex].hasOwnProperty('ext_instant'))
            instantMsg.checked = myBoard.buttons[btnIndex].ext_instant;
        else
            instantMsg.checked = false;

        var act = "";
        if (myBoard.buttons[btnIndex].hasOwnProperty('action')) {
            act = myBoard.buttons[btnIndex].action;

        } else if (myBoard.buttons[btnIndex].hasOwnProperty('actions')) {
            act = myBoard.buttons[btnIndex].actions;
        }
        if (act.includes(":home")) {
            homeChk.checked = true;
        }
        if (act.includes(":speak")) {
            speakChk.checked = true
        }
        if (act.includes(":clear")) {
            clearChk.checked = true;
        }
        if (act.includes(":backspace")) {
            backChk.checked = true;
        }
    }
}


function setUpPanel() {
    //buttonPanel.style.left = "130vw";
    //    slideTo(panel, 130);
    titleLbl = document.createElement("LABEL");
    titleLbl.style.position = "absolute";
    titleLbl.style.height = "3vh";
    titleLbl.style.width = "33vw";
    if (smallPortrait) { // multiply left and width by 2.857
        titleLbl.style.width = "99vw";
    }
    titleLbl.style.left = ".5vw";
    titleLbl.style.top = ".8vh";
    titleLbl.style.fontFamily = "sans-serif";
    //        titleLbl.style.font = "ariel, bold, sans-serif";
    titleLbl.style.fontSize = "2.5vh";
    titleLbl.style.color = 'white';
    titleLbl.style.background = 'transparent';
    titleLbl.style.border = "none";
    titleLbl.style.textAlign = "left";
    titleLbl.innerHTML = "Board name";

    buttonNoLbl = document.createElement("LABEL");
    buttonNoLbl.style.position = "absolute";
    buttonNoLbl.style.height = "3vh";
    buttonNoLbl.style.width = "13vw";
    buttonNoLbl.style.left = "21vw";
    if (smallPortrait) { // multiply left and width by 2.857
        buttonNoLbl.style.width = "37.14vw";
        buttonNoLbl.style.left = "60vw";
    }
    buttonNoLbl.style.top = "8vh";
    buttonNoLbl.style.fontSize = "2.5vh";
    buttonNoLbl.style.color = 'black';
    buttonNoLbl.style.background = 'transparent';
    buttonNoLbl.style.border = "none";
    buttonNoLbl.style.textAlign = "center";
    buttonNoLbl.style.verticalAlign = "center";
    buttonNoLbl.innerHTML = "(1, 1)";

    lblText = document.createElement("LABEL");
    lblText.style.position = "absolute";
    lblText.style.height = "3vh";
    lblText.style.width = "11vw";
    lblText.style.left = "1vw";
    if (smallPortrait) { // multiply left and width by 2.857
        lblText.style.width = "31.4vw";
        lblText.style.left = "3vw";
    }
    lblText.style.top = "51.4vh";
    lblText.style.fontFamily = "sans-serif";
    lblText.style.fontSize = "2.5vh";
    lblText.style.color = 'black';
    lblText.style.background = 'transparent';
    lblText.style.border = "none";
    lblText.style.textAlign = "left";
    lblText.style.verticalAlign = "center";
    lblText.innerHTML = strText;

    lblVocal = document.createElement("LABEL");
    lblVocal.style.position = "absolute";
    lblVocal.style.height = "3vh";
    lblVocal.style.width = "11vw";
    lblVocal.style.left = "1vw";
    if (smallPortrait) { // multiply left and width by 2.857
        lblVocal.style.width = "31.4vw";
        lblVocal.style.left = "3vw";
    }
    lblVocal.style.top = "56.4vh";
    lblVocal.style.fontFamily = "sans-serif";
    lblVocal.style.fontSize = "2.5vh";
    lblVocal.style.color = 'black';
    lblVocal.style.background = 'transparent';
    lblVocal.style.border = "none";
    lblVocal.style.textAlign = "left";
    lblVocal.style.verticalAlign = "center";
    lblVocal.innerHTML = strVocalise;

    lblLink = document.createElement("LABEL");
    lblLink.style.position = "absolute";
    lblLink.style.height = "3vh";
    lblLink.style.width = "11vw";
    lblLink.style.left = "1vw";
    if (smallPortrait) { // multiply left and width by 2.857
        lblLink.style.width = "31.4vw";
        lblLink.style.left = "3vw";
    }
    lblLink.style.top = "61.4vh";
    lblLink.style.fontFamily = "sans-serif";
    lblLink.style.fontSize = "2.5vh";
    lblLink.style.color = 'black';
    lblLink.style.background = 'transparent';
    lblLink.style.border = "none";
    lblLink.style.textAlign = "left";
    lblLink.style.verticalAlign = "centre";
    lblLink.innerHTML = strLinkTo;


    txtText = document.createElement("INPUT");
    txtText.style.position = "absolute";
    txtText.style.height = "3vh";
    txtText.style.width = "21.2vw";
    txtText.style.left = "12vw";
    if (smallPortrait) { // multiply left and width by 2.857
        txtText.style.width = "60vw";
        txtText.style.left = "34.3vw";
    }
    txtText.style.top = "51vh";
    txtText.style.fontFamily = "sans-serif";
    txtText.style.fontSize = "2.5vh";
    txtText.style.color = 'black';
    txtText.style.background = 'white';
    txtText.style.border = "inset";
    txtText.value = "";
    txtText.oninput = function (e) {
        myBoard.buttons[btnIndex].label = txtText.value;
        buttonsChanged = true;
        refreshBoard++;
    }

    txtVocal = document.createElement("INPUT");
    txtVocal.style.position = "absolute";
    txtVocal.style.height = "3vh";
    txtVocal.style.width = "21.2vw";
    txtVocal.style.left = "12vw";
    if (smallPortrait) { // multiply left and width by 2.857
        txtVocal.style.width = "60vw";
        txtVocal.style.left = "34.3vw";
    }
    txtVocal.style.top = "56vh";
    txtVocal.style.fontFamily = "sans-serif";
    txtVocal.style.fontSize = "2.5vh";
    txtVocal.style.color = 'black';
    txtVocal.style.background = 'white';
    txtVocal.style.border = "inset";
    txtVocal.value = "";
    txtVocal.oninput = function (e) {
        myBoard.buttons[btnIndex].vocalization = txtVocal.value;
        buttonsChanged = true;
    }

    txtLink = document.createElement("SELECT");
    txtLink.style.position = "absolute";
    txtLink.style.height = "3vh";
    txtLink.style.width = "21.2vw";
    txtLink.style.left = "12vw";
    if (smallPortrait) { // multiply left and width by 2.857
        txtLink.style.width = "61.5vw";
        txtLink.style.left = "34.3vw";
    }
    txtLink.style.top = "61vh";
    txtLink.style.fontFamily = "sans-serif";
    txtLink.style.fontSize = "2.25vh";
    txtLink.style.color = 'black';
    txtLink.style.background = 'white';
    txtLink.style.border = "inset";
    options.length = 0; // clear options
    //    txtLink.options.length = 0; // clear options
    //    setOptions(txtLink);
    txtLink.onchange = function (e) {
        myBoard.buttons[btnIndex].load_board = {
            path: txtLink[txtLink.selectedIndex].innerText
        }
        buttonsChanged = true;
    }

    lblInstant = document.createElement("LABEL");
    lblInstant.style.position = "absolute";
    lblInstant.style.height = "3vh";
    lblInstant.style.width = "29vw";
    lblInstant.style.left = "4vw";
    if (smallPortrait) { // multiply left and width by 2.857
        lblInstant.style.width = "83vw";
        lblInstant.style.left = "11.4vw";
    }
    lblInstant.style.top = "66vh";
    lblInstant.style.fontFamily = "sans-serif";
    lblInstant.style.fontSize = "2.5vh";
    lblInstant.style.color = 'black';
    lblInstant.style.background = 'none';
    lblInstant.style.border = "none";
    lblInstant.style.textAlign = "left";
    lblInstant.style.verticalAlign = "centre";
    lblInstant.innerHTML = strInstandMessage;

    upArrow = document.createElement("INPUT");
    upArrow.style.position = "absolute";
    upArrow.style.height = "8vh";
    upArrow.style.width = "6vw";
    upArrow.style.left = "24.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        upArrow.style.width = "17.14vw";
        upArrow.style.left = "70vw";
    }
    upArrow.style.top = "11vh";
    upArrow.style.border = "none";
    upArrow.style.backgroundColor = "transparent";
    upArrow.style.backgroundSize = "100% 100%";
    upArrow.style.backgroundImage = "url('images/up.png')";
    upArrow.setAttribute("type", "button");
    upArrow.onclick = function (e) {
        stopRecording();
        moveUp();
    }
    downArrow = document.createElement("INPUT");
    downArrow.style.position = "absolute";
    downArrow.style.height = "8vh";
    downArrow.style.width = "6vw";
    downArrow.style.left = "24.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        downArrow.style.width = "17.14vw";
        downArrow.style.left = "70vw";
    }
    downArrow.style.top = "29.5vh";
    downArrow.style.border = "none";
    downArrow.style.backgroundColor = "transparent";
    downArrow.style.backgroundSize = "100% 100%";
    downArrow.style.backgroundImage = "url('images/down.png')";
    downArrow.setAttribute("type", "button");
    downArrow.onclick = function (e) {
        stopRecording();
        moveDown();
    }
    leftArrow = document.createElement("INPUT");
    leftArrow.style.position = "absolute";
    leftArrow.style.height = "8vh";
    leftArrow.style.width = "6vw";
    leftArrow.style.left = "21vw";
    if (smallPortrait) { // multiply left and width by 2.857
        leftArrow.style.width = "17.14vw";
        leftArrow.style.left = "60vw";
    }
    leftArrow.style.top = "20.5vh";
    leftArrow.style.border = "none";
    leftArrow.style.backgroundColor = "transparent";
    leftArrow.style.backgroundSize = "100% 100%";
    leftArrow.style.backgroundImage = "url('images/left.png')";
    leftArrow.setAttribute("type", "button");
    leftArrow.onclick = function (e) {
        stopRecording();
        moveLeft();
    }
    rightArrow = document.createElement("INPUT");
    rightArrow.style.position = "absolute";
    rightArrow.style.height = "8vh";
    rightArrow.style.width = "6vw";
    rightArrow.style.left = "28vw";
    if (smallPortrait) { // multiply left and width by 2.857
        rightArrow.style.width = "17.14vw";
        rightArrow.style.left = "80vw";
    }
    rightArrow.style.top = "20.5vh";
    rightArrow.style.border = "none";
    rightArrow.style.backgroundColor = "transparent";
    rightArrow.style.backgroundSize = "100% 100%";
    rightArrow.style.backgroundImage = "url('images/right.png')";
    rightArrow.setAttribute("type", "button");
    rightArrow.onclick = function (e) {
        stopRecording();
        moveRight();
    }

    instantMsg = document.createElement("INPUT");
    instantMsg.style.position = "absolute";
    instantMsg.style.height = "4vh";
    instantMsg.style.width = "2vw";
    instantMsg.style.left = ".5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        instantMsg.style.width = "5.7vw";
        instantMsg.style.left = "1.43vw";
    }
    instantMsg.style.top = "65vh";
    instantMsg.checked = false;
    instantMsg.setAttribute("type", "checkbox");
    instantMsg.onchange = function (e) {
        myBoard.buttons[btnIndex].ext_instant = instantMsg.checked;
        buttonsChanged = true;
    }

    homeChk = document.createElement("INPUT");
    homeChk.style.position = "absolute";
    homeChk.style.height = "4vh";
    homeChk.style.width = "2vw";
    homeChk.style.left = "2.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        homeChk.style.width = "5.7vw";
        homeChk.style.left = "7.14vw";
    }
    homeChk.style.top = "71.6vh";
    homeChk.checked = false;
    homeChk.setAttribute("type", "checkbox");
    homeChk.onchange = function (e) {
        saveActions();
    }

    backChk = document.createElement("INPUT");
    backChk.style.position = "absolute";
    backChk.style.height = "4vh";
    backChk.style.width = "2vw";
    backChk.style.left = "10.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        backChk.style.width = "5.7vw";
        backChk.style.left = "30vw";
    }
    backChk.style.top = "71.6vh";
    backChk.checked = false;
    backChk.setAttribute("type", "checkbox");
    //        rightArrow.setAttribute("title", 'aaa');
    backChk.onchange = function (e) {
        saveActions();
    }

    clearChk = document.createElement("INPUT");
    clearChk.style.position = "absolute";
    clearChk.style.height = "4vh";
    clearChk.style.width = "2vw";
    clearChk.style.left = "17.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        clearChk.style.width = "5.7vw";
        clearChk.style.left = "50vw";
    }
    clearChk.style.top = "71.6vh";
    clearChk.checked = false;
    clearChk.setAttribute("type", "checkbox");
    clearChk.onchange = function (e) {
        saveActions();
    }

    speakChk = document.createElement("INPUT");
    speakChk.style.position = "absolute";
    speakChk.style.height = "4vh";
    speakChk.style.width = "2vw";
    speakChk.style.left = "26.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        speakChk.style.width = "5.7vw";
        speakChk.style.left = "75.7vw";
    }
    speakChk.style.top = "71.6vh";
    speakChk.checked = false;
    speakChk.setAttribute("type", "checkbox");
    speakChk.onchange = function (e) {
        saveActions();
    }

    function saveActions() {
        if (myBoard.buttons[btnIndex].hasOwnProperty('action')) {
            myBoard.buttons[btnIndex].action = "";
        }
        var s = "";
        if (homeChk.checked)
            s += ":home ";
        if (speakChk.checked)
            s += ":speak "
        if (clearChk.checked)
            s += ":clear ";
        if (backChk.checked)
            s += ":backspace ";
        myBoard.buttons[btnIndex].actions = s;
        buttonsChanged = true;
    }

    close = document.createElement("INPUT");
    close.style.position = "absolute";
    close.style.height = "4vh";
    close.style.width = "3vw";
    close.style.left = "0.25vw";
    close.style.top = "0.25vh";
    close.style.backgroundSize = "100% 100%";
    close.style.backgroundImage = "url('images/close.png')";
    close.setAttribute("type", "button");
    close.onclick = function (e) {
        closeEdit();
        saveParams();
        showTabs(0);
    }

    btnLoadPic = document.createElement('INPUT');
    btnLoadPic.style.position = "absolute";
    btnLoadPic.style.height = "9vh";
    btnLoadPic.style.width = "7vw";
    btnLoadPic.style.left = "12.25vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnLoadPic.style.width = "20vw";
        btnLoadPic.style.left = "35vw";
    }
    btnLoadPic.style.top = "15.5vh";
    btnLoadPic.style.border = "none";
    btnLoadPic.style.borderColor = "transparent";
    btnLoadPic.style.backgroundColor = "transparent";
    btnLoadPic.style.backgroundSize = "100% 100%";
    btnLoadPic.style.backgroundImage = "url('images/LoadPic.png')";
    btnLoadPic.setAttribute("type", "button");
    btnLoadPic.onclick = function (e) {
        var fileLoad = document.getElementById('image-input').click();
        buttonsChanged = true;
    }

    btnDeletePic = document.createElement('INPUT');
    btnDeletePic.style.position = "absolute";
    btnDeletePic.style.height = "7.5vh";
    btnDeletePic.style.width = "5vw";
    btnDeletePic.style.left = "14vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnDeletePic.style.width = "14.3vw";
        btnDeletePic.style.left = "40vw";
    }
    btnDeletePic.style.top = "8.5vh";
    btnDeletePic.style.border = "none";
    btnDeletePic.style.backgroundSize = "100% 100%";
    btnDeletePic.style.backgroundImage = "url('images/trash.png')";
    btnDeletePic.style.backgroundColor = "transparent";
    btnDeletePic.setAttribute("type", "button");
    btnDeletePic.onclick = function (e) {
        myBoard.buttons[btnIndex].image_id = null;
        imgCurrentImg.src = "";
        buttonsChanged = true;
    }

    btnPlay = document.createElement('INPUT');
    btnPlay.style.position = "absolute";
    btnPlay.style.height = "8vh";
    btnPlay.style.width = "5vw";
    btnPlay.style.left = "2vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnPlay.style.width = "14.3vw";
        btnPlay.style.left = "5.7vw";
    }
    btnPlay.style.top = "40.5vh";
    btnPlay.style.border = "none";
    btnPlay.style.borderColor = "transparent";
    btnPlay.style.backgroundSize = "100% 100%";
    btnPlay.style.backgroundImage = "url('images/play.png')";
    btnPlay.style.backgroundColor = "transparent";
    btnPlay.setAttribute("type", "button");
    btnPlay.onclick = function (e) {
        if (myBoard.buttons[btnIndex].hasOwnProperty('sound_id')) {
            var snd = myBoard.buttons[btnIndex].sound_id;
            if (snd != -1) {
                var i = soundIndexFromId(snd);
                var is = myBoard.sounds[i];
                if (is.hasOwnProperty('data'))
                    snd = loadSound(is.data, soundLoaded);
                else if (is.hasOwnProperty('path'))
                    snd = loadSound(boardsFolderName + is.path, soundLoaded);
                else if (is.hasOwnProperty('url'))
                    snd = loadSound(is.url, soundLoaded);
            }
        }
    }

    btnRecSnd = document.createElement('INPUT');
    btnRecSnd.style.position = "absolute";
    btnRecSnd.style.height = "8vh";
    btnRecSnd.style.width = "5vw";
    btnRecSnd.style.left = "8.5vw ";
    if (smallPortrait) { // multiply left and width by 2.857
        btnRecSnd.style.width = "14.3vw";
        btnRecSnd.style.left = "24.3vw";
    }
    btnRecSnd.style.top = "40.5vh";
    btnRecSnd.style.border = "none";
    btnRecSnd.style.backgroundSize = "100% 100%";
    btnRecSnd.style.backgroundImage = "url('images/record.png')";
    btnRecSnd.style.backgroundColor = "transparent";
    btnRecSnd.setAttribute("type", "button");
    btnRecSnd.onclick = function (e) {
        buttonsChanged = true;
        startRecording();
    }

    btnStopRec = document.createElement('INPUT');
    btnStopRec.style.position = "absolute";
    btnStopRec.style.height = "8vh";
    btnStopRec.style.width = "5vw";
    btnStopRec.style.left = "15vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnStopRec.style.width = "14.3vw";
        btnStopRec.style.left = "42.9vw";
    }
    btnStopRec.style.top = "40.5vh";
    btnStopRec.style.border = "none";
    btnStopRec.style.backgroundSize = "100% 100%";
    btnStopRec.style.backgroundImage = "url('images/stop.png')";
    btnStopRec.style.backgroundColor = "transparent";
    btnStopRec.setAttribute("type", "button");
    btnStopRec.style.opacity = .5;
    btnStopRec.onclick = function (e) {
        buttonsChanged = true;
        stopRecording();
    }

    btnDeleteSnd = document.createElement('INPUT');
    btnDeleteSnd.style.position = "absolute";
    btnDeleteSnd.style.height = "8vh";
    btnDeleteSnd.style.width = "5vw";
    btnDeleteSnd.style.left = "28vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnDeleteSnd.style.width = "14.3vw";
        btnDeleteSnd.style.left = "80vw";
    }
    btnDeleteSnd.style.top = "40.5vh";
    btnDeleteSnd.style.border = "none";
    btnDeleteSnd.style.backgroundSize = "100% 100%";
    btnDeleteSnd.style.backgroundImage = "url('images/trash.png')";
    btnDeleteSnd.style.backgroundColor = "transparent";
    btnDeleteSnd.setAttribute("type", "button");
    btnDeleteSnd.onclick = function (e) {
        if (myBoard.buttons[btnIndex].hasOwnProperty('sound_id')) {
            var s = myBoard.buttons[btnIndex].hasOwnProperty('sound_id');
            s = soundIndexFromId(s);
            myBoard.sounds[s] = "";
            delete myBoard.buttons[btnIndex].sound_id;
            buttonsChanged = true;
        }
    }
    document.getElementById('image-input').addEventListener('change', function (evt) {
        var imgFile = document.getElementById('image-input').files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            //            imgCurrentImg.style.backgroundImage = 'url(' + event.target.result + ')';
            imgCurrentImg.src = event.target.result;
            //            var imgIndex = imageIndexFromId(myBoard.buttons[btnIndex].image_id);
            //            var im = imgs[imgIndex].canvas.toDataURL();
            //            imgs[imgIndex] = loadImage(event.target.result, picLoaded);
            var s = "";
            try {
                s = myBoard.images[myBoard.images.length - 1].id;
            } catch (e) {}
            if (s.includes("Picom")) {
                s = s.substr(5);
                s = "Picom" + (parseInt(s) + 1);
            } else
                s = "Picom1";
            myBoard.buttons[btnIndex].image_id = s;
            imgs[imgs.length] = loadImage(event.target.result, picLoaded);
            var tmp = {
                "id": s,
                "width": 250,
                "height": 250,
                "data": event.target.result
            }
            myBoard.images[myBoard.images.length] = tmp;
        });
        reader.readAsDataURL(imgFile);
    });

    function picLoaded() {
        refreshBoard++;
    }

    btnLoadSnd = document.createElement('INPUT');
    btnLoadSnd.style.position = "absolute";
    btnLoadSnd.style.height = "8vh";
    btnLoadSnd.style.width = "5vw";
    btnLoadSnd.style.left = "21.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnLoadSnd.style.width = "14.3vw";
        btnLoadSnd.style.left = "61.4vw";
    }
    btnLoadSnd.style.top = "40.5vh";
    btnLoadSnd.style.border = "none";
    btnLoadSnd.style.borderColor = "transparent";
    btnLoadSnd.style.backgroundSize = "100% 100%";
    btnLoadSnd.style.backgroundImage = "url('images/LoadSnd.png')";
    btnLoadSnd.style.backgroundColor = "transparent";
    btnLoadSnd.setAttribute("type", "button");
    btnLoadSnd.onclick = function (e) {
        var fileLoad = document.getElementById('sound-input').click();
        buttonsChanged = true;
    }
    document.getElementById('sound-input').addEventListener('change', function (evt) {
        var sndFile = document.getElementById('sound-input').files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            var s = "";
            if (myBoard.sounds.length == 0) { // no sounds yet
                s = "Picom1";
            } else {
                if (myBoard.buttons[btnIndex].hasOwnProperty('sound_id')) {
                    s = myBoard.buttons[btnIndex].sound_id;
                    var i = soundIndexFromId(s);
                    myBoard.sounds[i].data = event.target.result;
                    return;
                } else {
                    s = myBoard.sounds[myBoard.sounds.length - 1].id;
                    if (s.includes("Picom")) {
                        s = s.substr(5);
                        s = "Picom" + (parseInt(s) + 1);
                    } else
                        s = "Picom1";
                }
            }

            myBoard.buttons[btnIndex].sound_id = s;
            var tmp = {
                "id": s,
                "data": event.target.result
            }
            myBoard.sounds[myBoard.sounds.length] = tmp;
        });
        reader.readAsDataURL(sndFile);
    });


    btnEdgeCol = document.createElement('INPUT');
    btnEdgeCol.style.position = "absolute";
    btnEdgeCol.style.height = "9vh";
    btnEdgeCol.style.width = "8vw";
    btnEdgeCol.style.left = "11.1vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnEdgeCol.style.width = "22.8vw";
        btnEdgeCol.style.left = "31.7vw";
    }
    btnEdgeCol.style.top = "27vh";
    btnEdgeCol.style.border = "none";
    btnEdgeCol.style.backgroundSize = "100% 100%";
    btnEdgeCol.style.backgroundImage = "url('images/colours.png')";
    btnEdgeCol.setAttribute("type", "color");
    btnEdgeCol.onchange = function (e) {
        imgCurrentImg.style.borderColor = btnEdgeCol.value;
        myBoard.buttons[btnIndex].border_color = imgCurrentImg.style.borderColor;
        buttonsChanged = true;
    }
    btnEdgeCol.oninput = function (e) {
        imgCurrentImg.style.borderColor = btnEdgeCol.value;
        myBoard.buttons[btnIndex].border_color = imgCurrentImg.style.borderColor;
        buttonsChanged = true;
    }

    btnFillCol = document.createElement('INPUT');
    btnFillCol.style.position = "absolute";
    btnFillCol.style.height = "9vh";
    btnFillCol.style.width = "8vw";
    btnFillCol.style.left = "1.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        btnFillCol.style.width = "22.8vw";
        btnFillCol.style.left = "4.3vw";
    }
    btnFillCol.style.top = "27vh";
    btnFillCol.style.border = "none";
    btnFillCol.style.backgroundSize = "100% 100%";
    btnFillCol.style.backgroundImage = "url('images/colours.png')";
    btnFillCol.setAttribute("type", "color");
    btnFillCol.onchange = function (e) {
        imgCurrentImg.style.backgroundColor = btnFillCol.value;
        myBoard.buttons[btnIndex].background_color = imgCurrentImg.style.backgroundColor;
        buttonsChanged = true;
    }
    btnFillCol.oninput = function (e) {
        imgCurrentImg.style.backgroundColor = btnFillCol.value;
        myBoard.buttons[btnIndex].background_color = imgCurrentImg.style.backgroundColor;
        buttonsChanged = true;
    }

    imgCurrentImg = document.createElement('IMG');
    imgCurrentImg.style.position = "absolute";
    imgCurrentImg.style.height = "15vh";
    imgCurrentImg.style.width = "11vw";
    imgCurrentImg.style.left = "1.5vw";
    if (smallPortrait) { // multiply left and width by 2.857
        imgCurrentImg.style.width = "31.4vw";
        imgCurrentImg.style.left = "4.3vw";
    }
    imgCurrentImg.style.top = "9vh";
    imgCurrentImg.style.borderWidth = '2.5px';
    imgCurrentImg.style.borderStyle = 'solid';
    imgCurrentImg.style.borderColor = 'red';
    imgCurrentImg.style.backgroundColor = "black";
    imgCurrentImg.style.backgroundSize = "100% 100%";
    //imgCurrentImg.style.backgroundImage = "url('images/splash.jpg')";

    imgUparrow = document.createElement('INPUT');
    imgUparrow.style.position = "absolute";
    imgUparrow.style.height = "6vh";
    imgUparrow.style.width = "1.4vw";
    imgUparrow.style.left = "4.9vw";
    if (smallPortrait) { // multiply left and width by 2.857
        imgUparrow.style.width = "4vw";
        imgUparrow.style.left = "14vw";
    }
    imgUparrow.style.top = "22vh";
    imgUparrow.style.border = "none";
    imgUparrow.style.borderColor = "transparent";
    imgUparrow.style.backgroundSize = "100% 100%";
    imgUparrow.style.backgroundColor = "transparent";
    imgUparrow.style.backgroundImage = "url('images/uparrow.png')";

    //    buttonPanel.appendChild(close);
    buttonPanel.appendChild(imgCurrentImg);

    buttonPanel.appendChild(titleLbl);
    buttonPanel.appendChild(lblText);
    buttonPanel.appendChild(lblVocal);
    buttonPanel.appendChild(lblLink);
    buttonPanel.appendChild(lblInstant);
    buttonPanel.appendChild(buttonNoLbl);
    buttonPanel.appendChild(upArrow);
    buttonPanel.appendChild(downArrow);
    buttonPanel.appendChild(leftArrow);
    buttonPanel.appendChild(rightArrow);
    buttonPanel.appendChild(imgUparrow);
    buttonPanel.appendChild(btnLoadPic);
    buttonPanel.appendChild(btnDeletePic);
    buttonPanel.appendChild(btnPlay);
    buttonPanel.appendChild(btnRecSnd);
    buttonPanel.appendChild(btnStopRec);
    buttonPanel.appendChild(btnLoadSnd);
    buttonPanel.appendChild(btnDeleteSnd);
    buttonPanel.appendChild(btnEdgeCol);
    buttonPanel.appendChild(btnFillCol);
    buttonPanel.appendChild(txtText);
    buttonPanel.appendChild(txtVocal);
    buttonPanel.appendChild(txtLink);
    buttonPanel.appendChild(instantMsg);
    buttonPanel.appendChild(homeChk);
    buttonPanel.appendChild(backChk);
    buttonPanel.appendChild(clearChk);
    buttonPanel.appendChild(speakChk);
    //    buttonPanel.style.left = "50vw"

    function onDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function onDragOver(e) {

        //        currentX = floor(map(e.x, 0, windowWidth, 0, columns));
        //        currentY = floor(map(e.y, offsetForBoard, windowHeight, 0, rows));
        e.stopPropagation();
        e.preventDefault();
    }

    function onDragLeave(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    var fileType;

    function onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        if (buttonPanel.hidden)
            return;
        buttonsChanged = true;
        btnIndex = buttonIndexFromId(myBoard.grid.order[currentY][currentX]);
        if (btnIndex < 0)
            return;
        //        setFiles(e.dataTransfer.files);

        if (e.dataTransfer.files.length > 0) {
            var imgFile = e.dataTransfer.files[0];
            filetype = imgFile.type
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                if (filetype.toLowerCase().includes("image")) {
                    imgCurrentImg.src = event.target.result;
                    var s = myBoard.images[myBoard.images.length - 1].id;
                    if (s.includes("Picom")) {
                        s = s.substr(5);
                        s = "Picom" + (parseInt(s) + 1);
                    } else
                        s = "Picom1";
                    myBoard.buttons[btnIndex].image_id = s;
                    imgs[imgs.length] = loadImage(event.target.result, pictureLoaded);
                    tmpPicture = {
                        "id": s,
                        "width": 250,
                        "height": 250,
                        "data": event.target.result
                    }
                }
                if (filetype.toLowerCase().includes("audio")) {

                    var s = ""
                    if (myBoard.sounds.length == 0) { // no sounds yet
                        s = "Picom1";
                    } else {
                        if (myBoard.buttons[btnIndex].hasOwnProperty('sound_id')) {
                            s = myBoard.buttons[btnIndex].sound_id;
                            var i = soundIndexFromId(s);
                            myBoard.sounds[i].data = event.target.result;
                            return;
                        } else {
                            s = myBoard.sounds[myBoard.sounds.length - 1].id;
                            if (s.includes("Picom")) {
                                s = s.substr(5);
                                s = "Picom" + (parseInt(s) + 1);
                            } else
                                s = "Picom1";
                        }
                    }
                    myBoard.buttons[btnIndex].sound_id = s;
                    var tmp = {
                        "id": s,
                        "data": event.target.result
                    }
                    myBoard.sounds[myBoard.sounds.length] = tmp;
                }

            });
            reader.readAsDataURL(imgFile);
        } else {
            //            var imageUrl = e.dataTransfer.getData('URL');
            var html = e.dataTransfer.getData('text/html');
            var src = new DOMParser().parseFromString(html, "text/html").querySelector('img').src;
            imgCurrentImg.src = src;
            var s = "";
            try {
                s = myBoard.images[myBoard.images.length - 1].id;
            } catch (e) {}
            if (s.includes("Picom")) {
                s = s.substr(5);
                s = "Picom" + (parseInt(s) + 1);
            } else
                s = "Picom1";
            myBoard.buttons[btnIndex].image_id = s;
            tmpPicture = {
                "id": s,
                "width": 250,
                "height": 250,
                "data": src
            }
            imgs[imgs.length] = loadImage(src, pictureLoaded);
        }
        return false;
    }

    var tmpPicture;

    function pictureLoaded() {
        refreshBoard++;
        myBoard.images[myBoard.images.length] = tmpPicture;
    }

    document.addEventListener('dragenter', onDragEnter, false);
    document.addEventListener('dragover', onDragOver, false);
    document.addEventListener('dragleave', onDragLeave, false);
    document.addEventListener('drop', onDrop, false);

    if (params.tooltips) {
        MarcTooltips.add([leftArrow, rightArrow, upArrow, downArrow], 'Use arrow keys to choose button to edit', {
            position: 'up',
            className: 'green'
        });
//        MarcTooltips.add(closeButton, 'Close editor', {
//            position: 'down',
//            align: 'left',
//            className: 'green'
//        });
        MarcTooltips.add(settingsButton, 'Settings editor', {
            position: 'down',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(editButton, 'Button editor', {
            position: 'down',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(boardButton, 'Board editor', {
            position: 'down',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(imgCurrentImg, 'Preview image, background and border colours', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });


        MarcTooltips.add(btnDeletePic, 'Delete image from button', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(btnLoadPic, 'Choose image for button (can also drag and drop images)', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(btnFillCol, 'Set background colour for button', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(btnEdgeCol, 'Set border colour for button', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });

        MarcTooltips.add(btnDeleteSnd, 'Delete sound file for button', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(btnLoadSnd, 'Load sound file from disc', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(btnStopRec, 'Stop recording sound file', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(btnRecSnd, 'Record sound fine for button', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(btnPlay, 'Play sound file', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });

        MarcTooltips.add(txtText, 'Text label for button', {
            position: 'right',
            align: 'right',
            className: 'green'
        });
        MarcTooltips.add(txtVocal, 'Alternative text to speak when button pressed', {
            position: 'right',
            align: 'right',
            className: 'green'
        });
        MarcTooltips.add(txtLink, 'Link to other board', {
            position: 'right',
            align: 'right',
            className: 'green'
        });

        MarcTooltips.add(instantMsg, 'Speak this button but do not add to message bar', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(homeChk, 'Button goes to home page', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(backChk, 'Delete last button in message bar', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(clearChk, 'Clear message bar', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
        MarcTooltips.add(speakChk, 'Speak message bar', {
            position: 'bottom',
            align: 'left',
            className: 'green'
        });
    }

}
