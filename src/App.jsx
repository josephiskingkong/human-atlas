import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SlidePage from './pages/SlidePage';
import './styles/base/reset.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="human-atlas/slide/:id" element={<SlidePage />} />
      </Routes>
    </Router>
  );
}

export default App;