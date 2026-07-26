import axios from "axios";
import React, { use } from "react";
import { useState } from "react";
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
      setErr(error.response.data.message);
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return null;
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
      setErr(error?.response?.data?.message);
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
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-gray-800">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoArrowBack
            size={25}
            className="text-orange-700 cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-orange-700 ">
            Forgot Password
          </h1>
        </div>
        <div>
          {step == 1 && (
            <div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <button
                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow-md hover:shadow-lg"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
              </button>
              {err && <p className="text-red-500 text-center">*{err}</p>}
            </div>
          )}
          {step == 2 && (
            <div>
              <div className="mb-6">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
              </div>
              <button
                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow-md hover:shadow-lg"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
              </button>
              {err && <p className="text-red-500 text-center">*{err}</p>}
            </div>
          )}
          {step == 3 && (
            <div>
              <div className="mb-6">
                <label
                  htmlFor="newpassword"
                  className="block text-gray-700 font-medium mb-1"
                >
                  New Password
                </label>
                <input
                  type="text"
                  placeholder="New Password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="confirmpassword"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="text"
                  placeholder="Confirm Password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
              <button
                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow-md hover:shadow-lg"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Reset Password"
                )}
              </button>
              {err && <p className="text-red-500 text-center">*{err}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
