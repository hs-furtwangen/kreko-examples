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
        
        let colorPickers: NodeListOf<HTMLDivElement> = document.querySelectorAll(".colorPicker");
        for (let index: number = 0; index < colorPickers.length; index++) {
            const colorPicker: HTMLDivElement = colorPickers[index];
            
            // this click handler is going to be adapted for touch, thus a separate handle
            // is not needed
            colorPicker.addEventListener("click", onColorPickerClick, false);

        }
    };

    function onCanvasDown(e: MouseEvent | TouchEvent): void {
        let x: number = (e as TouchEvent).changedTouches ?
                 (e as TouchEvent).changedTouches[0].pageX :
                 (e as MouseEvent).pageX;
        let y: number = (e as TouchEvent).changedTouches ?
                    (e as TouchEvent).changedTouches[0].pageY :
                    (e as MouseEvent).pageY;
        lastPosition = [x, y];
        
        mouseIsDown = true;
    }

    function onCanvasUp(): void {
        mouseIsDown = false;
    }

    function onCanvasMove(e: MouseEvent | TouchEvent): void {
        if (mouseIsDown) {

            context.beginPath();
            context.moveTo(lastPosition[0], lastPosition[1]);

            let x: number = (e as TouchEvent).changedTouches ?
                (e as TouchEvent).changedTouches[0].pageX :
                (e as MouseEvent).pageX;
            let y: number = (e as TouchEvent).changedTouches ?
                (e as TouchEvent).changedTouches[0].pageY :
                (e as MouseEvent).pageY;
               
            context.lineTo(x, y);
            context.lineWidth = 5;
            context.strokeStyle = currentColor;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
            lastPosition = [x, y];
        }
    }

    function onColorPickerClick(e: MouseEvent): void {
        let thisColor: string = (e.target as Element).getAttribute("data-color");
        setColor(thisColor);
    }


    function setColor(color: string): void {
        currentColor = color;
    }
}