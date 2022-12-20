var gpad;
var waitingForCentre = false;



function JoystickMoveTo(jy, jx, jy1, jx1) { // first two are joystick 1, last two are joystick 2
    if (splash.hidden) {
        if (Math.abs(jx) < .75)
            jx = 0;
        if (Math.abs(jy) < .75)
            jy = 0;
        if (Math.abs(jx1) < .75)
            jx1 = 0;
        if (Math.abs(jy1) < .75)
            jy1 = 0;
        if (jx == 0 && jy == 0 && jx1 == 0 && jy1 == 0) {
            waitingForCentre = false;
            return;
        }
        if (params.speed == 0 && waitingForCentre)
            return;
        if (jx < -.1) {
            moveLeft();
            waitingForCentre = true;
        } else if (jx > .75) {
            moveRight();
            waitingForCentre = true;
        }
        if (jy < -.2) {
            moveUp();
            waitingForCentre = true;
        } else if (jy > .75) {
            moveDown();
            waitingForCentre = true;
        }

        if (jx1 < -.1) {
            moveLeft();
            waitingForCentre = true;
        } else if (jx1 > .75) {
            moveRight();
            waitingForCentre = true;
        }
        if (jy1 < -.2) {
            moveUp();
            waitingForCentre = true;
        } else if (jy1 > .75) {
            moveDown();
            waitingForCentre = true;
        }
    }
}


function showPressedButton(index) {
    console.log("Press: ", index);
    if (!splash.hidden) { // splash screen
        splash.hidden = true;
    } else {
        if (switchInput == strPress) {
            switch (index) {
                case 0: // A
                    if (params.acceptanceDelay == 0)
                        doClick(0);
                    else
                        tmrAccept = setTimeout(function () {
                            doClick(0);
                        }, params.acceptanceDelay * 1000);
                    break;
                case 1: // B - 
                    if (params.acceptanceDelay == 0)
                        doClick(1);
                    else
                        tmrAccept = setTimeout(function () {
                            doClick(1);
                        }, params.acceptanceDelay * 1000);
                    break;
                case 9: // three lines 
                    goHome();
                    break;
                case 10: // XBox or Joystick press
                    if (params.acceptanceDelay == 0)
                        doClick(0);
                    else
                        tmrAccept = setTimeout(function () {
                            doClick(0);
                        }, params.acceptanceDelay * 1000);
                    break;
                case 12: // dup
                    if (params.acceptanceDelay == 0)
                        moveUp();
                    else
                        tmrAccept = setTimeout(function () {
                            moveUp();
                        }, params.acceptanceDelay * 1000);
                    break;
                case 13: // ddown
                    if (params.acceptanceDelay == 0)
                        moveDown();
                    else
                        tmrAccept = setTimeout(function () {
                            moveDown();
                        }, params.acceptanceDelay * 1000);
                    break;
                case 14: // dleft
                    if (params.acceptanceDelay == 0)
                        moveLeft();
                    else
                        tmrAccept = setTimeout(function () {
                            moveLeft();
                        }, params.acceptanceDelay * 1000);
                    break;
                case 15: // dright
                    if (params.acceptanceDelay == 0)
                        moveRight();
                    else
                        tmrAccept = setTimeout(function () {
                            moveRight();
                        }, params.acceptanceDelay * 1000);
                    break;
                default:
            }
        }
    }
}

function removePressedButton(index) {
    clearTimeout(tmrAccept);
    if (switchInput == strRelease) {
        console.log("Released: ", index);
        switch (index) {
            case 0: // A
                doClick(0);
                break;
            case 1: // B - 
                doClick(1);
                break;
            case 10: // XBox or Joystick press
                doClick(0);
                break;
            case 12: // dup
                moveUp();
                break;
            case 13: // ddown
                moveDown();
                break;
            case 14: // dleft
                moveLeft();
                break;
            case 15: // dright
                moveRight();
                break;
            default:
        }

    }
}

function getAxes() {
    if (!splash.hidden)
        return;

    JoystickMoveTo(gpad.getAxis(1), gpad.getAxis(0), gpad.getAxis(3), gpad.getAxis(2));
    if (params.speed == 0) { // wait for centred
        setTimeout(function () {
            getAxes();
        }, 100);
    } else
        setTimeout(function () {
            getAxes();
        }, params.speed * 1000);
}

gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    gpad = e.gamepad;
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    setTimeout(function () {
        getAxes();
    }, 50);
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
});

gamepads.start();
