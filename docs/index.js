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

import {ImageCapture} from '../src/imagecapture';

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
  let captureDevice = new ImageCapture(videoDevice, mediaStream);
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
