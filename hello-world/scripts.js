"use strict";
// retrieve hello world div from DOM
const div = document.getElementById("hello-world");
// set random color 
setInterval(setRandomDivColor, 250);
function setRandomDivColor() {
    const r = Math.floor(255 * Math.random()); // random red value 0 to 255
    const g = Math.floor(255 * Math.random()); // random green value 0 to 255
    const b = Math.floor(255 * Math.random()); // random blue value 0 to 255
    // compose color string
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    // text color
    div.style.color = color;
    // print color to console
    console.log(color);
}
//# sourceMappingURL=scripts.js.map