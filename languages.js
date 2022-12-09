var strPiComBoards = "PiCom Template";
var strInputOptions = "Input Options";
var strInputMethod = "Input Method";
var strAllowZoom = "Allow Zoom";
var strSelectOn = "Select on";
var strVisual = "View";
var strToolbar = "Toolbar";
var strLabelPosition = "Label Position";
var strSpacing = "Spacing";
var strHighContrast = "High Contrast";
var strBackground = "Background";
var strHighlight = "Highlight";
var strSpeech = "Speech";
var strVoice = "Voice";
var strPitch = "Pitch";
var strRate = "Rate";
var strVolume = "Volume";
var strAdvanced = "Advanced";
var strAutoHome = "Auto Home";
var strLoadBoard = "Import Communicator From File";
var strSaveBoard = "Export Communicator To File";
var strEditButton = "Edit";
var strText = "Text:";
var strVocalise = "Vocalize:";
var strLinkTo = "Link to:";
var strInstant = "Instant";
var strSpeakOnSelect = "Speak on select";
var strSpeakOnLink = "Speak on link";
var strTouchpadMode = "Touchpad Mode";
var strTouchpadSize = "Touchpad Size";
var strSpeed = "Speed";
var strAcceptTimer = "Accept Timer";
var strWheelScan = "Wheel Scan";
var strSwitchStyle = "Switch Style";
var strPress = "Press";
var strRelease = "Release";
var strHover = "Hover";
var strHoverTimer = "Hover Timer";
var strResetSettings = "Reset Settings";

// not done ones below yet fully
var strJoystick = "Joystick";
var strAbsolute = "Absolute";
var strRowColumn = "Row/Column";
var strScan = "Scan";
var strTouchMouse = "Touch/Mouse.";
var strTouchpad = "Touchpad";
var strAnalogJoystick = "Analog Joystick.";
var strCursorKeysDpad = "Cursor keys/Dpad";
var strMouseWheel = "Mousewheel"
var strSwitches = "Switches";
var strTwoSwitchStep = "Two switch step";
var strTwoSwitchRowColumn = "Two switch row/column";
var strOneSwitchStep = "One switch step";
var strOneSwitchOverscan = "One switch overscan";
var strToolbarBottom = "Toolbar Bottom";
var strToolbarTop = "Toolbar Top";
var strFullscreen = "Fullscreen";
var strTop = "Top.";
var strBottom = "Bottom.";
var strNone = "None";
var strSmall = "Small";
var strMedium = "Medium";
var strLarge = "Large";
var strHideSettingsButton = "Hide Settings Button";
var strsteButtonEditor = "Button Editor";
var strShowTooltips = "Show Tooltips";
var strHello = "Hello";
var strBackgroundImage = "Background Image";

var strChanged = "Current communicator has been changed.  Do you want to save those changes?";
var strYes = "Yes.";
var strNo = "No.";
var strOK = "OK.";

var strFace = "Face Control";
var strFaceExpressions = "Face Control (expressions)";

var strArrows = "Use arrow keys to choose button to edit.";
var strSettingsEditor = "Settings editor lkashdfklshdklf shafois \njashjhsajk.";
var strButtonEditor = "Button editor.";
var strBoardEditor = "Board editor.";
var strPreviewImage = "Preview image, background and border colours.";
var strDeleteImage = "Delete image from button.";
var strChooseImage = "Choose image for button (can also drag and drop images).";
var strBackgroundColour = "Set background colour for button.";
var strBorderColour = "Set border colour for button.";
var strDeleteSound = "Delete sound file for button.";
var strLoadSound = "Load sound file from disc.";
var strStopRecording = "Stop recording sound file.";
var strRecordSound = "Record sound fine for button.";
var strPlaySound = "Play sound file.";
var strTextLabel = "Text label for button.";
var strVolcaliseTooltip = "Alternative text to speak when button pressed.";
var strLinkToTooltip = "Link to other board.";
var strInstantTooltip = "Speak this button but do not add to message bar.";
var strHomeTooltip = "Button goes to home page.";
var strBackspaceTooltip = "Delete last button in message bar.";
var strClearToolTip = "Clear message bar.";
var strSpeakTooltip = "Speak message bar.";

var strCannotAdd = "Cannot add another board to single board communicator (obf).";
var strTypeName = "Please type board name.";
var strCurrentBoard = "Current Board.";
var strSetSize = "Set Board Size.";
var strRows = "Rows.";
var strColumns = "Columns.";
var strAddBoard = "Add Board.";
var strName = "Name.";
var strDescription = "Description.";
var strNewBoard = "Make New Board.";
var strNewCommunicator = "New Communicator.";
var strMakeNewCommunicator = "Make New Communicator.";

var lang = "en";

const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    } else {
        return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    }
}

function LinkCheck(url) {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    } catch (e) {
        return false;
    }
}

function initLanguages() {
    var lg = getNavigatorLanguage();
    var l = "lang/" + lg + ".json";
    l = "lang/en-gb.json"
    lang = LOADJSON(l, getLang);
    return;

    // do proper language check later - linkcheck not working properly on server.
    var exists = LinkCheck(l);
    if (exists)
        lang = LOADJSON(l, getLang);
    else if (lg.length > 2) {
        l = "lang/" + lg.substring(0, 2) + ".json";;
        lang = LOADJSON(l, getLang);
    }
}

function getLang(s) {
    lang = JSON.parse(s);
    if (lang.hasOwnProperty('PiComBoards'))
        strPiComBoards = lang.PiComBoards;
    if (lang.hasOwnProperty('InputOptions'))
        strInputOptions = lang.InputOptions;
    if (lang.hasOwnProperty('InputMethod'))
        strInputMethod = lang.InputMethod;
    if (lang.hasOwnProperty('AllowZoom'))
        strAllowZoom = lang.AllowZoom;
    if (lang.hasOwnProperty('SelectOn'))
        strSelectOn = lang.SelectOn;
    if (lang.hasOwnProperty('View'))
        strVisual = lang.Visual;
    if (lang.hasOwnProperty('Toolbar'))
        strToolbar = lang.Toolbar;
    if (lang.hasOwnProperty('LabelPosition'))
        strLabelPosition = lang.LabelPosition;
    if (lang.hasOwnProperty('Spacing'))
        strSpacing = lang.Spacing;
    if (lang.hasOwnProperty('HighContrast'))
        strHighContrast = lang.HighContrast;
    if (lang.hasOwnProperty('Background'))
        strBackground = lang.Background;
    if (lang.hasOwnProperty('Highlight'))
        strHighlight = lang.Highlight;
    if (lang.hasOwnProperty('Speech'))
        strSpeech = lang.Speech;
    if (lang.hasOwnProperty('Voice'))
        strVoice = lang.Voice;
    if (lang.hasOwnProperty('Pitch'))
        strPitch = lang.Pitch;
    if (lang.hasOwnProperty('Rate'))
        strRate = lang.Rate;
    if (lang.hasOwnProperty('Volume'))
        strVolume = lang.Volume;
    if (lang.hasOwnProperty('Advanced'))
        strAdvanced = lang.Advanced;
    if (lang.hasOwnProperty('AutoHome'))
        strAutoHome = lang.AutoHome;
    if (lang.hasOwnProperty('LoadBoard'))
        strLoadBoard = lang.LoadBoard;
    if (lang.hasOwnProperty('SaveBoard'))
        strSaveBoard = lang.SaveBoard;
    if (lang.hasOwnProperty('EditButton'))
        strEditButton = lang.EditButton;
    if (lang.hasOwnProperty('ResetSettings'))
        strResetSettings = lang.ResetSettings;
    if (lang.hasOwnProperty('Text'))
        strText = lang.Text;
    if (lang.hasOwnProperty('Vocalise'))
        strVocalise = lang.Vocalise;
    if (lang.hasOwnProperty('LinkTo'))
        strLinkTo = lang.LinkTo;
    if (lang.hasOwnProperty('Instant'))
        strInstant = lang.Instant;
    if (lang.hasOwnProperty('SpeakOnSelect'))
        strSpeakOnSelect = lang.SpeakOnSelect;
    if (lang.hasOwnProperty('SpeakOnLink'))
        strSpeakOnLink = lang.SpeakOnLink;
    if (lang.hasOwnProperty('TouchpadMode'))
        strTouchpadMode = lang.TouchpadMode;
    if (lang.hasOwnProperty('TouchpadSize'))
        strTouchpadSize = lang.TouchpadSize;
    if (lang.hasOwnProperty('Speed'))
        strSpeed = lang.Speed;
    if (lang.hasOwnProperty('AcceptTimer'))
        strAcceptTimer = lang.AcceptTimer;
    if (lang.hasOwnProperty('WheelScan'))
        strWheelScan = lang.WheelScan;
    if (lang.hasOwnProperty('SwitchStyle'))
        strSwitchStyle = lang.SwitchStyle;

    if (lang.hasOwnProperty('Press'))
        strPress = lang.Press;
    if (lang.hasOwnProperty('Release'))
        strRelease = lang.Release;
    if (lang.hasOwnProperty('Hover'))
        strHover = lang.Hover;
    if (lang.hasOwnProperty('HoverTimer'))
        strHoverTimer = lang.HoverTimer;

    if (lang.hasOwnProperty('Joystick'))
        strJoystick = lang.Joystick;
    if (lang.hasOwnProperty('Absolute'))
        strAbsolute = lang.Absolute;
    if (lang.hasOwnProperty('RowColumn'))
        strRowColumn = lang.RowColumn;
    if (lang.hasOwnProperty('Scan'))
        strScan = lang.Scan;
    if (lang.hasOwnProperty('TouchMouse'))
        strTouchMouse = lang.TouchMouse;
    if (lang.hasOwnProperty('Touchpad'))
        strTouchpad = lang.Touchpad;
    if (lang.hasOwnProperty('AnalogJoystick'))
        strAnalogJoystick = lang.AnalogJoystick;
    if (lang.hasOwnProperty('CursorKeysDpad'))
        strCursorKeysDpad = lang.CursorKeysDpad;
    if (lang.hasOwnProperty('MouseWheel'))
        strMouseWheel = lang.MouseWheel;
    if (lang.hasOwnProperty('Switches'))
        strSwitches = lang.Switches;
    if (lang.hasOwnProperty('TwoSwitchStep'))
        strTwoSwitchStep = lang.TwoSwitchStep;
    if (lang.hasOwnProperty('HoverTimer'))
        strHoverTimer = lang.HoverTimer;
    if (lang.hasOwnProperty('TwoSwitchRowColumn'))
        strTwoSwitchRowColumn = lang.TwoSwitchRowColumn;
    if (lang.hasOwnProperty('OneSwitchStep'))
        strOneSwitchStep = lang.OneSwitchStep;
    if (lang.hasOwnProperty('OneSwitchOverscan'))
        strOneSwitchOverscan = lang.OneSwitchOverscan;
    if (lang.hasOwnProperty('ToolbarBottom'))
        strToolbarBottom = lang.ToolbarBottom;
    if (lang.hasOwnProperty('ToolbarTop'))
        strToolbarTop = lang.ToolbarTop;
    if (lang.hasOwnProperty('Fullscreen'))
        strFullscreen = lang.Fullscreen;
    if (lang.hasOwnProperty('Top'))
        strTop = lang.Top;
    if (lang.hasOwnProperty('Bottom'))
        strBottom = lang.Bottom;
    if (lang.hasOwnProperty('None'))
        strNone = lang.None;
    if (lang.hasOwnProperty('Small'))
        strSmall = lang.Small;
    if (lang.hasOwnProperty('Medium'))
        strMedium = lang.Medium;
    if (lang.hasOwnProperty('Large'))
        strLarge = lang.Large;
    if (lang.hasOwnProperty('Face'))
        strFace = lang.Face;
    if (lang.hasOwnProperty('FaceExpressions'))
        strFaceExpressions = lang.FaceExpressions;

    defaultParams.selectWith = strRelease;
    defaultParams.selectWithSwitchScan = strPress;
    switchInput = strPress;
}
