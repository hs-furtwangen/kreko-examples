"use strict";
/**
 * Code example using the Media Devices (gerUserMedia) API
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
var photoBooth;
(function (photoBooth) {
    const video = document.getElementById("video");
    const image = document.getElementById("image");
    const instructions = document.getElementById("instructions");
    const canvas = document.createElement("canvas");
    let imageWidth = null;
    let imageHeight = null;
    let videoX = null;
    let videoY = null;
    // create user media manager and assign video element
    const userMediaManager = new UserMediaManager({ video: true, audio: false });
    userMediaManager.videoElement = video;
    // create start screen and register user media manager
    const startScreen = new StartScreen("start-screen");
    startScreen.addResourceManager(userMediaManager);
    // start (creates audio context )
    startScreen.start().then(() => {
        video.play().then(() => {
            adaptElements();
            window.addEventListener("resize", adaptElements);
            video.addEventListener("click", takeSnapshot);
            image.addEventListener("click", resetVideo);
        });
    });
    // take a snapshot by copying video into image via (hidden) canvas
    function takeSnapshot() {
        const context = canvas.getContext("2d");
        context.drawImage(video, videoX, videoY, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
        const srcDataUrl = canvas.toDataURL("image/png");
        image.setAttribute("src", srcDataUrl);
        // hide video and show image
        video.classList.add("hide");
        image.classList.remove("hide");
        // update instructions overlay
        instructions.innerHTML = "tap screen to display camera capture";
    }
    // return to live video display
    function resetVideo() {
        // hide image and show video
        image.classList.add("hide");
        video.classList.remove("hide");
        // update instructions overlay
        instructions.innerHTML = "tap screen to take a snapshot";
    }
    // adapt video element to current screen size
    function adaptElements() {
        const rect = document.body.getBoundingClientRect();
        const screenWidth = rect.width;
        const screenHeight = rect.height;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const widthRatio = videoWidth / screenWidth;
        const heightRatio = videoHeight / screenHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        // set image size and offset
        imageWidth = Math.floor(ratio * screenWidth + 0.5);
        imageHeight = Math.floor(ratio * screenHeight + 0.5);
        videoX = Math.max(0, Math.floor(0.5 * (videoWidth - imageWidth) + 0.5));
        videoY = Math.max(0, Math.floor(0.5 * (videoHeight - imageHeight) + 0.5));
        // adapt canvas size to input video size
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        // adapt canvas size to screen
        image.width = screenWidth;
        image.height = screenHeight;
        // calculate video screen size and offset
        const videoScreenWidth = Math.floor(videoWidth / ratio + 0.5);
        const videoScreenHeight = Math.floor(videoHeight / ratio + 0.5);
        const videoScreenX = Math.floor(videoX / ratio + 0.5);
        const videoScreenY = Math.floor(videoY / ratio + 0.5);
        // resize and position video an screen
        video.width = videoScreenWidth;
        video.height = videoScreenHeight;
        video.style.left = `${-videoScreenX}px`;
        video.style.top = `${-videoScreenY}px`;
        // show live video
        resetVideo();
    }
})(photoBooth || (photoBooth = {}));
//# sourceMappingURL=scripts.js.map