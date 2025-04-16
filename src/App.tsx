import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IntroPage from './pages/IntroPage';
import InstallPrompt from "./components/InstallPrompt/InstallPrompt.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/create" element={<HomePage />} />
            </Routes>
            {/* Composant de prompt d'installation */}
            <InstallPrompt />
        </Router>
    );
}

export default App;