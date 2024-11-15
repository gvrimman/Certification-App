import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter

import App from "./App.jsx"; // Import App which will handle routes

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        {" "}
        {/* Wrap the App with Router */}
        <App /> {/* Render App which will have routes */}
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
