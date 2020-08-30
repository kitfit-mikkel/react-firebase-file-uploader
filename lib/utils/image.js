"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resizeAndCropImage;

var _polyfill = require("./polyfill");

var _polyfill2 = _interopRequireDefault(_polyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function imgToCanvas(image, rawWidth, rawHeight) {
  var canvas = document.createElement("canvas");
  canvas.width = rawWidth;
  canvas.height = rawHeight;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, rawWidth, rawHeight);
  return canvas;
}
function resizeAndCropImage(file, maxWidth, maxHeight, quality) {
  if (!HTMLCanvasElement.prototype.toBlob) {
    (0, _polyfill2.default)();
  }
  return new Promise(function (resolve, reject) {
    quality = quality ? Math.min(quality, 1) : 1;

    // Create file reader
    var reader = new FileReader();
    reader.onload = function (readerEvent) {
      // Create image object
      var image = new Image();
      image.onload = function () {
        var width = void 0;
        var height = void 0;
        if (maxWidth && !maxHeight) {
          // Calculate height based on maximum width
          width = Math.min(maxWidth, image.width);
          height = image.height / (image.width / width);
        } else if (maxHeight && !maxWidth) {
          // Calculate width based on maximum height
          height = Math.min(maxHeight, image.height);
          width = image.width / (image.height / height);
        } else {
          // Otherwise use provided maximum values or the image dimensions (whichever is smaller)
          width = Math.min(maxWidth, image.width);
          height = Math.min(maxHeight, image.height);
        }
        var canvas = imgToCanvas(image, width, height);
        canvas.toBlob(resolve, file.type, quality);
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}