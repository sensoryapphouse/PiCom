var btnsLabels = new Array(10);
var buttonCount = 0;
var textToSpeak = "";
var ctx;
var timerTpad = null;

var leftButton;
var rightButton;
var homeBtn;
var editArea;
var backspace;
var clearDisplay;
var backgroundButton;
var highlightButton;
var speakBtn;

function goHome() {
    //    return;
    //    var scale = 'scale(1)';
    //    document.body.style.webkitTransform = scale; // Chrome, Opera, Safari
    //    document.body.style.msTransform = scale; // IE 9
    //    document.body.style.transform = scale; // General
    if (boardDiskFormat == 2)
        loadZipBoard(homeBoardName);
    else if (boardDiskFormat == 1)
        myBoard = loadJSON(homeBoardName, jsonLoaded);
    currentBoardName = homeBoardName;
    refreshBoard += 100;
}

function doBackspace() {
    if (textToSpeak.length > 0)
        textToSpeak = textToSpeak.substring(0, textToSpeak.lastIndexOf(' |'));
    if (buttonCount > 0) {
        buttonCount--;
        ctx.fillStyle = "#FFFFFF";
        if (rightToLeft) {
            ctx.fillRect((9 - buttonCount) * 100, 0, 100, 150);
            btnsLabels[9 - buttonCount].textContent = "";
        } else {
            ctx.fillRect(buttonCount * 100, 0, 100, 150);
            btnsLabels[buttonCount].textContent = "";
        }
    }
}

function doClear() {
    ctx.fillStyle = "#FFFFFF";
    textToSpeak = "";
    for (j = 0; j < 10; j++) {
        ctx.fillRect(j * 100, 0, 100, 150);
        btnsLabels[j].textContent = "";
    }
    buttonCount = 0;
}

function doSpeak() {
    var txt = textToSpeak;
    txt = txt.replaceAll(' | ', ' ');
    speech.cancel();
    speech.speak(txt);
}

function setUpToolbar() {
    picomBar.onmousedown = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    picomBar.onmouseup = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    backgroundButton = document.createElement("button");
    backgroundButton.style.position = "absolute";
    backgroundButton.style.top = "0vh";
    backgroundButton.style.left = "0vw";
    backgroundButton.style.height = "10vh";
    backgroundButton.style.width = "100vw";
    backgroundButton.style.borderRadius = "0vh";
    backgroundButton.style.borderStyle = 'none';
    backgroundButton.style.background = params.backgroundColour;
    backgroundButton.tabIndex = -1;
    picomBar.appendChild(backgroundButton);

    highlightButton = document.createElement("button");
    highlightButton.style.position = "absolute";
    highlightButton.style.top = "0vh";
    highlightButton.style.left = "-40vw";
    highlightButton.style.height = "10vh";
    highlightButton.style.width = "12vw";
    highlightButton.style.borderRadius = "0vh";
    highlightButton.style.borderStyle = 'none';
    highlightButton.style.background = params.highlightColour;
    highlightButton.tabIndex = -1;
    picomBar.appendChild(highlightButton);

    homeBtn = document.createElement("button");
    homeBtn.style.position = "absolute";
    homeBtn.style.top = "0.5vh";
    homeBtn.style.left = "5.5vw";
    homeBtn.style.height = "8.5vh";
    homeBtn.style.width = "8vw";
    homeBtn.style.borderColor = "black";
    homeBtn.style.background = 'none';
    homeBtn.style.backgroundImage = "url('images/home.png')";
    homeBtn.style.backgroundSize = "8vw 8.5vh";
    homeBtn.tabIndex = -1;
    homeBtn.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        goHome();
    };
    homeBtn.onmouseover = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(0);
    };
    homeBtn.onmouseleave = function (e) {
        e.stopPropagation();
        e.preventDefault();
        removeToolbarHighlight();
        homeBtn.style.filter = "brightness(100%)";
    };

    homeBtn.ontouchstart = function (e) {
        e.stopPropagation();
        e.preventDefault();
        goHome();
    };
    homeBtn.ontouchmove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(0);
    };
    homeBtn.ontouchend = function (e) {
        e.stopPropagation();
        e.preventDefault();
        removeToolbarHighlight();
        homeBtn.style.filter = "brightness(100%)";
    };
    picomBar.appendChild(homeBtn);

    leftButton = document.createElement("canvas");
    leftButton.style.position = "absolute";
    leftButton.style.bottom = "0vh";
    leftButton.style.left = "0vw";
    leftButton.style.height = "10vh";
    leftButton.style.width = "10vw";
    leftButton.style.border = 'none';
    leftButton.style.background = "none";
    leftButton.style.backgroundImage = "url('images/Button_Blue.png')"; //ds changed
    leftButton.style.backgroundSize = "10vw 10vh";
    leftButton.tabIndex = -1;
    leftButton.onclick = function () {};
    picomBar.appendChild(leftButton);
    leftButton.hidden = true;
    var doingLeft = false;

    leftButton.onmousedown = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        if (params.inputMethod == strSwitches) {
            if (switchInput == strPress) {
                if (params.acceptanceDelay == 0)
                    doClick(0);
                else
                    tmrAccept = setTimeout(function () {
                        doClick(0);
                    }, params.acceptanceDelay * 1000);
            }
        } else { // touchpad
            clearTimeout(tmrRepeat);
            firstTouch = true;
            tpdSleep = false;
            mouseHeldDown = true;
            doingLeft = true;
            tpdEvent(e, 0);
        }
    }

    leftButton.onmouseup = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        if (params.inputMethod == strSwitches) {
            if (switchInput == strRelease)
                doClick(0);
        } else {
            firstTouch = false;
            tpdSleep = false;
            mouseHeldDown = false;
            doingLeft = true;
            clearTimeout(tmrRepeat);
            tpdEvent(e, 1);
        }
    }

    leftButton.onmousemove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        if (params.inputMethod == strSwitches) {} else {
            doingLeft = true;
            if (mouseHeldDown || params.touchpadMode == "Absolute")
                tpdEvent(e, 2);
        }
    }

    leftButton.onmouseleave = function (e) {
        e.stopPropagation();
        e.preventDefault();
        mouseHeldDown = false;
        doingLeft = true;
        clearTimeout(tmrRepeat);
    }

    leftButton.ontouchstart = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        tchX = e.x = e.touches[0].pageX;
        tchY = e.y = e.touches[0].pageY;
        console.log("Button Touch started");
        if (params.inputMethod == strSwitches) {
            if (switchInput == strPress) {
                if (params.acceptanceDelay == 0)
                    doClick(0);
                else
                    tmrAccept = setTimeout(function () {
                        doClick(0);
                    }, params.acceptanceDelay * 1000);
            }
        } else { // touchpad
            clearTimeout(tmrRepeat);
            firstTouch = true;
            tpdSleep = false;
            mouseHeldDown = true;
            doingLeft = true;
            tpdEvent(e, 0);
        }
    }

    leftButton.ontouchmove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        //    event.preventDefault();
        tchX = e.x = event.touches[0].pageX;
        tchY = e.y = event.touches[0].pageY;
        if (params.inputMethod == strSwitches) {} else {
            doingLeft = true;
            if (mouseHeldDown || params.touchpadMode == strSwitches)
                tpdEvent(e, 2);
        }
    }

    leftButton.ontouchend = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        e.x = tchX;
        e.y = tchY;
        console.log("Button touch ended");
        if (params.inputMethod == strSwitches) {
            if (switchInput == strRelease)
                doClick(0);
        } else {
            firstTouch = false;
            tpdSleep = false;
            mouseHeldDown = false;
            doingLeft = true;
            clearTimeout(tmrRepeat);
            tpdEvent(e, 1);
        }
    }

    rightButton = document.createElement("button");
    rightButton.style.position = "absolute";
    rightButton.style.bottom = "0vh";
    rightButton.style.right = "0vw";
    rightButton.style.height = "10vh";
    rightButton.style.width = "10vw";
    rightButton.style.border = 'none';
    rightButton.style.background = "none";
    rightButton.style.backgroundImage = "url('images/Button_Red.png')"; //DS changed
    rightButton.style.backgroundSize = "10vw 10vh";
    rightButton.tabIndex = -1;
    rightButton.onclick = function () {};
    picomBar.appendChild(rightButton);
    rightButton.hidden = true;


    var tpdSleep = false;
    var firstTouch = true;
    var mouseHeldDown = false;
    var tmpX;
    var tmpY;
    rightButton.onmousedown = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (params.inputMethod == strSwitches) {
            e.stopPropagation();
            e.preventDefault();
            if (switchInput == strPress) {
                if (params.acceptanceDelay == 0)
                    doClick(1);
                else
                    tmrAccept = setTimeout(function () {
                        doClick(1);
                    }, params.acceptanceDelay * 1000);
            }
        } else { // touchpad
            clearTimeout(tmrRepeat);
            firstTouch = true;
            tpdSleep = false;
            mouseHeldDown = true;
            doingLeft = false;
            tpdEvent(e, 0);
        }
    }

    rightButton.onmouseup = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (params.inputMethod == strSwitches) {
            e.stopPropagation();
            e.preventDefault();
            if (switchInput == strRelease)
                doClick(1);
        } else {
            firstTouch = false;
            tpdSleep = false;
            mouseHeldDown = false;
            doingLeft = false;
            clearTimeout(tmrRepeat);
            tpdEvent(e, 1);
        }
    }

    rightButton.onmousemove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!buttonPanel.hidden)
            return;
        if (params.inputMethod == strSwitches) {} else {
            doingLeft = false;
            if (mouseHeldDown || params.touchpadMode == "Absolute")
                tpdEvent(e, 2);
        }
    }

    rightButton.onmouseleave = function (e) {
        e.stopPropagation();
        e.preventDefault();
        mouseHeldDown = false;
        doingLeft = true;
        clearTimeout(tmrRepeat);
    }


    rightButton.ontouchstart = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        tchX = e.x = e.touches[0].pageX;
        tchY = e.y = e.touches[0].pageY;
        console.log("Button Touch started");
        if (params.inputMethod == strSwitches) {
            if (switchInput == strPress) {
                if (params.acceptanceDelay == 0)
                    doClick(1);
                else
                    tmrAccept = setTimeout(function () {
                        doClick(1);
                    }, params.acceptanceDelay * 1000);
            }
        } else { // touchpad
            clearTimeout(tmrRepeat);
            firstTouch = true;
            tpdSleep = false;
            mouseHeldDown = true;
            doingLeft = false;
            tpdEvent(e, 0);
        }
    }

    rightButton.ontouchmove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        //    event.preventDefault();
        tchX = e.x = event.touches[0].pageX;
        tchY = e.y = event.touches[0].pageY;
        if (params.inputMethod == strSwitches) {} else {
            doingLeft = false;
            if (mouseHeldDown || params.touchpadMode == "Absolute")
                tpdEvent(e, 2);
        }
    }

    rightButton.ontouchend = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!closeButton.hidden)
            return;
        e.x = tchX;
        e.y = tchY;
        console.log("Button touch ended");
        if (params.inputMethod == strSwitches) {
            if (switchInput == strRelease)
                doClick(1);
        } else {
            firstTouch = false;
            tpdSleep = false;
            mouseHeldDown = false;
            doingLeft = false;
            clearTimeout(tmrRepeat);
            tpdEvent(e, 1);
        }
    }

    /*
    if (params.boardStyle == strToolbarTop) {
        if (smallPortrait) {
            xIndex = floor(map(event.pageX, 0, layoutViewport.offsetWidth, 0, rows));
            yIndex = floor(map(event.pageY, offsetForBoard, layoutViewport.offsetHeight, 0, columns));
        } else {
            xIndex = floor(map(event.pageX, 0, layoutViewport.offsetWidth, 0, columns));
            yIndex = floor(map(event.pageY, offsetForBoard, layoutViewport.offsetHeight, 0, rows));
        }
        console.log(floor(xIndex), floor(yIndex));
    } else {
        if (smallPortrait) {
            yIndex = map(event.pageY, 0, hWindow, 0, columns);
        } else {
            yIndex = map(event.pageY, 0, hWindow, 0, rows);
        }
    }
    */

    function tpdEvent(e, state) {
        if (params.inputMethod == strTouchpad) {
            console.log("touchpad: ", e.x, e.y)
            if (params.touchpadMode == "Absolute") {
                if (doingLeft) {
                    if (params.boardStyle == strToolbarBottom) {
                        if (smallPortrait) {
                            //                            currentY = floor(map(e.y, 0, hWindow, 0, columns));
                            currentY = (columns + 1) - 1 - floor((columns + 1) * (layoutViewport.offsetHeight - e.y) / leftButton.offsetHeight);
                            if (currentY == columns) {
                                currentX = floor(4 * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(rows * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        } else {
                            currentY = (rows + 1) - 1 - floor((rows + 1) * (layoutViewport.offsetHeight - e.y) / leftButton.offsetHeight);
                            if (currentY == rows) {
                                currentX = floor(4 * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(columns * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        }
                    } else {
                        if (smallPortrait) {
                            //                            currentY = floor(map(e.y, 0, hWindow, 0, columns));
                            currentY = (columns) - 1 - floor((columns + 1) * (leftButton.offsetHeight - e.y) / leftButton.offsetHeight);
                            if (currentY == -1) {
                                currentX = floor(4 * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(rows * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        } else {
                            currentY = (rows) - 1 - floor((rows + 1) * (leftButton.offsetHeight - e.y) / leftButton.offsetHeight);
                            if (currentY == -1) {
                                currentX = floor(4 * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(columns * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        }
                    }
                } else {
                    if (params.boardStyle == strToolbarBottom) {
                        if (smallPortrait) {
                            //                            currentY = floor(map(e.y, 0, hWindow, 0, columns));
                            currentY = (columns + 1) - 1 - floor((columns + 1) * (layoutViewport.offsetHeight - e.y) / leftButton.offsetHeight);
                            if (currentY == columns) {
                                currentX = floor(4 * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(rows * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        } else {
                            currentY = (rows + 1) - 1 - floor((rows + 1) * (layoutViewport.offsetHeight - e.y) / leftButton.offsetHeight);
                            if (currentY == rows) {
                                currentX = floor(4 * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(columns * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        }
                    } else {
                        if (smallPortrait) {
                            //                            currentY = floor(map(e.y, 0, hWindow, 0, columns));
                            currentY = (columns) - 1 - floor((columns + 1) * (leftButton.offsetHeight - e.y) / leftButton.offsetHeight);
                            if (currentY == -1) {
                                currentX = floor(4 * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(rows * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        } else {
                            currentY = (rows) - 1 - floor((rows + 1) * (rightButton.offsetHeight - e.y) / rightButton.offsetHeight);
                            if (currentY == -1) {
                                currentX = floor(4 * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                toolbarHighlightItem(currentX);
                            } else {
                                currentX = floor(columns * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                                removeToolbarHighlight();
                            }
                        }
                    }


                    console.log(currentX, currentY);
                }
                if (currentX < 0)
                    currentX = 0;
                if (state == 0 && switchInput == strPress) //down
                    doClick(0);
                if (state == 1 && switchInput == strRelease) //up
                    doClick(0);

                refreshBoard = 1;
            } else { // joystick
                if (params.boardStyle == strToolbarBottom) {
                    if (doingLeft)
                        tmpX = floor(9 * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                    else
                        tmpX = floor(9 * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                    tmpY = floor(9 * (layoutViewport.offsetHeight - e.y) / rightButton.offsetHeight);
                } else {
                    if (doingLeft)
                        tmpX = floor(9 * (e.x - leftButton.offsetLeft) / leftButton.offsetWidth);
                    else
                        tmpX = floor(9 * (e.x - rightButton.offsetLeft) / rightButton.offsetWidth);
                    tmpY = floor(9 * (rightButton.offsetHeight - e.y) / rightButton.offsetHeight);
                }
                tpdMove(state);
                if (tmpX > 2 && tmpX < 6 && tmpY > 2 && tmpY < 6) {
                    tpdSleep = true;
                    clearInterval(tmrRepeat);
                    console.log("Tpad: ", tmpX, tmpY);
                    if (state == 0 && switchInput == strPress)
                        doClick(0);
                    else if (state == 1 && switchInput == strRelease)
                        doClick(0);
                }
            }
        }
    }

    function tpdMove(state) {
        if (params.speed == 0) {
            if (!firstTouch)
                return;
            tpdMove2(state);
            firstTouch = false;
        } else { // autorepeat
            if (firstTouch) {
                tpdMove2(state);
                firstTouch = false;
            }
            if (!tpdSleep) {
                tpdRepeat(state);
            }
        }
    }

    function tpdRepeat(state) {
        if (!mouseHeldDown)
            return;
        tpdSleep = true;
        tmrRepeat = setTimeout(function () {
            tpdSleep = false;
            tpdMove2(state);
            tpdRepeat(state);
        }, params.speed * 1000);
    }

    function tpdMove2(state) {
        if (tmpX <= 2)
            moveLeft();
        else if (tmpX >= 6)
            moveRight();
        if (tmpY <= 2)
            moveDown();
        else if (tmpY >= 6)
            moveUp();
    }


    backspace = document.createElement("button");
    backspace.style.position = "absolute";
    backspace.style.top = "0.5vh";
    backspace.style.left = "79.5vw";
    backspace.style.height = "8.5vh";
    backspace.style.width = "7vw";
    backspace.style.borderColor = "black";
    backspace.style.backgroundColor = params.backgroundColour;
    backspace.style.backgroundImage = "url('images/backspace.png')";
    backspace.style.backgroundSize = "7vw 9vh";
    backspace.tabIndex = -1;
    backspace.onmouseover = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(2);
    };
    backspace.onmouseleave = function (event) {
        event.stopPropagation();
        event.preventDefault();
        removeToolbarHighlight();
    };
    backspace.onclick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        doBackspace();
    };

    backspace.ontouchmove = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!settingsButton.hidden)
            return;
    };
    backspace.ontouchend = function (event) {
        event.stopPropagation();
        event.preventDefault();
        removeToolbarHighlight();
    };
    backspace.ontouchstart = function (event) {
        event.stopPropagation();
        event.preventDefault();
        doBackspace();
        toolbarHighlightItem(2);
    };
    picomBar.appendChild(backspace);


    clearDisplay = document.createElement("button");
    clearDisplay.style.position = "absolute";
    clearDisplay.style.top = "0.5vh";
    clearDisplay.style.left = "88vw";
    clearDisplay.style.height = "8.5vh";
    clearDisplay.style.width = "7vw";
    clearDisplay.style.borderColor = "black";
    clearDisplay.style.background = params.backgroundColour;
    clearDisplay.style.backgroundImage = "url('images/clear.png')";
    clearDisplay.style.backgroundSize = "7vw 9vh";
    clearDisplay.tabIndex = -1;
    clearDisplay.onmouseover = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(3);
    };
    clearDisplay.onmouseleave = function (event) {
        event.stopPropagation();
        event.preventDefault();
        removeToolbarHighlight();
    };
    clearDisplay.onclick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        doClear();
    };

    clearDisplay.ontouchmove = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(3);
    };
    clearDisplay.ontouchend = function (event) {
        event.stopPropagation();
        event.preventDefault();
        removeToolbarHighlight();
    };
    clearDisplay.ontouchstart = function (event) {
        event.stopPropagation();
        event.preventDefault();
        doClear();
    };
    picomBar.appendChild(clearDisplay);

    editArea = document.createElement("canvas");
    editArea.style.position = "absolute";
    editArea.style.top = ".25vh";
    editArea.style.left = "18.5vw";
    editArea.style.height = "8vh";
    editArea.style.width = "55vw";
    editArea.style.borderRadius = "0vh";
    editArea.style.borderStyle = 'inset';
    editArea.style.background = "white";
    editArea.width = 1000;
    editArea.height = 150;
    editArea.tabIndex = -1;
    editArea.onclick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        doSpeak();
    };
    editArea.onmousedown = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    editArea.onmouseup = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    editArea.onmouseover = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(1);
    };
    editArea.onmouseleave = function (event) {
        removeToolbarHighlight();
    };

    editArea.ontouchstart = function (event) {
        event.stopPropagation();
        event.preventDefault();
        doSpeak();
    };
    editArea.ontouchend = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    editArea.ontouchmove = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(1);
    };

    picomBar.appendChild(editArea);

    picomBar.ontouchstart = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };
    picomBar.ontouchend = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    picomBar.ontouchmove = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };

    picomBar.tabIndex = -1;
    ctx = editArea.getContext("2d");
    //    ctx.translate(1000, 75);
    //    ctx.font = "30px Arial";
    //    ctx.save();
    //    ctx.rotate(Math.PI);
    //    ctx.fillText("TEST", 10, 10);
    //    ctx.restore();

    speakBtn = document.createElement("button");
    speakBtn.style.position = "absolute";
    speakBtn.style.top = "1vh";
    speakBtn.style.left = "68vw";
    speakBtn.style.height = "7.5vh";
    speakBtn.style.width = "6vw";
    speakBtn.style.border = "none";
    speakBtn.style.backgroundImage = "url('images/speak.png')";
    speakBtn.style.backgroundSize = "6vw 7.5vh";
    speakBtn.style.opacity = .5;
    speakBtn.onclick = function (event) {
        event.stopPropagation();
        event.preventDefault();
        doSpeak();
    }
    speakBtn.onmousedown = function (event) {
        event.stopPropagation();
        event.preventDefault();
        toolbarHighlightItem(1);
    }
    speakBtn.onmouseup = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    speakBtn.onmouseover = function (event) {
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(1);
    };

    speakBtn.ontouchstart = function (event) {
        event.stopPropagation();
        event.preventDefault();
        toolbarHighlightItem(1);
        doSpeak();
    }
    speakBtn.ontouchend = function (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    speakBtn.ontouchmove = function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (!settingsButton.hidden)
            return;
        toolbarHighlightItem(1);
    };

    picomBar.appendChild(speakBtn);

    for (var i = 0; i < 10; i++) {
        btnsLabels[i] = document.createElement("label");
        btnsLabels[i].style.position = "absolute";
        btnsLabels[i].style.top = "7.0vh";
        btnsLabels[i].style.left = 18.7 + i * 5.5 + "vw";
        btnsLabels[i].style.height = "1.9vh";
        btnsLabels[i].style.width = "5.5vw";
        btnsLabels[i].style.borderRadius = "0vh";
        btnsLabels[i].style.borderStyle = 'none';
        btnsLabels[i].style.background = "none";
        btnsLabels[i].style.textAlign = "center";
        btnsLabels[i].style.fontSize = "1.9vh";
        btnsLabels[i].style.overflow = "hidden";
        btnsLabels[i].textContent = "";
        btnsLabels[i].style.pointerEvents = "none";
        btnsLabels[i].enabled = false;
        picomBar.appendChild(btnsLabels[i]);
    }
    setUpForTouchpad();
}

function toolbarHighlightItem(i) {
    if (smallPortrait)
        currentY = columns;
    else
        currentY = rows;
    currentX = i;
    highlightRow = -1;
    backgroundButton.style.backgroundColor = params.backgroundColour;
    homeBtn.style.backgroundColor = params.backgroundColour;
    switch (i) {
        case 0:
            homeBtn.style.backgroundColor = "white";
            if (homeBtn.style.left == "5vw")
                highlightButton.style.left = "4.5vw";
            else
                highlightButton.style.left = "9.8vw";
            highlightButton.style.width = "9vw";
            break;
        case 1:
            editArea.style.borderStyle = "inset";
            editArea.style.borderWidth = "thick";
            highlightButton.style.left = "18vw";
            highlightButton.style.width = "56.8vw";
            //            editArea.style.background = "rgb(245,245,245)";
            break;
        case 2:
            backspace.style.backgroundColor = "white";
            if (backspace.style.left == "79.5vw")
                highlightButton.style.left = "79vw";
            else
                highlightButton.style.left = "74.5vw";
            highlightButton.style.width = "7.9vw";
            break;
        case 3:
            clearDisplay.style.backgroundColor = "white";
            if (clearDisplay.style.left == "88vw")
                highlightButton.style.left = "87.6vw";
            else
                highlightButton.style.left = "82.1vw";
            highlightButton.style.width = "7.8vw";
            break;
        default:
            break;
    }
}

function removeToolbarHighlight() {
    highlightButton.style.left = "-120vw";
    editArea.style.borderStyle = "inset";
    editArea.style.borderWidth = "medium";
    editArea.style.background = "white";
    homeBtn.style.backgroundColor = params.backgroundColour;
    clearDisplay.style.backgroundColor = params.backgroundColour;
    backspace.style.backgroundColor = params.backgroundColour;
    backgroundButton.style.backgroundColor = params.backgroundColour;
}

function setUpForButtons() {
    jeelizCanvas.hidden = true;
    rightButton.hidden = false;
    rightButton.style.backgroundImage = "url('images/Button_Red.png')";
    rightButton.style.border = 'none';
    leftButton.hidden = false;
    leftButton.style.backgroundImage = "url('images/Button_Blue.png')";
    leftButton.style.border = 'none';
    leftButton.style.height = "10vh";
    backspace.style.left = "75vw";
    clearDisplay.style.left = "82.5vw";
    homeBtn.style.left = "10.3vw";
}

function setUpForTouchpad() {
    jeelizCanvas.hidden = true;
    rightButton.hidden = false;
    rightButton.style.backgroundImage = "url('images/touchpad3.png')";
    rightButton.style.border = 'inset';
    leftButton.hidden = false;
    leftButton.style.backgroundImage = "url('images/touchpad3.png')";
    leftButton.style.border = 'inset';
    leftButton.style.height = "10vh";
    backspace.style.left = "75vw";
    clearDisplay.style.left = "82.5vw";
    homeBtn.style.left = "10.3vw";
}

function setUpForFace() {
    jeelizCanvas.hidden = false;
    rightButton.hidden = true;
    leftButton.hidden = true;
    backspace.style.left = "75vw";
    leftButton.style.height = "15vh";
    clearDisplay.style.left = "82.5vw";
    homeBtn.style.left = "10.3vw";
}

function setupToolbarDefault() {
    jeelizCanvas.hidden = true;
    rightButton.hidden = true;
    leftButton.hidden = true;
    leftButton.style.height = "10vh";
    homeBtn.style.left = "5vw";
    backspace.style.left = "79.5vw";
    clearDisplay.style.left = "88vw";
}
