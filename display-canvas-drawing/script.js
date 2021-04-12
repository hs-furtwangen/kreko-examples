/**
 * An example on how to use Canvas for visualization
 *
 * Gabriel Rausch (2021)
 */
var displayCanvasDrawing;
(function (displayCanvasDrawing) {
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
        // support touch input
        canvas.addEventListener("touchstart", onCanvasDown, false);
        canvas.addEventListener("touchmove", onCanvasMove, false);
        canvas.addEventListener("touchend", onCanvasUp, false);
        canvas.addEventListener("touchcancel", onCanvasUp, false);
        // and the good old mouse events as well :-)
        canvas.addEventListener("mousedown", onCanvasDown, false);
        canvas.addEventListener("mousemove", onCanvasMove, false);
        canvas.addEventListener("mouseup", onCanvasUp, false);
        canvas.addEventListener("mouseout", onCanvasUp, false);
        var colorPickers = document.querySelectorAll(".colorPicker");
        for (var index = 0; index < colorPickers.length; index++) {
            var colorPicker = colorPickers[index];
            // this click handler is going to be adapted for touch, thus a separate handle
            // is not needed
            colorPicker.addEventListener("click", onColorPickerClick, false);
        }
    };
    function onCanvasDown(e) {
        var x = e.changedTouches ?
            e.changedTouches[0].pageX :
            e.pageX;
        var y = e.changedTouches ?
            e.changedTouches[0].pageY :
            e.pageY;
        lastPosition = [x, y];
        mouseIsDown = true;
    }
    function onCanvasUp() {
        mouseIsDown = false;
    }
    function onCanvasMove(e) {
        if (mouseIsDown) {
            context.beginPath();
            context.moveTo(lastPosition[0], lastPosition[1]);
            var x = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            var y = e.changedTouches ?
                e.changedTouches[0].pageY :
                e.pageY;
            context.lineTo(x, y);
            context.lineWidth = 5;
            context.strokeStyle = currentColor;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
            lastPosition = [x, y];
        }
    }
    function onColorPickerClick(e) {
        var thisColor = e.target.getAttribute("data-color");
        setColor(thisColor);
    }
    function setColor(color) {
        currentColor = color;
    }
})(displayCanvasDrawing || (displayCanvasDrawing = {}));
