"use strict";
/**
 * An example on how to you pure html element to create
 * an interactive visualization
 *
 * Gabriel Rausch (2021)
 */
var displayHTMLSoapRacer;
(function (displayHTMLSoapRacer) {
    let autoLeft = 150;
    let timer = 0;
    window.onload = function () {
        document.querySelector("#auto").addEventListener("mouseover", drive, false);
        window.setInterval(setTimer, 1000);
    };
    function drive() {
        autoLeft += 30;
        document.getElementById("auto").style.left = autoLeft + "px";
        if (autoLeft > 1400) {
            alert("Yeaaahhh!!! Zeit: " + timer + "s");
        }
    }
    function setTimer() {
        timer++;
        document.getElementById("zeitanzeige").innerHTML = timer + "s";
    }
})(displayHTMLSoapRacer || (displayHTMLSoapRacer = {}));
//# sourceMappingURL=script.js.map