import React, { useState } from "react";
import type { UserLogin } from "../types/user";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/UserContext";
import { Loader } from "../components/Loader";


function Login() {
  const [user, setUser] = useState<UserLogin>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login ,createLoading} = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      alert("All fields are required");
      return;
    }

    await login(user);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl">

        <div className="px-8 py-8">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Sign in to your NightFeed account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSumbit}>

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
              disabled={createLoading}
              className="w-full h-12 mt-2 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 active:scale-[0.98] transition"
            >
              {
                createLoading ? <Loader/>:<p>  Login </p>
              }
            
            </button>

          </form>

          <div className="mt-8 text-center items-center flex justify-center gap-1">
            <p className="text-sm text-neutral-400">
              Don’t have an account?
            </p>

            <Link to={"/register"}>
              <span className="text-white hover:underline cursor-pointer">
                Sign up
              </span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;