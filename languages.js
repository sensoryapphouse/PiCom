var rightToLeft = false;
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
var strCommunicatorChanged = "Save changed communicator?";
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
var strOneSwitchRowColumn = "One switch row/column";
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
var strShare = "Share.";
var strShareCommunicator = "Share/Save Communicator";
var strButtons = "Buttons";
var strBoards = "Boards";
var strRenameBoard = "Rename board";
var strSwap = "Swap";
var strShowTooltips = "Show Tooltips";
var strHello = "Hello";
var strBackgroundImage = "Background Image";

var strChanged = "Current communicator has been changed.  Do you want to save those changes?";
var strYes = "Yes.";
var strNo = "No.";
var strOK = "OK.";
var strLoading = "Loading"
var strNowChoose = "Now choose file to import?"
var strCurrentFile = "Current file";
var strArrowKeys = "Use arrow keys to choose button to edit";
var strFace = "Face Control";
var strFaceExpressions = "Face Control (expressions)";

var strArrows = "Use arrow keys to choose button to edit";
var strSettingsEditor = "Settings editor";
var strButtonEditor = "Button editor";
var strBoardEditor = "Board editor";
var strPreviewImage = "Preview image, background and border colours";
var strDeleteImage = "Delete image from button";
var strChooseImage = "Choose image for button (can also drag and drop images)";
var strBackgroundColour = "Set background colour for button";
var strBorderColour = "Set border colour for button";
var strDeleteSound = "Delete sound file for button";
var strLoadSound = "Load sound file from disc";
var strStopRecording = "Stop recording sound file";
var strRecordSound = "Record sound file for button";
var strPlaySound = "Play sound file";
var strTextLabel = "Text label for button";
var strVolcaliseTooltip = "Alternative text to speak when button pressed";
var strLinkToTooltip = "Link to other board";
var strInstantTooltip = "Speak this button but do not add to message bar";
var strHomeTooltip = "Button goes to home page";
var strBackspaceTooltip = "Delete last button in message bar";
var strClearToolTip = "Clear message bar";
var strSpeakTooltip = "Speak message bar";
var strSearchForImage = "Search for image";
var strCannotAdd = "Cannot add another board to single board communicator (obf)";
var strTypeName = "Please type board name";
var strCurrentBoard = "Current Board";
var strChangeBoard = "Change Board";
var strSetSize = "Set Board Size";
var strRows = "Rows";
var strColumns = "Columns";
var strAddBoard = "Add Board";
var strName = "Name";
var strDescription = "Description";
var strNewBoard = "Make New Board";
var strNewCommunicator = "New Communicator";
var strMakeNewCommunicator = "Make New Communicator";
var strAdvancedBeta = "Advanced (beta)";
var strChangeToSAH = "Change to SAH symbols";
var strMakeLocal = "Make Images Local";
var strFileNotLoad = "File did not load";
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
    let lg = getNavigatorLanguage();
    languageCode = window.localStorage.getItem("PiComL");
    console.log("Language: ", languageCode)
    lg = languageCode;
    l = "lang/" + languageCode + ".json";
    if (typeof lang_map[lg] === 'undefined')
        l = "lang/en-gb.json";
    else {
        l = "lang/" + lang_map[lg] + ".json";
        rightToLeft = (lang_map[lg] === "he" || lang_map[lg] === "ar" || lang_map[lg] === "sd" || lang_map[lg] === "ur" || lang_map[lg] === "yi");
        if (rightToLeft)
            speakBtn.style.left = "18.6vw";
    }
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

function getLang(langTxt) {
    lang = JSON.parse(langTxt);
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
        strVisual = lang.View;
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
    if (lang.hasOwnProperty('ShowTooltips'))
        strShowTooltips = lang.ShowTooltips;
    if (lang.hasOwnProperty('ButtonEditor'))
        strButtonEditor = lang.ButtonEditor;
    if (lang.hasOwnProperty('HideSettingsButton'))
        strHideSettingsButton = lang.HideSettingsButton;
    if (lang.hasOwnProperty('Share'))
        strShare = lang.Share;
    if (lang.hasOwnProperty('ShareCommunicator'))
        strShareCommunicator = lang.ShareCommunicator;
    if (lang.hasOwnProperty('Buttons'))
        strButtons = lang.Buttons;
    if (lang.hasOwnProperty('Boards'))
        strBoards = lang.Boards;
    if (lang.hasOwnProperty('RenameBoard'))
        strRenameBoard = lang.RenameBoard;
    if (lang.hasOwnProperty('Swap'))
        strSwap = lang.Swap;
    if (lang.hasOwnProperty('BackgroundImage'))
        strBackgroundImage = lang.BackgroundImage;
    if (lang.hasOwnProperty('CommunicatorChanged'))
        strCommunicatorChanged = lang.CommunicatorChanged;
    if (lang.hasOwnProperty('Yes'))
        strYes = lang.Yes;
    if (lang.hasOwnProperty('No'))
        strNo = lang.No;
    if (lang.hasOwnProperty('Loading'))
        strLoading = lang.Loading;
    if (lang.hasOwnProperty('NowChoose'))
        strNowChoose = lang.NowChoose;
    if (lang.hasOwnProperty('CurrentFile'))
        strCurrentFile = lang.CurrentFile;
    if (lang.hasOwnProperty('ArrowKeys'))
        strArrowKeys = lang.ArrowKeys;
    if (lang.hasOwnProperty('SettingsEditor'))
        strSettingsEditor = lang.SettingsEditor;
    if (lang.hasOwnProperty('BoardEditor'))
        strBoardEditor = lang.BoardEditor;
    if (lang.hasOwnProperty('PreviewImage'))
        strPreviewImage = lang.PreviewImage;
    if (lang.hasOwnProperty('DeleteImage'))
        strDeleteImage = lang.DeleteImage;
    if (lang.hasOwnProperty('ChooseImage'))
        strChooseImage = lang.ChooseImage;
    if (lang.hasOwnProperty('BackgroundColour'))
        strBackgroundColour = lang.BackgroundColour;
    if (lang.hasOwnProperty('BorderColour'))
        strBorderColour = lang.BorderColour;
    if (lang.hasOwnProperty('DeleteSound'))
        strDeleteSound = lang.DeleteSound;
    if (lang.hasOwnProperty('LoadSound'))
        strLoadSound = lang.LoadSound;
    if (lang.hasOwnProperty('StopRecording'))
        strStopRecording = lang.StopRecording;
    if (lang.hasOwnProperty('RecordSound'))
        strRecordSound = lang.RecordSound;
    if (lang.hasOwnProperty('PlaySound'))
        strPlaySound = lang.PlaySound;
    if (lang.hasOwnProperty('TextLabel'))
        strTextLabel = lang.TextLabel;
    if (lang.hasOwnProperty('VocaliseTooltip'))
        strVolcaliseTooltip = lang.VocaliseTooltip;
    if (lang.hasOwnProperty('LinkToTooltip'))
        strLinkToTooltip = lang.LinkToTooltip;
    if (lang.hasOwnProperty('InstantMessage'))
        strInstant = lang.InstantMessage;
    if (lang.hasOwnProperty('HomePage'))
        strHomeTooltip = lang.HomePage;
    if (lang.hasOwnProperty('Backspace'))
        strBackspaceTooltip = lang.Backspace;
    if (lang.hasOwnProperty('ClearMessage'))
        strClearToolTip = lang.ClearMessage;
    if (lang.hasOwnProperty('SpeakMessage'))
        strSpeakTooltip = lang.SpeakMessage;
    if (lang.hasOwnProperty('SearchForImage'))
        strSearchForImage = lang.SearchForImage;
    if (lang.hasOwnProperty('CannotAdd'))
        strCannotAdd = lang.CannotAdd;
    if (lang.hasOwnProperty('TypeName'))
        strTypeName = lang.TypeName;
    if (lang.hasOwnProperty('CurrentBoard'))
        strCurrentBoard = lang.CurrentBoard;
    if (lang.hasOwnProperty('ChangeBoard'))
        strChangeBoard = lang.ChangeBoard;
    if (lang.hasOwnProperty('SetSize'))
        strSetSize = lang.SetSize;
    if (lang.hasOwnProperty('Rows'))
        strRows = lang.Rows;
    if (lang.hasOwnProperty('AddBoard'))
        strAddBoard = lang.AddBoard;
    if (lang.hasOwnProperty('Name'))
        strName = lang.Name;
    if (lang.hasOwnProperty('Description'))
        strDescription = lang.Description;
    if (lang.hasOwnProperty('NewBoard'))
        strNewBoard = lang.NewBoard;
    if (lang.hasOwnProperty('NewCommunicator'))
        strNewCommunicator = lang.NewCommunicator;
    if (lang.hasOwnProperty('MakeNewCommunicator'))
        strMakeNewCommunicator = lang.MakeNewCommunicator;
    if (lang.hasOwnProperty('AdvancedBeta'))
        strAdvancedBeta = lang.AdvancedBeta;
    if (lang.hasOwnProperty('ChangeToSAH'))
        strChangeToSAH = lang.ChangeToSAH;
    if (lang.hasOwnProperty('MakeLocal'))
        strMakeLocal = lang.MakeLocal;
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
    if (lang.hasOwnProperty('OneSwitchRowColumn'))
        strOneSwitchRowColumnn = lang.OneSwitchRowColumn;
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
    if (lang.hasOwnProperty('InstantMessage'))
        strInstantTooltip = lang.InstantMessage;
    if (lang.hasOwnProperty('SearchForImage'))
        strSearchForImage = lang.SearchForImage;
    if (lang.hasOwnProperty('ArrowKeys'))
        strArrowKeys = lang.ArrowKeys;
    if (lang.hasOwnProperty('FileNotLoad'))
        strFileNotLoad = lang.FileNotLoad;

    params.selectWith = defaultParams.selectWith = strRelease;
    defaultParams.selectWith = strRelease;
    defaultParams.selectWithSwitchScan = strPress;
    switchInput = strPress;

    defaultParams.boardStyle = strToolbarBottom;
    defaultParams.toolbarSize = strMedium;
    defaultParams.textPos = strTop;
    defaultParams.buttonSpacing = strMedium;
    //    defaultParams.inputMethod = 'Touch/Mouse';
    defaultParams.selectWith = strRelease;
    defaultParams.selectWithSwitchScan = strRelease;
    defaultParams.touchpadMode = strAbsolute;
    //    defaultParams.mouseWheel = "Row/Column";
    //    defaultParams.switchStyle = 'Two switch step';
    //
    params = defaultParams;
    loadParams();
}

const lang_map = {
    "af": "af", // afrikaans
    "am": "am", // Amharic
    "ar": "ar", // Arabic
    "ar-DZ": "ar",
    "ar-BH": "ar",
    "ar-EG": "ar",
    "ar-IQ": "ar",
    "ar-JO": "ar",
    "ar-KW": "ar",
    "ar-LB": "ar",
    "ar-LY": "ar",
    "ar-MA": "ar",
    "ar-OM": "ar",
    "ar-QA": "ar",
    "ar-SA": "ar",
    "ar-SY": "ar",
    "ar-TN": "ar",
    "ar-AE": "ar",
    "ar-YE": "ar",
    "as": "as", // Assamese
    "az": "az", // Azerbaijani
    "az-AZ": "az",
    "cy": "cy", // Welsh
    "be": "be", // Belarusian
    "bn": "bn", // Bengali
    "bs": "bs", // bosnian
    "bg": "bg", // bulgarian
    "ca": "ca", // Catalan
    "cs": "cs", // Czech	
    "da": "da", // Danish
    "de": "de", // German
    "de-AT": "de",
    "de-DE": "de",
    "de-LI": "de",
    "de-LU": "de",
    "de-CH": "de",
    "dv": "dv", // Divehi
    "el": "el", // Greek
    "en": "en", // English
    "en-AU": "en",
    "en-BZ": "en",
    "en-CA": "en",
    "en-CB": "en",
    "en-GB": "en",
    "en-IN": "en",
    "en-IE": "en",
    "en-JM": "en",
    "en-NZ": "en",
    "en-PH": "en",
    "en-ZA": "en",
    "en-TT": "en",
    "en-US": "en",
    "es": "es", // Spanish
    "es-AR": "es",
    "es-BO": "es",
    "es-CL": "es",
    "es-CO": "es",
    "es-CR": "es",
    "es-DO": "es",
    "es-EC": "es",
    "es-SV": "es",
    "es-GT": "es",
    "es-HN": "es",
    "es-MX": "es",
    "es-NI": "es",
    "es-PA": "es",
    "es-PY": "es",
    "es-PE": "es",
    "es-PR": "es",
    "es-ES": "es",
    "es-UY": "es",
    "es-VE": "es",
    "et": "et", // Estonian
    "eu": "eu", // basque
    "fa": "fa", // Farsi
    "fi": "fi", // Finniah
    "fr": "fr", // French
    "fr-BE": "fr",
    "fr-CA": "fr",
    "fr-FR": "fr",
    "fr-LU": "fr",
    "fr-CH": "fr",
    "gn": "gn", // Guarani
    "gu": "gu", // Gujarati
    "he": "he", // Hebrew
    "hi": "hi", // Hindi
    "hr": "hr", // Croatian
    "hu": "hu", // Hungarian
    "hy": "hy", // Armenian
    "is": "is", // Icelandic
    "id": "id", // Indonesian
    "it": "it", // Italian
    "it-IT": "it",
    "it-CH": "it",
    "ja": "ja", // Japanese
    "kk": "kk", // Kazakh
    "kn": "kn", // Kannada
    "km": "km", // Central Kymer
    "ko": "ko", // Korean
    "lo": "lo", // Lao
    "lt": "lt", // Lithuanian
    "lv": "lv", // Latvian
    "mi": "mi", // Maori
    "mk": "mk", // FYRO Macedonian
    "ml": "ml", // Malayalam
    "mn": "mn", // Mongolian
    "mr": "mr", // Marathi
    "ms": "ms", // Malay
    "ms-BN": "ms",
    "ms-MY": "ms",
    "mt": "mt", // Maltese
    "my": "my", // Myamar/Burmese
    "ne": "ne", // Nepali
    "nl": "nl", // Dutch
    "nl-BE": "nl",
    "nl-NL": "nl",
    "no": "no", // Norwegian
    "no-NO": "no",
    "or": "or", // Oriya
    "pa": "pa", // Punjabi
    "pl": "pl", // Polish
    "pt": "pt", // Portugese
    "pt-BR": "pt",
    "pt-PT": "pt",
    "ro": "ro", // Romanian
    "ro-MO": "ro",
    "ru": "ru", // Russian
    "ru-MO": "ru",
    "sd": "sd", // Sindhi
    "si": "si", // Sinhala
    "sk": "sk", // Slovak
    "sl": "sl", // Slovenian
    "so": "so", // Somali
    "sq": "sq", // Albanian
    "sr": "sr", // Serbian
    "sr-SP": "sr",
    "sv": "sv", // Swedish
    "sv-FI": "sv",
    "sv-SE": "sv",
    "sw": "sw", // Swahili
    "ta": "ta", // Tamil
    "te": "te", // Telugu
    "tg": "tg", // Tajik
    "th": "th", // Thai
    "tk": "tk", // Turkman
    "tr": "tr", // Turkish
    "ts": "ts", // Tsonga
    "tt": "tt", // Tatar
    "uk": "uk", // Ukranian
    "ur": "ur", // Urdu
    "uz": "uz", // Uzbek
    "uz-UZ": "uz",
    "vi": "vi", // Vietnamese
    "xh": "xh", // Xhosa
    "yi": "yi", // Yiddish
    "zh": "zh", // Mandarin
    "zh-CN": "zh",
    "zh-HK": "zh",
    "zh-MO": "zh",
    "zh-SG": "zh",
    "zh-TW": "zh",
    "zu": "zu" // Zulu
}
