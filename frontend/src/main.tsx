import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WorkoutContextProvider } from "./context/WorkoutContext.tsx";
import { AuthProvider } from "./context/UserContext.tsx";
import { AdminProvider } from "./context/AdminContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminProvider>
      <AuthProvider>
        <WorkoutContextProvider>
          <App />
        </WorkoutContextProvider>
      </AuthProvider>
    </AdminProvider>
  </React.StrictMode>
);
