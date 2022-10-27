var currentZipBoard = "";
var tmpBoard;

function renameBoard(s1, s1) {
    if (manifestInfo.root == s1)
        manifestInfo.root = s2;
    var s = manifestInfo.paths.boards;
    for (var propt in s) {
        loadBoardFromZip(s[propt], s1, s2);
    }
}

function loadBoardFromZip(sa, s1, s2) {
    zipData.file(sa).async("string").then(function (data2) {
        //        console.log(data2);
        tmpBoard = JSON.parse(data2);
        for (i = 0; i < tmpBoard.buttons.length; i++)
            if (tmpBoard.buttons[i].hasOwnProperty('load_board')) {
                if (tmpBoard.buttons[i].load_board.path == s1)
                    tmpBoard.buttons[i].load_board.path = s2;
            }

        // save board back
        var text = JSON.stringify(tmpBoard, null, ' ');
        zip.file(sa, text);
    }).catch(function (err) {
        console.error("Failed to open file:", err);
    })
}
