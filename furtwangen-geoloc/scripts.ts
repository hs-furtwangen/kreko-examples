/**
 * Code example using the Geolocation API
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
 namespace furtwangenGeoloc {
  interface Point {
    label: string;
    element: HTMLDivElement;
    text: HTMLDivElement;
    latitude: number;
    longitude: number;
  }

  const pointsDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("points");
  const userPointDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".point.user");
  const iBauPointDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".point.i-bau");
  const donauQuellePointDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".point.donau-quelle");

  const userTextDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".text-field.user");
  const iBauTextDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".text-field.i-bau");
  const donauQuelleTextDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".text-field.donau-quelle");
  
  const points: Point[] = [
    { label: "You", element: userPointDiv, text: userTextDiv, latitude: 0, longitude: 0 },
    { label: "HFU I-Bau", element: iBauPointDiv,  text: iBauTextDiv, latitude: 48.049993, longitude: 8.210727 },
    { label: "Donau Quelle", element: donauQuellePointDiv,  text: donauQuelleTextDiv, latitude: 48.095364, longitude: 8.154895 },
  ];

  // create start screen and register 
  const geoLocationManager: GeoLocationManager = new GeoLocationManager();
  geoLocationManager.onLocation = onLoction;

  // create start screen and register web audio manager
  const startScreen: StartScreen = new StartScreen("start-screen");
  startScreen.addResourceManager(geoLocationManager);

  // start (creates audio context )
  startScreen.start();

  window.addEventListener("resize", calculatePoints);

  function onLoction(coord: GeolocationCoordinates, timestamp: number): void {
    const userPoint: Point = points[0];

    userPoint.latitude = coord.latitude;
    userPoint.longitude = coord.longitude;

    if (userPoint.label === "You") {
      userPoint.element.classList.add("breathe");
      setTimeout(() => userPoint.element.classList.remove("breathe"), 250);
    }

    calculatePoints();
  }

  function calculatePoints(): void {
    let maxLatitude: number = -Infinity;
    let minLatitude: number = Infinity;
    let maxLongitude: number = -Infinity;
    let minLongitude: number = Infinity;

    for (let point of points) {  
      maxLatitude = Math.max(maxLatitude, point.latitude);
      minLatitude = Math.min(minLatitude, point.latitude);
      maxLongitude = Math.max(maxLongitude, point.longitude);
      minLongitude = Math.min(minLongitude, point.longitude);
    }

    const margin: number = 40;
    const rect: DOMRect = pointsDiv.getBoundingClientRect();
    const width: number = rect.width;
    const height: number = rect.height;
    const size: number = Math.min(width, height);
    const xMargin: number = margin + 0.5 * (width - size);
    const yMargin: number = margin + 0.5 * (height - size);
    const distLatitude: number = maxLatitude - minLatitude;
    const distLongitude: number = maxLongitude - minLongitude;
    const scaleX: number = (size - 2 * margin) / distLongitude;
    const scaleY: number = (size - 2 * margin) / distLatitude;

    for (let point of points) { 
      const x: number = xMargin + scaleX * (point.longitude - minLongitude); 
      const y: number = yMargin + scaleY * (point.latitude - minLatitude); 

      point.element.style.left = `${x}px`;
      point.element.style.bottom = `${y}px`;
      point.text.innerHTML = `${point.label}: ${point.latitude.toFixed(3)}, ${point.longitude.toFixed(3)}`;
    }
  }
}
