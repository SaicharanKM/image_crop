// src/utils/cropImage.js

// 🔹 Helper function for high-quality resizing
function downscaleImage(sourceCanvas, targetWidth, targetHeight) {
  const finalCanvas = document.createElement("canvas");
  
  // FIX: Removed devicePixelRatio. 
  // We want the downloaded file to exactly match the target dimensions.
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;

  const ctx = finalCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

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
  rotation = 0,
  returnBlob = false
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

      // Step 1: Crop from rotated image
      const croppedCanvas = document.createElement("canvas");
      // React-easy-crop's pixelCrop is already in natural dimensions, no scaling needed
      croppedCanvas.width = pixelCrop.width;
      croppedCanvas.height = pixelCrop.height;

      const croppedCtx = croppedCanvas.getContext("2d");
      croppedCtx.drawImage(
        offCanvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height
      );

      // Step 2: Determine output resolution
      let outputWidth, outputHeight;

      if (targetWidth && targetHeight) {
        // Handle custom dimensions maintaining aspect ratio
        const customRatio = targetWidth / targetHeight;
        const cropRatio = pixelCrop.width / pixelCrop.height;

        if (customRatio > cropRatio) {
          outputWidth = pixelCrop.width;
          outputHeight = pixelCrop.width / customRatio;
        } else {
          outputWidth = pixelCrop.height * customRatio;
          outputHeight = pixelCrop.height;
        }
      } else {
        // Default to natural crop size
        outputWidth = pixelCrop.width;
        outputHeight = pixelCrop.height;
      }

      // Resize the image
      const finalCanvas = downscaleImage(croppedCanvas, Math.ceil(outputWidth), Math.ceil(outputHeight));

      // Step 3: Export as Blob
      finalCanvas.toBlob(
        (blob) => {
          // FIX: Add safety check to prevent createObjectURL from crashing if blob is null
          if (!blob) {
            reject(new Error("Image resolution is too high for this device. Please try a smaller crop or lower resolution."));
            return;
          }

          // Return raw Blob for size estimation and background processing
          if (returnBlob) {
            resolve(blob);
            return;
          }

          // Return blob URL for direct rendering
          const blobUrl = URL.createObjectURL(blob);
          resolve(blobUrl);

          // Cleanup after 1 min
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        },
        format,
        format === "image/jpeg" || format === "image/webp" ? quality : undefined
      );
    };

    image.onerror = () => reject(new Error("Image failed to load."));
  });
};