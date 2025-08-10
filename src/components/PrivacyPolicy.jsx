import React from 'react'

function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold text-amber-600 mb-6 mt-10">Privacy Policy</h1>

      <p className="mb-6">
        This Privacy Policy explains how your information is handled when using our image editing tools, including cropping, resizing, and compressing features. We are committed to protecting your privacy and ensuring a secure user experience.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We <strong>do not collect or store</strong> any personal information or images uploaded to our tool. All image processing — including cropping, resizing, and compressing — is handled <strong>locally in your browser</strong>. Your files <strong>never leave your device</strong>.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-2">How We Use Your Data</h2>
      <p className="mb-4">
        Your images are used solely for the purpose of:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Cropping selected areas</li>
        <li>Resizing images to custom or preset dimensions</li>
        <li>Compressing files to reduce size for faster sharing</li>
      </ul>
      <p className="mb-4">
        These operations are conducted entirely in-browser, and <strong>no data is transmitted or stored externally</strong>.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-2">Security</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>100% local processing</strong>: All actions happen on your device.</li>
        <li><strong>No uploads</strong>: Your images are never transferred to our servers.</li>
        <li><strong>No tracking</strong>: We don’t use cookies or trackers to monitor your usage.</li>
      </ul>
      <p className="mb-4">
        This approach ensures your <strong>privacy, safety, and complete control</strong> over your content.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-2">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Any changes will be published on this page with an updated effective date.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-2">Contact</h2>
      <p className="mb-2">If you have any questions or concerns about this Privacy Policy, feel free to reach out:</p>
      <p className="font-medium text-blue-600">admin@xpertxyz.in</p>

      <p className="mt-10 text-sm text-gray-500">Last updated: July 22, 2025</p>
    </div>
    )
}

export default PrivacyPolicy
