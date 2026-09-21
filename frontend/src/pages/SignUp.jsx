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

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    if (!fullName.trim()) return showError("Full name is required");
    if (!email.trim()) return showError("Email is required");
    if (!password) return showError("Password is required");
    if (!mobile.trim()) return showError("Mobile number is required");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Sign up failed";
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
          role,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(data));
    } catch (error) {
      showError(error?.response?.data?.message || "Google sign up failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white/95 p-8 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
        <h1 className="mb-2 text-3xl font-extrabold text-emerald-600">
          FOOD BUS
        </h1>

        <p className="mb-8 text-sm text-slate-600">
          Create your account to get started with delicious food deliveries.
        </p>

        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter Full Name"
            required
            className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        </div>

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
            htmlFor="mobile"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Mobile No
          </label>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            required
            className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
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

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                className={`flex-1 rounded-2xl border px-3 py-2 text-center text-sm font-medium transition ${
                  role === r
                    ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                    : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                }`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-2.5 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-150 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
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
            Sign Up with Google
          </span>
        </button>

        <p
          className="mt-6 cursor-pointer text-center text-sm text-slate-600"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="font-semibold text-emerald-600">Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
