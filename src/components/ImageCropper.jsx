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

// Color palette
const colors = {
    space_cadet: '#22223b',
    ultra_violet: '#4a4e69',
    rose_quartz: '#9a8c98',
    pale_dogwood: '#c9ada7',
    isabelline: '#f2e9e4'
};

// ─────────────────────────────────────────────
// Pixfit API config
// ─────────────────────────────────────────────
const API_URL = "https://pixfitapi.sandyeditz.in";
const API_KEY = "pixfit_img_compress_sk_2026";

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

// helper to create Pixfit filename
const getPixfitFileName = (originalName, format) => {
    const ext = format.split("/")[1] === "jpeg" ? "jpg" : format.split("/")[1] || "jpg";
    if (!originalName) {
        return `Pixfit.${ext}`;
    }
    const dotIndex = originalName.lastIndexOf(".");
    const name = dotIndex === -1 ? originalName : originalName.substring(0, dotIndex);
    return `${name}Pixfit.${ext}`;
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
    const [activeTab, setActiveTab] = useState('crop');
    const [isDownloading, setIsDownloading] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState(null);
    const lastBlobUrlRef = useRef(null);
    const fileNameRef = useRef(null);

    useEffect(() => {
        return () => {
            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
        };
    }, []);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleImageUpload = (e) => {
        const files =
            e.target.files ||
            (e.dataTransfer && e.dataTransfer.files);
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
            setImage(URL.createObjectURL(file));
            fileNameRef.current = file.name;
        }
    };

    const handleResolutionChange = (label, w, h) => {
        setSelectedLabel(label);
        if (label === "Original") {
            setAspect(undefined);
            setTargetWidth(0);
            setTargetHeight(0);
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
            const formatName = format.split("/")[1];

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

            const formData = new FormData();
            formData.append("image", croppedBlob, `pixfit.${formatName}`);
            formData.append("quality", quality);
            formData.append("format", formatName);
            if (width) formData.append("width", width);
            if (height) formData.append("height", height);

            const res = await fetch(`${API_URL}/api/compress`, {
                method: "POST",
                headers: { "x-api-key": API_KEY },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Compression failed");
            }

            const savings = res.headers.get("X-Savings-Percent");
            const originalSize = res.headers.get("X-Original-Size");
            const compressedSize = res.headers.get("X-Compressed-Size");
            const outWidth = res.headers.get("X-Output-Width");
            const outHeight = res.headers.get("X-Output-Height");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
            lastBlobUrlRef.current = url;

            const fileName = getPixfitFileName(fileNameRef.current, format);
            const link = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.click();

            if (savings) {
                setCompressionInfo({
                    savings,
                    originalSize: (originalSize / 1024).toFixed(0),
                    compressedSize: (compressedSize / 1024).toFixed(0),
                    width: outWidth,
                    height: outHeight,
                });
            }

        } catch (e) {
            console.error("Download failed:", e);
            alert(`Something went wrong: ${e.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleRotateLeft = () => {
        setRotation(prev => (prev - 90) % 360);
    };

    const handleRotateRight = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleReset = () => {
        setZoom(1);
        setRotation(0);
        setCrop({ x: 0, y: 0 });
    };

    return (
        <div className={`min-h-screen w-full grid grid-cols-1 lg:grid-cols-3 overflow-hidden mt-[60px]`} style={{
            background: `linear-gradient(to bottom right, ${colors.pale_dogwood}, ${colors.isabelline}, ${colors.rose_quartz})`
        }}>

            {/* Left: Canvas/Preview */}
            <div className="lg:col-span-2 flex flex-col justify-center items-center h-full bg-white shadow-xl p-4 md:p-8">
                {!image ? (
                    <div
                        className="flex flex-col items-center justify-center text-center px-6 py-10 md:py-14"
                        style={{ color: "#000" }}
                    >
                        {/* Icon */}
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${colors.rose_quartz}20` }}>
                                <CloudUploadIcon className="text-4xl" style={{ color: "#000" }} />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <div className="text-white rounded-full px-3 py-1 text-xs font-bold animate-pulse" style={{ backgroundColor: "#000" }}>
                                    FREE
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1
                            className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight max-w-3xl"
                            style={{
                                color: "#000",
                                fontFamily: "'Poppins', sans-serif"
                            }}
                        >
                            Resize, Crop & Convert Images in Seconds
                        </h1>

                        {/* Subtext */}
                        <p
                            className="mt-4 text-sm md:text-lg leading-relaxed max-w-2xl font-medium"
                            style={{
                                color: "#000",
                                fontFamily: "'Inter', sans-serif"
                            }}
                        >
                            Easily crop, resize, compress, and convert images for social media, websites, thumbnails, profile pictures, and more.
                        </p>

                        {/* Upload Button */}
                        <label
                            htmlFor="imageUpload"
                            className="mt-8 inline-flex items-center gap-2 px-7 py-3 text-white font-medium rounded-xl cursor-pointer transition-all duration-200 hover:opacity-95 shadow-md"
                            style={{ background: "#000" }}
                        >
                            <CloudUploadIcon className="text-xl" />
                            Upload Image
                        </label>

                        {/* Helper Text */}
                        <p
                            className="mt-4 text-xs md:text-sm"
                            style={{ color: "#000" }}
                        >
                            Supports JPG, PNG and WEBP
                        </p>

                        {/* Hidden Input */}
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                ) : (
                    <>
                        <div className="w-full flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold" style={{ color: "#000" }}>Image Preview</h3>
                        </div>

                        <div className="crop-container w-full h-[350px] md:h-[60vh] relative rounded-md overflow-hidden shadow-lg" style={{ backgroundColor: "#000" }}>
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

                        {/* Icon-based controls */}
                        <div className="w-full mt-3 max-w-md mx-auto">
                            <div className="p-4 rounded-lg">
                                <div className="flex items-center justify-around">
                                    <div className="flex flex-col items-center">
                                        <Tooltip title="Re-upload Image">
                                            <IconButton
                                                onClick={() => document.getElementById("reuploadInput").click()}
                                                sx={{ color: "#000", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}
                                            >
                                                <CloudUploadIcon fontSize="medium" />
                                            </IconButton>
                                        </Tooltip>
                                        <span className="text-xs mt-1" style={{ color: "#000" }}>Re-upload</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <Tooltip title="Remove Image">
                                            <IconButton
                                                onClick={() => { setImage(null); setCroppedAreaPixels(null); setCompressionInfo(null); }}
                                                sx={{ color: "#000", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}
                                            >
                                                <DeleteIcon fontSize="medium" />
                                            </IconButton>
                                        </Tooltip>
                                        <span className="text-xs mt-1" style={{ color: "#000" }}>Delete Image</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <Tooltip title="Rotate Left">
                                            <IconButton
                                                onClick={handleRotateLeft}
                                                sx={{ color: "#000", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}
                                            >
                                                <RotateLeftIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <span className="text-xs mt-1" style={{ color: "#000" }}>Rotate Left</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <Tooltip title="Rotate Right">
                                            <IconButton
                                                onClick={handleRotateRight}
                                                sx={{ color: "#000", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}
                                            >
                                                <RotateRightIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <span className="text-xs mt-1" style={{ color: "#000" }}>Rotate Right</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <Tooltip title="Reset All Adjustments">
                                            <IconButton
                                                onClick={handleReset}
                                                sx={{ color: "#000", "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" } }}
                                            >
                                                <RestoreIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <span className="text-xs mt-1" style={{ color: "#000" }}>Reset</span>
                                    </div>
                                </div>
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={downloadImage}
                                disabled={isDownloading}
                                className="w-full mt-2 py-3 px-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ background: "#000" }}
                            >
                                {isDownloading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Compressing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <DownloadIcon /> Download Image
                                    </span>
                                )}
                            </button>

                            {/* Compression Info */}
                            {compressionInfo && (
                                <div
                                    className="mt-4 p-4 rounded-xl border shadow-sm"
                                    style={{
                                        backgroundColor: "#dcfce7",
                                        borderColor: "#22c55e"
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg"></span>
                                        <h3 className="font-bold text-base sm:text-lg" style={{ color: "#000" }}>
                                            Image Compressed Successfully
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
                                        <div className="bg-white rounded-lg p-3">
                                            <p className="text-gray-500 text-xs mb-1">File Size</p>
                                            <p className="font-semibold text-black">
                                                {compressionInfo.originalSize}KB → {compressionInfo.compressedSize}KB
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg p-3">
                                            <p className="text-gray-500 text-xs mb-1">Output Resolution</p>
                                            <p className="font-semibold text-black">
                                                {compressionInfo.width} × {compressionInfo.height}px
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <input
                            id="reuploadInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </>
                )}
            </div>

            {/* Right Controls/Tools */}
            <div className="flex flex-col h-full bg-white shadow-inner p-5 md:p-6 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white pb-4 z-10 border-b" style={{ borderColor: `${colors.rose_quartz}50` }}>
                    <h2 className="text-xl font-bold mb-2" style={{ color: "#000" }}>Editing Tools</h2>
                    <div className="flex space-x-4">
                        <button
                            className="py-2 px-4 font-medium text-sm flex items-center gap-1 border-b-2"
                            style={{ color: "#000", borderColor: "#000" }}
                        >
                            <AspectRatioIcon className="w-4 h-4" /> Crop & Resize
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4 flex-1 space-y-8">
                    {/* Aspect Ratios */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: "#000" }}>Aspect Ratios</h3>
                        <select
                            value={selectedLabel}
                            onChange={(e) => {
                                const selected = resolutions.find(
                                    (item) => item.label === e.target.value
                                );
                                if (selected.label === "Original") {
                                    handleResolutionChange("Original");
                                } else {
                                    handleResolutionChange(selected.label, selected.w, selected.h);
                                }
                            }}
                            className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-black"
                            style={{ color: "#000" }}
                        >
                            {resolutions.map((item) => (
                                <option key={item.label} value={item.label}>
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        {/* Custom Dimensions */}
                        <div className="p-4 rounded-xl border mt-6" style={{
                            backgroundColor: "rgba(0,0,0,0.03)",
                            borderColor: "rgba(0,0,0,0.1)"
                        }}>
                            <h4 className="font-medium mb-3 flex items-center" style={{ color: "#000" }}>
                                <AspectRatioIcon className="mr-2" style={{ color: "#000" }} /> Custom Dimensions
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: "#000" }}>Width (px)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetWidth ?? ""}
                                            onChange={(e) => handleCustomDimensionChange("width", e.target.value)}
                                            placeholder="Width"
                                            className="w-full pl-3 pr-10 py-2 rounded-lg border bg-white placeholder-gray-400 focus:outline-none focus:ring-2"
                                            style={{ borderColor: "rgba(0,0,0,0.2)", color: "#000" }}
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs" style={{ color: "#000" }}>px</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs mb-1" style={{ color: "#000" }}>Height (px)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetHeight ?? ""}
                                            onChange={(e) => handleCustomDimensionChange("height", e.target.value)}
                                            placeholder="Height"
                                            className="w-full pl-3 pr-10 py-2 rounded-lg border bg-white placeholder-gray-400 focus:outline-none focus:ring-2"
                                            style={{ borderColor: "rgba(0,0,0,0.2)", color: "#000" }}
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs" style={{ color: "#000" }}>px</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Settings */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "#000" }}>
                            <SettingsIcon className="w-5 h-5" style={{ color: "#000" }} /> Output Settings
                        </h3>

                        <div className="mb-4">
                            <label className="text-sm font-medium block mb-2" style={{ color: "#000" }}>File Format</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full pl-3 pr-10 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2"
                                style={{ borderColor: "rgba(0,0,0,0.2)", color: "#000" }}
                            >
                                <option value="image/jpeg">JPG - Best for photos</option>
                                <option value="image/png">PNG - Supports transparency</option>
                                <option value="image/webp">WEBP - Modern format</option>
                                <option value="image/avif">AVIF - Best compression</option>
                            </select>
                        </div>

                        {/* Quality Slider */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium" style={{ color: "#000" }}>Quality</label>
                                <span className="font-bold text-sm" style={{ color: "#000" }}>{quality}%</span>
                            </div>
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-1 relative h-6 flex items-center">
                                    <div className="absolute w-full h-2 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.12)" }}></div>
                                    <div
                                        className="absolute h-2 rounded-full"
                                        style={{ width: `${quality}%`, background: "#000" }}
                                    ></div>
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        step={1}
                                        value={quality}
                                        disabled={format === "image/png"}
                                        onChange={(e) => setQuality(parseInt(e.target.value))}
                                        className="absolute w-full h-6 opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                                    />
                                    <div
                                        className="absolute h-4 w-4 bg-white border-2 rounded-full shadow-md transform -translate-x-1/2 z-10 pointer-events-none transition-transform"
                                        style={{ left: `${quality}%`, borderColor: "#000" }}
                                    >
                                        <div className="absolute inset-0 m-auto h-2 w-2 rounded-full" style={{ backgroundColor: "#000" }}></div>
                                    </div>
                                </div>
                            </div>
                            {format === "image/png" && (
                                <p className="text-xs mt-2 italic" style={{ color: "#000" }}>
                                    Quality adjustment is not available for PNG format
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageCropper;