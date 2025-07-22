import React from 'react'

function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto p-6 text-black bg-white ">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

            <p className="mb-4 mt-6">
                This Privacy Policy explains how your information is handled when using our image cropping tool.
                We are committed to protecting your privacy and providing a safe experience.
            </p>

            <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
            <p className="mb-4">
                We do <strong>not collect</strong> or store any personal information or images uploaded to our tool.
                All processing is done locally in your browser, and your data never leaves your device.
            </p>

            <h2 className="text-xl font-semibold mb-2"> How We Use Your Data</h2>
            <p className="mb-4">
                Your images are used only for cropping and resizing within the browser.
                We <strong>do not send</strong> or store your files on any external server.
            </p>

            {/* <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
      <p className="mb-4">
        Our website may display ads through third-party services (such as Google AdSense). 
        These services may use cookies or tracking technologies to personalize ads based on your usage.
        We do not control the data collected by these third parties. Please refer to their privacy policies for more information.
      </p> */}

            <h2 className="text-xl font-semibold mb-2">Security</h2>
            <p className="mb-4">
                All processing is performed in your browser. Your images and data are never uploaded, ensuring privacy and security.
            </p>

            <h2 className="text-xl font-semibold mb-2"> Changes to This Policy</h2>
            <p className="mb-4">
                We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date.
            </p>

            <h2 className="text-xl font-semibold mb-2"> Contact</h2>
            <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at: <br />
                <a href="mailto:admin@xpertxyz.in" className="text-blue-600">admin@xpertxyz.in

                </a>
            </p>

            <p className="text-sm text-gray-600">Last updated: July 22, 2025</p>
        </div>
    )
}

export default PrivacyPolicy
