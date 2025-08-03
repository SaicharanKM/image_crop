import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faXTwitter, faLinkedinIn, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="w-full bg-white backdrop-blur-sm border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

                    {/* Logo & About */}
                    <div>
                        <div className="flex items-center mb-4">
                            <img
                                src="/android-chrome-192x192.png"
                                alt="PixFit Pro Logo"
                                className="w-10 h-10 mr-3"
                            />
                            <h4 className="text-xl font-bold text-gray-900">PixFit</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Professional image cropping for creators, marketers, and photographers. Clean. Fast. Efficient.
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h5 className="font-bold text-gray-800 mb-4">Features</h5>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>Multiple aspect ratios</li>
                            <li>Custom dimensions</li>
                            <li>High-quality output</li>
                            <li>Browser-based processing</li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h5 className="font-bold text-gray-800 mb-4">Legal</h5>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>
                                <Link to="/privacy-policy" className="hover:text-amber-600 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h5 className="font-bold text-gray-800 mb-4">Connect</h5>
                        <ul className="flex space-x-4">
                            <li>
                                <a href="https://www.instagram.com/sai.charan.km/" target="_blank" rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-amber-600 transition">
                                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                                </a>
                            </li>
                            {/* <li>
                                <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-amber-600 transition">
                                    <FontAwesomeIcon icon={faXTwitter} size="lg" />
                                </a>
                            </li> */}
                            <li>
                                <a href="https://www.linkedin.com/in/saicharankm/" target="_blank" rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-amber-600 transition">
                                    <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
                                </a>
                            </li>
                          
                        </ul>
                    </div>

                    {/* More from Us */}
                    <div>
                        <h5 className="font-bold text-gray-800 mb-4">More from Us</h5>
                        <ul className="space-y-3 text-gray-600 text-sm">

                            <li className="flex items-center space-x-2">
                                <img src="/xpertxyz_logo.png" alt="XpertXYZ" className="w-5 h-5" />
                                <a
                                    href="https://xpertxyz.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-amber-600 transition"
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
                                    className="hover:text-amber-600 transition"
                                >
                                    Our Apps on Play Store
                                </a>
                            </li>

                            {/* 
    <li className="flex items-center space-x-2">
      <img src="/icons/portfolio.png" alt="Portfolio" className="w-5 h-5" />
      <a
        href="https://charan.xpertxyz.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-amber-600 transition"
      >
        Charan’s Portfolio
      </a>
    </li> 
    */}

                        </ul>
                    </div>


                </div>
            </div>

            <div className="border-t border-gray-200 mt-5 pt-3 text-center text-gray-500 text-sm h-10">
                <p>© {new Date().getFullYear()} PixFit Pro. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
