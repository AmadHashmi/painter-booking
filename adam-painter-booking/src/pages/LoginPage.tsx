import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage({ onLogin }: { onLogin: Function }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user);

      if (res.data.user.role === "PAINTER") {
        navigate("/painter");
      } else if (res.data.user.role === "CLIENT") {
        navigate("/client");
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || "Invalid email or password."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={login}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-100 p-2 rounded">
            {errorMessage}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
