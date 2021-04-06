/**
 * An example on how to use Canvas for visualization
 * 
 * Gabriel Rausch (2021)
 */
namespace displayCanvasDrawing {
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let mouseIsDown: Boolean = false;
let lastPosition: number[] = [];
let currentColor: string = "blue";

window.onload = function (): void {
    canvas = document.querySelector("#can");
    context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.addEventListener("mousedown", onCanvasDown, false);
    canvas.addEventListener("mouseup", onCanvasUp, false);
    canvas.addEventListener("mousemove", onCanvasMove, false);

    let colorPickers: NodeListOf<HTMLDivElement> = document.querySelectorAll(".colorPicker");
    for (let index: number = 0; index < colorPickers.length; index++) {
        const colorPicker: HTMLDivElement = colorPickers[index];
        colorPicker.addEventListener("click", onColorPickerClick, false);
        
    }
};


function onCanvasDown(e: MouseEvent): void {
    lastPosition = [e.pageX, e.pageY]
    mouseIsDown = true;
}

function onCanvasUp(e: MouseEvent): void {
    mouseIsDown = false;
}

function onCanvasMove(e: MouseEvent): void {
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

function onColorPickerClick(e: MouseEvent): void {
    let thisColor: string = (e.target as Element).getAttribute("data-color");
    setColor(thisColor);
}


function setColor(color: string): void {
    currentColor = color;
}
