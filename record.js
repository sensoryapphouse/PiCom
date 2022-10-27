//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

function startRecording() {
    console.log("recordButton clicked");

    /*
    	Simple constraints object, for more advanced audio features see
    	https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = {
        audio: true,
        video: false
    }

    /*
    	Disable the record button until we get a success or fail from getUserMedia() 
	*/

    btnRecSnd.style.opacity = .5;
    btnStopRec.style.opacity = 1.;

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
        	create an audio context after getUserMedia is called
        	sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
        	the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        //        document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
        	Create the Recorder object and configure to record mono sound (1 channel)
        	Recording 2 channels  will double the file size
        */
        rec = new Recorder(input, {
            numChannels: 1
        })

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function (err) {
        //enable the record button if getUserMedia() fails
        btnRecSnd.disabled = false;
        //        btnStopRec.disabled = true;
    });
}

function stopRecording() {
    if (btnRecSnd.style.opacity == 1.)
        return;
    btnRecSnd.style.opacity = 1.;
    btnStopRec.style.opacity = .5;
    console.log("stopButton clicked");
    try {
        //disable the stop button, enable the record too allow for new recordings
        //        btnStopRec.disabled = true;
        btnRecSnd.disabled = false;


        //tell the recorder to stop the recording
        rec.stop();

        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to createDownloadLink
        rec.exportWAV(createDownloadLink);
    } catch (e) {}
}

function createDownloadLink(blob) {
    var reader = new FileReader();
    reader.onload = function () {
        //        alert(reader.result);
        var s = "";
        if (myBoard.sounds.length == 0) { // no sounds yet
            s = "Picom1";
        } else {
            if (myBoard.buttons[btnIndex].hasOwnProperty('sound_id')) {
                s = myBoard.buttons[btnIndex].sound_id;
                var i = soundIndexFromId(s);
                myBoard.sounds[i].data = reader.result;
                return;
            } else {
                s = myBoard.sounds[myBoard.sounds.length - 1].id;
                if (s.includes("Picom")) {
                    s = s.substr(5);
                    s = "Picom" + (parseInt(s) + 1);
                } else
                    s = "Picom1";
            }
        }

        myBoard.buttons[btnIndex].sound_id = s;
        var tmp = {
            "id": s,
            "data": reader.result
        }
        myBoard.sounds[myBoard.sounds.length] = tmp;
    }
    reader.readAsDataURL(blob); // get sound data
}
