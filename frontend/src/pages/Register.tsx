import React, { useState } from 'react'
import type { UserRegister } from '../types/user'
import { Link } from 'react-router';

function Register() {
    const [user, setUser] = useState<UserRegister>({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }))
        console.log(user)
    }

    return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
  <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
    
    <div className="px-8 py-6">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          Welcome to Posty
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Create your account to continue
        </p>
      </div>

      <form className="space-y-5">
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
          className="w-full h-12 rounded-xl bg-zinc-800 px-4 text-white placeholder-zinc-400 border border-zinc-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={user.email}
          onChange={handleChange}
          className="w-full h-12 rounded-xl bg-zinc-800 px-4 text-white placeholder-zinc-400 border border-zinc-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          className="w-full h-12 rounded-xl bg-zinc-800 px-4 text-white placeholder-zinc-400 border border-zinc-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
        />
        <button
          type="submit"
          className="w-full h-12 mt-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 active:scale-[0.98] transition"
        >
          Create Account
        </button>
      </form>

      <div className="mt-8 text-center flex items-center gap-1">
        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
        </p>
        <Link to={"/login"}>
          <span className="text-blue-400 hover:underline cursor-pointer">
            Sign in
          </span>
        </Link>
      </div>

    </div>
  </div>
</div>

    )

}

export default Register