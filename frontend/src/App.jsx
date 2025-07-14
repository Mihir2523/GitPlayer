import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Main from "./components/Main";
import Card from "./components/temp";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<SignUp />} />
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <Card />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
