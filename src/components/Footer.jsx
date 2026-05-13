import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

function Footer() {
    return (
        <footer className="w-full bg-[#0a0a0a] text-[#f5f0eb]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
                    <div>
                        <div className="flex items-center mb-4">
                            <img
                                src="/android-chrome-192x192.png"
                                alt="PixFit Pro Logo"
                                className="w-10 h-10 mr-3 transition duration-300 ease-in-out hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.8)] "
                            />
                            <h4 className="text-2xl font-bold text-amber-500 ">PixFit</h4>
                        </div>
                        <p className="text-sm text-[#b8b0a9] leading-relaxed">
                            Smart tools for precise image editing—crafted for creators and professionals.
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h5 className="font-semibold text-[#f5f0eb] mb-4">Features</h5>
                        <ul className="space-y-2 text-sm text-[#b8b0a9]">
                            <li>Multiple aspect ratios</li>
                            <li>Custom dimensions</li>
                            <li>High-quality output</li>
                            <li>Browser-based processing</li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h5 className="font-semibold text-[#f5f0eb] mb-4">Legal</h5>
                        <ul className="space-y-2 text-sm text-[#b8b0a9]">
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="hover:text-[#f5f0eb] transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h5 className="font-semibold text-[#f5f0eb] mb-4">Connect</h5>
                        <ul className="flex space-x-4">
                            <li>
                                <a
                                    href="https://www.instagram.com/sai.charan.km/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#E1306C] hover:text-[#E1305c] transition"
                                >
                                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com/in/saicharankm/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0A66C2] hover:text-[#0A66C1]  transition"
                                >
                                    <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
                                </a>
                            </li>
                        </ul>
                    </div>


                    {/* More from Us */}
                    <div>
                        <h5 className="font-semibold text-[#f5f0eb] mb-4">More from Us</h5>
                        <ul className="space-y-3 text-sm text-[#b8b0a9]">
                            <li className="flex items-center space-x-2">
                                <img src="/xpertxyz_logo.png" alt="XpertXYZ" className="w-5 h-5" />
                                <a
                                    href="https://xpertxyz.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#f5f0eb] font-bold transition"
                                >
                                    XpertXYZ Website
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <img src="/xpertxyz_logo.png" alt="XpertXYZ" className="w-5 h-5" />
                                <a
                                    href="https://play.google.com/store/apps/dev?id=5590657123168889231"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#f5f0eb] font-bold transition"
                                >
                                    Our Apps on Play Store
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#ffffff] py-4 text-center text-sm text-[#b8b0a9]">
                <p>© {new Date().getFullYear()} PixFit Pro. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
