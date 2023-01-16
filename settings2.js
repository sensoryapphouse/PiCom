var gui2;
var rowsGui;
var columnsGui;
var boardDesc;
var boardName;
var newComDesc;
var newComName;
var addBlank = null;
var blankBoard = null;
var changedBoard;
var currentBoard;

var defaultParams2 = {
    //    isFullscreen: false,
    rows: 3,
    columns: 4,
    name: "",
    description: "",
    theBoardName: "A"
};
var params2 = defaultParams2;

function showSettings2() {
    if (smallPortrait) {
        gui2.width = window.innerWidth * .9;
    } else {
        gui2.width = window.innerWidth * .319;
    }
    gui2.show();
    guiVisible = true;
    rowsGui.setValue(rows);
    columnsGui.setValue(columns);
}

var saveName = "";

function askToSave(s) {
    saveName = s;
    if (communicatorChanged) {
        Notiflix.Confirm.show('Picom', 'Save changed communicator?', 'yes', 'no', function () {
            needToSave();
            saveFileObj(-1);
        }, function () {
            loadBoard(saveName);
            saveFileObj(-1);
        });
    } else {
        loadBoard(s);
        saveFileObj(-1);
    }
    communicatorChanged = false;
}

function needToSave() {
    console.log("Need to save");
    if (webViewIOS)
        share.Share_Board();
    else {
        doSaveFile();
    }
}

var apply1 = { // set size
    Apply: function () {
        var newRows = rowsGui.object.rows;
        var newColumns = columnsGui.object.columns;
        buttonsChanged = true;
        communicatorChanged = true;
        if (rows > newRows) {
            for (i = rows; i > newRows; i--)
                myBoard.grid.order.pop();
            rows = newRows;
        } else if (newRows > rows) {
            for (i = rows; i < newRows; i++) {
                myBoard.grid.order.push([newColumns]);
                for (j = 0; j < newColumns; j++) {
                    var tmp = j.toString() + i.toString();
                    if (buttonIndexFromId("PiCom" + tmp) < 0) {
                        myBoard.buttons[myBoard.buttons.length] = { // initialise new button
                            "id": "PiCom" + tmp,
                            "label": tmp,
                            "image_id": null
                        };
                    }
                    myBoard.grid.order[i][j] = "PiCom" + tmp;
                }
            }
            rows = newRows;
        }
        if (columns > newColumns) {
            for (i = 0; i < rows; i++)
                for (j = columns; j > newColumns; j--)
                    myBoard.grid.order[i].pop();
            columns = newColumns;
        } else if (columns < newColumns) {
            for (i = 0; i < myBoard.grid.rows; i++)
                for (j = columns; j < newColumns; j++) {
                    myBoard.grid.order[i].push(null);
                    var tmp = j.toString() + i.toString();
                    if (buttonIndexFromId("PiCom" + tmp) < 0) {
                        myBoard.buttons[myBoard.buttons.length] = { // initialise new button
                            "id": "PiCom" + tmp,
                            "label": tmp,
                            "image_id": null
                        };
                    }
                    myBoard.grid.order[i][j] = "PiCom" + tmp;
                }
            columns = newColumns;
        }
        myBoard.grid.rows = newRows;
        myBoard.grid.columns = newColumns;
        for (i = 0; i < rows; i++)
            for (j = 0; j < columns; j++)
        ;
        windowResized();
        //            if (typeof myBoard.grid.order[i][j] === 'undefined') {
        //                // does not exist
        //            } else {
        //                // does exist
        //            }
    },
    changeBoard: function () {}
};

function setUpGUI2() {
    gui2 = new dat.GUI({
        //        autoPlace: false,
        width: 350
    });
    gui2.domElement.id = 'gui2';
    gui_container.appendChild(gui2.domElement);

    var close = {
        X: function () {
            showTabs(0);
            gui2.hide();
            setTimeout(hideSettings2, 500);

            function hideSettings2() {
                guiVisible = false;
                showGUI = 0;
            }
        }
    };

    var load = {
        Load_Board_From_File: function () {
            currentZipBoard = '';
            //            gui.hide();
            //            setTimeout(hideSettings, 500);
            //
            //            function hideSettings() {
            //                showGUI = 0;
            //            }
            saveParams();
            if (communicatorChanged) {
                askToSave2(currentCommunicatorName);
            } else {
                showTabs(0);
                var fileLoad1 = document.getElementById('file-input').click();
            }
        }
    };
    //
    //    var editButton = {
    //        Edit_Button: function () {
    //            showEdit();
    //        }
    //    };

    document.getElementById('file-input').addEventListener('change', function (evt) {
        //        var tgt = evt.target || window.event.srcElement,
        //            files = tgt.files;

        fileObj = document.getElementById('file-input').files[0];
        //                loadBoard(fileObj.name,fileObj);
        saveFileObj(fileObj); // remember file object
        currentZipBoard = "";
        loadIt();
        this.value = null;
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
            showTabs(0);
            doSaveFile();
        }
    };

    function gotBlank(s) {
        blankBoard = JSON.parse(s);
        blankBoard.id = boardName.object.name;
        blankBoard.name = boardName.object.name;
        blankBoard.description_html = boardDesc.object.description;
        currentBoardName = blankBoard.name + '.obf';
        var text = JSON.stringify(blankBoard, null, ' ');
        zip.file(currentBoardName, text);
        loadZipBoard(currentBoardName);

        // add board info to manifestInfo.paths.boards
        var k = Object.keys(manifestInfo.paths.boards).length - 1;
        var s = Object.keys(manifestInfo.paths.boards)[k];
        if (s.includes("PicomBrd")) {
            s = s.substr(8);
            s = "PicomBrd" + (parseInt(s) + 1);
        } else
            s = "PicomBrd1";
        manifestInfo.paths.boards[s] = currentBoardName;
        currentX = currentY = 0;
        communicatorChanged = true;
    }


    var apply2 = { // Add board
        Apply: function () {
            if (boardDiskFormat == 0) {
                Notiflix.Confirm.show('Picom', strCannotAdd, strOK, false, false, false, false);
                return;
            }
            if (boardName.object.name == "") {
                Notiflix.Confirm.show('Picom', strTypeName, strOK, false, false, false, false);
                return;
            }
            addBlank = LOADJSON('boards/blank.obf', gotBlank)
        }
    };
    var apply3 = { // New Communicator
        Apply: function () {
            askToSave('boards/blank.obz');
        }
    };

    var apply4 = { // New Communicator
        ChangeSymbolstoSAHstyle: function () {
            changeSymbols();
        },
        MakeImagesLocal: function () {
            embedImages();
        }
    };


    //    var c = gui2.add(close, 'X').name("🅇");
    gui2.__closeButton.hidden = true;

    var openSaveShare = gui2.addFolder("Share");

    if (!(isChromium && isMac)) {
        var shb = openSaveShare.add(share, 'Share_Board').name("Share Communicator");
        shb.__li.style.textAlign = "center";
    }
    var lb = openSaveShare.add(load, 'Load_Board_From_File').name(strLoadBoard);
    lb.__li.style.textAlign = "center";
    if (!webViewIOS) {
        var sb = openSaveShare.add(save, 'Save_Board_To_File').name(strSaveBoard);
        sb.__li.style.textAlign = "center";
    }

    //    advancedSettings.add(editButton, 'Edit_Button').name(strEditButton);
    var addBoard = gui2.addFolder(strAddBoard);
    //    gui2.hide();
    //    guiVisible = false;

    boardName = addBoard.add(params2, 'name').name(strName);
    boardDesc = addBoard.add(params2, 'description').name(strDescription);
    var t2 = addBoard.add(apply2, 'Apply').name(strNewBoard);
    t2.__li.style.textAlign = "center";

    currentBoard = gui2.addFolder(strCurrentBoard);

    changedBoard = currentBoard.add(params2, 'theBoardName', []).name("Change Board").onChange(function () {
        var x = 3;
    });

    rowsGui = currentBoard.add(params2, 'rows', 1, 20, 1).name(strRows);
    columnsGui = currentBoard.add(params2, 'columns', 1, 20, 1).name(strColumns);
    var t1 = currentBoard.add(apply1, 'Apply').name(strSetSize);
    t1.__li.style.textAlign = "center";

    var newCom = gui2.addFolder(strNewCommunicator);
    //    gui2.hide();
    //    guiVisible = false;

    //    newComName = newCom.add(params2, 'name').name("Name");
    //    newComDesc = newCom.add(params2, 'description').name("Description");
    var t3 = newCom.add(apply3, 'Apply').name(strMakeNewCommunicator);
    t3.__li.style.textAlign = "center";


    var globalChange = gui2.addFolder("Advanced [beta]");
    var t4 = globalChange.add(apply4, 'ChangeSymbolstoSAHstyle').name("Change to SAH Symbols");
    t4.__li.style.textAlign = "center";
    var t5 = globalChange.add(apply4, 'MakeImagesLocal').name("Make Images Local");
    t5.__li.style.textAlign = "center";

    //    newComName.setValue("name test");
    //    var s = newComName.object.name;
    openSaveShare.open();
    currentBoard.open();
    addBoard.open();
    newCom.open();
    gui2.hide();
    boardUtils();
}

// *****************************************************************
//
// The functions below are used to rename boards and images to tidy up the names.
// To use, uncomment the function calls and restart PiCom, ideally with console log visible.
//

var changeCount = 1;
async function changeSymbols() {
    Notiflix.Loading.dots('Loading...');
    var s = manifestInfo.paths.boards;
    var images = manifestInfo.paths.images;

    var gotImages = false;
    for (var p in images) {
        gotImages = true;
        var tmp = images[p].substring(images[p].lastIndexOf("/") + 1).replace(/\.[^/.]+$/, "").toLowerCase().trim();
        try {
            let s1 = tmp + '.svg';
            let tf = symbolZip.file(s1);
            //            await timer(20);
            if (tf != null) {
                images[p] = 'SAHsymbols/' + tmp + '.svg';
                console.log("Found: ", tmp);
                Notiflix.Loading.change('Loading: ' + floor(changeCount / 10));
                changeCount++;
                //                pausecomp(20);
                // now delete internal file
                zip.remove(images[p]);
            } else
                console.log("Not Found: ", tmp);
        } catch (e) {
            console.log("Error");
        }

    }
    manifestInfo.paths.images = images;

    if (!gotImages) {
        for (var i = 0; i < myBoard.buttons.length; i++) {
            try {
                var tmpS = 'SAHsymbols/' + myBoard.buttons[i].label.toLowerCase() + '.svg';
                let s1 = myBoard.buttons[i].label.toLowerCase() + '.svg';
                let tf = symbolZip.file(s1);
                //                var tmp = loadImage(tmpS);
                //                pausecomp(100);
                //                await timer(100);
                //            setTimeout(function () {
                if (tf != null) {
                    console.log("Found: ", s1);
                    var imgId = myBoard.buttons[i].image_id;
                    var tmpId = imageIndexFromId(imgId);
                    buttonsChanged = true;
                    myBoard.images[tmpId].path = tmpS;
                    imgs[tmpId] = loadImage(myBoard.images[tmpId].path);
                    delete myBoard.images[tmpId].data;
                    delete myBoard.images[tmpId].url;
                    delete myBoard.images[tmpId].data_url;
                    if (manifestInfo.paths.images.length > 0) {
                        manifestInfo.paths.images[imgId] = tmpS;
                        manifestChanged = true;
                    }
                    // now replace image path and delete image data
                } else
                    console.log("Not Found: ", tmp);
                //            }, 50);
            } catch (e) {}
        }
        var text = JSON.stringify(myBoard, null, ' ');
        pausecomp(200);
        zip.file(currentZipBoard, text);
    } else {
        for (var propt in s) {
            Notiflix.Loading.change('Changing: ' + s[propt]);
            setSymbolInfo(propt, s[propt]);
            await timer(5);
        }
    }

    var text = JSON.stringify(manifestInfo, null, ' ')
    zip.file("manifest.json", text);
    Notiflix.Loading.remove();
    await timer(250);
    currentZipBoard = "";
    loadZipBoard(homeBoardName);
}

async function setSymbolInfo(s2, s1) {
    console.log("Board: ", s1, " Id: ", s2);
    zipData.file(s1).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        for (i = 0; i < tmpBoard.images.length; i++) {
            if (tmpBoard.images[i].hasOwnProperty('data'))
                continue;
            if (tmpBoard.images[i].hasOwnProperty('path')) {
                //                newimagename = "images/" + manifestInfo.paths.images[tmpBoard.images[i].id] ;
                //               console.log("i: ", i, tmpBoard.images[i].path, " -> ", newimagename);
                tmpBoard.images[i].path = manifestInfo.paths.images[tmpBoard.images[i].id];
            }
        }
        // now save board
        var text = JSON.stringify(tmpBoard, null, ' ');
        //        pausecomp(200);
        zip.file(s1, text);
        console.log("Save: ", s1);
        //        pausecomp(200);
    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s1;
    })
}

var counter2;
async function embedImagesForBoard(s) {
    imagesLoaded = false;
    await zipData.file(s).async("string").then(function (data2) {
        //        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        getImages();
    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s;
    })
    await timer(9000);
    var text = JSON.stringify(tmpBoard, null, ' ');
    zip.file(s, text);
    console.log("Save: ", s);
}

var imagesLoaded = false;
async function getImages() {
    for (var i = 0; i < tmpBoard.images.length; i++) {
        counter2 = i;
        var im = tmpBoard.images[i];
        if (im.hasOwnProperty('path')) {
            if (boardDiskFormat == 1)
                continue;
            else if (tmpBoard.images[i].path.includes('SAHsymbols')) {
                console.log("Skip: ", tmpBoard.images[i].path);
                delete tmpBoard.images[i].data;
                delete tmpBoard.images[i].url;
                delete tmpBoard.images[i].data_url;
            }
        } else if (im.hasOwnProperty('data'))
        ;
        else if (im.hasOwnProperty('url')) {
            if (myBoard.images[counter2].url != null) {
                getBase64FromImageUrl(myBoard.images[counter2].url);
                Notiflix.Loading.change('Loading: ' + myBoard.images[counter2].url.replace(/^.*[\\\/]/, ''));
                await timer(100);
            }
        } else
        ;
        //    imgs[i] = null;
    }
    imagesLoaded = true;
}

function getBase64FromImageUrl(url) {
    var img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");
        tmpBoard.images[counter2].data = dataURL;
        console.log("Got data: ", counter2, url);
        //        alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };
    img.src = url;
}

async function embedImages() {
    Notiflix.Loading.dots('Loading...');
    var s = manifestInfo.paths.boards;
    for (var propt in s) {
        console.log("Name: ", s[propt])
        embedImagesForBoard(s[propt]);
        await timer(10000);
    }
    Notiflix.Loading.remove();
}


function boardUtils() {
    setTimeout(function () {
        //        changeSymbols();
        //        updateBoardNames();
        //        updateImageNames();
        //        doRename();
        //        currentBoardName = "";
    }, 1000);
}
var oldValues;
var newValues;
var homeId;

async function updateBoardNames() {
    var s = manifestInfo.paths.boards;
    oldValues = s;
    var IDs = Object.values(s);
    var keys = Object.keys(s);
    newValues = structuredClone(s);
    try {
        for (var propt in s) {
            getBoardInfo(s[propt], propt);
            await timer(300);
        }

        for (var propt in s) {
            setBoardInfo(propt, s[propt]);
            await timer(300);
        }
    } catch (e) {
        var k = 3;
    }
    manifestInfo.root = "TopPage.obf";
    var text = JSON.stringify(manifestInfo, null, ' ')
    zip.file("manifest.json", text);
    var k = 5;
}

async function getBoardInfo(s1, s2) {
    console.log("Board: ", s1, s2);
    if (s1 == manifestInfo.root)
        newValues[s2] = "TopPage.obf";
    zipData.file(s1).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        for (i = 0; i < tmpBoard.buttons.length; i++) {
            if (tmpBoard.buttons[i].hasOwnProperty('load_board')) {
                //                tmpBoard.buttons[i].load_board.
                var filename = tmpBoard.buttons[i].load_board.url.replace(/^.*[\\\/]/, '') + '.obf';
                newValues[tmpBoard.buttons[i].load_board.id] = filename;

            }
        }

    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s;
    })
}

async function setBoardInfo(s2, s1) {
    console.log("Board: ", s1, " Id: ", s2);
    manifestInfo.paths.boards[s2] = newValues[s2];
    zipData.file(s1).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        for (i = 0; i < tmpBoard.buttons.length; i++) {
            if (tmpBoard.buttons[i].hasOwnProperty('load_board')) {
                console.log(tmpBoard.buttons[i].load_board.path, " -> ", tmpBoard.buttons[i].load_board.url.replace(/^.*[\\\/]/, '') + ".obf");
                tmpBoard.buttons[i].load_board.path = tmpBoard.buttons[i].load_board.url.replace(/^.*[\\\/]/, '') + ".obf";
            }
        }
        // now save board and delete old board
        var text = JSON.stringify(tmpBoard, null, ' ');
        zip.file(newValues[s2], text);
        zip.remove(s1);
        console.log("Save: ", newValues[s2]);
    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s;
    })
}

var newImageValues;

async function updateImageNames() {
    var s = manifestInfo.paths.boards;
    var images = manifestInfo.paths.images;
    var IDs = Object.values(images);
    var keys = Object.keys(images);
    newImageValues = structuredClone(images);

    for (var propt in s) {
        getImageInfo(s[propt], propt);
        await timer(300);
    }

    for (var propt in s) {
        setImageInfo(propt, s[propt]);
        await timer(500);
    }

    redoImages();

    var text = JSON.stringify(manifestInfo, null, ' ')
    zip.file("manifest.json", text);
    var k = 5;
}

async function getImageInfo(s1, s2) {
    console.log("Board: ", s1);
    zipData.file(s1).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        for (i = 0; i < tmpBoard.buttons.length; i++) {
            if (tmpBoard.buttons[i].hasOwnProperty('image_id')) {
                //                tmpBoard.buttons[i].load_board.
                var filename = tmpBoard.buttons[i].label;
                newImageValues[tmpBoard.buttons[i].image_id] = filename;
                //                console.log("Label: ", filename);
            }
        }
    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s1;
    })
}

async function setImageInfo(s2, s1) {
    console.log("Board: ", s1, " Id: ", s2);
    manifestInfo.paths.images[s2] = newImageValues[s2];
    zipData.file(s1).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        for (i = 0; i < tmpBoard.images.length; i++) {
            if (tmpBoard.images[i].hasOwnProperty('data'))
                continue;
            if (tmpBoard.images[i].hasOwnProperty('path')) {
                newimagename = "images/" + newImageValues[tmpBoard.images[i].id] + "." + tmpBoard.images[i].path.split('.').pop();
                //               console.log("i: ", i, tmpBoard.images[i].path, " -> ", newimagename);
                tmpBoard.images[i].path = newimagename;

                // tmpBoard.images[counter2].data = "data:image/svg+xml;base64," + data;
                // imageIndexFromId(tmpBoard.images[i].id)
                //zip.file(newimagename, "aGVsbG8gd29ybGQK", {base64: true});
                // tmpBoard.images[counter2].data = "data:image/svg+xml;base64," + data;
                //
            }
        }
        // now save board
        var text = JSON.stringify(tmpBoard, null, ' ');
        pausecomp(200);
        zip.file(s1, text);
        console.log("Save: ", s1);
        pausecomp(200);
    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s1;
    })
}

var counter3;
var currentImg;
async function redoImages(i) {
    var oldManifestImages = structuredClone(manifestInfo.paths.images);
    counter3 = 0;
    try {
        for (var img in manifestInfo.paths.images) {
            //            if (newImageValues[img] == " ")
            //                continue;
            currentImg = img;

            const fileStr = zipData.file(manifestInfo.paths.images[img]).async('base64').then(function (data) {
                newimagename = "images/" + newImageValues[img] + "." + manifestInfo.paths.images[img].split('.').pop();
                manifestInfo.paths.images[img] = newimagename;
                //                zip.file(newimagename, "data:image/png;base64," + data);
                zip.file(newimagename, data, {
                    base64: true
                });
                console.log("getimagedata: ", counter3, newimagename);

            }).catch(function (err) {
                console.error("Failed to open file:", err);
            })
            await timer(50);
            counter3++;
        }
    } catch (e) {
        console.log("Error");
    }
    counter3 = 0;
    for (var img in oldManifestImages) {
        zip.remove(oldManifestImages[img]);
        await timer(5);
        counter3++;
    }
}


var tmpS = "";
async function doRename() {
    var s = manifestInfo.paths.boards;
    for (var propt in s) {
        getBoardName(s[propt]);
        await timer(2000);
        renameBoard(s[propt], tmpS)
        console.log("Name: ", tmpS)
    }

    var text = JSON.stringify(manifestInfo, null, ' ')
    zip.file("manifest.json", text);
    //    renameBoard("board_1_235.obf", "TopPage.obf")
}

function getBoardName(s) {
    zipData.file(s).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        if (tmpBoard.hasOwnProperty('name')) {
            tmpS = tmpBoard.name.substring(tmpBoard.name.indexOf(' ') + 1).replace(/\s/g, '') + ".obf";;
        } else
            tmpS = s;

    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s;
    })
}

var tmpBoard;

const timer = ms => new Promise(res => setTimeout(res, ms))
async function renameBoard(s1, s2) {
    if (!s1.includes("board"))
        return;
    if (manifestInfo.root == s1) {
        manifestInfo.root = s2;
        // change manifest.path.boards
        // here!!!
    }
    for (var propt in manifestInfo.paths.boards) {
        loadBoardFromZip(manifestInfo.paths.boards[propt], s1, s2);
        await timer(25);
        if (manifestInfo.paths.boards[propt] == s1)
            manifestInfo.paths.boards[propt] = s2;
        console.log("Load: ", manifestInfo.paths.boards[propt], manifestInfo.root);
    }
    zip.remove(s1);
}

function loadBoardFromZip(sa, s1, s2) {
    if (sa == null)
        return;
    if (s1 == null)
        return;
    if (s2 == null)
        return;
    zipData.file(sa).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        for (i = 0; i < tmpBoard.buttons.length; i++) {
            if (tmpBoard.buttons[i].hasOwnProperty('load_board')) {
                if (tmpBoard.buttons[i].load_board.path == s1)
                    tmpBoard.buttons[i].load_board.path = s2;
            }
            if (tmpBoard.buttons[i].hasOwnProperty('label')) {
                if (tmpBoard.buttons[i].label == "Top Page")
                    tmpBoard.buttons[i].path = "TopPage.obf";
            }
        }

        // save board back
        var text = JSON.stringify(tmpBoard, null, ' ');
        if (sa == s1) {
            zip.file(s2, text);
            console.log("Save: ", s2);
        } else {
            zip.file(sa, text);
            console.log("Save: ", sa);
        }

    }).catch(function (err) {
        console.error("Failed to open file:", err);
    })
}

var tmpBoard2;

async function renameBoardInZip(s1, s2) {
    zipData.file(s1).async("string").then(function (data2) {
        zip.file(s2, data2);
    }).catch(function (err) {
        console.error("Failed to open file:", err);
    });
    pausecomp(20);
    zip.remove(s1);
}

function pausecomp(ms) {
    ms += new Date().getTime();
    while (new Date() < ms) {}
}
