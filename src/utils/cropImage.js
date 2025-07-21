export const getCroppedImg = (imageSrc, pixelCrop, targetWidth = 300, targetHeight = 300) => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    // Ensures cross-origin images work
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");

      // Optional: better image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty or toBlob failed"));
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/png");
    };

    image.onerror = (err) => {
      reject(new Error("Image failed to load"));
    };
  });
};
