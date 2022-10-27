var gui2;
var rowsGui;
var columnsGui;
var boardDesc;
var boardName;
var newComDesc;
var newComName;
var addBlank = null;
var blankBoard = null;

var defaultParams2 = {
    //    isFullscreen: false,
    rows: 3,
    columns: 4,
    name: "",
    description: ""
};
var params2 = defaultParams2;

function showSettings2() {
    if (smallPortrait) {
        gui2.width = window.innerWidth;
    } else {
        gui2.width = window.innerWidth * .319;
    }
    gui2.show();
    guiVisible = true;
    rowsGui.setValue(rows);
    columnsGui.setValue(columns);
}

function askToSave(s) {
    if (communicatorChanged) {
        Notiflix.Confirm.show('Picom', 'Current communicator has been changed.  Do you want to save those changes?', 'Yes', 'No', function () {
            needToSave();
        }, function () {
            loadBoard(s);
            saveFileObj(null);
        });
    } else {
        loadBoard(s);
        saveFileObj(null);
    }
    communicatorChanged = false;
}

function needToSave() {
    doSaveFile();
}

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
        communicatorChanged = true;
    }


    var apply2 = { // Add board
        Apply: function () {
            if (boardDiskFormat == 0) {
                Notiflix.Confirm.show('Picom', 'Cannot add another board to single board communicator (obf)', "OK", false, false, false, false);
                return;
            }
            if (boardName.object.name == "") {
                Notiflix.Confirm.show('Picom', 'Please type board name', "OK", false, false, false, false);
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

    //    var c = gui2.add(close, 'X').name("🅇");
    gui2.__closeButton.hidden = true;

    var currentBoard = gui2.addFolder("Current Board");
    rowsGui = currentBoard.add(params2, 'rows', 1, 20, 1).name("Rows");
    columnsGui = currentBoard.add(params2, 'columns', 1, 20, 1).name("Columns");
    var t1 = currentBoard.add(apply1, 'Apply').name("Set Board Size");
    t1.__li.style.textAlign = "center";

    var addBoard = gui2.addFolder("Add Board");
    //    gui2.hide();
    //    guiVisible = false;

    boardName = addBoard.add(params2, 'name').name("Name");
    boardDesc = addBoard.add(params2, 'description').name("Description");
    var t2 = addBoard.add(apply2, 'Apply').name("Make New Board");
    t2.__li.style.textAlign = "center";

    var newCom = gui2.addFolder("New Communicator");
    //    gui2.hide();
    //    guiVisible = false;

    //    newComName = newCom.add(params2, 'name').name("Name");
    //    newComDesc = newCom.add(params2, 'description').name("Description");
    var t3 = newCom.add(apply3, 'Apply').name("Make New Communicator");
    t3.__li.style.textAlign = "center";

    //    newComName.setValue("name test");
    //    var s = newComName.object.name;
    currentBoard.open();
    addBoard.open();
    newCom.open();
    gui2.hide();
//    setTimeout(function () {
//        embedImages();
//    }, 1000);
}

var counter2;
async function embedImagesForBoard(s) {
    await zipData.file(s).async("string").then(function (data2) {
        //        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        getImages()
    }).catch(function (err) {
        console.error("Failed to open file:", err);
        tmpS = s;
    })
    await timer(5000);
    var text = JSON.stringify(tmpBoard, null, ' ');
    zip.file(s, text);
    console.log("Save: ", s);
}


async function getImages() {
    for (var i = 0; i < tmpBoard.images.length; i++) {
        await timer(100);
        counter2 = i;
        var im = tmpBoard.images[i];
        if (im.hasOwnProperty('data'))
            continue;
        else if (im.hasOwnProperty('path')) {
            if (boardDiskFormat == 1)
                continue;
            else { // now read images from zip
                var ext = re.exec(tmpBoard.images[i].path)[1];
                if (ext == 'svg') {
                    const fileStr2 = await zipData.file(tmpBoard.images[i].path).async('base64').then(function (data) {
                        tmpBoard.images[counter2].data = "data:image/svg+xml;base64," + data;
                        console.log(counter2);
                    }).catch(function (err) {
                        console.error("Failed to open file:", err);
                    })
                } else {

                    const fileStr = await zipData.file(tmpBoard.images[i].path).async('base64').then(function (data) {
                        tmpBoard.images[counter2].data = "data:image/" + ext + ";base64," + data;
                        console.log(counter2);
                    }).catch(function (err) {
                        console.error("Failed to open file:", err);
                    })

                }
            }
        } else if (im.hasOwnProperty('url'))
        ; //                            imgs[i] = await loadImage(myBoard.images[i].url, imageLoaded);
        else
        ;
        //    imgs[i] = null;
    }

}

async function embedImages() {
    var s = manifestInfo.paths.boards;
    for (var propt in s) {
        embedImagesForBoard(s[propt]);
        await timer(5000);
        console.log("Name: ", tmpS)
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
