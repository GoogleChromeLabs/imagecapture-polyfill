# ImageCapture polyfill

[![Build Status](https://travis-ci.org/dandv/imagecapture.svg?branch=master)](https://travis-ci.org/dandv/imagecapture) [![Dependency Status](https://david-dm.org/dandv/imagecapture.svg)](https://david-dm.org/dandv/imagecapture) [![devDependency Status](https://david-dm.org/dandv/imagecapture/dev-status.svg)](https://david-dm.org/dandv/imagecapture#info=devDependencies)

ImageCapture is a polyfill for the [MediaStream Image Capture API](https://w3c.github.io/mediacapture-image/).

## Status

As of October 2016, the ImageCapture spec is still under [active development](https://github.com/w3c/mediacapture-image/issues). The only browser with partial support for the API is [Chrome](https://www.chromestatus.com/feature/4843864737185792), behind the `enable-experimental-web-platform-features` flag.

## Prior art

Prior to this API, in order to take a still picture from the device camera, two approaches have been used:

1. Set the source of a `<video>` element to a stream obtained via [`navigator[.mediaDevices].getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), then use a 2D canvas context to [`drawImage`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage) from that video. The `canvas` can return a URL to be used as the `src` attribute of an `<img>` element, via [`.toDataURL('image/<format>')`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL). ([1](http://www.html5rocks.com/en/tutorials/getusermedia/intro/#toc-screenshot), [2](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos))
2. Use the [HTML Media Capture API](https://w3c.github.io/html-media-capture/), i.e. ` <input type="file" name="image" accept="image/*" capture>`
 
# Demo

[The demo](https://dandv.github.io/imagecapture) currently shows grabFrame() and takePhoto().

# Quick start

```js
let videoDevice;
let canvas = document.getElementById('canvas');
let photo = document.getElementById('photo');

navigator.mediaDevices.getUserMedia({video: true}).then(gotMedia).catch(failedToGetMedia);

function gotMedia(mediaStream) {
  // Extract video track.
  videoDevice = mediaStream.getVideoTracks()[0];
  // Check if this device supports a picture mode...
  let captureDevice = new ImageCapture(videoDevice);
  if (captureDevice) {
    captureDevice.takePhoto().then(processPhoto).catch(stopCamera);
    captureDevice.grabFrame().then(processFrame).catch(stopCamera);
  }
}

function processPhoto(blob) {
  photo.src = window.URL.createObjectURL(blob);
}

function processFrame(imageBitmap) {
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  canvas.getContext('2d').drawImage(imageBitmap, 0, 0);
}

function stopCamera(error) {
  console.error(error);
  if (videoDevice) videoDevice.stop();  // turn off the camera
}

photo.addEventListener('load', function () {
  // After the image loads, discard the image object to release the memory
  window.URL.revokeObjectURL(this.src);
});
```


# Methods

Start by constructing a new ImageCapture object:

```js
let captureDevice;

navigator.mediaDevices.getUserMedia({video: true}).then(mediaStream => {
  captureDevice = new ImageCapture(mediaStream.getVideoTracks()[0]);
}).catch(...)
```

Please consult [the spec](https://w3c.github.io/mediacapture-image/#methods) for full detail on the methods.
 
## constructor(videoStreamTrack)

Takes a video track and returns an ImageCapture object.


## getPhotoCapabilities

TBD

## setOptions

TBD

## takePhoto

Capture the video stream into a [Blob](https://www.w3.org/TR/FileAPI/#blob) containing a single still image.

Returns a Promise that resolves to a Blob on success, or is rejected with `DOMException` on failure.

```js
captureDevice.takePhoto().then(blob => {
  
}).catch(error => ...);
```


## grabFrame

Gather data from the video stream into an [ImageBitmap](https://www.w3.org/TR/html51/webappapis.html#webappapis-images) object. The width and height of the ImageBitmap object are derived from the constraints of the video stream track passed to the constructor.

Returns a Promise that resolves to an ImageBitmap on success, or is rejected with `DOMException` on failure.

```js
captureDevice.grabFrame().then(imageBitmap => {
  
}).catch(error => ...);
```


# Compatibility

The polyfill has been tested to work in current browsers:

* Chrome 55
* Firefox 49
* Chrome 52 for Android
* Firefox 48 for Android

For the widest compatibility, you can additionally load the [WebRTC adapter](https://github.com/webrtc/adapter). That will expand support to:

* Chrome 53 

For older browsers that don't support navigator.getUserMedia, you can additionally load Addy Osmani's shim with optional fallback to Flash - [getUserMedia.js](https://github.com/addyosmani/getUserMedia.js/). Alternatively, the [getUserMedia](https://github.com/otalk/getUserMedia) wrapper normalizes error handling and gives an error-first API with cross-browser support.
 

# Development
 
 ```js
 npm install
 npm run dev
 ```
 
Before committing, make sure you pass `npm run lint` without errors, and run `npm run docs` to generate the documentation.
