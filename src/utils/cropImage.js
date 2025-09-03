export const getCroppedImg = (
  imageSrc,
  pixelCrop,
  targetWidth = 300,
  targetHeight = 300,
  format = 'image/png',
  quality = 1,
  triggerDownload = false
) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      // Optional: High-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
  

      // Draw the cropped section
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

      // Convert to blob with format and quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty or toBlob failed."));
            return;
          }

          const blobUrl = URL.createObjectURL(blob);

          // Optional download
          if (triggerDownload) {
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `cropped-${Date.now()}.${format.split('/')[1]}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }

          resolve(blobUrl);

          // Optional: Cleanup after 1 minute
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        },
        format,
        format === "image/jpeg" || format === "image/webp" ? quality : undefined
      );
    };

    image.onerror = () => {
      reject(new Error("Image failed to load."));
    };
  });
};
