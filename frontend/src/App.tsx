import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import './App.css'; // Assuming you have a global CSS file
import animeBackground from './assets/anime_background.png';
import { AuthProvider } from './state/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            minHeight: '100vh',
            backgroundImage: `url(${animeBackground})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            backgroundAttachment: 'fixed',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
