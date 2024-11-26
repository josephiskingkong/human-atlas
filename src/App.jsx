import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import routes from "./routes";
import "./styles/base/reset.css";
import useCsrfToken from "./hooks/user/useCsrf";
import { useSession } from "./context/SessionContext";
import { setSessionExpiredHandler } from "./config/apiRequest";

function App() {
  useCsrfToken();
  const { handleSessionExpired } = useSession();

  useEffect(() => {
    setSessionExpiredHandler(handleSessionExpired);
  }, [handleSessionExpired]);
  return (
    <Router>
      <Suspense fallback={<div aria-busy="true" aria-label="Loading"></div>}>
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
