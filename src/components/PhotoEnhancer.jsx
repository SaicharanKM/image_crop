import React, { useState, useCallback, useRef, useEffect } from "react";
import { IconButton, Tooltip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CompareIcon from '@mui/icons-material/Compare';

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
  const [sharpenAmount, setSharpenAmount] = useState(0.5);
  const [dragActive, setDragActive] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const canvasRef = useRef(null);
  const originalFileNameRef = useRef("photo");

  // Draw the image to the canvas (handles responsive sizing)
  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // If we are holding the compare button, show the original
    img.src = (hdImage && !isComparing) ? hdImage : image;

    img.onload = () => {
      // Make canvas match the image aspect ratio
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (loading) {
        ctx.filter = "blur(8px)";
      } else {
        ctx.filter = "none";
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [image, hdImage, loading, isComparing]);

  // File upload + drag & drop
  const handleFileUpload = useCallback((event) => {
    event.preventDefault();
    let file;
    if (event.dataTransfer && event.dataTransfer.files.length)
      file = event.dataTransfer.files[0];
    else if (event.target.files && event.target.files.length)
      file = event.target.files[0];
    
    if (!file) return;

    originalFileNameRef.current = file.name.split('.')[0] || "photo";

    const reader = new FileReader();
    reader.onload = () => {
        setImage(reader.result);
        setHdImage(null); // Reset when new image is uploaded
    };
    reader.readAsDataURL(file);
    setDragActive(false);
  }, []);

  const handleDragEnter = useCallback((e) => { e.preventDefault(); setDragActive(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setDragActive(false); }, []);
  const handleDrop = useCallback((e) => { handleFileUpload(e); setDragActive(false); }, [handleFileUpload]);

  // Trigger the enhancement process
  const applyEnhancement = async () => {
    if (!image || loading) return;

    try {
      setLoading(true);
      // Small timeout to allow the UI to update the loading state before the heavy thread blocking begins
      setTimeout(async () => {
          const result = await enhanceToDataURL(image, sharpenAmount);
          setHdImage(result);
          setLoading(false);
      }, 50);
    } catch (err) {
      console.error("Enhancement failed", err);
      setLoading(false);
      alert("Failed to process image. It might be too large.");
    }
  };

  // Download HD image
  const downloadHD = () => {
    if (!hdImage) return;
    const link = document.createElement("a");
    link.href = hdImage;
    link.download = `${originalFileNameRef.current}_Enhanced.png`;
    link.click();
  };

  const handleReset = () => {
      setImage(null);
      setHdImage(null);
      setSharpenAmount(0.5);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F7F9] mt-[60px] font-sans">
      
      {/* Left: Canvas/Preview Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 relative">
        {!image ? (
            <div
                className={`w-full max-w-3xl mx-auto p-8 min-h-[400px] md:min-h-[65vh] rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out border-2 border-dashed
                ${dragActive 
                    ? "border-black bg-gray-100 scale-[1.02]" 
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <AutoFixHighIcon className="text-gray-800 text-4xl" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                    Enhance your photo
                </h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Upload a blurry or soft image to instantly sharpen and clarify it locally in your browser.
                </p>
                
                <label
                    htmlFor="file-input"
                    className="px-8 py-4 bg-black text-white text-base font-semibold rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-md active:scale-95"
                >
                    Browse Files
                </label>
                <input id="file-input" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
        ) : (
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                {/* Editor Canvas Container */}
                <div className="w-full relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border border-gray-200 flex justify-center items-center min-h-[300px]">
                    <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-[65vh] object-contain transition-opacity duration-300"
                        style={{ opacity: loading ? 0.5 : 1 }}
                    />
                    
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                            <svg className="animate-spin h-10 w-10 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            <span className="text-gray-900 font-bold tracking-wide">Processing...</span>
                        </div>
                    )}

                    {/* Compare Overlay Indicator */}
                    {isComparing && hdImage && (
                         <div className="absolute top-4 right-4 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                             Original Image
                         </div>
                    )}
                </div>

                {/* Minimalist Floating Toolbar */}
                <div className="mt-6 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 flex items-center justify-center gap-2 md:gap-6">
                    <Tooltip title="Upload New">
                        <IconButton onClick={() => document.getElementById("file-input").click()} sx={{ color: "#374151" }}>
                            <CloudUploadIcon />
                        </IconButton>
                    </Tooltip>
                    
                    {hdImage && (
                        <Tooltip title="Hold to Compare">
                            <IconButton 
                                onMouseDown={() => setIsComparing(true)} 
                                onMouseUp={() => setIsComparing(false)}
                                onMouseLeave={() => setIsComparing(false)}
                                onTouchStart={() => setIsComparing(true)}
                                onTouchEnd={() => setIsComparing(false)}
                                sx={{ color: isComparing ? "#000" : "#374151" }}
                            >
                                <CompareIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    <div className="w-px h-8 bg-gray-200 mx-2"></div>
                    
                    <Tooltip title="Delete Image">
                        <IconButton onClick={handleReset} sx={{ color: "#EF4444" }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        )}
      </div>

      {/* Right: Floating Control Card */}
      <div className={`w-full lg:w-[420px] bg-white lg:my-6 lg:mr-6 lg:rounded-[2rem] lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col transition-opacity duration-300 ${!image ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              <div className="mb-8">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                      <AutoFixHighIcon /> Clarity
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Adjust the intensity of the sharpening filter.</p>
              </div>

              {/* Slider Control */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                  <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Intensity</label>
                      <span className="font-bold text-gray-900">{Math.round(sharpenAmount * 100)}%</span>
                  </div>
                  
                  <input
                      type="range"
                      min={0.1}
                      max={1.5}
                      step={0.1}
                      value={sharpenAmount}
                      onChange={(e) => setSharpenAmount(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Soft</span>
                      <span>Extreme</span>
                  </div>

                  <button
                      onClick={applyEnhancement}
                      disabled={loading}
                      className="w-full mt-6 py-3 px-4 bg-white border-2 border-black text-black text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                      Apply Filter
                  </button>
              </div>
          </div>

          {/* Fixed Action Bottom Area */}
          <div className="p-6 border-t border-gray-100 bg-white lg:rounded-b-[2rem]">
              <button
                  onClick={downloadHD}
                  disabled={!hdImage || loading}
                  className="w-full py-4 px-6 bg-black text-white text-base font-bold rounded-2xl shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                  <DownloadIcon /> Export Enhanced Image
              </button>
          </div>
      </div>
    </div>
  );
}

export default PhotoEnhancer;