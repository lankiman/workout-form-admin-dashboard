// import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./admin/Admin";
import { useAuthContext } from "./hooks/useAuthContext";
import AdminDashboard from "./admin/AdminDashboard";

function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <Router>
        <NavBar />
        <div className="pages">
          <Routes>
            <Route
              path="/*"
              element={
                user && user.role == "Basic" ? (
                  <Home />
                ) : !user ? (
                  <Navigate to="/login" />
                ) : (
                  <AdminDashboard />
                )
              }
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/dashboard/*"
              element={
                user && user.role == "Admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
