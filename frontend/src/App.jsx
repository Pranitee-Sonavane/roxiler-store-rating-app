import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
  <Route path="/login" element={<Login />} />

  <Route path="/admin" element={<AdminDashboard />} />

  <Route path="/user" element={<UserDashboard />} />

  <Route path="/owner" element={<OwnerDashboard />} />

  <Route
    path="/"
    element={
      user ? (
        user.role === "admin" ? (
          <Navigate to="/admin" />
        ) : user.role === "store_owner" ? (
          <Navigate to="/owner" />
        ) : (
          <Navigate to="/user" />
        )
      ) : (
        <Navigate to="/login" />
      )
    }
  />
</Routes>
    </BrowserRouter>
  );
}

export default App;