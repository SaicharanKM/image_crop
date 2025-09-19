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
    if (!originalName) {
        return `Pixfit.${format.split("/")[1] || "jpg"}`;
    }
    const dotIndex = originalName.lastIndexOf(".");
    if (dotIndex === -1) {
        return `${originalName}Pixfit.${format.split("/")[1] || "jpg"}`;
    }
    const name = originalName.substring(0, dotIndex);
    const ext = originalName.substring(dotIndex + 1);
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
            setImage(URL.createObjectURL(file));
            fileNameRef.current = file.name; // save original file name
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
        try {
            const width = selectedLabel === "Custom" ? parseInt(targetWidth) : 0;
            const height = selectedLabel === "Custom" ? parseInt(targetHeight) : 0;

            const croppedImgUrl = await getCroppedImg(
                image,
                croppedAreaPixels,
                width,
                height,
                format,
                quality / 100,
                rotation
            );

            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
            lastBlobUrlRef.current = croppedImgUrl;

            const fileName = getPixfitFileName(fileNameRef.current, format);

            const link = document.createElement("a");
            link.download = fileName;
            link.href = croppedImgUrl;
            link.click();
        } catch (e) {
            console.error("Download failed:", e);
            alert("Something went wrong while exporting.");
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

            {/* Left: Canvas/Preview - 2 columns on large screens */}
            <div className="lg:col-span-2 flex flex-col justify-center items-center h-full bg-white shadow-xl p-4 md:p-8">
                <div
                    className={`upload-section w-full max-w-4xl mx-auto p-4 min-h-[400px] md:min-h-[70vh] border-4 rounded-2xl border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out transform shadow-lg ${isDragging
                        ? `border-[${colors.ultra_violet}] bg-[${colors.ultra_violet}20] shadow-[0_0_20px_${colors.ultra_violet}50] scale-[1.02]`
                        : `border-[${colors.rose_quartz}] bg-gradient-to-br from-[${colors.isabelline}] to-white`
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleImageUpload(e);
                    }}
                >
                    {!image ? (
                        <div className="flex flex-col items-center p-6" style={{ color: colors.space_cadet }}>
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${colors.rose_quartz}20` }}>
                                    <CloudUploadIcon className="text-4xl" style={{ color: colors.ultra_violet }} />
                                </div>
                                <div className="absolute -top-2 -right-2">
                                    <div className="text-white rounded-full px-3 py-1 text-xs font-bold animate-pulse" style={{ backgroundColor: colors.ultra_violet }}>
                                        FREE
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: colors.space_cadet }}>
                                Transform Your Images in Seconds
                            </h2>
                            <p className="text-lg mb-6 px-4 max-w-xl" style={{ color: colors.ultra_violet }}>
                                The Ultimate Tool for Resizing and Cropping at the Same Time
                            </p>
                            <label
                                htmlFor="imageUpload"
                                className="mt-2 px-8 py-3 text-white font-bold rounded-lg cursor-pointer transition shadow-lg hover:shadow-xl flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(to right, ${colors.space_cadet}, ${colors.ultra_violet})`
                                }}
                            >
                                <CloudUploadIcon className="mr-2" />
                                Upload Your Image
                            </label>
                            <p className="text-sm mt-4" style={{ color: colors.ultra_violet }}>
                                or drag and drop an image here
                            </p>
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
                                <h3 className="text-lg font-semibold" style={{ color: colors.space_cadet }}>Image Preview</h3>
                            </div>

                            <div className="crop-container w-full h-[400px] md:h-[60vh] relative rounded-md overflow-hidden shadow-lg" style={{ backgroundColor: colors.space_cadet }}>
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

                            {/* Icon-based controls - No slider bars */}
                            <div className="w-full mt-3 max-w-md mx-auto">
                                <div className="p-4 rounded-lg" >
                                    <div className="flex items-center justify-around">
                                        <div className="flex flex-col items-center">
                                            <Tooltip title="Re-upload Image">
                                                <IconButton
                                                    onClick={() => document.getElementById("reuploadInput").click()}
                                                    sx={{ color: colors.ultra_violet, "&:hover": { backgroundColor: `${colors.ultra_violet}10` } }}
                                                >
                                                    <CloudUploadIcon fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>
                                            <span className="text-xs mt-1" style={{ color: colors.ultra_violet }}>Re-upload</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Tooltip title="Remove Image">
                                                <IconButton
                                                    onClick={() => { setImage(null); setCroppedAreaPixels(null); }}
                                                    sx={{ color: colors.rose_quartz, "&:hover": { backgroundColor: `${colors.rose_quartz}10` } }}
                                                >
                                                    <DeleteIcon fontSize="medium" />
                                                </IconButton>
                                            </Tooltip>
                                            <span className="text-xs mt-1" style={{ color: colors.ultra_violet }}>Delete Image</span>
                                        </div>

                                        {/* Rotate Left */}
                                        <div className="flex flex-col items-center">
                                            <Tooltip title="Rotate Left">
                                                <IconButton
                                                    onClick={handleRotateLeft}
                                                    sx={{ color: colors.ultra_violet, "&:hover": { backgroundColor: `${colors.ultra_violet}10` } }}
                                                >
                                                    <RotateLeftIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <span className="text-xs mt-1" style={{ color: colors.ultra_violet }}>Rotate Left</span>
                                        </div>

                                        {/* Rotate Right */}
                                        <div className="flex flex-col items-center">
                                            <Tooltip title="Rotate Right">
                                                <IconButton
                                                    onClick={handleRotateRight}
                                                    sx={{ color: colors.ultra_violet, "&:hover": { backgroundColor: `${colors.ultra_violet}10` } }}
                                                >
                                                    <RotateRightIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <span className="text-xs mt-1" style={{ color: colors.ultra_violet }}>Rotate Right</span>
                                        </div>

                                        {/* Reset */}
                                        <div className="flex flex-col items-center">
                                            <Tooltip title="Reset All Adjustments">
                                                <IconButton
                                                    onClick={handleReset}
                                                    sx={{ color: colors.rose_quartz, "&:hover": { backgroundColor: `${colors.rose_quartz}10` } }}
                                                >
                                                    <RestoreIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <span className="text-xs mt-1" style={{ color: colors.ultra_violet }}>Reset</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={downloadImage}
                                    className="w-full mt-2 py-3 px-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(to right, ${colors.ultra_violet}, ${colors.space_cadet})`
                                    }}
                                >
                                    <DownloadIcon className="mr-2" />
                                    Download Image
                                </button>
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
            </div>

            {/* Right Controls/Tools - 1 column on large screens */}
            <div className="flex flex-col h-full bg-white shadow-inner p-5 md:p-6 overflow-y-auto" >
                {/* Header */}
                <div className="sticky top-0 bg-white pb-4 z-10 border-b" style={{ borderColor: `${colors.rose_quartz}50` }}>
                    <h2 className="text-xl font-bold mb-2" style={{ color: colors.space_cadet }}>Editing Tools</h2>
                    <div className="flex space-x-4">
                        <button
                            className="py-2 px-4 font-medium text-sm flex items-center gap-1 border-b-2"
                            style={{
                                color: colors.ultra_violet,
                                borderColor: colors.ultra_violet
                            }}
                        >
                            <AspectRatioIcon className="w-4 h-4" /> Crop & Resize
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4 flex-1 space-y-8">
                    {/* Aspect Ratios */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors.space_cadet }}>Aspect Ratios</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Original */}
                            <button
                                key="Original"
                                onClick={() => handleResolutionChange("Original")}
                                className={`py-3 px-2 rounded-lg border font-medium text-center transition-all duration-200 flex flex-col items-center justify-center
    ${selectedLabel === "Original"
                                        ? "shadow-md ring-2"
                                        : "hover:border-gray-200"}`}
                            >
                                <span className="text-xs font-medium">Original</span>
                            </button>



                            {/* Dynamic Ratios */}
                            {resolutions.map(({ label, w, h }) => (
                                <button
                                    key={label}
                                    onClick={() => handleResolutionChange(label, w, h)}
                                    className={`py-3 px-2 rounded-lg border font-medium text-center transition-all duration-200 flex flex-col items-center justify-center
              ${selectedLabel === label
                                            ? "shadow-md ring-2"
                                            : "hover:border-gray-200"}`}
                                // style={{
                                //     backgroundColor: selectedLabel === label ? `${colors.ultra_violet}10` : `${colors.isabelline}`,
                                //     borderColor: selectedLabel === label ? colors.ultra_violet : `${colors.rose_quartz}50`,
                                //     color: selectedLabel === label ? colors.ultra_violet : colors.space_cadet,
                                //     ringColor: `${colors.ultra_violet}30`
                                // }}
                                >
                                    <span className="block text-xs mt-1">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Custom Dimensions */}
                        <div className="p-4 rounded-xl border mt-6" style={{
                            backgroundColor: `${colors.ultra_violet}08`,
                            borderColor: `${colors.ultra_violet}20`
                        }}>
                            <h4 className="font-medium mb-3 flex items-center" style={{ color: colors.space_cadet }}>
                                <AspectRatioIcon className="mr-2" style={{ color: colors.ultra_violet }} /> Custom Dimensions
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Width */}
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: colors.ultra_violet }}>
                                        Width (px)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetWidth ?? ""}
                                            onChange={(e) => handleCustomDimensionChange("width", e.target.value)}
                                            placeholder="Width"
                                            className="w-full pl-3 pr-10 py-2 rounded-lg border bg-white placeholder-gray-400 focus:outline-none focus:ring-2"
                                            style={{
                                                borderColor: `${colors.rose_quartz}80`,
                                                color: colors.space_cadet,
                                            }}
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs" style={{ color: colors.ultra_violet }}>px</span>
                                    </div>
                                </div>

                                {/* Height */}
                                <div>
                                    <label className="block text-xs mb-1" style={{ color: colors.ultra_violet }}>
                                        Height (px)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetHeight ?? ""}
                                            onChange={(e) => handleCustomDimensionChange("height", e.target.value)}
                                            placeholder="Height"
                                            className="w-full pl-3 pr-10 py-2 rounded-lg border bg-white placeholder-gray-400 focus:outline-none focus:ring-2"
                                            style={{
                                                borderColor: `${colors.rose_quartz}80`,
                                                color: colors.space_cadet,
                                            }}
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs" style={{ color: colors.ultra_violet }}>px</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Settings */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: colors.space_cadet }}>
                            <SettingsIcon className="w-5 h-5" style={{ color: colors.ultra_violet }} /> Output Settings
                        </h3>

                        <div className="mb-4">
                            <label className="text-sm font-medium block mb-2" style={{ color: colors.space_cadet }}>File Format</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full pl-3 pr-10 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2"
                                style={{
                                    borderColor: `${colors.rose_quartz}80`,
                                    color: colors.space_cadet,
                                    focusRingColor: colors.ultra_violet,
                                    focusBorderColor: colors.ultra_violet
                                }}
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
                                <label className="text-sm font-medium" style={{ color: colors.space_cadet }}>Quality</label>
                                <span className="font-bold text-sm" style={{ color: colors.ultra_violet }}>{quality}%</span>
                            </div>
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex-1 relative h-6 flex items-center">
                                    <div className="absolute w-full h-2 rounded-full" style={{ backgroundColor: `${colors.rose_quartz}40` }}></div>
                                    <div
                                        className="absolute h-2 rounded-full"
                                        style={{
                                            width: `${quality}%`,
                                            background: `linear-gradient(to right, ${colors.ultra_violet}, ${colors.space_cadet})`
                                        }}
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
                                        style={{
                                            left: `${quality}%`,
                                            borderColor: colors.ultra_violet
                                        }}
                                    >
                                        <div className="absolute inset-0 m-auto h-2 w-2 rounded-full" style={{ backgroundColor: colors.ultra_violet }}></div>
                                    </div>
                                </div>
                            </div>
                            {format === "image/png" && (
                                <p className="text-xs mt-2 italic" style={{ color: colors.ultra_violet }}>
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