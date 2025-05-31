import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PainterDashboard from "./pages/PainterDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Header from "./components/Header";

type User = {
  id: string;
  name: string;
  role: "PAINTER" | "CLIENT";
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          id: decoded.userId,
          name: decoded.name, // ✅ Now this is defined
          role: decoded.role,
        });
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <>
      {/* ✅ Show header only when logged in */}
      {user && (
        <Header
          name={user.name}
          role={user.role}
          onLogout={() => {
            setUser(null);
            navigate("/login");
          }}
        />
      )}

      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage onLogin={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              path="/painter"
              element={
                user.role === "PAINTER" ? (
                  <PainterDashboard user={user} />
                ) : (
                  <Navigate to="/client" />
                )
              }
            />
            <Route
              path="/client"
              element={
                user.role === "CLIENT" ? (
                  <CustomerDashboard />
                ) : (
                  <Navigate to="/painter" />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={`/${user.role.toLowerCase()}`} />}
            />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
