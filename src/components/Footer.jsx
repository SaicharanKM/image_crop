import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInstagram,
    faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
    return (
        <footer className="w-full bg-black text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-14">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-5">

                            <img
                                src="/favicon.svg"
                                alt="PixFit Logo"
                                className="w-10 h-10 object-contain"
                            />

                            <h2
                                className="text-2xl font-bold tracking-tight"
                                style={{
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                PixFit
                            </h2>
                        </div>

                        <p className="text-gray-400 leading-relaxed text-sm max-w-md">
                            Professional online image tool to crop, resize, compress,
                            and convert images instantly with high-quality output.
                        </p>

                        {/* Powered By */}
                        <div className="mt-6">

                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
                                Powered By
                            </p>

                            <div className="flex flex-col md:flex-row gap-4">

                                {/* TrendScan */}
                                <a
                                    href="https://trendscan.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 hover:opacity-80 transition bg-white/5 px-4 py-3 rounded-2xl border border-white/10 flex-1"
                                >
                                    <img
                                        src="/trendscanlogo.png"
                                        alt="TrendScan"
                                        className="w-10 h-10 rounded-xl object-cover"
                                    />

                                    <div>
                                        <h4 className="font-semibold text-white">
                                            TrendScan
                                        </h4>

                                        <p className="text-sm text-gray-400">
                                            trendscan.in
                                        </p>
                                    </div>
                                </a>

                                {/* XpertXYZ */}
                                <a
                                    href="https://xpertxyz.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 hover:opacity-80 transition bg-white/5 px-4 py-3 rounded-2xl border border-white/10 flex-1"
                                >
                                    <img
                                        src="/xpertxyz_logo.png"
                                        alt="XpertXYZ"
                                        className="w-10 h-10 rounded-xl object-cover"
                                    />

                                    <div>
                                        <h4 className="font-semibold text-white">
                                            XpertXYZ
                                        </h4>

                                        <p className="text-sm text-gray-400">
                                            xpertxyz.in
                                        </p>
                                    </div>
                                </a>

                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h5 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                            Features
                        </h5>

                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="hover:text-white transition">
                                Multiple aspect ratios
                            </li>

                            <li className="hover:text-white transition">
                                Custom dimensions
                            </li>

                            <li className="hover:text-white transition">
                                HD quality export
                            </li>

                            <li className="hover:text-white transition">
                                Image compression
                            </li>

                            <li>
                                <Link
                                    to="/features"
                                    className="text-white font-medium hover:underline"
                                >
                                    View all features →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h5 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                            Legal
                        </h5>

                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="hover:text-white transition"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h5 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                            Connect
                        </h5>

                        <div className="flex items-center gap-4">

                            <a
                                href="https://www.instagram.com/sai.charan.km/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/saicharankm/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

                    <p className="text-sm text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} PixFit. All rights reserved.
                    </p>

                    <p className="text-sm text-gray-500">
                        Built with ❤️ by{" "}
                        <a
                            href="https://charan.xpertxyz.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:underline transition"
                        >
                            Sai Charan
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;