// retrieve hello world div from DOM
const div: HTMLDivElement = <HTMLDivElement>document.getElementById("hello-world");

// set random color 
setInterval(setRandomDivColor, 250);

function setRandomDivColor(): void {
  const r: number = Math.floor(255 * Math.random()); // random red value 0 to 255
  const g: number = Math.floor(255 * Math.random()); // random green value 0 to 255
  const b: number = Math.floor(255 * Math.random()); // random blue value 0 to 255

  // compose color string
  const color: string = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  // text color
  div.style.color = color;

  // print color to console
  console.log(color);
}

