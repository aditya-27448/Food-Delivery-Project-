import axios from "axios";
import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import { ClipLoader } from "react-spinners";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/send-otp`,
        { email },
        { withCredentials: true },
      );
      console.log(result);
      setErr("");
      setStep(2);
      setLoading(false);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true },
      );
      setErr("");
      console.log(result);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message || "Reset failed");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true },
      );
      console.log(result);
      setErr("");
      setStep(3);
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid OTP");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white/95 p-8 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
        <div className="mb-6 flex items-center gap-4">
          <IoArrowBack
            size={25}
            className="cursor-pointer text-emerald-600"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-slate-800">Forgot Password</h1>
        </div>

        {step === 1 && (
          <div>
            <div className="mb-6">
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

            <button
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-2.5 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-150 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>

            {err && (
              <p className="mt-3 text-center text-sm text-rose-500">*{err}</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>

            <button
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-2.5 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-150 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
            </button>

            {err && (
              <p className="mt-3 text-center text-sm text-rose-500">*{err}</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="newpassword"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>
              <input
                type="password"
                placeholder="New Password"
                required
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmpassword"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>

            <button
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-2.5 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-150 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>

            {err && (
              <p className="mt-3 text-center text-sm text-rose-500">*{err}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
