import React, { useState } from "react";
import { FaLocationDot, FaCompass, FaCheck, FaCircleExclamation } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentState } from "../../redux/userSlice";
import { setAddress, setLocation } from "../../redux/mapSlice";
import axios from "axios";
import { serverURL } from "../../App";

function LocationModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { currentCity, userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }
  const apikey = import.meta.env.VITE_GEOAPIKEY;

  if (!isOpen) return null;

  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: "error", text: "Geolocation is not supported by your browser." });
      return;
    }

    setLoading(true);
    setStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        dispatch(setLocation({ lat: latitude, lon: longitude }));

        try {
          // Update backend location if user is logged in
          if (userData) {
            axios.post(
              `${serverURL}/api/user/update-location`,
              { lat: latitude, lon: longitude },
              { withCredentials: true }
            ).catch((err) => console.log("Backend location update err:", err));
          }

          if (apikey) {
            const result = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`
            );
            if (result?.data?.results?.[0]) {
              const city = result.data.results[0].city || result.data.results[0].county || "Bhubaneswar";
              const state = result.data.results[0].state || "Odisha";
              const formattedAddress = result.data.results[0].formatted || "Bhubaneswar, Odisha, India";

              dispatch(setCurrentCity(city));
              dispatch(setCurrentState(state));
              dispatch(setCurrentAddress(formattedAddress));
              dispatch(setAddress(formattedAddress));

              setStatus({ type: "success", text: `Location set to ${city}!` });
            } else {
              setStatus({ type: "success", text: "Live location enabled!" });
            }
          } else {
            setStatus({ type: "success", text: "Live location coordinates acquired!" });
          }

          localStorage.setItem("locationPermissionAsked", "true");
          setTimeout(() => {
            setLoading(false);
            onClose();
          }, 1200);
        } catch (error) {
          console.error("Geocoding error:", error);
          setStatus({ type: "error", text: "Unable to resolve city name. Defaulting to Bhubaneswar." });
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        localStorage.setItem("locationPermissionAsked", "true");
        let msg = "Location permission denied or unavailable.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Permission denied. Using Bhubaneswar as default location.";
        }
        setStatus({ type: "error", text: msg });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleUseDefault = () => {
    dispatch(setCurrentCity("Bhubaneswar"));
    dispatch(setCurrentState("Odisha"));
    dispatch(setCurrentAddress("Bhubaneswar, Odisha, India"));
    dispatch(setLocation({ lat: 20.2961, lon: 85.8245 }));
    dispatch(setAddress("Bhubaneswar, Odisha, India"));

    localStorage.setItem("locationPermissionAsked", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl transition-all sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
        >
          <IoClose size={20} />
        </button>

        {/* Icon & Graphic Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-600 shadow-inner">
            <FaLocationDot size={36} className="text-emerald-600 animate-bounce" />
            <div className="absolute -inset-1 rounded-full border-2 border-emerald-400/30 animate-ping opacity-25" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
            Location Access
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Allow location access so we can show you nearby food options & track your delivery.
            Default location is set to <span className="font-semibold text-emerald-600">Bhubaneswar</span>.
          </p>
        </div>

        {/* Current Selection Badge */}
        <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
          <FaCompass size={15} />
          <span>Active Location: <strong className="text-emerald-800 font-bold">{currentCity || "Bhubaneswar"}</strong></span>
        </div>

        {/* Status Message Display */}
        {status && (
          <div
            className={`mt-4 flex items-center gap-2.5 rounded-2xl p-3 text-xs font-medium ${status.type === "success"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
          >
            {status.type === "success" ? (
              <FaCheck className="shrink-0 text-emerald-600" size={14} />
            ) : (
              <FaCircleExclamation className="shrink-0 text-amber-600" size={14} />
            )}
            <span>{status.text}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleEnableLocation}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 py-3.5 px-5 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-75"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Detecting Location...</span>
              </>
            ) : (
              <>
                <FaLocationDot size={16} />
                <span>Enable Location Permission</span>
              </>
            )}
          </button>

          <button
            onClick={handleUseDefault}
            disabled={loading}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 py-3 font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 text-sm"
          >
            Continue with Default (Bhubaneswar)
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
