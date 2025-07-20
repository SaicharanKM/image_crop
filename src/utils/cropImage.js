export const getCroppedImg = (imageSrc, pixelCrop, targetWidth = 300, targetHeight = 300) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

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
          console.error("Canvas is empty");
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/png");
    };
    image.onerror = () => reject("Image load failed");
  });
};
