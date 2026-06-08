import React, { useState, useCallback, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { IconButton, Tooltip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import SettingsIcon from '@mui/icons-material/Settings';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RestoreIcon from '@mui/icons-material/Restore';

const resolutions = [
    { label: "16:9", w: 16, h: 9 },
    { label: "4:3", w: 4, h: 3 },
    { label: "1:1", w: 1, h: 1 },
    { label: "3:2", w: 3, h: 2 },
    { label: "2:3", w: 2, h: 3 },
    { label: "4:5", w: 4, h: 5 },
    { label: "9:16", w: 9, h: 16 },
    { label: "21:9", w: 21, h: 9 }
];

const getPixfitFileName = (originalName, format) => {
    if (!originalName) {
        return `Pixfit.${format.split("/")[1] || "jpg"}`;
    }
    const dotIndex = originalName.lastIndexOf(".");
    if (dotIndex === -1) {
        return `${originalName}Pixfit.${format.split("/")[1] || "jpg"}`;
    }
    const name = originalName.substring(0, dotIndex);
    const ext = originalName.substring(dotIndex + 1);
    return `${name}_Pixfit.${ext}`;
};

const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    if (bytes < k) return bytes + ' Bytes';
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

function ImageCropper() {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState(undefined);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    
    const [targetWidth, setTargetWidth] = useState("");
    const [targetHeight, setTargetHeight] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("Original");
    const [format, setFormat] = useState('image/jpeg');
    const [quality, setQuality] = useState(90);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const [originalFileSize, setOriginalFileSize] = useState(0);
    const [compressionInfo, setCompressionInfo] = useState(null);
    const [estimatedSize, setEstimatedSize] = useState(null);
    const [isEstimating, setIsEstimating] = useState(false);
    
    const lastBlobUrlRef = useRef(null);
    const fileNameRef = useRef(null);

    useEffect(() => {
        return () => {
            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!image || !croppedAreaPixels) {
            setEstimatedSize(null);
            return;
        }

        setIsEstimating(true);
        const timer = setTimeout(async () => {
            try {
                const width = selectedLabel === "Custom" ? parseInt(targetWidth) : 0;
                const height = selectedLabel === "Custom" ? parseInt(targetHeight) : 0;

                const blob = await getCroppedImg(
                    image,
                    croppedAreaPixels,
                    width,
                    height,
                    format,
                    quality / 100,
                    rotation,
                    true
                );
                setEstimatedSize(blob.size);
            } catch (err) {
                console.error("Estimation failed", err);
            } finally {
                setIsEstimating(false);
            }
        }, 400); 

        return () => clearTimeout(timer);
    }, [image, croppedAreaPixels, targetWidth, targetHeight, format, quality, rotation, selectedLabel]);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleImageUpload = (e) => {
        const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
        const file = files && files[0];
        if (file) {
            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
                lastBlobUrlRef.current = null;
            }
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setCompressionInfo(null);
            setEstimatedSize(null);
            
            setOriginalFileSize(file.size); 
            setImage(URL.createObjectURL(file));
            fileNameRef.current = file.name; 
        }
    };

    const handleResolutionChange = (label, w, h) => {
        setSelectedLabel(label);
        if (label === "Original") {
            setAspect(undefined);
            setTargetWidth("");
            setTargetHeight("");
        } else if (label === "Custom") {
            setAspect(undefined);
        } else {
            setTargetWidth(w);
            setTargetHeight(h);
            setAspect(w / h);
        }
    };

    const handleCustomDimensionChange = (field, value) => {
        const num = value === "" ? "" : Number(value);
        if (field === "width") {
            setTargetWidth(num);
            if (num && targetHeight) setAspect(num / targetHeight);
        } else if (field === "height") {
            setTargetHeight(num);
            if (targetWidth && num) setAspect(targetWidth / num);
        }
        setSelectedLabel("Custom");
    };

    const downloadImage = async () => {
        if (!image || !croppedAreaPixels) {
            alert("Please upload an image and adjust the crop area first");
            return;
        }

        setIsDownloading(true);
        setCompressionInfo(null);

        try {
            const width = selectedLabel === "Custom" ? parseInt(targetWidth) : 0;
            const height = selectedLabel === "Custom" ? parseInt(targetHeight) : 0;

            const croppedBlob = await getCroppedImg(
                image,
                croppedAreaPixels,
                width,
                height,
                format,
                quality / 100, 
                rotation,
                true 
            );

            const url = URL.createObjectURL(croppedBlob);

            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
            lastBlobUrlRef.current = url;

            const fileName = getPixfitFileName(fileNameRef.current, format);
            const link = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.click();

            const compressedSize = croppedBlob.size;
            let savings = 0;
            if (originalFileSize > 0 && compressedSize < originalFileSize) {
                savings = (((originalFileSize - compressedSize) / originalFileSize) * 100).toFixed(1);
            }

            const img = new Image();
            img.src = url;
            await new Promise(resolve => img.onload = resolve);

            setCompressionInfo({
                savings: savings > 0 ? `${savings}` : null, 
                originalSize: (originalFileSize / 1024).toFixed(0),
                compressedSize: (compressedSize / 1024).toFixed(0),
                width: img.width,
                height: img.height,
            });

        } catch (e) {
            console.error("Download failed:", e);
            alert(`Something went wrong: ${e.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleRotateLeft = () => setRotation(prev => (prev - 90) % 360);
    const handleRotateRight = () => setRotation(prev => (prev + 90) % 360);
    const handleReset = () => {
        setZoom(1);
        setRotation(0);
        setCrop({ x: 0, y: 0 });
    };

    return (
        <>
            <Helmet>
                <title>Free Online Image Cropper & Resizer | Crop Photos to Custom Dimensions</title>
                <meta name="description" content="Instantly crop, resize, and compress your images online for free. Crop photos to exact dimensions (16:9, 4:3) or specific pixel sizes with no watermarks." />
                <meta name="keywords" content="image cropper, crop photo online, resize image pixels, compress image size, crop to 16:9, custom image dimensions" />
                <link rel="canonical" href="https://pixfit.sandyeditz.in/" />
                <meta property="og:title" content="Free Online Image Cropper & Resizer" />
                <meta property="og:description" content="Crop and resize images instantly with zero quality loss." />
                <meta property="og:url" content="https://pixfit.sandyeditz.in/" />
                <script type="application/ld+json">
                    {`
                        {
                          "@context": "https://schema.org",
                          "@type": "WebApplication",
                          "name": "PixFit Image Cropper",
                          "url": "https://pixfit.sandyeditz.in/",
                          "applicationCategory": "ImageEditing",
                          "operatingSystem": "All",
                          "description": "A browser-based tool to crop images, change aspect ratios, and compress file sizes instantly without leaving the page.",
                          "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "INR"
                          }
                        }
                    `}
                </script>
            </Helmet>

            {/* Premium Teal and Gray Gradient Backdrop from the one8 site template */}
            <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#e8edec] mt-[60px] font-sans antialiased">

                {/* Left: Workspace Workstation Viewport Panel */}
                <div className="flex-1 flex flex-col justify-center items-center p-5 md:p-10 relative">
                    
                    {!image ? (
                        /* Glassmorphic Minimalist Dropzone Panel Container */
                        <div
                            className={`w-full max-w-2xl mx-auto p-12 min-h-[420px] md:min-h-[65vh] rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-300  bg-[#e8edec] backdrop-blur-md border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.02)]
                            ${isDragging 
                                ? "border-black/40 bg-white/60 scale-[1.01]" 
                                : "hover:shadow-[0_25px_50px_rgba(0,0,0,0.04)]"
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                handleImageUpload(e);
                            }} //
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center mb-6 border border-white/80 shadow-sm">
                                <CloudUploadIcon className="text-gray-900 text-2xl" />
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
                                Transform Your Content
                            </h2>
                            <p className="text-gray-600/80 text-sm font-medium max-w-sm leading-relaxed mb-8">
                                Drag and drop your files here or select an asset from your directory to execute real-time canvas configuration.
                            </p>
                            
                            <label
                                htmlFor="imageUpload"
                                className="px-8 py-3  bg-[#318584] hover:bg-[#286f6e] text-white text-xs font-bold rounded-full cursor-pointer  tracking-wider uppercase transition-all shadow-md active:scale-[0.98]"
                            >
                                Browse Files
                            </label>
                            <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </div>
                    ) : (
                        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                            
                            {/* Bounded Active Workspace Viewport Frame */}
                            <div className="crop-container w-full h-[400px] md:h-[62vh] relative rounded-[2rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.06)] bg-black border border-white/30">
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={aspect}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>

                            {/* Frost Glassmorphic Functional Control Panel Floating Dock */}
                            <div className="mt-6 bg-white/40 backdrop-blur-md px-6 py-1.5 rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.03)] border border-white/60 flex items-center justify-center gap-1 md:gap-3">
                                <Tooltip title="Re-upload" enterDelay={300}>
                                    <IconButton onClick={() => document.getElementById("reuploadInput").click()} sx={{ color: "#111827", padding: "8px" }}>
                                        <CloudUploadIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Rotate Left" enterDelay={300}>
                                    <IconButton onClick={handleRotateLeft} sx={{ color: "#111827", padding: "8px" }}>
                                        <RotateLeftIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Rotate Right" enterDelay={300}>
                                    <IconButton onClick={handleRotateRight} sx={{ color: "#111827", padding: "8px" }}>
                                        <RotateRightIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Reset Viewport" enterDelay={300}>
                                    <IconButton onClick={handleReset} sx={{ color: "#111827", padding: "8px" }}>
                                        <RestoreIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <div className="w-px h-5 bg-black/10 mx-1"></div>
                                <Tooltip title="Remove Image" enterDelay={300}>
                                    <IconButton onClick={() => { setImage(null); setCroppedAreaPixels(null); setCompressionInfo(null); setEstimatedSize(null); }} sx={{ color: "#dc2626", padding: "8px" }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <input id="reuploadInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            
                            {/* Glassmorphic Metrics Verification Interface Box */}
                            {compressionInfo && (
                                <div className="mt-6 w-full max-w-md bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-5 text-gray-900 shadow-sm animate-fade-in-up">
                                    <div className="flex justify-between items-center mb-2.5">
                                        <h4 className="font-bold tracking-tight text-xs uppercase text-gray-500">Processing Success</h4>
                                        {compressionInfo.savings && (
                                            <span className="bg-[#318584] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                Saved {compressionInfo.savings}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2 border-t border-black/5 pt-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Payload Size</p>
                                            <p className="font-bold text-gray-900 mt-0.5">{compressionInfo.originalSize}kb → {compressionInfo.compressedSize}kb</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">True Dimensions</p>
                                            <p className="font-bold text-gray-900 mt-0.5">{compressionInfo.width} × {compressionInfo.height} px</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Clean, Structured Studio Workspace Control Column Sheet */}
                <div className={`w-full lg:w-[420px] bg-white/40 backdrop-blur-xl border-l border-white/40 flex flex-col transition-all duration-300 ${!image ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                    
                    <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-10">
                        
                        {/* Aspect Ratio Configuration Segment */}
                        <div>
                            <div className="mb-5">
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                    <AspectRatioIcon className="text-gray-900 text-xl" /> Aspect Profiles
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Enforce clean cinematic presets or dynamic aspect bounds.</p>
                            </div>

                            {/* Mobile Responsive Navigation Dropdown Block */}
                            <div className="block md:hidden relative mb-6">
                                <select
                                    value={selectedLabel}
                                    onChange={(e) => {
                                        const label = e.target.value;
                                        if (label === "Original") {
                                            handleResolutionChange("Original");
                                        } else {
                                            const selected = resolutions.find((r) => r.label === label);
                                            if (selected) {
                                                handleResolutionChange(selected.label, selected.w, selected.h);
                                            }
                                        }
                                    }}
                                    className="w-full appearance-none bg-white/60 border border-white/80 text-gray-900 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="Original">Original Boundaries</option>
                                    {resolutions.map(({ label }) => (
                                        <option key={label} value={label}>{label} Container Preset</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>

                            {/* Desktop Structural Aspect Profile Pill Grid */}
                            <div className="hidden md:flex flex-wrap gap-1.5 mb-6">
                                <button
                                    onClick={() => handleResolutionChange("Original")}
                                    className={`px-4 py-2 rounded-full text-xs  tracking-wide transition-all duration-200 border ${
                                        selectedLabel === "Original"
                                            ? " bg-[#318584] hover:bg-[#286f6e] text-white border-white shadow-sm"
                                            : "bg-white/60 text-gray-700 border-white/90 hover:border-gray-300"
                                    }`}
                                >
                                    Original
                                </button>

                                {resolutions.map(({ label, w, h }) => (
                                    <button
                                        key={label}
                                        onClick={() => handleResolutionChange(label, w, h)}
                                        className={`px-4 py-2 rounded-full text-xs  tracking-wide transition-all duration-200 border ${
                                            selectedLabel === label
                                                ? " bg-[#318584] hover:bg-[#286f6e] text-white border-white/90 shadow-sm"
                                                : "bg-white/60 text-gray-700 border-white/80 hover:border-gray-300"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Geometric Pixel Sizing Control Suite */}
                        <div className="bg-white/50 p-5 rounded-2xl border border-white/70">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Canvas Width</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetWidth ?? ""}
                                            onChange={(e) => handleCustomDimensionChange("width", e.target.value)}
                                            className="w-full bg-white border border-gray-200/80 text-sm text-gray-900 font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            placeholder="Auto"
                                        />
                                        <span className="absolute right-4 top-2.5 text-xs font-bold text-gray-300">px</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Canvas Height</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetHeight ?? ""}
                                            onChange={(e) => handleCustomDimensionChange("height", e.target.value)}
                                            className="w-full bg-white border border-gray-200/80 text-sm text-gray-900 font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            placeholder="Auto"
                                        />
                                        <span className="absolute right-4 top-2.5 text-xs font-bold text-gray-300">px</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-black/5"></div>

                        {/* Compression and Encoding Configuration Layer */}
                        <div>
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                    <SettingsIcon className="text-gray-900 text-xl" /> Export Details
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Define target container profiles and quantization density.</p>
                            </div>

                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Target Extension Container</label>
                            <div className="relative mb-6">
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="w-full appearance-none bg-white/60 border border-white/80 text-sm font-semibold text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                >
                                    <option value="image/jpeg">JPEG (Photorealistic Formats)</option>
                                    <option value="image/png">PNG (Lossless Transparency Channels)</option>
                                    <option value="image/webp">WEBP (Advanced Web Ecosystem Optimization)</option>
                                    <option value="image/avif">AVIF (Ultra-Efficient Algorithmic Vectoring)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Density Weight Matrix</label>
                                    <span className="font-extrabold text-xs bg-black/5 px-2 py-0.5 rounded text-gray-900">{quality}%</span>
                                </div>
                                <input
                                    type="range"
                                    min={10}
                                    max={100}
                                    step={1}
                                    value={quality}
                                    disabled={format === "image/png"}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-black/5 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-30 transition-all"
                                />
                                {format === "image/png" && (
                                    <p className="text-[11px] italic font-medium text-gray-400 mt-2">Lossless container format bypasses quantization sliders.</p>
                                )}
                            </div>

                            {/* Background Simulated Live Weight Matrix Indicator Component */}
                            <div className="mt-6 p-4 bg-white/40 rounded-xl border border-white/60 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Weight:</span>
                                <span className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                                    {isEstimating ? (
                                        <span className="flex items-center gap-1.5">
                                            <svg className="animate-spin h-3.5 w-3.5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                            </svg>
                                            <span className="text-gray-400 font-medium text-xs">Evaluating Assets...</span>
                                        </span>
                                    ) : estimatedSize ? (
                                        formatBytes(estimatedSize)   
                                    ) : (
                                        "--"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Integrated site Button Action Footer Frame */}
                    <div className="p-6 bg-white/30 border-t border-white/40">
                        <button
                            onClick={downloadImage}
                            disabled={!image || isDownloading}
                            className="w-full py-3.5 px-6 bg-[#318584] hover:bg-[#286f6e] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    <span>Compiling Output Frame...</span>
                                </>
                            ) : (
                                <>
                                    <DownloadIcon className="text-sm" /> Generate & Save Image
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ImageCropper;