"use strict";
/**
 * Code example using the Geolocation API
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
var furtwangenGeoloc;
(function (furtwangenGeoloc) {
    const pointsDiv = document.getElementById("points");
    const userPointDiv = document.querySelector(".point.user");
    const iBauPointDiv = document.querySelector(".point.i-bau");
    const donauQuellePointDiv = document.querySelector(".point.donau-quelle");
    const userTextDiv = document.querySelector(".text-field.user");
    const iBauTextDiv = document.querySelector(".text-field.i-bau");
    const donauQuelleTextDiv = document.querySelector(".text-field.donau-quelle");
    const points = [
        { label: "You", element: userPointDiv, text: userTextDiv, latitude: 0, longitude: 0 },
        { label: "HFU I-Bau", element: iBauPointDiv, text: iBauTextDiv, latitude: 48.049993, longitude: 8.210727 },
        { label: "Donau Quelle", element: donauQuellePointDiv, text: donauQuelleTextDiv, latitude: 48.095364, longitude: 8.154895 },
    ];
    // create start screen and register 
    const geoLocationManager = new GeoLocationManager();
    geoLocationManager.onLocation = onLoction;
    // create start screen and register web audio manager
    const startScreen = new StartScreen("start-screen");
    startScreen.addResourceManager(geoLocationManager);
    // start (creates audio context )
    startScreen.start();
    window.addEventListener("resize", calculatePoints);
    function onLoction(coord, timestamp) {
        const userPoint = points[0];
        userPoint.latitude = coord.latitude;
        userPoint.longitude = coord.longitude;
        if (userPoint.label === "You") {
            userPoint.element.classList.add("breathe");
            setTimeout(() => userPoint.element.classList.remove("breathe"), 250);
        }
        calculatePoints();
    }
    function calculatePoints() {
        let maxLatitude = -Infinity;
        let minLatitude = Infinity;
        let maxLongitude = -Infinity;
        let minLongitude = Infinity;
        for (let point of points) {
            maxLatitude = Math.max(maxLatitude, point.latitude);
            minLatitude = Math.min(minLatitude, point.latitude);
            maxLongitude = Math.max(maxLongitude, point.longitude);
            minLongitude = Math.min(minLongitude, point.longitude);
        }
        const margin = 40;
        const rect = pointsDiv.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const size = Math.min(width, height);
        const xMargin = margin + 0.5 * (width - size);
        const yMargin = margin + 0.5 * (height - size);
        const distLatitude = maxLatitude - minLatitude;
        const distLongitude = maxLongitude - minLongitude;
        const scaleX = (size - 2 * margin) / distLongitude;
        const scaleY = (size - 2 * margin) / distLatitude;
        for (let point of points) {
            const x = xMargin + scaleX * (point.longitude - minLongitude);
            const y = yMargin + scaleY * (point.latitude - minLatitude);
            point.element.style.left = `${x}px`;
            point.element.style.bottom = `${y}px`;
            point.text.innerHTML = `${point.label}: ${point.latitude.toFixed(3)}, ${point.longitude.toFixed(3)}`;
        }
    }
})(furtwangenGeoloc || (furtwangenGeoloc = {}));
//# sourceMappingURL=scripts.js.map