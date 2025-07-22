import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ImageCropper from './components/ImageCropper'
import PrivacyPolicy from './components/PrivacyPolicy'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ImageCropper />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
