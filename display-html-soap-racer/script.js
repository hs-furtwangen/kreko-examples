/**
 * An example on how to you pure html element to create
 * an interactive visualization
 *
 * Gabriel Rausch (2021)
 */
var displayHTMLOnly;
(function (displayHTMLOnly) {
    var autoLeft = 150;
    var timer = 0;
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
})(displayHTMLOnly || (displayHTMLOnly = {}));
