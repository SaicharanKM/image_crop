// 🔹 Helper function for high-quality resizing with devicePixelRatio
function downscaleImage(sourceCanvas, targetWidth, targetHeight) {
  const pixelRatio = window.devicePixelRatio || 1;

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = targetWidth * pixelRatio;
  finalCanvas.height = targetHeight * pixelRatio;
  finalCanvas.style.width = `${targetWidth}px`;
  finalCanvas.style.height = `${targetHeight}px`;

  const ctx = finalCanvas.getContext("2d");
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Important: drawImage scales from natural pixels → ensures high res
  ctx.drawImage(
    sourceCanvas,
    0, 0, sourceCanvas.width, sourceCanvas.height, // input (full crop)
    0, 0, targetWidth, targetHeight                // output (requested size)
  );

  return finalCanvas;
}


// 🔹 Main crop + resize function
export const getCroppedImg = (
  imageSrc,
  pixelCrop,
  targetWidth,
  targetHeight,
  format = "image/png",
  quality = 1,
  rotation = 0
) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // allow CORS
    image.src = imageSrc;

    image.onload = () => {
      const radians = (rotation * Math.PI) / 180;

      // Bounding box for rotated image
      const boundWidth =
        Math.abs(Math.cos(radians) * image.naturalWidth) +
        Math.abs(Math.sin(radians) * image.naturalHeight);
      const boundHeight =
        Math.abs(Math.sin(radians) * image.naturalWidth) +
        Math.abs(Math.cos(radians) * image.naturalHeight);

      // Rotate offscreen canvas
      const offCanvas = document.createElement("canvas");
      offCanvas.width = boundWidth;
      offCanvas.height = boundHeight;
      const offCtx = offCanvas.getContext("2d");

      offCtx.translate(boundWidth / 2, boundHeight / 2);
      offCtx.rotate(radians);
      offCtx.drawImage(
        image,
        -image.naturalWidth / 2,
        -image.naturalHeight / 2
      );

      // Scale factors (to account for natural size vs. displayed size)
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Step 1: Crop from rotated image (use natural pixels)
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = pixelCrop.width * scaleX;
      croppedCanvas.height = pixelCrop.height * scaleY;

      const croppedCtx = croppedCanvas.getContext("2d");
      croppedCtx.drawImage(
        offCanvas,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height
      );

      // If custom dimensions are too small, keep natural crop resolution
      let outputWidth, outputHeight;

      if (targetWidth && targetHeight) {
        // treat custom as "aspect ratio" not tiny size
        const cropW = pixelCrop.width * scaleX;
        const cropH = pixelCrop.height * scaleY;
        const customRatio = targetWidth / targetHeight;
        const cropRatio = cropW / cropH;

        if (customRatio > cropRatio) {
          outputWidth = cropW;
          outputHeight = cropW / customRatio;
        } else {
          outputWidth = cropH * customRatio;
          outputHeight = cropH;
        }
      } else {
        // default (natural crop size)
        outputWidth = Math.ceil(pixelCrop.width * scaleX);
        outputHeight = Math.ceil(pixelCrop.height * scaleY);
      }

      const finalCanvas = downscaleImage(croppedCanvas, outputWidth, outputHeight);

      // Step 3: Export as Blob
      finalCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty or toBlob failed"));
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          resolve(blobUrl);

          // Cleanup after 1 min
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        },
        format,
        format === "image/jpeg" || format === "image/webp" ? quality : undefined
      );
    };

    image.onerror = () => reject(new Error("Image failed to load"));
  });
};
