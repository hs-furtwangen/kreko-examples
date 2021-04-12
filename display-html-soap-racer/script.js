/**
 * An example on how to you pure html element to create
 * an interactive visualization
 *
 * Gabriel Rausch (2021)
 */
var displayHTMLSoapRacer;
(function (displayHTMLSoapRacer) {
    var autoLeft = 0;
    var timer = 0;
    window.onload = function () {
        document.querySelector("#auto").addEventListener("click", drive, false);
        window.setInterval(setTimer, 1000);
    };
    function drive() {
        autoLeft += window.innerWidth / 10;
        document.getElementById("auto").style.left = autoLeft + "px";
        if (autoLeft > window.innerWidth * 0.75) {
            alert("Yeaaahhh!!! Zeit: " + timer + "s");
        }
    }
    function setTimer() {
        timer++;
        document.getElementById("zeitanzeige").innerHTML = timer + "s";
    }
})(displayHTMLSoapRacer || (displayHTMLSoapRacer = {}));
