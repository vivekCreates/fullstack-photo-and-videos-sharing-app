import { Link } from 'react-router'
import { useAuth } from '../context/UserContext'

function Navbar() {
  const { logout } = useAuth()

  return (
    <nav className="w-[70%] mx-auto mt-6 px-6 py-3 
                    bg-zinc-900/60 backdrop-blur-md 
                    border border-zinc-800 
                    rounded-2xl 
                    flex justify-between items-center
                    shadow-lg">

      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className="text-2xl tracking-wide 
                     hover:text-[#8B5CD1] 
                     transition duration-200 text-[#8B5CF6] font-semibold font-sans"
                     
        >
          Posty
        </Link>
      </div>

      <div className="flex items-center gap-6 text-zinc-300 font-medium">

        <Link 
          to="/create"
          className="hover:text-white transition duration-200"
        >
          Create
        </Link>

        <Link 
          to="/profile"
          className="hover:text-white transition duration-200"
        >
          Profile
        </Link>

        <button
          onClick={logout}
          className="px-4 py-2 
                     bg-red-600/90 
                     hover:bg-red-700 
                     text-white 
                     rounded-xl 
                     transition duration-200
                     shadow-md"
        >
          Logout
        </button>

      </div>

    </nav>
  )
}

export default Navbar
