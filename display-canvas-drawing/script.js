/**
 * Example on how to use Canvas for visualization
 *
 * Gabriel Rausch (2021)
 */
var canvas;
var context;
var mouseIsDown = false;
var lastPosition = [];
var currentColor = "blue";
window.onload = function () {
    canvas = document.querySelector("#can");
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener("mousedown", onCanvasDown, false);
    canvas.addEventListener("mouseup", onCanvasUp, false);
    canvas.addEventListener("mousemove", onCanvasMove, false);
    var colorPickers = document.querySelectorAll(".colorPicker");
    for (var index = 0; index < colorPickers.length; index++) {
        var colorPicker = colorPickers[index];
        colorPicker.addEventListener("click", onColorPickerClick, false);
    }
};
function onCanvasDown(e) {
    lastPosition = [e.pageX, e.pageY];
    mouseIsDown = true;
}
function onCanvasUp(e) {
    mouseIsDown = false;
}
function onCanvasMove(e) {
    if (mouseIsDown) {
        context.beginPath();
        context.moveTo(lastPosition[0], lastPosition[1]);
        context.lineTo(e.pageX, e.pageY);
        context.lineWidth = 5;
        context.strokeStyle = currentColor;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        lastPosition = [e.pageX, e.pageY];
    }
}
function onColorPickerClick(e) {
    var thisColor = e.target.getAttribute("data-color");
    setColor(thisColor);
}
function setColor(color) {
    currentColor = color;
}
