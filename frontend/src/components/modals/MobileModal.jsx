import React, { useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverURL } from "../../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";

function MobileModal() {
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!mobile) {
      return setErr("Mobile number is required");
    }
    if (!/^\d{10}$/.test(mobile)) {
      return setErr("Please enter a valid 10-digit mobile number");
    }
    setErr("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${serverURL}/api/user/update-mobile`,
        { mobile },
        { withCredentials: true },
      );
      dispatch(setUserData(data));
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white/95 p-8 shadow-[0_20px_60px_rgba(16,185,129,0.15)] animate-[slideUp_0.3s_ease-out]">
        {/* Header Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
          <FaMobileAlt size={28} className="text-white" />
        </div>

        <h2 className="mb-1 text-center text-2xl font-extrabold text-slate-800">
          Almost There!
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          Please add your mobile number to complete your profile.
        </p>

        {/* Mobile Input */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              +91
            </span>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className="w-full rounded-2xl border border-emerald-100 bg-white py-2.5 pl-12 pr-3 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setMobile(val);
              }}
              value={mobile}
              autoFocus
            />
          </div>
        </div>

        {/* Error */}
        {err && (
          <p className="mb-3 text-center text-sm text-rose-500">*{err}</p>
        )}

        {/* Submit Button */}
        <button
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-2.5 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-150 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : (
            "Save & Continue"
          )}
        </button>
      </div>

      {/* Keyframe animations via inline style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default MobileModal;
