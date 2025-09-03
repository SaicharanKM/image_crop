import { Routes, Route } from 'react-router-dom'
import ImageCropper from './components/ImageCropper'
import PrivacyPolicy from './components/PrivacyPolicy'
import Features from './components/Features'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import PhotoEnhancer from './components/PhotoEnhancer'

function App() {
  return (
    <>
      {/* Scroll to top on every route change */}
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<ImageCropper />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/features" element={<Features />} />
        <Route path="/PhotoEnhancer" element={<PhotoEnhancer />}/>
      </Routes>
      <Footer />
    </>
  )
}

export default App


// App.jsx

// App.jsx
// import React from "react";
// import PhotoEnhancer from "./components/PhotoEnhancer";

// function App() {
//   return (
//     <div>
//       <PhotoEnhancer />
//     </div>
//   );
// }

// export default App;
