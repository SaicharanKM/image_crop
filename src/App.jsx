import { Routes, Route } from 'react-router-dom'
import ImageCropper from './components/ImageCropper'
import PrivacyPolicy from './components/PrivacyPolicy'
import Features from './components/Features'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<ImageCropper />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/Features" element={<Features />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App