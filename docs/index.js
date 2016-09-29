"use strict";

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
  // Check if this device supports a picture mode...
  let captureDevice = new ImageCapture(videoDevice, mediaStream);
  if (captureDevice) {
    interval = setInterval(function () {
      captureDevice.grabFrame().then(processFrame).catch(error => {
        console.error((new Date()).toISOString(), error);
      });

      captureDevice.takePhoto().then(processPhoto).catch(error => {
        console.error((new Date()).toISOString(), error);
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
  console.error('Failed due to', error);
  stopFunction();
}
