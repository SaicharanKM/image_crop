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
    // Integrated high-end signature background gradient matching the brand template setup
    <div className="min-h-screen w-full flex flex-col lg:flex-row  bg-[#e8edec]  mt-[60px] font-sans antialiased">
      
      {/* Left: Responsive Dynamic Studio Preview Canvas Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-5 md:p-10 relative">
        {!image ? (
            /* Glassmorphic Minimalist Dropzone Panel Container */
            <div
                className={`w-full max-w-2xl mx-auto p-12 min-h-[420px] md:min-h-[65vh] rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-300  bg-[#e8edec]  backdrop-blur-md border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]
                ${dragActive 
                    ? "border-black/40 bg-white/60 scale-[1.01]" 
                    : "hover:shadow-[0_25px_50px_rgba(0,0,0,0.04)]"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center mb-6 border border-white/80 shadow-sm">
                    <AutoFixHighIcon className="text-gray-900 text-2xl" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
                    Enhance Clarity
                </h2>
                <p className="text-gray-600/80 text-sm font-medium max-w-sm leading-relaxed mb-8">
                    Upload soft, compressed, or blurry photos to re-clarify edge details natively inside your secure digital browser workstation.
                </p>
                
                <label
                    htmlFor="file-input"
                    className="px-8 py-3 bg-[#318584] hover:bg-[#286f6e] text-white text-xs font-bold rounded-full cursor-pointer tracking-wider uppercase transition-all shadow-md active:scale-[0.98]"
                >
                    Select Local Image
                </label>
                <input id="file-input" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
        ) : (
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Active Dynamic Rendering Viewport Container */}
                <div className="w-full relative rounded-[2rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.06)] bg-white border border-white/40 flex justify-center items-center min-h-[320px]">
                    <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-[62vh] object-contain transition-opacity duration-300"
                        style={{ opacity: loading ? 0.4 : 1 }}
                    />
                    
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm z-10">
                            <svg className="animate-spin h-8 w-8 text-black mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            <span className="text-gray-900 text-xs font-bold tracking-wider uppercase">Re-mapping Pixels...</span>
                        </div>
                    )}

                    {/* Compare Overlay Status Indicator */}
                    {isComparing && hdImage && (
                         <div className="absolute top-4 right-4 bg-black/80 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-md backdrop-blur-md border border-white/10">
                             Original Reference View
                         </div>
                    )}
                </div>

                {/* Frost Glassmorphic Floating Toolbar Station Dock */}
                <div className="mt-6 bg-white/40 backdrop-blur-md px-6 py-1.5 rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.03)] border border-white/60 flex items-center justify-center gap-1 md:gap-4">
                    <Tooltip title="Upload Alternative File" enterDelay={300}>
                        <IconButton onClick={() => document.getElementById("file-input").click()} sx={{ color: "#111827", padding: "8px" }}>
                            <CloudUploadIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    
                    {hdImage && (
                        <Tooltip title="Hold Down to View Original" enterDelay={300}>
                            <IconButton 
                                onMouseDown={() => setIsComparing(true)} 
                                onMouseUp={() => setIsComparing(false)}
                                onMouseLeave={() => setIsComparing(false)}
                                onTouchStart={() => setIsComparing(true)}
                                onTouchEnd={() => setIsComparing(false)}
                                sx={{ color: isComparing ? "#318584" : "#111827", padding: "8px" }}
                            >
                                <CompareIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    <div className="w-px h-5 bg-black/10 mx-1"></div>
                    
                    <Tooltip title="Clear Photo Workspace" enterDelay={300}>
                        <IconButton onClick={handleReset} sx={{ color: "#dc2626", padding: "8px" }}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
                <input id="file-input" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
        )}
      </div>

      {/* Right: Architectural Studio Control Panel Column Sidebar Sheet */}
      <div className={`w-full lg:w-[420px] bg-white/40 backdrop-blur-xl border-l border-white/40 flex flex-col transition-all duration-300 ${!image ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-10">
              <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                      <AutoFixHighIcon className="text-gray-900" /> Filter Engine
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Configure your local convolution matrix filter parameters.</p>
              </div>

              {/* Functional Convolution Slider Matrix Box */}
              <div className="bg-white/50 p-6 rounded-2xl border border-white/70">
                  <div className="flex justify-between items-center mb-4">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantization Power</label>
                      <span className="font-extrabold text-xs bg-black/5 px-2 py-0.5 rounded text-gray-900">{Math.round(sharpenAmount * 100)}%</span>
                  </div>
                  
                  <input
                      type="range"
                      min={0.1}
                      max={1.5}
                      step={0.1}
                      value={sharpenAmount}
                      onChange={(e) => setSharpenAmount(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-black/5 rounded-lg appearance-none cursor-pointer accent-black transition-all"
                  />
                  <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-2.5 uppercase tracking-wider">
                      <span>Soft Blend</span>
                      <span>Extreme Edge</span>
                  </div>

                  <button
                      onClick={applyEnhancement}
                      disabled={loading}
                      className="w-full mt-6 py-2.5 px-4 bg-white border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                  >
                      Execute Calculations
                  </button>
              </div>
          </div>

          {/* Integrated Action Button Footer Base Frame */}
          <div className="p-6 bg-white/30 border-t border-white/40">
              <button
                  onClick={downloadHD}
                  disabled={!hdImage || loading}
                  className="w-full py-3.5 px-6 bg-gradient-to-tr from-[#E1E6E7] via-[#D3DFE0] to-[#BCE4E1] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
              >
                  <DownloadIcon className="text-sm" /> Commit & Save Enhanced Asset
              </button>
          </div>
      </div>
    </div>
  );
}

export default PhotoEnhancer;