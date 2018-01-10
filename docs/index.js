// Copyright 2018 Google Inc.
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

const logElement = document.querySelector('#log');

/**
 * Log messages to the #log element and the console
 * @param {*[]} messages - list of messages
 */
function log(...messages) {
  console.log(...messages);
  const p = document.createElement('p');
  p.innerText = messages.join(' ');
  logElement.appendChild(p);
}

/**
 * Log messages to the #log element and the console as errors
 * @param {*} messages - list of messages
 */
function err(...messages) {
  console.error(...messages);
  const p = document.createElement('p');
  p.innerText = messages.join(' ');
  p.style = 'color: red';
  logElement.appendChild(p);
}

import {ImageCapture} from '../src/imagecapture';

let interval;
const canvas = document.getElementById('frame');

const photo = document.getElementById('photo');
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

  const captureDevice = new ImageCapture(videoDevice, mediaStream);
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
