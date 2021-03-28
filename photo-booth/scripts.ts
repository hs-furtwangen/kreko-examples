namespace photoBooth {
  const video: HTMLVideoElement = <HTMLVideoElement>document.getElementById("video");
  const image: HTMLImageElement = <HTMLImageElement>document.getElementById("image");
  const instructions: HTMLDivElement = <HTMLDivElement>document.getElementById("instructions");
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  let imageWidth: number = null;
  let imageHeight: number = null;
  let videoX: number = null;
  let videoY: number = null;

  // create user media manager and assign video element
  const userMediaManager: UserMediaManager = new UserMediaManager({ video: true, audio: false });
  userMediaManager.videoElement = video;

  // create start screen and register user media manager
  const startScreen: StartScreen = new StartScreen("start-screen");
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
  function takeSnapshot(): void {
    const context: CanvasRenderingContext2D = canvas.getContext("2d");
    context.drawImage(video, videoX, videoY, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);

    const srcDataUrl: string = canvas.toDataURL("image/png");
    image.setAttribute("src", srcDataUrl);

    // hide video and show image
    video.classList.add("hide");
    image.classList.remove("hide");

    // update instructions overlay
    instructions.innerHTML = "tap screen to display camera capture";
  }

  // return to live video display
  function resetVideo(): void {
    // hide image and show video
    image.classList.add("hide");
    video.classList.remove("hide");

    // update instructions overlay
    instructions.innerHTML = "tap screen to take a snapshot";
  }

  // adapt video element to current screen size
  function adaptElements(): void {
    const rect: DOMRect = document.body.getBoundingClientRect();
    const screenWidth: number = rect.width;
    const screenHeight: number = rect.height;
    const videoWidth: number = video.videoWidth;
    const videoHeight: number = video.videoHeight;
    const widthRatio: number = videoWidth / screenWidth;
    const heightRatio: number = videoHeight / screenHeight;
    const ratio: number = Math.min(widthRatio, heightRatio);

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
    const videoScreenWidth: number = Math.floor(videoWidth / ratio + 0.5);
    const videoScreenHeight: number = Math.floor(videoHeight / ratio + 0.5);
    const videoScreenX: number = Math.floor(videoX / ratio + 0.5);
    const videoScreenY: number = Math.floor(videoY / ratio + 0.5);

    // resize and position video an screen
    video.width = videoScreenWidth;
    video.height = videoScreenHeight;
    video.style.left = `${-videoScreenX}px`;
    video.style.top = `${-videoScreenY}px`;

    // show live video
    resetVideo();
  }
}
