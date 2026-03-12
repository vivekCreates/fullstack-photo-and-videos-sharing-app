import { Link } from "react-router";
import { useAuth } from "../context/UserContext";
import { useState } from "react";
import { Menu } from "lucide-react";

function Navbar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full px-4 mt-4 flex justify-center z-50">
      <div
        className="w-full max-w-6xl
        px-4 sm:px-6 py-3
        bg-neutral-950/80 backdrop-blur-md
        border border-neutral-800
        rounded-xl sm:rounded-2xl
        flex items-center justify-between
        shadow-lg
        z-50
        relative"
      >

        <Link
          to="/"
          className="text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-wide"
        >
          NightFeed
        </Link>

        <div className="hidden md:flex items-center gap-6 text-neutral-300 font-medium">

          <Link to="/create" className="hover:text-white transition">
            Create
          </Link>

          <Link to="/profile" className="hover:text-white transition">
            Profile
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl hover:bg-neutral-200 transition"
          >
            Logout
          </button>

        </div>


        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          <Menu size={26} />
        </button>


        {open && (
          <div
            className="absolute top-16 left-0 w-full
            bg-neutral-950 border-t border-neutral-800
            flex flex-col  items-center gap-4 py-6 md:hidden"
          >
            <Link
              to="/create"
              onClick={() => setOpen(false)}
              className="text-neutral-300 hover:text-white"
            >
              Create
            </Link>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="text-neutral-300 hover:text-white"
            >
              Profile
            </Link>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;