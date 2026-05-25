import React, { useState, useCallback, useRef, useEffect } from "react";
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

// Helper to format bytes into readable KB/MB
const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    if (bytes < k) return bytes + ' Bytes';
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

function ImageCropper() {
    // Core Cropper States
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState(undefined);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    
    // UI & Settings States
    const [targetWidth, setTargetWidth] = useState("");
    const [targetHeight, setTargetHeight] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("Original");
    const [format, setFormat] = useState('image/jpeg');
    const [quality, setQuality] = useState(90);
    const [isDownloading, setIsDownloading] = useState(false);
    
    // File Tracking States
    const [originalFileSize, setOriginalFileSize] = useState(0);
    const [compressionInfo, setCompressionInfo] = useState(null);
    const [estimatedSize, setEstimatedSize] = useState(null);
    const [isEstimating, setIsEstimating] = useState(false);
    
    const lastBlobUrlRef = useRef(null);
    const fileNameRef = useRef(null);

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
        };
    }, []);

    // Real-time Size Estimation Effect (Debounced)
    useEffect(() => {
        if (!image || !croppedAreaPixels) {
            setEstimatedSize(null);
            return;
        }

        setIsEstimating(true);
        
        // Wait 400ms after the user stops tweaking settings before calculating
        const timer = setTimeout(async () => {
            try {
                const width = selectedLabel === "Custom" ? parseInt(targetWidth) : 0;
                const height = selectedLabel === "Custom" ? parseInt(targetHeight) : 0;

                // Generate a raw blob in the background silently
                const blob = await getCroppedImg(
                    image,
                    croppedAreaPixels,
                    width,
                    height,
                    format,
                    quality / 100,
                    rotation,
                    true // true = returns raw Blob instead of URL
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
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F7F9] mt-[60px] font-sans">

            {/* Left: Canvas/Preview Area */}
            <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 relative">
                
                {!image ? (
                    <div
                        className={`w-full max-w-3xl mx-auto p-8 min-h-[400px] md:min-h-[65vh] rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out border-2 border-dashed
                        ${isDragging 
                            ? "border-black bg-gray-100 scale-[1.02]" 
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            handleImageUpload(e);
                        }}
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                            <CloudUploadIcon className="text-gray-800 text-4xl" />
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                            Drop your image here
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md">
                            Upload a JPG, PNG, or WEBP file to instantly crop, resize, and compress securely in your browser.
                        </p>
                        
                        <label
                            htmlFor="imageUpload"
                            className="px-8 py-4 bg-black text-white text-base font-semibold rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-md active:scale-95"
                        >
                            Browse Files
                        </label>
                        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                ) : (
                    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                        {/* Editor Canvas Container */}
                        <div className="crop-container w-full h-[400px] md:h-[65vh] relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-black border border-gray-200">
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

                        {/* Minimalist Floating Toolbar */}
                        <div className="mt-6 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200 flex items-center justify-center gap-2 md:gap-6">
                            <Tooltip title="Re-upload">
                                <IconButton onClick={() => document.getElementById("reuploadInput").click()} sx={{ color: "#374151" }}>
                                    <CloudUploadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Rotate Left">
                                <IconButton onClick={handleRotateLeft} sx={{ color: "#374151" }}>
                                    <RotateLeftIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Rotate Right">
                                <IconButton onClick={handleRotateRight} sx={{ color: "#374151" }}>
                                    <RotateRightIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset Changes">
                                <IconButton onClick={handleReset} sx={{ color: "#374151" }}>
                                    <RestoreIcon />
                                </IconButton>
                            </Tooltip>
                            <div className="w-px h-8 bg-gray-200 mx-2"></div>
                            <Tooltip title="Remove Image">
                                <IconButton onClick={() => { setImage(null); setCroppedAreaPixels(null); setCompressionInfo(null); setEstimatedSize(null); }} sx={{ color: "#EF4444" }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <input id="reuploadInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        
                        {/* Export Success Banner */}
                        {compressionInfo && (
                            <div className="mt-6 w-full max-w-md bg-green-50 border border-green-200 rounded-2xl p-4 text-green-900 shadow-sm animate-fade-in-up">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold">Export Successful</h4>
                                    {compressionInfo.savings && (
                                        <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                            Saved {compressionInfo.savings}%
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-4 text-sm mt-3">
                                    <div>
                                        <p className="text-green-700 text-xs uppercase tracking-wider">Size</p>
                                        <p className="font-semibold">{compressionInfo.originalSize}kb → {compressionInfo.compressedSize}kb</p>
                                    </div>
                                    <div>
                                        <p className="text-green-700 text-xs uppercase tracking-wider">Dimensions</p>
                                        <p className="font-semibold">{compressionInfo.width} × {compressionInfo.height}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Floating Control Card */}
            <div className={`w-full lg:w-[420px] bg-white lg:my-6 lg:mr-6 lg:rounded-[2rem] lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col transition-opacity duration-300 ${!image ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <AspectRatioIcon /> Dimensions
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Select an aspect ratio or enter custom pixels.</p>
                    </div>

                    {/* 1. Mobile View: Dropdown for Aspect Ratios */}
                    <div className="block md:hidden relative mb-8">
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
                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="Original">Original</option>
                            {resolutions.map(({ label }) => (
                                <option key={label} value={label}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* 2. Desktop View: Chips for Aspect Ratios */}
                    <div className="hidden md:flex flex-wrap gap-2 mb-8">
                        <button
                            onClick={() => handleResolutionChange("Original")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                                selectedLabel === "Original"
                                    ? "bg-black text-white border-black shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                            }`}
                        >
                            Original
                        </button>

                        {resolutions.map(({ label, w, h }) => (
                            <button
                                key={label}
                                onClick={() => handleResolutionChange(label, w, h)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                                    selectedLabel === label
                                        ? "bg-black text-white border-black shadow-md"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Custom Dimensions Form */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Width</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={targetWidth ?? ""}
                                        onChange={(e) => handleCustomDimensionChange("width", e.target.value)}
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        placeholder="Auto"
                                    />
                                    <span className="absolute right-4 top-3.5 text-gray-400 text-sm">px</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Height</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={targetHeight ?? ""}
                                        onChange={(e) => handleCustomDimensionChange("height", e.target.value)}
                                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        placeholder="Auto"
                                    />
                                    <span className="absolute right-4 top-3.5 text-gray-400 text-sm">px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 my-8" />

                    {/* Output Settings */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 mb-6">
                            <SettingsIcon /> Export
                        </h2>

                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</label>
                        <div className="relative mb-6">
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="image/jpeg">JPG (Best for photos)</option>
                                <option value="image/png">PNG (Supports transparency)</option>
                                <option value="image/webp">WEBP (Modern web format)</option>
                                <option value="image/avif">AVIF (Highest compression)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Quality</label>
                                <span className="font-bold text-gray-900">{quality}%</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={100}
                                step={1}
                                value={quality}
                                disabled={format === "image/png"}
                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50"
                            />
                            {format === "image/png" && (
                                <p className="text-xs text-gray-400 mt-2">Quality slider is disabled for PNG</p>
                            )}
                        </div>

                        {/* Real-time Size Estimation Display */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center transition-all duration-300">
                            <span className="text-sm font-semibold text-gray-500">Estimated Size:</span>
                            <span className="font-bold text-gray-900 flex items-center gap-2">
                                {isEstimating ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        <span className="text-gray-400 text-sm">Calculating...</span>
                                    </>
                                ) : estimatedSize ? (
                                    formatBytes(estimatedSize)
                                ) : (
                                    "--"
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Fixed Action Bottom Area */}
                <div className="p-6 border-t border-gray-100 bg-white lg:rounded-b-[2rem]">
                    <button
                        onClick={downloadImage}
                        disabled={isDownloading || !image}
                        className="w-full py-4 px-6 bg-black text-white text-base font-bold rounded-2xl shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <DownloadIcon /> Export Image
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageCropper;