// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

// Login nahi hai => /profile (login page) par bhej do.
// "from" save hota hai taaki login ke baad wapas isi page par aaye.
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/profile"
        replace
        state={{
          from: location,
          notice: "Please login first to access this page.",
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;