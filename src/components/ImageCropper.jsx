import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";

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

    // Cleanup blob URLs when component unmounts
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

        <div className="min-h-screen w-full bg-[#1f2937] text-white flex justify-center p-6">
            <div className="w-full max-w-[800px] flex flex-col items-center">
                <h5 className="text-3xl font-bold text-white text-center">
                    <span className="text-yellow-500 font-extrabold">PixFit</span>
                </h5>
                <h5 className="text-1xl font-bold text-white text-center">The Ultimate Tool for Resizing and Cropping at the Same Time </h5>

                <div
                    className={`upload-section h-[370px] max-w-[700px] w-full mx-auto mt-4 p-6 border-2 border-dashed rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? "border-yellow-500 bg-yellow-100" : "border-gray-300 bg-gradient-to-br from-gray-100 to-white"
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
                                    className="h-16 w-16 mb-4 text-yellow-500 animate-bounce"
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
                            <div className="crop-container mt-6 relative w-full max-w-[600px] h-[400px] mx-auto">
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


                            <div className="flex flex-row items-center justify-center gap-4 mt-6">
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


                <div className="ratio-input mt-2 max-w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center gap-1">

                    {/* Common Ratios */}
                    <div className=" w-full text-center">
                        <h3 className="text-gray-100 font-semibold text-lg">Common Ratios</h3>
                        <div className="  flex flex-wrap justify-center">
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
                                    className="w-13 px-2 py-2 text-sm rounded-xl text-white bg-primary hover:brightness-110 transition text-center m-1"
                                >
                                    {label}
                                </button>

                            ))}
                        </div>
                    </div>


                    {/* Custom Size */}
                    <div className="  w-full bg-gray-800 rounded-2xl ">
                        <h3 className="text-gray-100 font-semibold mb-1 text-center text-lg">Custom Size</h3>
                        <div className="flex justify-center items-center gap-4">
                            <input
                                type="number"
                                value={targetWidth}
                                onChange={(e) => {
                                    const w = parseInt(e.target.value);
                                    setTargetWidth(w);
                                    if (w > 0 && targetHeight > 0) setAspect(w / targetHeight);
                                }}
                                placeholder="Width (px)"
                                className="px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>


                </div>

                {image && (
                    <div className="result mt-3 flex justify-center">
                        <button
                            onClick={downloadImage}
                            className="px-7 py-2.5 bg-[#f59e0b] text-white font-semibold rounded-lg hover:brightness-120 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300"
                        >
                            Download  Image
                        </button>
                    </div>
                )}


            </div>
        </div >
    );
}

export default ImageCropper;
