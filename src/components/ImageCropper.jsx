import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { IconButton, Tooltip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInstagram,
    faXTwitter,
    faLinkedinIn,
    faWhatsapp
} from '@fortawesome/free-brands-svg-icons';



// Define resolution options
const resolutions = [
    { label: "16:9", w: 1600, h: 900 },   // video, YouTube, screens
    { label: "4:3", w: 800, h: 600 },     // Common in older TVs, webcams, some photography
    { label: "1:1", w: 500, h: 500 },     // Instagram posts, profile pictures
    { label: "3:2", w: 900, h: 600 },     // DSLR cameras, photography
    { label: "2:3", w: 800, h: 1200 },    // Portrait photography, prints
    { label: "4:5", w: 1080, h: 1350 },   // Instagram portrait format
    { label: "9:16", w: 900, h: 1600 }    // TikTok, Instagram Reels, vertical video
];

function ImageCropper() {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(undefined);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [targetWidth, setTargetWidth] = useState(0);
    const [targetHeight, setTargetHeight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("Original");
    const [format, setFormat] = useState('image/jpeg');
    const [quality, setQuality] = useState(90);

    const lastBlobUrlRef = useRef(null);

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
        const file = e.target.files[0];
        if (file) {
            // Cleanup previous blob URL
            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
                lastBlobUrlRef.current = null;
            }

            // Reset states for new image
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setImage(URL.createObjectURL(file));
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
    const handleCustomDimensionChange = (width, height) => {
        setTargetWidth(width);
        setTargetHeight(height);
        // Only update aspect if both values are valid numbers
        if (width && height) {
            setAspect(width / height);
        } else {
            setAspect(undefined);
        }
        setSelectedLabel("Custom"); // Ensure Custom is selected
    };

    const downloadImage = async () => {
        if (!image || !croppedAreaPixels) {
            alert("Please upload an image and adjust the crop area first");
            return;
        }

        try {

            const width = targetWidth === 0 ? croppedAreaPixels.width : targetWidth;
            const height = targetHeight === 0 ? croppedAreaPixels.height : targetHeight;

            const croppedImgUrl = await getCroppedImg(
                image,
                croppedAreaPixels,
                parseInt(width),
                parseInt(height),
                format,
                quality / 100
            );

            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
            lastBlobUrlRef.current = croppedImgUrl;
            const extension = format.split('/')[1];
            const link = document.createElement("a");
            link.download = `cropped-image.${extension}`;
            link.href = croppedImgUrl;
            link.click();

        } catch (e) {
            console.error("Download failed:", e);
            alert("Unsupported file format. Please try with JPEG or PNG.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 flex flex-col items-center pt-16">
            {/* <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-6">
            </div> */}
            <div className="w-full max-w-5xl flex flex-col items-center p-4">
                <div
                    className={`upload-section w-full mx-auto mt-4 p-4 sm:p-6
    min-h-[520px] sm:min-h-[560px]
    border-3 ${isDragging
                            ? "border-amber-500 bg-amber-50 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                            : "border-gray-300 bg-gradient-to-br from-gray-50 to-white"
                        }
    border-dashed rounded-2xl shadow-lg flex flex-col items-center justify-center text-center
    transition-all duration-300 ease-in-out transform ${isDragging ? "scale-[1.01]" : ""}`}


                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) {
                            handleImageUpload({ target: { files: [file] } });
                        }
                    }}
                >
                    {!image ? (
                        <>
                            <div className="w-full flex flex-col items-center text-gray-800 justify-center">
                                <div className="relative mb-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-20 w-20 mb-4 text-amber-500 mx-auto"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 3L7 8h3v4h4V8h3l-5-5zM5 18h14v2H5z" />
                                    </svg>
                                    <div className="absolute -top-2 -right-2">
                                        <div className="bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-bold animate-pulse">
                                            FREE
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 text-center">Transform Your Images in Seconds</p>
                                <p className="text-base sm:text-lg text-gray-700 mb-4 text-center px-4">
                                    The Ultimate Tool for Resizing and Cropping at the Same Time
                                </p>

                                <label
                                    htmlFor="imageUpload"
                                    className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg cursor-pointer hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
                                >
                                    <CloudUploadIcon className="mr-2" />
                                    Upload Your Image
                                </label>
                                <p className="text-gray-600 text-sm mt-3">
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
                        </>
                    ) : (
                        <>
                            <div className="crop-container mt-4 w-full h-[100vw] max-h-[440px] sm:h-[500px] relative rounded-md overflow-hidden">
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={aspect}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 w-full">
                                {/* Re-upload */}
                                <div className="flex flex-col items-center">
                                    <Tooltip title="Re-upload Image">
                                        <IconButton
                                            onClick={() => document.getElementById("reuploadInput").click()}
                                            sx={{
                                                color: '#0d3288ff',
                                                '&:hover': { color: '#0c296cff' },
                                            }}
                                        >
                                            <CloudUploadIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                    <span className="text-sm text-gray-700 mt-1 font-bold">Re-upload</span>
                                </div>

                                {/* Remove */}
                                <div className="flex flex-col items-center">
                                    <Tooltip title="Remove Image">
                                        <IconButton
                                            onClick={() => {
                                                setImage(null);
                                                setCroppedAreaPixels(null);
                                            }}
                                            sx={{
                                                color: '#dc2626',
                                                '&:hover': { color: '#b91c1c' },
                                            }}
                                        >
                                            <DeleteIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                    <span className="text-sm text-gray-700 mt-1 font-bold">Remove</span>
                                </div>

                                {/* Download */}
                                {image && (
                                    <div className="flex flex-col items-center">
                                        <Tooltip title="Download Image">
                                            <IconButton
                                                onClick={downloadImage}
                                                sx={{
                                                    color: '#f59e0b',
                                                    '&:hover': { filter: 'brightness(1.1)' },
                                                }}
                                            >
                                                <DownloadIcon fontSize="medium" />
                                            </IconButton>
                                        </Tooltip>
                                        <span className="text-sm text-gray-700 mt-1 font-bold">Download</span>
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



                <div className="ratio-input w-full max-w-6xl mx-auto px-4 mt-8 " >
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Resolution Card */}
                        <div className="w-full lg:w-1/2 rounded-xl p-8 shadow-lg border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Professional Aspect Ratios</h3>
                                <p className="text-gray-500">Optimized for all platforms and use cases</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                                {resolutions.map(({ label, w, h }) => (
                                    <button
                                        key={label}
                                        onClick={() => handleResolutionChange(label, w, h)}
                                        className={`py-3 px-2 rounded-lg transition-all duration-200 text-center border
                    ${selectedLabel === label
                                                ? "bg-amber-50 border-amber-300 shadow-sm ring-1 ring-amber-200 font-medium"
                                                : "bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-200"}
                `}
                                    >
                                        <span className="block text-gray-800">{label}</span>
                                        <span className="block text-xs text-gray-500 mt-1">{label !== 'Custom' ? `${w}×${h}` : ''}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                                <h4 className="text-gray-700 font-medium mb-4 flex items-center justify-center">
                                    <span className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center mr-2">↔</span>
                                    Custom Dimensions
                                </h4>

                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm text-gray-600 mb-1">Width</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={targetWidth}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Allow empty value or valid numbers
                                                    if (value === '' || !isNaN(value)) {
                                                        handleCustomDimensionChange(value === '' ? '' : Number(value), targetHeight);
                                                    }
                                                }}
                                                placeholder="100"
                                                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                                            />
                                            <span className="absolute right-3 top-3.5 text-gray-400 text-sm">px</span>
                                        </div>
                                    </div>

                                    {/* <div className="text-gray-400 text-xl  sm:mt-0">×</div> */}

                                    <div className="w-full">
                                        <label className="block text-sm text-gray-600 mb-1">Height</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={targetHeight}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '' || !isNaN(value)) {
                                                        handleCustomDimensionChange(targetWidth, value === '' ? '' : Number(value));
                                                    }
                                                }}
                                                placeholder="100"
                                                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                                            />
                                            <span className="absolute right-3 top-3.5 text-gray-400 text-sm">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 rounded-xl p-8 shadow-lg border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-semibold text-gray-800 mb-2">Image Compressor</h2>
                                <p className="text-gray-500 text-lg">Best web app to compress image files online for free.</p>
                            </div>
                            <div className="w-full grid grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label className="text-gray-600 text-sm font-medium block mb-2 flex items-center justify-center">
                                        Output Format
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 appearance-none"
                                        >
                                            <option value="image/jpeg">JPG (Best for photos)</option>
                                            <option value="image/png">PNG (Transparency support)</option>
                                        </select>
                                        <span className="absolute right-3 top-3.5 text-gray-400 text-xs">▼</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-600 text-sm font-medium block mb-2 flex items-center justify-center">
                                        Quality: <span className="ml-2 font-bold text-amber-600">{quality}%</span>
                                    </label>
                                    <div className="flex items-center gap-4 w-full">
                                        {/* Track container with progress indicator */}
                                        <div className="flex-1 relative h-6 flex items-center">
                                            {/* Full track background */}
                                            <div className="absolute w-full h-1.5 bg-gray-100 rounded-full"></div>

                                            {/* Colored progress portion */}
                                            <div
                                                className="absolute h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                                style={{ width: `${quality}%` }}
                                            ></div>

                                            {/* Interactive slider */}
                                            <input
                                                type="range"
                                                min={10}
                                                max={100}
                                                step={1}
                                                value={quality}
                                                disabled={format === "image/png"}
                                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                                className="absolute w-full h-6 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                            />

                                            {/* Custom thumb */}
                                            <div
                                                className="absolute h-4 w-4 bg-white border-2 border-amber-500 rounded-full shadow-md transform -translate-x-1/2 z-20 transition-transform hover:scale-125"
                                                style={{ left: `${quality}%` }}
                                            >
                                                <div className="absolute inset-0 m-auto h-2 w-2 bg-amber-500 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Value display */}
                                        <div className="flex items-center justify-center bg-white border border-amber-200 text-amber-700 font-medium text-sm w-16 h-8 rounded-lg shadow-inner">
                                            {quality}%
                                        </div>
                                    </div>
                                    {format === "image/png" && (
                                        <p className="text-xs text-gray-500 mt-2 text-center italic">
                                            Quality adjustment is not available for PNG format
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={downloadImage}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 flex items-center justify-center"
                                >
                                    Download High-Quality Image
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-2">No watermarks • Unlimited exports</p>
                            </div>
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start">
                                <div className="bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center mr-3 flex-shrink-0 font-medium">i</div>
                                <div>
                                    <p className="text-sm text-gray-700 font-medium mb-1">Quality vs. File Size</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Lower values reduce both image quality <span className="font-semibold text-amber-700">and file size</span> significantly.
                                        For most images, <span className="font-semibold">80-90%</span> provides the best balance between quality and compression.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-8 rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white">

                </div>

            </div>
        </div>
    );
}

export default ImageCropper;