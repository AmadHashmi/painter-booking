import { useNavigate } from "react-router-dom";

export default function Header({
  name,
  role,
  onLogout,
}: {
  name?: string;
  role?: string;
  onLogout?: () => void;
}) {
  const navigate = useNavigate();
  console.log();
  return (
    <header className="flex justify-between items-center bg-gray-100 px-6 py-4 shadow-md">
      <div className="text-lg font-bold text-gray-800">Painter Booking App</div>

      {name && role && onLogout && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            Logged in as <strong>{name}</strong> ({role})
          </span>
          <button
            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => {
              localStorage.removeItem("token");
              onLogout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
