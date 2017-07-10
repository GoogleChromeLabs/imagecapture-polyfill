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
/**
 * MediaStream ImageCapture polyfill
 *
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let ImageCapture = window.ImageCapture;

if (typeof ImageCapture === 'undefined') {
  ImageCapture = class {

    /**
     * TODO https://www.w3.org/TR/image-capture/#constructors
     *
     * @param {MediaStreamTrack} videoStreamTrack - A MediaStreamTrack of the 'video' kind
     */
    constructor(videoStreamTrack) {
      if (videoStreamTrack.kind !== 'video')
        throw new DOMException('NotSupportedError');

      this._videoStreamTrack = videoStreamTrack;
      if (!('readyState' in this._videoStreamTrack)) {
        // Polyfill for Firefox
        this._videoStreamTrack.readyState = 'live';
      }

      // MediaStream constructor not available until Chrome 55 - https://www.chromestatus.com/feature/5912172546752512
      this._previewStream = new MediaStream([videoStreamTrack]);
      this.videoElement = document.createElement('video');
      this.videoElement.src = URL.createObjectURL(this._previewStream);
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
      return this._videoStreamTrack;
    }

    /**
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-getphotocapabilities
     * @return {Promise<PhotoCapabilities>} Fulfilled promise with [PhotoCapabilities](https://www.w3.org/TR/image-capture/#idl-def-photocapabilities) object on success, rejected promise on failure
     */
    getPhotoCapabilities() {
      return new Promise(function executorGPC(resolve, reject) {
        // TODO see https://github.com/w3c/mediacapture-image/issues/97
        let MediaSettingsRange = {
          current: 0, min: 0, max: 0,
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
          zoom: MediaSettingsRange,
        });
        reject(new DOMException('OperationError'));
      });
    }

    /**
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-setoptions
     * @param {Object} photoSettings - Photo settings dictionary, https://www.w3.org/TR/image-capture/#idl-def-photosettings
     * @return {Promise<void>} Fulfilled promise on success, rejected promise on failure
     */
    setOptions(photoSettings = {}) {
      return new Promise(function executorSO(resolve, reject) {
        // TODO
      });
    }

    /**
     * TODO
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-takephoto
     * @return {Promise<Blob>} Fulfilled promise with [Blob](https://www.w3.org/TR/FileAPI/#blob) argument on success; rejected promise on failure
     */
    takePhoto() {
      let self = this;
      return new Promise(function executorTP(resolve, reject) {
        // `If the readyState of the MediaStreamTrack provided in the constructor is not live,
        // return a promise rejected with a new DOMException whose name is "InvalidStateError".`
        if (self._videoStreamTrack.readyState === 'live') {
          // -- however, checking for `live` alone doesn't guarantee the video is ready
          if (self.videoElement.videoWidth) {
            try {
              self.canvasElement.width = self.videoElement.videoWidth;
              self.canvasElement.height = self.videoElement.videoHeight;
              self.canvas2dContext.drawImage(self.videoElement, 0, 0);
              self.canvasElement.toBlob(blob => {
                resolve(blob);
              });
            } catch (error) {
              reject(new DOMException('UnknownError'));
            }
          } else {
            reject(new DOMException('UnknownError'));
          }
        } else {
          reject(new DOMException('InvalidStateError'));
        }
      });
    }

    /**
     * Implements https://www.w3.org/TR/image-capture/#dom-imagecapture-grabframe
     * @return {Promise<ImageBitmap>} Fulfilled promise with [ImageBitmap](https://www.w3.org/TR/html51/webappapis.html#webappapis-images) argument on success; rejected promise on failure
     */
    grabFrame() {
      let self = this;
      return new Promise(function executorGF(resolve, reject) {
        if (self._videoStreamTrack.readyState === 'live') {
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
              reject(new DOMException('UnknownError'));
            }
          } else {
            reject(new DOMException('UnknownError'));
          }
        } else {
          reject(new DOMException('InvalidStateError'));
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
// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////////

// Demo for the MediaStream ImageCapture polyfill

'use strict';

let logElement = document.querySelector('#log');

/**
 * Log messages to the #log element and the console
 * @param {*[]} messages - list of messages
 */
function log(...messages) {
  console.log(...messages);
  let p = document.createElement('p');
  p.innerText = messages.join(' ');
  logElement.appendChild(p);
}

/**
 * Log messages to the #log element and the console as errors
 * @param {*} messages - list of messages
 */
function err(...messages) {
  console.error(...messages);
  let p = document.createElement('p');
  p.innerText = messages.join(' ');
  p.style = 'color: red';
  logElement.appendChild(p);
}



let interval;
let canvas = document.getElementById('frame');

let photo = document.getElementById('photo');
photo.addEventListener('load', function () {
  // After the image loads, discard the image object to release the memory
  window.URL.revokeObjectURL(photo.src);
});

let videoDevice;
document.getElementById('stop').addEventListener('click', stopFunction);

// Use navigator.mediaDevices.getUserMedia instead of navigator.getUserMedia, per
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia and https://webrtc.org/web-apis/interop/
// For cross-platform compatibility, we'll use the WebRTC adapter.js library
navigator.mediaDevices.getUserMedia({video: true}).then(gotMedia).catch(failedToGetMedia);

/**
 * We have a video capture device. Exercise various capturing modes.
 * @param {MediaStream} mediaStream
 */
function gotMedia(mediaStream) {
  // Extract video track.
  videoDevice = mediaStream.getVideoTracks()[0];
  log('Using camera', videoDevice.label);

  let captureDevice = new __WEBPACK_IMPORTED_MODULE_0__src_imagecapture__["a" /* ImageCapture */](videoDevice, mediaStream);
  interval = setInterval(function () {
    captureDevice.grabFrame().then(processFrame).catch(error => {
      err((new Date()).toISOString(), 'Error while grabbing frame:', error);
    });

    captureDevice.takePhoto().then(processPhoto).catch(error => {
      err((new Date()).toISOString(), 'Error while taking photo:', error);
    });
  }, 300);
}

/**
 * Draw the imageBitmap returned by grabFrame() onto a canvas
 * @param {ImageBitmap} imageBitmap
 */
function processFrame(imageBitmap) {
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
}

/**
 * Set the source of the 'photo' <img> to the blob returned by takePhoto()
 * @param {Blob} blob
 */
function processPhoto(blob) {
  photo.src = window.URL.createObjectURL(blob);
}

/**
 * Stop frame grabbing and video capture
 */
function stopFunction() {
  if (interval) clearInterval(interval);  // stop frame grabbing
  if (videoDevice) videoDevice.stop();  // turn off the camera
}

/**
 * Handle errors
 * @param {Error} error
 */
function failedToGetMedia(error) {
  err('getUserMedia failed:', error);
  stopFunction();
}


/***/ }
/******/ ]);