import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRole, children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "store_owner") {
      return <Navigate to="/owner" replace />;
    }

    return <Navigate to="/user" replace />;
  }

  return children;
}

export default ProtectedRoute;