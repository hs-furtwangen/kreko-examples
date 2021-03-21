"use strict";
if (window.AudioContext == undefined)
    window.AudioContext = window.webkitAudioContext;
class WebAudioManager {
    constructor() {
        this.context = new AudioContext();
    }
    getCheck() {
        return new Promise((resolve, reject) => {
            if (AudioContext) {
                this.context.resume()
                    .then(() => resolve())
                    .catch(() => reject());
            }
            else {
                reject("no web audio");
            }
        });
    }
}
//# sourceMappingURL=WebAudioManager.js.map