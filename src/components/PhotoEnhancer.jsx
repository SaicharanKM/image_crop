import React, { useState, useCallback, useRef, useEffect } from "react";

// --- Utility functions ---
function clamp255(v) {
  return Math.max(0, Math.min(255, v | 0));
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
  const dstData = convolve3x3(
    srcImageData.data,
    srcImageData.width,
    srcImageData.height,
    kernel
  );
  const outImageData = new ImageData(
    dstData,
    srcImageData.width,
    srcImageData.height
  );
  ctx.putImageData(outImageData, 0, 0);

  return canvas.toDataURL("image/png", 0.92);
}

// --- Main Component ---
function PhotoEnhancer() {
  const [image, setImage] = useState(null);
  const [hdImage, setHdImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hdEnabled, setHdEnabled] = useState(false);
  const [sharpenAmount] = useState(1);
  const [dragActive, setDragActive] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = hdEnabled && hdImage ? hdImage : image;

    img.onload = () => {
      // fixed canvas size
      const fixedWidth = 700;
      const fixedHeight = 500;
      canvas.width = fixedWidth;
      canvas.height = fixedHeight;

      ctx.clearRect(0, 0, fixedWidth, fixedHeight);
      ctx.fillStyle = "#161616";
      ctx.fillRect(0, 0, fixedWidth, fixedHeight);

      if (loading) {
        ctx.filter = "blur(6px)";
      } else {
        ctx.filter = "none";
      }

      // keep aspect ratio
      const scale = Math.min(fixedWidth / img.width, fixedHeight / img.height);
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      // center image
      const offsetX = (fixedWidth - newWidth) / 2;
      const offsetY = (fixedHeight - newHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    };
  }, [image, hdImage, hdEnabled, loading]);

  // File upload + drag & drop
  const handleFileUpload = useCallback((event) => {
    event.preventDefault();
    let file;
    if (event.dataTransfer && event.dataTransfer.files.length)
      file = event.dataTransfer.files[0];
    else if (event.target.files && event.target.files.length)
      file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);

    setHdEnabled(false);
    setHdImage(null);
    setDragActive(false);
  }, []);

  // Drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);
  const handleDrop = useCallback((e) => {
    handleFileUpload(e);
    setDragActive(false);
  }, [handleFileUpload]);

  // Toggle HD with delay + loader
  const toggleHD = useCallback(async () => {
    if (!image || loading) return;

    if (hdEnabled) {
      setHdEnabled(false);
      setHdImage(null);
      return;
    }

    try {
      setLoading(true);
      const result = await enhanceToDataURL(image, sharpenAmount);

      // wait 1 second before applying result
      setTimeout(() => {
        setHdImage(result);
        setHdEnabled(true);
        setLoading(false);
      }, 1000);
    } catch {
      setLoading(false);
    }
  }, [image, hdEnabled, loading, sharpenAmount]);

  // Download HD image
  const downloadHD = () => {
    const link = document.createElement("a");
    link.href = hdImage;
    link.download = "enhanced-photo.png";
    link.click();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center">Photo Enhancer</h1>

        {/* Upload Area */}
        {!image && (
          <div
            className={`flex flex-col items-center justify-center w-full h-76 border-2 border-dashed rounded-xl cursor-pointer transition ${dragActive
                ? "border-blue-600 bg-black/60"
                : "border-gray-500 bg-gray-950 hover:border-white"
              }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <label
              htmlFor="file-input"
              className="flex flex-col items-center gap-2 py-8"
            >
              {/* SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="font-medium text-lg">
                {dragActive ? "Drop image to upload" : "Click or Drag & Drop to Upload"}
              </span>
              <span className="text-white/80 text-sm">
                Supported: JPEG, PNG, GIF • Max size: 10MB
              </span>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-sm text-gray-400 mt-2 text-center max-w-lg">
              Your image is private and processed locally for fast results.
            </p>
          </div>
        )}

        {/* Preview Area */}
        {image && (
          <div className="relative border border-gray-700 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-lg">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[700px] h-[300px] sm:h-[500px] object-contain rounded-xl"
              aria-label="Image Preview"
            />
            {/* Loader */}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                {/* Animated Loader */}
                <div className="relative flex flex-col items-center gap-2">
                  <div className="w-16 h-16 border-4 border-white/40 border-t-blue-400 rounded-full animate-spin" />
                  <span className="text-white text-md font-semibold mt-2">Enhancing...</span>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-3 w-full max-w-[95%] justify-center">
              <button
                onClick={toggleHD}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition duration-200 ${hdEnabled
                    ? "bg-blue-600 text-white border-blue-400 shadow-md"
                    : "bg-black/80 text-white border-white hover:bg-white hover:text-black"
                  }`}
              >
                {hdEnabled ? "HD Enabled" : "Enhance to HD"}
              </button>

              {hdEnabled && (
                <>
                  <button
                    onClick={downloadHD}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border border-green-500 bg-black/80 text-white hover:bg-green-500 hover:text-black transition"
                  >
                    Download HD
                  </button>
                  <button
                    onClick={() => {
                      setImage(null);
                      setHdImage(null);
                      setHdEnabled(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border border-red-500 bg-black/80 text-white hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoEnhancer;
