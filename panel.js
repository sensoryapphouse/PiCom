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
var btnLoadPic;
var btnLoadSnd;
var btnPlay;
var btnFillCol;
var btnEdgeCol;
var imgColours;
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


function showTabs(i) {
    if (i == 1) {
        settingsButton.hidden = false;
        editButton.hidden = false;
    } else {
        settingsButton.hidden = true;
        editButton.hidden = true;
        if (buttonsChanged) {
            closeEdit();
            buttonsChanged = false;
        }
        settingsButton.style.zIndex = "15001";
        editButton.style.zIndex = "15000";
    }
}

function closeEdit() {
    if (boardDiskFormat == 2) {
        var text = JSON.stringify(myBoard, null, ' ');
        zip.file(currentBoardName, text);
    }
    buttonPanel.hidden = true;
}

function updateEditPanel() {
    if (buttonPanel.hidden)
        return;
    titleLbl.innerHTML = currentBoardName.substring(currentBoardName.indexOf('/') + 1);; // myBoard.name
    buttonNoLbl.innerHTML = "(" + (currentX + 1) + ", " + (currentY + 1) + ")";
    btnIndex = buttonIndexFromId(myBoard.grid.order[currentY][currentX]);
    if (btnIndex < 0) { // everything blank
        imgColours.style.borderColor = "rgb(0,0,0)";
        imgColours.style.backgroundColor = "rgb(255,255,255)";
        btnFillCol.value = '#FFFFFF';
        btnEdgeCol.value = '#000000'
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
    } else {
        var imgIndex = imageIndexFromId(myBoard.buttons[btnIndex].image_id);
        var im = imgs[imgIndex].canvas.toDataURL();
        imgCurrentImg.src = im; //'url(' + im + ')';

        imgColours.style.borderColor = myBoard.buttons[btnIndex].border_color;
        var c = tinycolor(myBoard.buttons[btnIndex].border_color);
        btnEdgeCol.value = '#' + c.toHex();
        imgColours.style.backgroundColor = myBoard.buttons[btnIndex].background_color;
        c = tinycolor(myBoard.buttons[btnIndex].background_color);
        btnFillCol.value = '#' + c.toHex();
        imgCurrentImg.style.backgroundColor = myBoard.buttons[btnIndex].background_color;
        lblText.value = myBoard.buttons[btnIndex].text;
        if (myBoard.buttons[btnIndex].hasOwnProperty('label'))
            txtText.value = myBoard.buttons[btnIndex].label;
        else
            txtText.value = "";
        if (myBoard.buttons[btnIndex].hasOwnProperty('vocalization'))
            txtVocal.value = myBoard.buttons[btnIndex].vocalization;
        else
            txtVocal.value = "";
        if (myBoard.buttons[btnIndex].hasOwnProperty('load_board'))
            txtLink.value = myBoard.buttons[btnIndex].load_board.path;
        else
            txtLink.value = "";

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
    titleLbl.style.height = "3.5vh";
    titleLbl.style.width = "27vw";
    titleLbl.style.left = "4vw";
    titleLbl.style.top = "1.75vh";
    //    titleLbl.style.font = "ariel, bold, sans-serif";
    titleLbl.style.fontSize = "3.5vh";
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
    buttonNoLbl.style.top = "8vh";
    buttonNoLbl.style.fontSize = "3vh";
    buttonNoLbl.style.color = 'white';
    buttonNoLbl.style.background = 'transparent';
    buttonNoLbl.style.border = "none";
    buttonNoLbl.style.textAlign = "center";
    buttonNoLbl.style.verticalAlign = "centre";
    buttonNoLbl.innerHTML = "(1, 1)";

    lblText = document.createElement("LABEL");
    lblText.style.position = "absolute";
    lblText.style.height = "3vh";
    lblText.style.width = "11vw";
    lblText.style.left = ".7vw";
    lblText.style.top = "51.4vh";
    lblText.style.fontSize = "3vh";
    lblText.style.color = 'white';
    lblText.style.background = 'transparent';
    lblText.style.border = "none";
    lblText.style.textAlign = "centre";
    //    lblText.style.verticalAlign = "centre";
    lblText.innerHTML = strText;

    lblVocal = document.createElement("LABEL");
    lblVocal.style.position = "absolute";
    lblVocal.style.height = "3vh";
    lblVocal.style.width = "11vw";
    lblVocal.style.left = ".7vw";
    lblVocal.style.top = "56.4vh";
    lblVocal.style.fontSize = "3vh";
    lblVocal.style.color = 'white';
    lblVocal.style.background = 'transparent';
    lblVocal.style.border = "none";
    lblVocal.style.textAlign = "left";
    lblVocal.style.verticalAlign = "centre";
    lblVocal.innerHTML = strVocalise;

    lblLink = document.createElement("LABEL");
    lblLink.style.position = "absolute";
    lblLink.style.height = "3vh";
    lblLink.style.width = "11vw";
    lblLink.style.left = ".7vw";
    lblLink.style.top = "61.4vh";
    lblLink.style.fontSize = "3vh";
    lblLink.style.color = 'white';
    lblLink.style.background = 'transparent';
    lblLink.style.border = "none";
    lblLink.style.textAlign = "left";
    lblLink.style.verticalAlign = "centre";
    lblLink.innerHTML = strLinkTo;


    txtText = document.createElement("INPUT");
    txtText.style.position = "absolute";
    txtText.style.height = "3vh";
    txtText.style.width = "20.8vw";
    txtText.style.left = "12vw";
    txtText.style.top = "51vh";
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
    txtVocal.style.width = "20.8vw";
    txtVocal.style.left = "12vw";
    txtVocal.style.top = "56vh";
    txtVocal.style.fontSize = "2.5vh";
    txtVocal.style.color = 'black';
    txtVocal.style.background = 'white';
    txtVocal.style.border = "inset";
    txtVocal.value = "";
    txtVocal.oninput = function (e) {
        myBoard.buttons[btnIndex].vocalization = txtVocal.value;
        buttonsChanged = true;
    }

    txtLink = document.createElement("INPUT");
    txtLink.style.position = "absolute";
    txtLink.style.height = "3vh";
    txtLink.style.width = "20.8vw";
    txtLink.style.left = "12vw";
    txtLink.style.top = "61vh";
    txtLink.style.fontSize = "2.5vh";
    txtLink.style.color = 'black';
    txtLink.style.background = 'white';
    txtLink.style.border = "inset";
    txtLink.value = "";
    txtLink.oninput = function (e) {
        if (myBoard.buttons[btnIndex].hasOwnProperty('load_board'))
            myBoard.buttons[btnIndex].load_board.path = txtLink.value;
        else {
            myBoard.buttons[btnIndex].load_board = {
                "path": txtLink.value
            }
            buttonsChanged = true;
        }
    }

    lblInstant = document.createElement("LABEL");
    lblInstant.style.position = "absolute";
    lblInstant.style.height = "3vh";
    lblInstant.style.width = "29vw";
    lblInstant.style.left = "4.3vw";
    lblInstant.style.top = "66vh";
    lblInstant.style.fontSize = "3vh";
    lblInstant.style.color = 'white';
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
    upArrow.style.top = "12vh";
    upArrow.style.border = "none";
    upArrow.style.backgroundColor = "transparent";
    upArrow.style.backgroundSize = "100% 100%";
    upArrow.style.backgroundImage = "url('images/up.png')";
    upArrow.setAttribute("type", "button");
    upArrow.onclick = function (e) {
        moveUp();
    }
    downArrow = document.createElement("INPUT");
    downArrow.style.position = "absolute";
    downArrow.style.height = "8vh";
    downArrow.style.width = "6vw";
    downArrow.style.left = "24.5vw";
    downArrow.style.top = "30vh";
    downArrow.style.border = "none";
    downArrow.style.backgroundColor = "transparent";
    downArrow.style.backgroundSize = "100% 100%";
    downArrow.style.backgroundImage = "url('images/down.png')";
    downArrow.setAttribute("type", "button");
    downArrow.onclick = function (e) {
        moveDown();
    }
    leftArrow = document.createElement("INPUT");
    leftArrow.style.position = "absolute";
    leftArrow.style.height = "8vh";
    leftArrow.style.width = "6vw";
    leftArrow.style.left = "21vw";
    leftArrow.style.top = "21vh";
    leftArrow.style.border = "none";
    leftArrow.style.backgroundColor = "transparent";
    leftArrow.style.backgroundSize = "100% 100%";
    leftArrow.style.backgroundImage = "url('images/left.png')";
    leftArrow.setAttribute("type", "button");
    leftArrow.onclick = function (e) {
        moveLeft();
    }
    rightArrow = document.createElement("INPUT");
    rightArrow.style.position = "absolute";
    rightArrow.style.height = "8vh";
    rightArrow.style.width = "6vw";
    rightArrow.style.left = "28vw";
    rightArrow.style.top = "21vh";
    rightArrow.style.border = "none";
    rightArrow.style.backgroundColor = "transparent";
    rightArrow.style.backgroundSize = "100% 100%";
    rightArrow.style.backgroundImage = "url('images/right.png')";
    rightArrow.setAttribute("type", "button");
    rightArrow.onclick = function (e) {
        moveRight();
    }

    instantMsg = document.createElement("INPUT");
    instantMsg.style.position = "absolute";
    instantMsg.style.height = "4vh";
    instantMsg.style.width = "8vw";
    instantMsg.style.left = "-2.3vw";
    instantMsg.style.top = "64.8vh";
    instantMsg.checked = false;
    instantMsg.setAttribute("type", "checkbox");
    instantMsg.onchange = function (e) {
        myBoard.buttons[btnIndex].ext_instant = instantMsg.checked;
        buttonsChanged = true;
    }

    homeChk = document.createElement("INPUT");
    homeChk.style.position = "absolute";
    homeChk.style.height = "4vh";
    homeChk.style.width = "8vw";
    homeChk.style.left = "-1vw";
    homeChk.style.top = "71.6vh";
    homeChk.checked = false;
    homeChk.setAttribute("type", "checkbox");
    homeChk.onchange = function (e) {
        saveActions();
    }

    backChk = document.createElement("INPUT");
    backChk.style.position = "absolute";
    backChk.style.height = "4vh";
    backChk.style.width = "8vw";
    backChk.style.left = "7vw";
    backChk.style.top = "71.6vh";
    backChk.checked = false;
    backChk.setAttribute("type", "checkbox");
    backChk.onchange = function (e) {
        saveActions();
    }

    clearChk = document.createElement("INPUT");
    clearChk.style.position = "absolute";
    clearChk.style.height = "4vh";
    clearChk.style.width = "8vw";
    clearChk.style.left = "14vw";
    clearChk.style.top = "71.6vh";
    clearChk.checked = false;
    clearChk.setAttribute("type", "checkbox");
    clearChk.onchange = function (e) {
        saveActions();
    }

    speakChk = document.createElement("INPUT");
    speakChk.style.position = "absolute";
    speakChk.style.height = "4vh";
    speakChk.style.width = "8vw";
    speakChk.style.left = "23vw";
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
        showTabs(0);
    }

    btnLoadPic = document.createElement('INPUT');
    btnLoadPic.style.position = "absolute";
    btnLoadPic.style.height = "10vh";
    btnLoadPic.style.width = "8vw";
    btnLoadPic.style.left = "11vw";
    btnLoadPic.style.top = "12vh";
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

    document.getElementById('image-input').addEventListener('change', function (evt) {
        var imgFile = document.getElementById('image-input').files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            //            imgCurrentImg.style.backgroundImage = 'url(' + event.target.result + ')';
            imgCurrentImg.src = event.target.result;
            //            var imgIndex = imageIndexFromId(myBoard.buttons[btnIndex].image_id);
            //            var im = imgs[imgIndex].canvas.toDataURL();
            //            imgs[imgIndex] = loadImage(event.target.result, picLoaded);
            var s = myBoard.images[myBoard.images.length - 1].id;
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
    btnLoadSnd.style.height = "9vh";
    btnLoadSnd.style.width = "7vw";
    btnLoadSnd.style.left = "12vw";
    btnLoadSnd.style.top = "27vh";
    btnLoadSnd.style.border = "none";
    btnLoadSnd.style.borderColor = "transparent";
    btnLoadSnd.style.backgroundSize = "100% 100%";
    btnLoadSnd.style.backgroundImage = "url('images/LoadSnd.png')";
    btnLoadSnd.setAttribute("type", "button");
    btnLoadSnd.onclick = function (e) {
        var fileLoad = document.getElementById('sound-input').click();
        buttonsChanged = true;
    }
    document.getElementById('sound-input').addEventListener('change', function (evt) {
        var sndFile = document.getElementById('sound-input').files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            var s = ""
            if (myBoard.sounds.length == 0) { // no sounds yet
                s = "Picom1";
            } else {
                s = myBoard.sounds[myBoard.sounds.length - 1].id;
                if (s.includes("Picom")) {
                    s = s.substr(5);
                    s = "Picom" + (parseInt(s) + 1);
                } else
                    s = "Picom1";
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

    btnPlay = document.createElement('INPUT');
    btnPlay.style.position = "absolute";
    btnPlay.style.height = "8vh";
    btnPlay.style.width = "4vw";
    btnPlay.style.left = "4vw";
    btnPlay.style.top = "27vh";
    btnPlay.style.border = "none";
    btnPlay.style.borderColor = "transparent";
    btnPlay.style.backgroundSize = "100% 100%";
    btnPlay.style.backgroundImage = "url('images/Play.png')";
    btnPlay.setAttribute("type", "button");
    btnPlay.onclick = function (e) {
        //        buttonPanel.hidden = true;
    }


    btnEdgeCol = document.createElement('INPUT');
    btnEdgeCol.style.position = "absolute";
    btnEdgeCol.style.height = "9vh";
    btnEdgeCol.style.width = "7vw";
    btnEdgeCol.style.left = "2vw";
    btnEdgeCol.style.top = "39.9vh";
    btnEdgeCol.style.border = "outset";
    btnEdgeCol.style.backgroundSize = "100% 100%";
    btnEdgeCol.style.backgroundImage = "url('images/colours.png')";
    btnEdgeCol.setAttribute("type", "color");
    btnEdgeCol.onchange = function (e) {
        imgColours.style.borderColor = btnEdgeCol.value;
        myBoard.buttons[btnIndex].border_color = imgColours.style.borderColor;
        buttonsChanged = true;
    }
    btnEdgeCol.oninput = function (e) {
        imgColours.style.borderColor = btnEdgeCol.value;
        myBoard.buttons[btnIndex].border_color = imgColours.style.borderColor;
        buttonsChanged = true;
    }

    btnFillCol = document.createElement('INPUT');
    btnFillCol.style.position = "absolute";
    btnFillCol.style.height = "9vh";
    btnFillCol.style.width = "7vw";
    btnFillCol.style.left = "25.5vw";
    btnFillCol.style.top = "39.9vh";
    btnFillCol.style.border = "outset";
    btnFillCol.style.backgroundSize = "100% 100%";
    btnFillCol.style.backgroundImage = "url('images/colours.png')";
    btnFillCol.setAttribute("type", "color");
    btnFillCol.onchange = function (e) {
        imgColours.style.backgroundColor = btnFillCol.value;
        myBoard.buttons[btnIndex].background_color = imgColours.style.backgroundColor;
        buttonsChanged = true;
    }
    btnFillCol.oninput = function (e) {
        imgColours.style.backgroundColor = btnFillCol.value;
        myBoard.buttons[btnIndex].background_color = imgColours.style.backgroundColor;
        buttonsChanged = true;
    }

    imgColours = document.createElement('IMG');
    imgColours.style.position = "absolute";
    imgColours.style.height = "8.6vh";
    imgColours.style.width = "8.5vw";
    imgColours.style.left = "13.8vw";
    imgColours.style.top = "39.9vh";
    imgColours.style.borderWidth = '2.5px';
    imgColours.style.borderStyle = 'solid';
    imgColours.style.borderColor = 'red';
    imgColours.style.backgroundColor = "white";
    imgColours.style.backgroundSize = "100% 100%";
    imgColours.style.backgroundImage = "url('images/colour2.png')";

    imgCurrentImg = document.createElement('IMG');
    imgCurrentImg.style.position = "absolute";
    imgCurrentImg.style.height = "12vh";
    imgCurrentImg.style.width = "10vw";
    imgCurrentImg.style.left = "2vw";
    imgCurrentImg.style.top = "10vh";
    imgCurrentImg.style.borderWidth = '1px';
    imgCurrentImg.style.borderStyle = 'inset';
    //    imgCurrentImg.style.borderColor = 'none';
    imgCurrentImg.style.backgroundColor = "black";
    imgCurrentImg.style.backgroundSize = "100% 100%";
    //imgCurrentImg.style.backgroundImage = "url('images/splash.jpg')";

    buttonPanel.appendChild(close);
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
    buttonPanel.appendChild(btnLoadPic);
    buttonPanel.appendChild(btnPlay);
    buttonPanel.appendChild(btnLoadSnd);
    buttonPanel.appendChild(btnEdgeCol);
    buttonPanel.appendChild(btnFillCol);
    buttonPanel.appendChild(imgColours);
    buttonPanel.appendChild(txtText);
    buttonPanel.appendChild(txtVocal);
    buttonPanel.appendChild(txtLink);
    buttonPanel.appendChild(instantMsg);
    buttonPanel.appendChild(homeChk);
    buttonPanel.appendChild(backChk);
    buttonPanel.appendChild(clearChk);
    buttonPanel.appendChild(speakChk);

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
                        s = myBoard.sounds[myBoard.sounds.length - 1].id;
                        if (s.includes("Picom")) {
                            s = s.substr(5);
                            s = "Picom" + (parseInt(s) + 1);
                        } else
                            s = "Picom1";
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
            var s = myBoard.images[myBoard.images.length - 1].id;
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
}
