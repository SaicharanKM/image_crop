import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { IconButton, Tooltip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from "react-router-dom";
function ImageCropper() {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [targetWidth, setTargetWidth] = useState(300);
    const [targetHeight, setTargetHeight] = useState(300);
    const [isDragging, setIsDragging] = useState(false);


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

    const handleRatioChange = () => {
        const [w, h] = ratioInput.split(":").map(Number);
        if (w && h) {
            setAspect(w / h);
        }
    };

    const showCroppedImage = async () => {
        try {
            const croppedImg = await getCroppedImg(
                image,
                croppedAreaPixels,
                parseInt(targetWidth),
                parseInt(targetHeight)
            );
            setCroppedImage(croppedImg);
        } catch (e) {
            console.error(e);
        }
    };

    const downloadImage = async () => {
        if (!image || !croppedAreaPixels) {
            alert("Please upload an image and adjust the crop area first");
            return;
        }

        try {
            // Generate cropped image
            const croppedImgUrl = await getCroppedImg(
                image,
                croppedAreaPixels,
                parseInt(targetWidth),
                parseInt(targetHeight)
            );

            // Cleanup previous blob URL
            if (lastBlobUrlRef.current) {
                URL.revokeObjectURL(lastBlobUrlRef.current);
            }
            lastBlobUrlRef.current = croppedImgUrl;

            // Trigger download
            const link = document.createElement("a");
            link.download = "cropped-image.png";
            link.href = croppedImgUrl;
            link.click();

        } catch (e) {
            console.error("Download failed:", e);
            alert("Unsupported file format. Please try with JPEG or PNG.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#ffffff] text-white flex justify-center pt-24">
            <div className="w-full max-w-full flex flex-col items-center p-1">
                {/* <h5 className="text-3xl font-bold text-white text-center">
                    <span className="text-yellow-500 font-extrabold">PixFit</span>
                </h5>
                <h5 className="text-1xl font-bold text-white text-center">The Ultimate Tool for Resizing and Cropping at the Same Time </h5> */}

                <div
                    className={`upload-section h-[320px] max-w-[900px] w-full mx-auto mt-4 p-6 
  border-3 ${isDragging ?
                            "border-yellow-500 bg-yellow-50 shadow-[0_0_15px_rgba(245,158,11,0.5)]" :
                            "border-gray-300 bg-gradient-to-br from-gray-50 to-white"
                        } 
  border-dashed rounded-2xl shadow-lg flex flex-col items-center justify-center text-center 
  transition-all duration-300 ease-in-out transform ${isDragging ? "scale-[1.01]" : ""
                        }`}
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
                            <div className="flex flex-col items-center text-[#1f2932]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mb-4 text-dark  animate-bounce"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 15.75V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v8.25M3 15.75l4.72-4.72a.75.75 0 011.06 0L12 15.75l3.22-3.22a.75.75 0 011.06 0L21 15.75M3 15.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-2.25"
                                    />
                                </svg>
                                <p className="text-lg font-semibold mb-2">Upload an Image</p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Drag & Drop your image here, or click below to browse.
                                </p>

                                 <h5 className="text-1xl font-bold text-gray-700 text-center">The Ultimate Tool for Resizing and Cropping at the Same Time </h5> 
                            </div>

                            <label
                                htmlFor="imageUpload"
                                className="mt-4 px-4 py-2 bg-yellow-500 text-white font-medium rounded-md cursor-pointer hover:bg-yellow-600 transition-all duration-300"
                            >
                                Choose Image
                            </label>
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </>
                    ) : (
                        <>
                            <div className="crop-container mt-6 relative w-full max-w-[800px] h-[600px] mx-auto">
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


                            <div className="flex flex-row items-center justify-center gap-6 mt-2">
                                {/* Re-upload */}
                                <div className="flex flex-col items-center">
                                    <Tooltip title="Re-upload Image">
                                        <IconButton
                                            onClick={() => document.getElementById("reuploadInput").click()}
                                            sx={{
                                                color: '#0d3288ff',
                                                '&:hover': {
                                                    color: '#0c296cff',
                                                },
                                            }}
                                        >
                                            <CloudUploadIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                    <span className="text-sm text-gray-700 mt-1">Re-upload</span>
                                </div>

                                {/* Remove */}
                                <div className="flex flex-col items-center">
                                    <Tooltip title="Remove Image">
                                        <IconButton
                                            onClick={() => {
                                                setImage(null);
                                                setCroppedImage(null);
                                            }}
                                            sx={{
                                                color: '#dc2626',
                                                '&:hover': {
                                                    color: '#b91c1c',
                                                },
                                            }}
                                        >
                                            <DeleteIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                    <span className="text-sm text-gray-700 mt-1">Remove</span>
                                </div>

                                {/* Download (only if image exists) */}
                                {image && (
                                    <div className="flex flex-col items-center">
                                        <Tooltip title="Download Image">
                                            <IconButton
                                                onClick={downloadImage}
                                                sx={{
                                                    color: '#f59e0b',
                                                    '&:hover': {
                                                        filter: 'brightness(1.1)',
                                                    },
                                                }}
                                            >
                                                <DownloadIcon fontSize="medium" />
                                            </IconButton>
                                        </Tooltip>
                                        <span className="text-sm text-gray-700 mt-1">Download</span>
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

                <div className="ratio-input w-full max-w-[920px] mx-auto px-4 mt-6 mb-4">
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* Common Ratios Section */}
                        <div className="w-full md:w-1/2 rounded-2xl p-6 shadow-lg border border-gray-300">
                            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Common Ratios</h3>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-2">
                                {[
                                    { label: "1:1", w: 500, h: 500 },
                                    { label: "16:9", w: 1600, h: 900 },
                                    { label: "4:3", w: 800, h: 600 },
                                    { label: "3:2", w: 900, h: 600 },
                                    { label: "9:16", w: 900, h: 1600 },
                                ].map(({ label, w, h }) => (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            setTargetWidth(w);
                                            setTargetHeight(h);
                                            setAspect(w / h);
                                        }}
                                        className="py-3 px-2 rounded-xl text-gray-800 bg-white hover:bg-amber-200 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] text-center border border-gray-300"
                                    >
                                        <span className="font-semibold text-lg">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Size Section */}
                        <div className="w-full md:w-1/2 rounded-2xl p-6 shadow-lg border border-gray-300">
                            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Custom Size</h3>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <div className="w-full">
                                    <div className="flex items-center mb-1">
                                        <span className="text-gray-700 text-sm font-medium mr-2">Width:</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={targetWidth}
                                        onChange={(e) => {
                                            const w = parseInt(e.target.value);
                                            setTargetWidth(w);
                                            if (w > 0 && targetHeight > 0) setAspect(w / targetHeight);
                                        }}
                                        placeholder="Width"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div className="w-full">
                                    <div className="flex items-center mb-1">
                                        <span className="text-gray-700 text-sm font-medium mr-2">Height:</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={targetHeight}
                                        onChange={(e) => {
                                            const h = parseInt(e.target.value);
                                            setTargetHeight(h);
                                            if (targetWidth > 0 && h > 0) setAspect(targetWidth / h);
                                        }}
                                        placeholder="Height"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 "
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="mt-auto w-full backdrop-blur-sm border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="w-full px-4 sm:px-6 py-3 text-center text-gray-700 text-sm">
                        <div className="max-w-6xl mx-auto">
                            © {new Date().getFullYear()}{' '}
                            <span className="text-[#FFD300] font-medium">PixFit</span>. All rights reserved. |   
                            <Link to="/privacy-policy" className="text-gray-600 hover:text-[#FFD300] transition">
                                 Privacy Policy
                            </Link>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export default ImageCropper;
