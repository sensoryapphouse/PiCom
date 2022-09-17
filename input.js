var tmrAccept = null;
var tmrHover = null;
var tmrRepeat = null;

var tchX = 0;
var tchY = 0;
var tchCount;

function touchStarted(event) {
    console.log("Touch started");
    if (event.touches.length > 1) {
        if (event.touches[0].clientX > windowWidth * .75 && event.touches[0].clientY < windowHeight * .25) {
            showGUI++;
            console.log("Right clicks: ", showGUI)
            if (showGUI > 2) {
                buttonPanel.hidden = true; // hide button editor if showing
                gui.show();
                guiVisible = true;
                showGUI++;
            }
            return;
        } else
            showGUI = 0;
        return;
    }
    var element = document.elementsFromPoint(event.touches[0].pageX, event.touches[0].pageY);
    tchCount = element.length;
    if (tchCount <= 3) {
        try {
            event.stopPropagation();
            //            event.preventDefault();
        } catch (e) {}
    }

    //   console.log(element.length);
    tchX = event.x = event.touches[0].clientX;
    tchY = event.y = event.touches[0].clientY;
    mousePressed(event);
    //    return false;
}

function touchMoved(event) {
    console.log("Touch moved");
    var element = document.elementsFromPoint(event.touches[0].pageX, event.touches[0].pageY);
    tchCount = element.length;
    if (tchCount <= 3) {
        try {
            event.stopPropagation();
            event.preventDefault();
        } catch (e) {}
    }
    //    event.preventDefault();
    tchX = event.x = event.touches[0].clientX;
    tchY = event.y = event.touches[0].clientY;
    mouseMoved(event);
    console.log("Touch: ", currentX, currentY);
    //    return false;
}

function touchEnded(event) {
    console.log("Touch ended");
    if (event.touches.length > 1) {
        return;
    }
    if (tchCount <= 3) {
        try {
            event.stopPropagation();
            event.preventDefault();
        } catch (e) {}
    }
    event.x = tchX;
    event.y = tchY;
    mouseReleased(event);
    //    return false;
}

function mousePressed(event) {
    if (!splash.hidden)
        return;
    if (event.button == 2 || !buttonPanel.hidden)
        return;
    try {
        event.stopPropagation();
        //        event.preventDefault();
    } catch (e) {}
    switch (params.inputMethod) {
        case 'Touch/Mouse':
        case 'Touchpad':
        case 'Analog Joystick':
        case 'MouseWheel':
        case 'Cursor Keys/Dpad':
            if (switchInput == "Press") {
                if (params.acceptanceDelay == 0)
                    mseEvent(event);
                else
                    tmrAccept = setTimeout(function () {
                        mseEvent(event);
                    }, params.acceptanceDelay * 1000);
            }
            break;
        case 'Switches':
            if (switchInput == "Press") {
                mseEvent(event);
            }
            break;
    }
}

function mouseReleased(event) {
    if (!splash.hidden)
        return;
    clearTimeout(tmrAccept);
    if (event.button == 2 || !buttonPanel.hidden)
        return;
    switch (params.inputMethod) {
        case 'Touch/Mouse':
        case 'Touchpad':
        case 'Analog Joystick':
        case 'MouseWheel':
        case 'Cursor Keys/Dpad':
            if (switchInput == "Release") {
                mseEvent(event);
            }
            break;
        case 'Switches':
            if (switchInput == "Release") {
                mseEvent(event);
            }
            break;
    }
}

function mseEvent(event) {
    if (guiVisible)
        return;
    if (params.inputMethod == "MouseWheel") {
        if (params.mouseWheel == "Step")
            doClick(0);
        else { // row/column
            if (highLightingRow) {
                currentY = highlightRow;
                currentX = 0;
                highlightRow = -1;
                removeToolbarHighlight();
                if (currentY == rows) {
                    toolbarHighlightItem(0);
                }
            } else {
                doClick(0);
                highlightRow = 0;
                currentX = -1;
                removeToolbarHighlight();
            }
            highLightingRow = !highLightingRow;
        }
        refreshBoard++;
        return;
    }
    var xIndex;
    var yIndex;
    if (params.boardStyle == 'ToolbarTop') {
        xIndex = map(event.x, 0, windowWidth, 0, columns);
        yIndex = map(event.y, offsetForBoard, windowHeight, 0, rows);
        console.log(floor(xIndex), floor(yIndex));
    } else {
        xIndex = map(event.x, 0, windowWidth, 0, columns);
        yIndex = map(event.y, 0, hWindow, 0, rows);
        console.log(floor(xIndex), floor(yIndex));
    }
    xIndex = floor(xIndex);
    yIndex = floor(yIndex);
    console.log(xIndex, yIndex);
    currentX = xIndex;
    currentY = yIndex;
    if (yIndex >= 0 && yIndex < columns)
        doClick(event.button);
    refreshBoard++;
}

function mouseDragged(event) {
    mouseMoved(event);
}

function mouseMoved(event) {
    if (!buttonPanel.hidden)
        return;
    switch (params.inputMethod) {
        case 'Touch/Mouse':
        case 'Touchpad':
        case 'Analog Joystick':
        case 'MouseWheel':
        case 'Cursor Keys/Dpad':
            break;
        case 'Switches':
            if (switchInput == "Hover") {
                doClick(0);
            }
            break;
    }
    if (params.inputMethod == 'MouseWheel')
        return;
    if (guiVisible)
        return;
    if (params.boardStyle == 'ToolbarTop') {
        currentX = floor(map(event.x, 0, windowWidth, 0, columns));
        currentY = floor(map(event.y, offsetForBoard, windowHeight, 0, rows));
        if (currentX != lastX || currentY != lastY) {
            if (tmrAccept != null) {
                clearTimeout(tmrAccept);
                tmrAccept = null;
            }
            if (tmrHover != null) {
                clearTimeout(tmrHover);
                tmrHover = null;
            }
            refreshBoard++;
        }
    } else {
        currentX = floor(map(event.x, 0, windowWidth, 0, columns));
        currentY = floor(map(event.y, 0, hWindow, 0, rows));
        if (currentX != lastX || currentY != lastY) {
            clearTimeout(tmrHover);
            tmrHover = null;
            clearTimeout(tmrAccept);
            tmrAccept = null;
            if (tmrAccept != null) {

            }
            refreshBoard++;
            if (switchInput == "Hover") {
                tmrHover = setTimeout(function () {
                    doClick(0);
                    refreshBoard++;
                }, params.acceptanceDelayHover * 1000);
            }
        }
    }
    lastX = currentX;
    lastY = currentY;
}

function keyPressed() {
    switch (keyCode) {
        case LEFT_ARROW:
            if (switchInput == "Press") {
                if (params.acceptanceDelay == 0)
                    moveLeft();
                else
                    tmrAccept = setTimeout(function () {
                        moveLeft();
                    }, params.acceptanceDelay * 1000);
            }
            break;
        case RIGHT_ARROW:
            if (switchInput == "Press") {
                if (params.acceptanceDelay == 0)
                    moveRight();
                else
                    tmrAccept = setTimeout(function () {
                        moveRight();
                    }, params.acceptanceDelay * 1000);
            }
            break;
        case UP_ARROW:
            if (switchInput == "Press") {
                if (params.acceptanceDelay == 0)
                    moveUp();
                else
                    tmrAccept = setTimeout(function () {
                        moveUp();
                    }, params.acceptanceDelay * 1000);
            }
            break;
        case DOWN_ARROW:
            if (switchInput == "Press") {
                if (params.acceptanceDelay == 0)
                    moveDown();
                else
                    tmrAccept = setTimeout(function () {
                        moveDown();
                    }, params.acceptanceDelay * 1000);
            }
            break;
        case 13: // return
        case 51: // 3
        case 52: // 4
            if (switchInput == "Press") {
                if (params.acceptanceDelay == 0)
                    doClick(1);
                else
                    tmrAccept = setTimeout(function () {
                        doClick(1);
                    }, params.acceptanceDelay * 1000);
            }
            break;
        case 32: // space
        case 49: // 1
        case 50: // 2
            if (switchInput == "Press") {
                if (params.acceptanceDelay == 0)
                    doClick(0);
                else
                    tmrAccept = setTimeout(function () {
                        doClick(0);
                    }, params.acceptanceDelay * 1000);
            }
            break;
            //        case 76: // L - load
            //            if (keyIsDown(SHIFT)) {
            //                console.log("SHIFT_CTRL_L");
            //            }
            //            break;
        case 83: // S - settings
            if (keyIsDown(CONTROL)) {
                console.log("CTRL_S");
                showSettings();
            }
            break;
        case 69: // E - edit
            if (keyIsDown(CONTROL)) {
                console.log("SHIFT_E");
                showEdit();
            }
            break;
    }
    //    console.log(keyCode);
    if (event.ctrlKey) {
        event.preventDefault();
    }
    //    return (false);
}

function keyReleased() {
    clearTimeout(tmrAccept);
    console.log("Key Released", keyCode)
    switch (keyCode) {
        case LEFT_ARROW:
            if (switchInput == "Release") {
                moveLeft();
            }
            break;
        case RIGHT_ARROW:
            if (switchInput == "Release") {
                moveRight();
            }
            break;
        case UP_ARROW:
            if (switchInput == "Release") {
                moveUp();
            }
            break;
        case DOWN_ARROW:
            if (switchInput == "Release") {
                moveDown();
            }
            break;
        case 13: // return
        case 51: // 3
        case 52: // 4
            if (switchInput == "Release")
                doClick(1);
            break;
        case 32: // space
        case 49: // 1
        case 50: // 2
            if (switchInput == "Release")
                doClick(0);
            break;
    }

}

var doingFastOverscan = true;

function doClick(button) {
    if (!buttonPanel.hidden)
        return;
    if (params.inputMethod == "Switches") {
        clearTimeout(tmrRepeat);
        switch (params.switchStyle) {
            case 'Two switch step':
                if (button == 0)
                    moveRightWrap();
                else
                    justSelected(currentX, currentY);
                break;
            case 'Two switch row/column':
                if (button == 0) {
                    if (highLightingRow) {
                        highlightRow++;
                        if (highlightRow > rows)
                            highlightRow = 0;
                        if (highlightRow < 0)
                            highlightRow = rows;
                    } else {
                        moveRight();
                    }
                } else {
                    if (highLightingRow) {
                        highLightingRow = false;
                        currentX = 0;
                        currentY = highlightRow;
                        highlightRow = -1;
                        removeToolbarHighlight();
                    } else {
                        justSelected(currentX, currentY);
                        highLightingRow = true;
                        currentX = -1;
                        highlightRow = 0;
                        removeToolbarHighlight();
                    }
                }
                refreshBoard++;
                break;
            case 'One switch step':
                console.log("One switch step");
                justSelected(currentX, currentY);
                startGoingRight();
                break;
            case 'One switch row/column':
                if (highLightingRow) {
                    highLightingRow = false;
                    currentX = 0;
                    currentY = highlightRow;
                    highlightRow = -1;
                    removeToolbarHighlight();
                    startRightScan();
                } else {
                    justSelected(currentX, currentY);
                    highLightingRow = true;
                    currentX = -1;
                    highlightRow = 0;
                    startGoingDown();
                }
                refreshBoard++;
                break;

            case 'One switch overscan':
                if (doingFastOverscan) {
                    doingFastOverscan = false;
                    startGoingLeft();
                } else {
                    justSelected(currentX, currentY);
                    currentX = 0;
                    currentY = 0;
                    startGoingFastRight();
                    doingFastOverscan = true;
                }
                refreshBoard++;
                break;
        }
        console.log("switches", button);
    } else
        justSelected(currentX, currentY);
}

function startGoingFastRight() {
    console.log("startGoingFastRight");
    clearTimeout(tmrRepeat);
    tmrRepeat = setTimeout(function () {
        startGoingFastRight();
        moveRightWrap();
    }, params.speed * 250);
}

function startGoingRight() {
    console.log("StartGoingRight");
    clearTimeout(tmrRepeat);
    tmrRepeat = setTimeout(function () {
        startGoingRight();
        moveRightWrap();
    }, params.speed * 1000);
}

function startRightScan() {
    console.log("startRightScan");
    clearTimeout(tmrRepeat);
    tmrRepeat = setTimeout(function () {
        startRightScan();
        moveRight();
    }, params.speed * 1000);
}

function startGoingLeft() {
    console.log("startGoingLeft");
    clearTimeout(tmrRepeat);
    tmrRepeat = setTimeout(function () {
        startGoingLeft();
        moveLeftWrap();
    }, params.speed * 1000);
}

function startGoingDown() {
    console.log("StartGoingDown");
    clearTimeout(tmrRepeat);
    tmrRepeat = setTimeout(function () {
        startGoingDown();
        highlightRow++;
        if (highlightRow > rows)
            highlightRow = 0;
        if (highlightRow < 0)
            highlightRow = rows;
        refreshBoard++;
    }, params.speed * 1000);
}

//window.addEventListener('auxclick', (e) => { // detect middle click and right click
//    if (params.mouseWheel == 'Row/Column') { // switch between highlighting rows and buttons
//
//    } else
//        doClick();
//    console.log("Mouseclick", e.button);
//}, {
//    "passive": false
//});

var busy = false;
var highLightingRow = true;
window.addEventListener('wheel', (e) => {
    if (busy)
        return;
    busy = true;
    if (!params.allowZoom && params.inputMethod == 'Touch/Mouse') { // zoom and pan
        e.preventDefault();
    } else if (params.inputMethod != 'Touch/Mouse') {
        if (params.inputMethod == 'MouseWheel') {
            var movement = e.deltaY;
            console.log("MouseWheel", movement);
            if (switchInput == "Hover") {
                hoverTimer();
                clearTimeout(tmrHover);
                tmrHover = setTimeout(function () {
                    mseEvent(e);
                    refreshBoard++;
                }, params.acceptanceDelayHover * 1000);
            }
            if (params.mouseWheel == 'Row/Column') {
                if (highLightingRow) {
                    if (movement > 4) {
                        highlightRow++;
                    } else if (movement < -4) {
                        highlightRow--;
                    }
                    if (highlightRow > rows)
                        highlightRow = 0;
                    if (highlightRow < 0)
                        highlightRow = rows;
                } else {
                    if (movement > 4)
                        moveRight();
                    else if (movement < -4)
                        moveLeft();
                }
                refreshBoard++;
            } else {
                if (movement > 4) {
                    moveRightWrap();
                    refreshBoard++;
                } else if (movement < -4) {
                    moveLeftWrap();
                    refreshBoard++;
                }
            }
        }
        e.preventDefault();
    }
    busy = false;
}, {
    "passive": false
});


window.addEventListener('touchmove', e => {
    if (e.touches.length > 1) {
        if (!params.allowZoom && params.inputMethod == 'Touch/Mouse') { // zoom and pan
            e.preventDefault();
        } else if (params.inputMethod != 'Touch/Mouse')
            e.preventDefault();
    }
}, {
    passive: false
})

function moveDown() {
    currentY++;
    removeToolbarHighlight();
    if (!buttonPanel.hidden && currentY == rows)
        currentY = rows - 1;
    if (currentY == rows) {
        currentX = floor(4 * currentX / columns);
        toolbarHighlightItem(currentX);
    } else if (currentY == rows + 1) {
        currentY = 0;
        switch (currentX) {
            case 0:
                currentX = 0;
                break;
            case 1:
                currentX = floor(columns / 2);
                break;
            case 2:
                currentX = columns - 2;
                if (currentX < 0)
                    currentX == 0;
                break;
            case 3:
                currentX = columns - 1;
                break;
        }
    }
    console.log(currentX, currentY);
    updateEditPanel();
    refreshBoard++;
}

function moveUp() {
    removeToolbarHighlight();
    currentY--;
    if (!buttonPanel.hidden && currentY < 0)
        currentY = 0;
    if (currentY < 0) {
        currentY = rows;
        currentX = floor(4 * currentX / columns);
        toolbarHighlightItem(currentX);
    } else if (currentY == rows - 1) {
        switch (currentX) {
            case 0:
                currentX = 0;
                break;
            case 1:
                currentX = floor(columns / 2);
                break;
            case 2:
                currentX = columns - 2;
                if (currentX < 0)
                    currentX == 0;
                break;
            case 3:
                currentX = columns - 1;
                break;
        }
    }
    console.log(currentX, currentY);
    updateEditPanel();
    refreshBoard++;
}

function moveLeft() {
    console.log("Move left");
    removeToolbarHighlight();
    refreshBoard++;
    currentX--;
    if (!buttonPanel.hidden && currentX < 0)
        currentX = 0;
    if (currentX < 0) {
        if (currentY == rows) {
            currentX = 3;
        } else
            currentX = columns - 1;
    }
    if (currentY == rows) {
        toolbarHighlightItem(currentX);
    }
    console.log(currentX, currentY);
    updateEditPanel();
    refreshBoard++;
}

function moveRight() {
    removeToolbarHighlight();
    refreshBoard++;
    currentX++;
    if (!buttonPanel.hidden && (currentX == columns))
        currentX = columns - 1;
    if (currentY == rows) {
        if (currentX > 3)
            currentX = 0;
        toolbarHighlightItem(currentX);
    } else if (currentX >= columns)
        currentX = 0;
    console.log(currentX, currentY);
    updateEditPanel();
    refreshBoard++;
}

function moveLeftWrap() {
    removeToolbarHighlight();
    currentX--;
    if (currentY == rows) {
        if (currentX < 0) {
            currentX = columns - 1;
            currentY = rows - 1;
        } else
            toolbarHighlightItem(currentX);
    } else if (currentX < 0) {
        if (currentY == 0) {
            currentY = rows;
            currentX = 3;
            toolbarHighlightItem(currentX);
        } else {
            currentX = columns - 1;
            moveUp();
        }
    }
    refreshBoard++;
}


function moveRightWrap() {
    removeToolbarHighlight();
    currentX++;
    if (currentY == rows) {
        if (currentX < 4) {
            toolbarHighlightItem(currentX);
        } else {
            currentX = 0;
            moveDown();
        }
    } else if (currentX >= columns) {
        currentX = 0;
        moveDown();
    }
    refreshBoard++;
}
