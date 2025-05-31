import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("painter");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const navigate = useNavigate();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await axios.post("http://localhost:4000/auth/register", {
        email,
        password,
        name,
        role: role.toUpperCase(),
      });

      setMessage({
        type: "success",
        text: "✅ Registered successfully! Redirecting to login...",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      const errorText =
        err.response?.data?.error || "Failed to register. Please try again.";
      setMessage({ type: "error", text: errorText });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={register}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        {message && (
          <div
            className={`mb-4 p-2 text-sm text-center rounded ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

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
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="painter">Painter</option>
          <option value="client">Client</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
