let tempo = 120;
let beatsPerClick = 1; //subdivision
let clickInterval = null;
let metronomeOn = false;
let clicker;

$(document).ready(() => {
    clicker = document.getElementById('click');
    updateDisplay();

    //tempo change
    $("#plus1").click(() => {
        tempo += 1;
        updateDisplay();
        setTempo(tempo);
    });
    $("#minus1").click(() => {
        tempo = Math.max(0, tempo - 1);
        updateDisplay();
        setTempo(tempo);
    });
    $("#plus5").click(() => {
        tempo += 5;
        updateDisplay();
        setTempo(tempo);
    });
    $("#minus5").click(() => {
        tempo = Math.max(0, tempo - 5);
        updateDisplay();
        setTempo(tempo);
    });

    //subdivision change
    $("#sd-1").click(() => {
        beatsPerClick = 1;
        updateDisplay();
        setTempo(tempo);
    });
    $("#sd-2").click(() => {
        beatsPerClick = 2;
        updateDisplay();
        setTempo(tempo);
    });
    $("#sd-3").click(() => {
        beatsPerClick = 3;
        updateDisplay();
        setTempo(tempo);
    });
    $("#sd-4").click(() => {
        beatsPerClick = 4;
        updateDisplay();
        setTempo(tempo);
    });

    $("#toggle").click(() => {
        metronomeOn = !metronomeOn;
        if (metronomeOn) {
            setTempo(tempo);
        } else {
            clearInterval(clickInterval);
        }
        updateDisplay();
    });

});

function computeClickDelay(tempo, beatsPerClick) {
    return 60000 / (tempo * beatsPerClick);
}

function setTempo(tempo) {
    if (!metronomeOn) return;
    clearInterval(clickInterval);
    clickInterval = setInterval(() => {
        clicker.play();
    }, computeClickDelay(tempo, beatsPerClick));
}

function updateDisplay() {

    //set start/stop
    $("#toggle-text").text(metronomeOn ? "STOP" : "START");

    //set the tempo text
    $("#tempo").text(tempo);
    $("#tempo-name").text(getNameForTempo(tempo));
}

function getNameForTempo(tempo) {
    if (tempo < 24) return "Larghissimo";
    if (tempo < 45) return "Grave";
    if (tempo < 60) return "Largo";
    if (tempo < 76) return "Adagio";
    if (tempo < 108) return "Andante";
    if (tempo < 120) return "Moderato";
    if (tempo < 144) return "Allegro";
    if (tempo < 168) return "Vivace";
    if (tempo < 192) return "Presto";
    if (tempo > 216) return "Prestissimo";
}