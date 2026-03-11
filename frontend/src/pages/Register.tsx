import React, { useState } from "react";
import type { UserRegister } from "../types/user";
import { useAuth } from "../context/UserContext";
import { Link, useNavigate } from "react-router";

function Register() {
  const [user, setUser] = useState<UserRegister>({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      alert("All fields are required");
      return;
    }

    await register(user);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl">

        <div className="px-8 py-8">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white tracking-tight">
              Welcome to NightFeed
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Create your account to continue
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSumbit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleChange}
              className="w-full h-12 rounded-xl bg-neutral-900 px-4 text-white placeholder-neutral-500 border border-neutral-800 outline-none focus:border-white transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              className="w-full h-12 rounded-xl bg-neutral-900 px-4 text-white placeholder-neutral-500 border border-neutral-800 outline-none focus:border-white transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              className="w-full h-12 rounded-xl bg-neutral-900 px-4 text-white placeholder-neutral-500 border border-neutral-800 outline-none focus:border-white transition"
            />

            <button
              type="submit"
              className="w-full h-12 mt-2 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 active:scale-[0.98] transition"
            >
              Create Account
            </button>

          </form>

          <div className="mt-8 text-center flex items-center justify-center gap-1">
            <p className="text-sm text-neutral-400">
              Already have an account?
            </p>
            <Link to={"/login"}>
              <span className="text-white hover:underline cursor-pointer">
                Sign in
              </span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;