import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// 1. Lazy load your route components for maximum speed
const ImageCropper = lazy(() => import('./components/ImageCropper'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
const Features = lazy(() => import('./components/Features'))
const PhotoEnhancer = lazy(() => import('./components/PhotoEnhancer'))

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      
      {/* 2. Suspense wraps the routes to provide a fallback UI while the code downloads */}
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading tool...</div>}>
        <Routes>
          <Route path="/" element={<ImageCropper />} />
          <Route path= "/PhotoEnhancer" element={<PhotoEnhancer/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/features" element={<Features />} />
          
          {/* 3. Lowercase, hyphenated route for proper SEO */}
          <Route path="/photo-enhancer" element={<PhotoEnhancer />} />
          
          {/* 4. Optional but recommended: A catch-all 404 page */}
          <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px' }}><h1>404 - Page Not Found</h1></div>} />
        </Routes>
      </Suspense>
      
      <Footer />
    </>
  )
}

export default App