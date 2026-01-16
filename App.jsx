// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase"; // ✅ already correct

import Layout from "./Layout";

// pages
import Dashboard from "./pages/Dashboard";
import AuthScreen from "./pages/AuthScreen";
import PetProfile from "./pages/pet_profile";
import HealthDetection from "./pages/HealthDetection";
import Reports from "./pages/Reports";
import UploadHistory from "./pages/UploadHistory";

function App() {

  // 🔍 ADD THIS LINE (TEMPORARY TEST)
  console.log("Supabase client:", supabase);

  return (
    <Router>
      <Routes>
        {/* ✅ ALL PAGES USE COMMON LAYOUT */}
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="auth" element={<AuthScreen />} />
          <Route path="reports" element={<Reports />} />
          <Route path="health" element={<HealthDetection />} />
          <Route path="pet_profile" element={<PetProfile />} />
          <Route path="/upload-history" element={<UploadHistory />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
