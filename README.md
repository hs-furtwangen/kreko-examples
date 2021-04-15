# KreKo Example Code

---

## HTML, CSS, TypeScript Basics
This is a set of basic code examples using HTML, CSS and TypeScript:
- [Hello World (with HTML, CSS and TypeScript)](./hello-world)
- [HTML Soap Racer](./display-html-soap-racer),
  simple interactive game purely based on HTML elements
- [Canvas Drawing](./display-canvas-drawing),
  allows for drawing with different colors using an HTML canvas (2D)

---

## Mobile Device Sensors and Actuators
Below is a set of examples using mobile and media APIs:
- [*Device Motion* and *Device Orientation*](https://developers.google.com/web/fundamentals/native-hardware/device-orientation){:target="_blank"}
- [*Geolocation*](https://developers.google.com/web/fundamentals/native-hardware/user-location){:target="_blank"}
- [*Media Devices*](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/){:target="_blank"}
- [*Web Audio*](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API){:target="_blank"}

### Device Motion and Orientation
- [Raw Sensor Values](./motion-sensors/),
  displays sensor values obtained through the *Device Motion/Orientation* API
- [Shake'n'Flash](./shake-n-flash/){:target="_blank"},
  visualises *acceleration* of the *Device Motion* API
- [G-Buzz](./g-buzz/){:target="_blank"},
  sonifies *accelerationIncludingGravity* of the *Device Motion* API
- [Bouncing Ball](./bouncing-ball/){:target="_blank"},
  uses *accelerationIncludingGravity* to drive a virtual ball

### GPS Geolocation
- [Furtwangen Geoloc](./furtwangen-geoloc/), 
  displays the device's location in respect to the Digital Media Facutly and the soucre of the danube using the *Geolocation* API

### Audio/Video Input/Output
- [Photo Booth](./photo-booth/), 
  captures a still image from a video stream using the *Media Devices* API and HTML canvas
- [Sample Pads](./sample-pads/),
  simple drum pads using the *Web Audio* API
- [Dancing Smiley](./dancing-smiley/), 
  smiley reacting on audio input using the *Media Devices* and *Web Audio* APIs
- [Mad Mic](./mad-mic/), 
  applying complex *Web Audio* effect to mic input (best with head phones)

---

## Client-Server Communication
These examples show how to communicate data between clients and servers:
- [HTTP Message Board](./http-message-board/), 
  a simple message board using HTTP requests
- [Counter Pads](../kreko-counter-pads/), 
  counts touches from all connected clients using Web Socket connections
- [Simple Chat](../kreko-simple-chat/), 
  very simple chat using Web Socket connections
- [Photo Collector](../kreko-photo-collector/), 
  collects photos via Web Socket connections
- [Photo Collector Display](../kreko-photo-collector/display.html), collects photos via Web Socket connections

