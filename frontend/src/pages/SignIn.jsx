import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { showError } from "../utils/toast.js";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    if (!email.trim()) return showError("Email is required");
    if (!password) return showError("Password is required");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Sign in failed";
      setErr(message);
      showError(message);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverURL}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(data));
    } catch (error) {
      showError(error?.response?.data?.message || "Google sign in failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white/95 p-8 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
        <h1 className="mb-2 text-3xl font-extrabold text-emerald-600">
          FOOD BUS
        </h1>

        <p className="mb-8 text-sm text-slate-600">
          Sign in to your account and enjoy delicious food deliveries.
        </p>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            required
            className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              required
              className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2.5 pr-10 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-emerald-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <div
          className="mb-4 cursor-pointer text-right text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </div>

        <button
          className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-2.5 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-150 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
        </button>

        {err && (
          <p className="mt-3 text-center text-sm text-rose-500">*{err}</p>
        )}

        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 transition duration-150 hover:bg-emerald-100"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span className="font-medium text-slate-700">
            Sign In with Google
          </span>
        </button>

        <p
          className="mt-6 cursor-pointer text-center text-sm text-slate-600"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="font-semibold text-emerald-600">Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
