import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { getCroppedImg } from "../utils/cropImage";


function ImageCropper() {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [ratioInput, setRatioInput] = useState("1:1");
    const [targetWidth, setTargetWidth] = useState(300);
    const [targetHeight, setTargetHeight] = useState(300);
    const [isDragging, setIsDragging] = useState(false);


    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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

    const downloadImage = () => {
        const link = document.createElement("a");
        link.download = "cropped-image.png";
        link.href = croppedImage;
        link.click();
    };

    return (

        <div className="bg-[#1f2937] text-white p-4 rounded">
            <h2 className="text-white pb-10 text-xl font-bold">Custom Ratio Image Cropper</h2>
            <div
                className={`upload-section h-[400px] max-w-[500px] w-full mx-auto mt-4 p-6 border-2 border-dashed rounded-2xl shadow-md flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? "border-yellow-500 bg-yellow-100" : "border-gray-300 bg-white"
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
                        <div className="flex flex-col items-center text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mb-4 text-gray-400"
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
                            <p className="text-sm text-gray-400">
                                Drag & Drop your image here, or click below to browse.
                            </p>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-4 block w-full max-w-xs text-sm text-black border border-gray-300 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        />
                    </>
                ) : (
                    <>
                        <div className="crop-container mt-6 relative w-full max-w-[500px] h-[300px] mx-auto">
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

                        {/* Re-upload button */}
                        <div className="flex flex-row items-center justify-start space-x-4 mt-4">
                            {/* <button
                                onClick={() => document.getElementById("reuploadInput").click()}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition duration-300"
                            >
                                Re-upload Image
                            </button>
                            <button
                                onClick={() => {
                                    setImage(null);
                                    setCroppedImage(null);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                            >
                                Remove
                            </button> */}

                            {/* Hidden input for reupload */}
                            <input
                                id="reuploadInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-start space-x-4 mt-4">
                            <button
                                onClick={() => document.getElementById("reuploadInput").click()}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition duration-300"
                            >
                                Re-upload Image
                            </button>
                            <button
                                onClick={() => {
                                    setImage(null);
                                    setCroppedImage(null);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                            >
                                Remove
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="ratio-input mt-6 flex flex-col gap-4">

                {/* Width & Height Inputs */}
                <div className="flex flex-wrap items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md">
                    <input
                        type="number"
                        value={targetWidth}
                        onChange={(e) => {
                            const w = parseInt(e.target.value);
                            setTargetWidth(w);
                            if (w > 0 && targetHeight > 0) setAspect(w / targetHeight);
                        }}
                        placeholder="Width (px)"
                        className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        value={targetHeight}
                        onChange={(e) => {
                            const h = parseInt(e.target.value);
                            setTargetHeight(h);
                            if (targetWidth > 0 && h > 0) setAspect(targetWidth / h);
                        }}
                        placeholder="Height (px)"
                        className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>


                <div className="mt-6">
                    <h3 className="text-gray-100 font-semibold  mb-2">Common Ratios</h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: "1:1", w: 500, h: 500, color: "bg-blue-600" },
                            { label: "16:9", w: 1600, h: 900, color: "bg-green-600" },
                            { label: "4:3", w: 800, h: 600, color: "bg-purple-600" },
                            { label: "3:2", w: 900, h: 600, color: "bg-pink-600" },
                            { label: "9:16", w: 900, h: 1600, color: "bg-yellow-600 text-black" }
                        ].map(({ label, w, h, color }) => (
                            <button
                                key={label}
                                onClick={() => {
                                    setTargetWidth(w);
                                    setTargetHeight(h);
                                    setAspect(w / h);
                                }}
                                className={`px-4 py-2 rounded text-white hover:brightness-110 transition ${color}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>


            {/* Cropper Area (Fixed Container)
            {image && (
                <div className="crop-container mt-6 relative mx-auto" style={{ width: "500px", height: "300px" }}>
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
            )} */}

            {/* Zoom & Crop Button */}
            {image && (
                <div className="controls mt-4 flex items-center gap-4">
                    <label className="text-white">Zoom</label>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e, zoom) => setZoom(zoom)}
                        className="w-1/3"
                    />
                    <button
                        onClick={showCroppedImage}
                        className="bg-[#f59e0b] text-white px-4 py-2 rounded hover:brightness-110"
                    >
                        Crop
                    </button>
                </div>
            )}

            {/* Cropped Result + Download */}
            {croppedImage && (
                <div className="result mt-6 text-center">
                    <img src={croppedImage} alt="Cropped Result" className="mx-auto max-w-full rounded" />
                    <button
                        onClick={downloadImage}
                        className="mt-4 px-4 py-2 bg-[#f59e0b] text-white rounded hover:brightness-110"
                    >
                        Download
                    </button>
                </div>
            )}
        </div>


    );
}

export default ImageCropper;
