import React, { useState, useCallback } from "react";
import { Vibrant } from "@vibrant/core";

function clamp255(v) {
  if (v < 0) return 0;
  if (v > 255) return 255;
  return v | 0;
}

function sharpenKernel(amount = 0.5) {
  return [
    0, -amount, 0,
    -amount, 1 + 4 * amount, -amount,
    0, -amount, 0,
  ];
}

function convolve3x3(srcData, width, height, kernel) {
  const dst = new Uint8ClampedArray(srcData.length);
  const idx = (x, y) => (y * width + x) * 4;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const sx = Math.min(width - 1, Math.max(0, x + kx));
          const sy = Math.min(height - 1, Math.max(0, y + ky));
          const w = kernel[(ky + 1) * 3 + (kx + 1)];
          const o = idx(sx, sy);
          r += srcData[o] * w;
          g += srcData[o + 1] * w;
          b += srcData[o + 2] * w;
        }
      }
      const d = idx(x, y);
      dst[d] = clamp255(r);
      dst[d + 1] = clamp255(g);
      dst[d + 2] = clamp255(b);
      dst[d + 3] = srcData[d + 3];
    }
  }
  return dst;
}

async function enhanceToDataURL(dataURL, amount = 0.5) {
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = "Anonymous";
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataURL;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  ctx.drawImage(img, 0, 0);

  const srcImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const kernel = sharpenKernel(amount);
  const dstData = convolve3x3(srcImageData.data, srcImageData.width, srcImageData.height, kernel);
  const outImageData = new ImageData(dstData, srcImageData.width, srcImageData.height);
  ctx.putImageData(outImageData, 0, 0);

  return canvas.toDataURL("image/png", 0.92);
}

function PhotoEnhancer() {
  const [image, setImage] = useState(null);
  const [hdImage, setHdImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hdEnabled, setHdEnabled] = useState(false);
  const [sharpenAmount] = useState(1);
  const [colors, setColors] = useState(["#111827", "#1f2937"]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setError("");
    setHdEnabled(false);
    setHdImage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const imgData = reader.result;
      setImage(imgData);

      try {
        const palette = await Vibrant.from(imgData).getPalette();
        const extractedColors = [
          palette.Vibrant?.hex || "#111827",
          palette.Muted?.hex || "#1f2937",
        ];
        setColors(extractedColors);
      } catch (e) {
        console.error("Color extraction failed:", e);
        setColors(["#111827", "#1f2937"]);
      }
    };
    reader.onerror = () => setError("Failed to read the image file. Please try again.");
    reader.readAsDataURL(file);
  }, []);

  const toggleHD = useCallback(async () => {
    if (!image || loading) return;

    if (hdEnabled) {
      setHdEnabled(false);
      setHdImage(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await enhanceToDataURL(image, sharpenAmount);
      setHdImage(result);
      setHdEnabled(true);
    } catch (e) {
      setError("Failed to enhance image. Try another image.");
      setHdEnabled(false);
      setHdImage(null);
    } finally {
      setLoading(false);
    }
  }, [image, hdEnabled, loading, sharpenAmount]);

  const downloadCurrent = useCallback(() => {
    const src = (hdEnabled && hdImage) ? hdImage : image;
    if (!src) return;
    const link = document.createElement("a");
    link.href = src;
    link.download = hdEnabled ? "image-hd.png" : "image.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [image, hdImage, hdEnabled]);

  const resetImage = () => {
    setImage(null);
    setHdImage(null);
    setHdEnabled(false);
    setColors(["#111827", "#1f2937"]);
    setError("");
  };

  const backgroundGradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-10 text-white relative overflow-hidden"
      style={{ background: backgroundGradient }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 sm:w-64 sm:h-64 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-xl p-8 flex flex-col gap-6 z-10">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-green-500 mt-10">
            Photo Enhancer
          </h1>
          <p className="text-gray-200 mt-2 text-sm sm:text-base">
            Upload your image and sharpen it with HD mode.
          </p>
        </div>

        {/* Uploader */}
        <div>
          <label htmlFor="file-input" className="block w-full cursor-pointer group">
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center group-hover:border-green-400 transition bg-gray-800/50">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center mb-4 shadow-md">
                <svg
                  className="w-7 h-7 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <p className="font-semibold text-white text-lg">Click to upload</p>
              <p className="text-gray-400 text-sm">JPEG, PNG, WebP, GIF up to 10MB</p>
            </div>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-gray-800 text-red-400 border border-red-400 text-sm shadow-md">
            {error}
          </div>
        )}

        {/* Preview */}
        {image && (
          <div className="relative rounded-2xl border overflow-hidden shadow-xl">
            <img
              src={hdEnabled && hdImage ? hdImage : image}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain mix-blend-lighten"
              style={{ background: "transparent" }}
            />
            {/* HD toggle button */}
            <button
              onClick={toggleHD}
              disabled={loading}
              className={`absolute top-5 right-5 px-4 py-2 rounded-lg text-sm font-semibold border shadow-lg transition
                ${loading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}
                ${
                  hdEnabled
                    ? "bg-gradient-to-r from-amber-400 to-green-500 text-black border-none"
                    : "bg-gray-800/80 text-white border border-gray-600"
                }
              `}
              aria-pressed={hdEnabled}
            >
              {loading ? "loading..." : hdEnabled ? "HD" : "HD"}
            </button>
          </div>
        )}

        {/* Actions */}
        {image && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <button
              onClick={downloadCurrent}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 rounded-xl text-white font-semibold shadow-lg hover:bg-green-500 hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={loading}
            >
              Download {hdEnabled ? "HD" : "Original"}
            </button>
            <button
              onClick={resetImage}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 rounded-xl text-white font-semibold shadow-inner hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoEnhancer;
