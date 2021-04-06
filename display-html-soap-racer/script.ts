/**
 * An example on how to you pure html element to create 
 * an interactive visualization
 * 
 * Gabriel Rausch (2021)
 */

namespace displayHTMLSoapRacer {
    let autoLeft: number = 150;
    let timer: number = 0;
    
    window.onload = function (): void {
        document.querySelector("#auto").addEventListener("mouseover", drive, false);

        window.setInterval(setTimer, 1000);
    };

    function drive(): void {
        autoLeft += 30;
        document.getElementById("auto").style.left = autoLeft + "px";
        
        if (autoLeft > 1400) {
            alert("Yeaaahhh!!! Zeit: " + timer + "s");
        }
    }
    
    function setTimer(): void {
        timer++;
        document.getElementById("zeitanzeige").innerHTML = timer + "s";
    }
}