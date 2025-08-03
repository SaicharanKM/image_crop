import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ImageCropper from './components/ImageCropper'
import PrivacyPolicy from './components/PrivacyPolicy'
import Features from './components/Features'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ImageCropper />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/Features" element={<Features/>}/>
      </Routes>
    <Footer/>
    </Router>
  );
}

export default App;
