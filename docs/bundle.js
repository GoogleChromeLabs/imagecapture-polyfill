/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ImageCapture; });
/* unused harmony export ImageCaptureError */
let ImageCapture = window.ImageCapture;
let ImageCaptureError = window.ImageCaptureError;

if (typeof ImageCapture === 'undefined') {
  // Private variables storing the read-only properties of the object
  let _videoStreamTrack;
  let _previewStream;
  /**
   * https://www.w3.org/TR/image-capture/#ImageCaptureError
   * @type {{}} TODO
   */
  ImageCaptureError = class {
    constructor(errorDescription) {
      // https://www.w3.org/TR/image-capture/#dom-imagecaptureerror-errordescription
      this._errorDescription = errorDescription;
    }

    /**
     * @return {DOMString} Acceptable values: FRAME_ERROR, OPTIONS_ERROR, PHOTO_ERROR, INVALID_TRACK, and ERROR_UNKNOWN
     */
    get errorDescription() {
      return this._errorDescription;
    }
  };

  ImageCapture = class {

    /**
     * TODO https://www.w3.org/TR/image-capture/#constructors
     *
     * Per spec, the constructor only takes the first parameter.
     * However, without the preview stream, we can't supply a URL to the
     * videoElement that feeds both grabFrame() and takePhoto().
     *
     * @param {MediaStreamTrack} videoStreamTrack - A MediaStreamTrack, usually the video track of the previewStream
     * @param {MediaStream} previewStream - The MediaStream that provides a camera preview
     */
    constructor(videoStreamTrack, previewStream) {
      if (videoStreamTrack.kind !== 'video')
        throw new DOMException('NotSupportedError');

      _videoStreamTrack = videoStreamTrack;
      _previewStream = previewStream;
      this.videoElement = document.createElement('video');
      this.videoElement.src = window.URL.createObjectURL(previewStream);
      this.videoElement.muted = true;
      this.videoElement.play();  // required by Firefox

      this.canvasElement = document.createElement('canvas');
      // TODO Firefox has https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
      this.canvas2dContext = this.canvasElement.getContext('2d');
    }

    /**
     * https://w3c.github.io/mediacapture-image/index.html#dom-imagecapture-videostreamtrack
     * @return {MediaStreamTrack} The MediaStreamTrack passed into the constructor
     */
    get videoStreamTrack() {
      return _videoStreamTrack;
    }

    /**
     * https://w3c.github.io/mediacapture-image/index.html#dom-imagecapture-previewstream
     * @return {MediaStream} The MediaStream that provides a camera preview
     */
    get previewStream() {
      return _previewStream;
    }

    /**
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-getphotocapabilities
     * @return {Promise<PhotoCapabilities>} Fulfilled promise with [PhotoCapabilities](https://www.w3.org/TR/image-capture/#idl-def-photocapabilities) object on success, rejected promise on failure
     */
    getPhotoCapabilities() {
      return new Promise(function (resolve, reject) {
        // TODO
        let MediaSettingsRange = {
          current: 0, min: 0, max: 0
        };
        resolve({
          exposureCompensation: MediaSettingsRange,
          exposureMode: 'none',
          fillLightMode: 'none',
          focusMode: 'none',
          imageHeight: MediaSettingsRange,
          imageWidth: MediaSettingsRange,
          iso: MediaSettingsRange,
          redEyeReduction: false,
          whiteBalanceMode: 'none',
          zoom: MediaSettingsRange
        });
        reject(new ImageCaptureError('OPTIONS_ERROR'));
      });
    }

    /**
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-setoptions
     * @param {Object} photoSettings - Photo settings dictionary, https://www.w3.org/TR/image-capture/#idl-def-photosettings
     * @return {Promise<void>} Fulfilled promise on success, rejected promise on failure
     */
    setOptions(photoSettings = {}) {
      return new Promise(function (resolve, reject) {
        // TODO
      });
    }

    /**
     * TODO
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-takephoto
     * @param {Object} photoSettings - Photo settings dictionary, https://www.w3.org/TR/image-capture/#idl-def-photosettings
     * @return {Promise<Blob>} Fulfilled promise with [Blob](https://www.w3.org/TR/FileAPI/#blob) argument on success; rejected promise on failure
     */
    takePhoto(photoSettings = {}) {
      let self = this;
      return new Promise(function (resolve, reject) {
        if (!('readyState' in self.videoStreamTrack)) {
          // Polyfill for Firefox
          self.videoStreamTrack.readyState = 'live';
        }

        // "If the readyState of the MediaStreamTrack provided in the constructor is not 'live',
        // the UA must return a promise rejected with a newly created ImageCaptureError object
        // whose errorDescription is set to INVALID_TRACK."
        if (self.videoStreamTrack.readyState === 'live') {
          // -- however, checking for `live` alone doesn't guarantee the video is ready
          if (self.videoElement.videoWidth) {
            try {
              self.canvasElement.width = self.videoElement.videoWidth;
              self.canvasElement.height = self.videoElement.videoHeight;
              self.canvas2dContext.drawImage(self.videoElement, 0, 0);
              // TODO polyfill photoSettings
              self.canvasElement.toBlob(blob => {
                resolve(blob);
              });
            } catch (error) {
              reject(new ImageCaptureError('PHOTO_ERROR'));
            }
          } else {
            reject(new ImageCaptureError('PHOTO_ERROR'));
          }
        } else {
          reject(new ImageCaptureError('INVALID_TRACK'));
        }
      });
    }

    /**
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-grabframe
     * @return {Promise<ImageBitmap>} Fulfilled promise with [ImageBitmap](https://www.w3.org/TR/html51/webappapis.html#webappapis-images) argument on success; rejected promise on failure
     */
    grabFrame() {
      let self = this;
      return new Promise(function (resolve, reject) {
        if (!('readyState' in self.videoStreamTrack))
          self.videoStreamTrack.readyState = 'live';

        if (self.videoStreamTrack.readyState === 'live') {
          if (self.videoElement.videoWidth) {
            try {
              // videoWidth is available after videoElement.onloadedmetadata fires
              self.canvasElement.width = self.videoElement.videoWidth;
              self.canvasElement.height = self.videoElement.videoHeight;
              // The video has an image after videoElement.oncanplay triggers
              self.canvas2dContext.drawImage(self.videoElement, 0, 0);
              // TODO polyfill https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmapFactories/createImageBitmap for IE
              resolve(window.createImageBitmap(self.canvasElement));
            } catch (error) {
              reject(new ImageCaptureError('FRAME_ERROR'));
            }
          } else {
            reject(new ImageCaptureError('FRAME_ERROR'));
          }
        } else {
          reject(new ImageCaptureError('INVALID_TRACK'));
        }
      });
    }

  };
}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_imagecapture__ = __webpack_require__(0);
"use strict";

let logElement = document.querySelector('#log');

/**
 * Take a list of parameters, stringify them, and join the elements by spaces
 * @param {*[]} messages - List of messages
 * @return {string} Space-separated list of stringified messages
 */
function list2string(...messages) {
  return messages.map(message =>
      typeof message === 'object' ? JSON.stringify(message) : message
  ).join(' ');
}

/**
 * Log messages to the #log element and the console
 * @param messages - list of messages
 */

function log(...messages) {
  console.log(...messages);
  let p = document.createElement('p');
  p.innerText = list2string(...messages);
  logElement.appendChild(p);
}

/**
 * Log messages to the #log element and the consle as errors
 * @param messages - list of messages
 */

function err(...messages) {
  console.error(...messages);
  let p = document.createElement('p');
  p.innerText = list2string(...messages);
  p.style = 'color: red';
  logElement.appendChild(p);
}



let interval;
let canvas = document.getElementById('frame');

let photo = document.getElementById('photo');
photo.addEventListener('load', function () {
  // After the image loads, discard the image object to release the memory
  window.URL.revokeObjectURL(this.src);
});

let videoDevice;
document.getElementById('stop').addEventListener('click', stopFunction);

// Use navigator.mediaDevices.getUserMedia instead of navigator.getUserMedia, per
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia and https://webrtc.org/web-apis/interop/
// For cross-platform compatibility, we'll use the WebRTC adapter.js library
navigator.mediaDevices.getUserMedia({video: true}).then(gotMedia).catch(failedToGetMedia);

function gotMedia(mediaStream) {
  // Extract video track.
  videoDevice = mediaStream.getVideoTracks()[0];
  log('Using camera', videoDevice.label);
  // Check if this device supports a picture mode...
  let captureDevice = new __WEBPACK_IMPORTED_MODULE_0__src_imagecapture__["a" /* ImageCapture */](videoDevice, mediaStream);
  if (captureDevice) {
    interval = setInterval(function () {
      captureDevice.grabFrame().then(processFrame).catch(error => {
        err((new Date()).toISOString(), error);
      });

      captureDevice.takePhoto().then(processPhoto).catch(error => {
        err((new Date()).toISOString(), error);
      });
    }, 300);
  }
}

function processFrame(imageBitmap) {
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
}

function processPhoto(blob) {
  photo.src = window.URL.createObjectURL(blob);
}

function stopFunction() {
  if (interval) clearInterval(interval);  // stop frame grabbing
  if (videoDevice) videoDevice.stop();  // turn off the camera
}

function failedToGetMedia(error) {
  err('getUserMedia failed:', error);
  stopFunction();
}


/***/ }
/******/ ]);