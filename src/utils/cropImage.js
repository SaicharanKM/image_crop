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
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const radians = (rotation * Math.PI) / 180;

      // Step 1: Create an offscreen canvas for rotated image
      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");

      // calculate bounding box after rotation
      const boundWidth =
        Math.abs(Math.cos(radians) * image.width) +
        Math.abs(Math.sin(radians) * image.height);
      const boundHeight =
        Math.abs(Math.sin(radians) * image.width) +
        Math.abs(Math.cos(radians) * image.height);

      offCanvas.width = boundWidth;
      offCanvas.height = boundHeight;

      // move to center and rotate
      offCtx.translate(boundWidth / 2, boundHeight / 2);
      offCtx.rotate(radians);
      offCtx.drawImage(image, -image.width / 2, -image.height / 2);

      // Step 2: Crop from rotated canvas into final output
      const outputWidth = targetWidth || pixelCrop.width;
      const outputHeight = targetHeight || pixelCrop.height;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        offCanvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty or toBlob failed"));
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          resolve(blobUrl);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        },
        format,
        format === "image/jpeg" || format === "image/webp" ? quality : undefined
      );
    };

    image.onerror = () => reject(new Error("Image failed to load"));
  });
};
