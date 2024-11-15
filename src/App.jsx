import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import ExperienceForm from "./components/CertificationForm";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginForm setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/form"
        element={
          isAuthenticated ? <ExperienceForm /> : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
};

export default App;
