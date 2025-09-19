import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800 mt-5">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6">
        This Privacy Policy explains how your information is handled when using our image editing tools. 
        We are committed to protecting your privacy and ensuring a secure user experience.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We <strong>do not collect or store</strong> any personal information or images uploaded to our tool. 
        All image processing is handled <strong>locally in your browser</strong>. 
        Your files <strong>never leave your device</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Data</h2>
      <p className="mb-4">Your images are used solely for the purpose of:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Cropping selected areas</li>
        <li>Resizing images to custom or preset dimensions</li>
        <li>Compressing files to reduce size</li>
      </ul>
      <p className="mb-4">
        These operations are conducted entirely in-browser, and 
        <strong> no data is transmitted or stored externally</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Security</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>All actions happen locally on your device</li>
        <li>Your images are never uploaded to our servers</li>
        <li>No cookies or trackers are used</li>
      </ul>
      <p className="mb-4">
        This ensures your <strong>privacy, safety, and complete control</strong> over your content.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. 
        Any changes will be published on this page with an updated effective date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p className="mb-2">
        If you have any questions or concerns about this Privacy Policy, please contact us at:
      </p>
      <p className="font-medium">admin@xpertxyz.in</p>

      <p className="mt-10 text-sm text-gray-500">Last updated: July 22, 2025</p>
    </div>
  );
}

export default PrivacyPolicy;
