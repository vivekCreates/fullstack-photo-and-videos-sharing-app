import { Link } from 'react-router'

function Navbar() {
  return (
<nav className="w-[70%] py-3 border-b border-gray-200 flex justify-between items-center">
  
  <div className="flex items-center gap-6">
    <Link to="/" className="text-2xl font-semibold">
      Posty
    </Link>
  </div>

  <div className="flex items-center gap-4">
    <Link 
      to="/create"
    >
      Create
    </Link>

    <Link 
      to="/profile"
      className="hover:text-gray-600 transition"
    >
      Profile
    </Link>

    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
      Logout
    </button>
  </div>

</nav>


  )
}

export default Navbar