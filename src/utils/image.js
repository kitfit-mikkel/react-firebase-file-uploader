// @flow
import addToBlobPolyfill from "./polyfill";

function imgToCanvas(
  image: Image,
  rawWidth: number,
  rawHeight: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = rawWidth;
  canvas.height = rawHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, rawWidth, rawHeight);
  return canvas;
}

export default function resizeAndCropImage(
  file: File,
  maxWidth ? : number,
  maxHeight ? : number,
  quality ? : number
): Promise < Blob > {
  if (!HTMLCanvasElement.prototype.toBlob) {
    addToBlobPolyfill();
  }
  return new Promise((resolve, reject) => {
    quality = quality ? Math.min(quality, 1) : 1;

    // Create file reader
    const reader = new FileReader();
    reader.onload = readerEvent => {
      // Create image object
      const image = new Image();
      image.onload = () => {
        let width;
        let height;
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
        const canvas = imgToCanvas(
          image,
          width,
          height
        );
        canvas.toBlob(resolve, file.type, quality);
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}