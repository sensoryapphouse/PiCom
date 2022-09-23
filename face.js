var jeelizCanvas;
var faceInitialised = false;
var rx;
var ry;
var rz;
var faceDirection = 0;
var lastFaceDirection = 0;
var smile = false;
var mouthOpen = false;
var eyebrows = false;

function initialiseFace() {
    if (faceInitialised)
        return;
    initialiseFace = true;
    JeelizWebojiSVGHelper.init({
        canvasId: 'jeelizFaceExpressionsCanvas',
        NNCPath: 'libraries/',
        hysteresis: 0.02, // bonus score for already selected expression. Against flickering
        isMirror: true,
        rotationCallback: function (xyz) {
            rx = xyz[0].toPrecision(1); // head angle: rotation around X (look up/down)
            ry = xyz[1].toPrecision(1); // rotation around Y: look right/left
            rz = xyz[2]; // rotation around Z: head bending
        }
    });
}

var gotExpression = false;
var previousExpression = false;
var JeelizWebojiSVGHelper = (function () {

    let _hysteresis = 0;
    let _rotation = [0, 0, 0];
    let _rotationCallback = null;

    function getFace() { // use gamepad joystick code
        if (!splash.hidden)
            return;
        switch (faceDirection) {
            case 0: // centred
                JoystickMoveTo(0, 0, 0, 0);
                break;
            case 1: // up
                JoystickMoveTo(-1, 0, 0, 0);
                break
            case 2: // down
                JoystickMoveTo(1, 0, 0, 0);
                break
            case 3: // left
                JoystickMoveTo(0, -1, 0, 0);
                break
            case 4: // right
                JoystickMoveTo(0, 1, 0, 0);
                break
        }

        if (params.speed == 0) { // wait for centred
            setTimeout(function () {
                getFace();
            }, 100);
        } else
            setTimeout(function () {
                getFace();
            }, params.speed * 1000);
    }

    function callbackReady(errCode) {
        if (errCode) {
            console.log('ERROR in JeelizWebojiSVGHelper - CANNOT INITIALIZE JEELIZFACEEXPRESSIONS: errCode =', errCode);
            return;
        }
        faceInitialised = true;
        console.log('INFO: JEELIZFACEEXPRESSIONS is ready!');
        _morphFactorsArr = JEELIZFACEEXPRESSIONS.get_morphTargetInfluencesStabilized();
        if (_rotationCallback) {
            _rotation = JEELIZFACEEXPRESSIONS.get_rotationStabilized();
        }
        JEELIZFACEEXPRESSIONS.set_morphUpdateCallback(onMorphUpdate);
        JEELIZFACEEXPRESSIONS.set_animateDelay(80);
        setTimeout(function () {
            getFace();
        }, 100);
    }


    function onMorphUpdate(quality, benchmarkCoeff) {
        if (params.inputMethod != strFace && params.inputMethod != strFaceExpressions) {
            faceDirection = 0;
            gotExpression = previousExpression = false;
            return;
        }

        if (params.inputMethod == strFaceExpressions) {
            mouthOpen = (_morphFactorsArr[6].toPrecision(1) > .3);
            smile = (((_morphFactorsArr[0] + _morphFactorsArr[1]) / 2).toPrecision(1) > .2);
            eyebrows = (((_morphFactorsArr[4] + _morphFactorsArr[5]) / 2).toPrecision(1) > .7);

            gotExpression = (mouthOpen || smile || eyebrows);

            if (gotExpression != previousExpression) { // switch change
                if (gotExpression) { // switch down
                    console.log("Got expression");
                    if (switchInput == strPress) {
                        if (params.acceptanceDelay == 0)
                            doClick(0);
                        else
                            tmrAccept = setTimeout(function () {
                                doClick(0);
                            }, params.acceptanceDelay * 1000);
                    }
                } else { // switch up
                    console.log("Not got expression");
                    clearTimeout(tmrAccept);
                    if (switchInput == strRelease)
                        doClick(0);
                }
            }
            previousExpression = gotExpression;
        }

        console.log(ry);

        if (rx < 0)
            faceDirection = 1; // up
        else if (rx > .2)
            faceDirection = 2; // down
        else if (ry < -.3)
            faceDirection = 3; // left
        else if (ry > .3)
            faceDirection = 4; // right
        else
            faceDirection = 0; // centre

        if (switchInput == strHover) {
            if (faceDirection != lastFaceDirection) {
                if (faceDirection == 0)
                    clearTimeout(tmrHover);
                else {
                    tmrHover = setTimeout(function () {
                        doClick(0);
                        refreshBoard++;
                    }, params.acceptanceDelayHover * 1000);
                }
            }
        }
        //        console.log(s + faceDirection);
        lastFaceDirection = faceDirection;
        if (_rotationCallback) {
            _rotationCallback(_rotation);
        }
    } //end onMorphUpdate()


    const that = {

        init: function (spec) {
            _expressions = spec.expressions;
            if (typeof (spec.hysteresis) !== 'undefined') _hysteresis = spec.hysteresis;
            if (typeof (spec.rotationCallback) !== 'undefined') _rotationCallback = spec.rotationCallback;

            JEELIZFACEEXPRESSIONS.init({
                canvasId: spec.canvasId,
                NNCPath: (spec.NNCPath) ? spec.NNCPath : './',
                callbackReady: callbackReady,
                videoSettings: {
                    isAudio: false
                }
            });
        }
    }; //end that
    return that;
})();

//window.addEventListener('load', main);
