import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import routes from './routes';
import './styles/base/reset.css';
import Breadcrumbs from './components/Common/Breadcrumbs';

function App() {
  return (
    <Router>
      <Suspense fallback={<div aria-busy="true" aria-label="Loading">Loading...</div>}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;