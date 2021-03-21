interface Window {
  webkitAudioContext: typeof AudioContext;
}

if (window.AudioContext == undefined)
  window.AudioContext = window.webkitAudioContext;

  class WebAudioManager implements ResourceManager {
  context: AudioContext = new AudioContext();

  getCheck(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (AudioContext) {
        this.context.resume()
        .then(() => resolve())
        .catch(() => reject());
      } else {
        reject("no web audio");
      }
    });
  }
}
