import React, { useEffect, useRef, useState } from "react";
import {
  FaLocationDot,
  FaCompass,
  FaCheck,
  FaCircleExclamation,
  FaStar,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../../redux/userSlice";
import { setAddress, setLocation } from "../../redux/mapSlice";
import axios from "axios";
import { serverURL } from "../../App";

function LocationModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { currentCity, currentAddress, userData } = useSelector(
    (state) => state.user,
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }
  const [manualCityInput, setManualCityInput] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const apikey = import.meta.env.VITE_GEOAPIKEY;
  const popupRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsidePointerDown = (event) => {
      if (
        !popupRef.current?.contains(event.target) &&
        !event.target.closest("[data-location-trigger]")
      ) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [isOpen, onClose]);

  // Normalize city names by stripping common suffixes from geocoding APIs
  const normalizeCity = (cityName) => {
    if (!cityName) return cityName;
    return cityName
      .replace(/\s*\(M\.Corp\.\)\s*/gi, "")
      .replace(/\s*Municipal\s*Corporation\s*/gi, "")
      .replace(/\s*M\.Corp\.\s*/gi, "")
      .trim();
  };

  if (!isOpen) return null;

  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      setStatus({
        type: "error",
        text: "Geolocation is not supported by your browser.",
      });
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
          let city = "Bhubaneswar";
          let state = "Odisha";
          let formattedAddress = "Bhubaneswar, Odisha, India";

          if (apikey) {
            const result = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`,
            );
            if (result?.data?.results?.[0]) {
              const resData = result.data.results[0];
              city =
                normalizeCity(resData.city || resData.county) || "Bhubaneswar";
              state = resData.state || "Odisha";
              formattedAddress =
                resData.formatted || `${city}, ${state}, India`;
            }
          }

          dispatch(setCurrentCity(city));
          dispatch(setCurrentState(state));
          dispatch(setCurrentAddress(formattedAddress));
          dispatch(setAddress(formattedAddress));

          setStatus({ type: "success", text: `Location set to ${city}!` });

          if (userData) {
            axios
              .post(
                `${serverURL}/api/user/update-location`,
                {
                  lat: latitude,
                  lon: longitude,
                  address: formattedAddress,
                  city,
                  state,
                },
                { withCredentials: true },
              )
              .catch((err) => console.log("Backend location update err:", err));
          }

          localStorage.setItem("locationPermissionAsked", "true");
          setTimeout(() => {
            setLoading(false);
            onClose();
          }, 1200);
        } catch (error) {
          console.error("Geocoding error:", error);
          setStatus({
            type: "error",
            text: "Unable to resolve city name. Defaulting to Bhubaneswar.",
          });
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        localStorage.setItem("locationPermissionAsked", "true");
        let msg = "Location permission denied or unavailable.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Permission denied. Using default location.";
        }
        setStatus({ type: "error", text: msg });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!manualCityInput.trim()) return;

    setManualLoading(true);
    setStatus(null);
    try {
      if (apikey) {
        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            manualCityInput.trim(),
          )}&apiKey=${apikey}`,
        );
        if (result?.data?.features?.[0]) {
          // Prefer a feature that has an actual 'city' property over county-only results
          let bestFeature = result.data.features[0];
          for (const f of result.data.features) {
            if (f.properties.city) {
              bestFeature = f;
              break;
            }
          }
          const props = bestFeature.properties;
          // Use the user's own input as the city name for shop matching,
          // since Geoapify may return a different spelling (e.g. "Bhubaneshwar" vs "Bhubaneswar")
          const userCity = manualCityInput.trim();
          const city = userCity.charAt(0).toUpperCase() + userCity.slice(1);
          const state = props.state || "";
          const formatted = props.formatted || city;
          const lat = props.lat;
          const lon = props.lon;

          dispatch(setCurrentCity(city));
          if (state) dispatch(setCurrentState(state));
          dispatch(setCurrentAddress(formatted));
          dispatch(setAddress(formatted));
          if (lat && lon) dispatch(setLocation({ lat, lon }));

          setStatus({ type: "success", text: `Location set to ${city}!` });

          localStorage.setItem("locationPermissionAsked", "true");
          setTimeout(() => {
            setManualLoading(false);
            onClose();
          }, 1000);
          return;
        }
      }

      // Fallback if no geoapify key or results:
      const city = manualCityInput.trim();
      dispatch(setCurrentCity(city));
      dispatch(setCurrentAddress(city));
      dispatch(setAddress(city));

      setStatus({ type: "success", text: `Location set to ${city}!` });

      localStorage.setItem("locationPermissionAsked", "true");
      setTimeout(() => {
        setManualLoading(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Manual city search err:", err);
      setStatus({ type: "error", text: "Could not find that location." });
      setManualLoading(false);
    }
  };

  const handleUseDefault = () => {
    const targetCity = "Bhubaneswar";
    const targetState = "Odisha";
    const targetAddress = "Bhubaneswar, Odisha, India";
    const targetLat = 20.2961;
    const targetLon = 85.8245;

    dispatch(setCurrentCity(targetCity));
    dispatch(setCurrentState(targetState));
    dispatch(setCurrentAddress(targetAddress));
    dispatch(setLocation({ lat: targetLat, lon: targetLon }));
    dispatch(setAddress(targetAddress));

    localStorage.setItem("locationPermissionAsked", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div
        ref={popupRef}
        className="relative w-full max-w-md translate-y-3 overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl transition-all sm:translate-y-5 sm:p-7 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
        >
          <IoClose size={20} />
        </button>

        {/* Icon & Graphic Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-600 shadow-inner">
            <FaLocationDot
              size={30}
              className="text-emerald-600 animate-bounce"
            />
            <div className="absolute -inset-1 rounded-full border-2 border-emerald-400/30 animate-ping opacity-25" />
          </div>

          <h2 className="text-xl font-black tracking-tight text-slate-800 sm:text-2xl">
            Choose Delivery Location
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
            Select your location to discover nearby restaurants and enjoy fast
            food delivery.
          </p>
        </div>

        {/* Current Active Location & Default Status */}
        <div className="mt-4 rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-emerald-800">
              <FaCompass size={14} className="text-emerald-600 shrink-0" />
              <span>Active City:</span>
              <strong className="font-bold text-emerald-900">
                {currentCity || "Bhubaneswar"}
              </strong>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              <FaStar size={10} className="text-amber-500" /> Default:
              Bhubaneswar
            </span>
          </div>

          <div className="text-[11px] text-slate-600 truncate">
            <span className="font-medium text-slate-700">Address: </span>
            {currentAddress || "Bhubaneswar, Odisha, India"}
          </div>
        </div>

        {/* Manual City / Address Input */}
        <form onSubmit={handleManualSearch} className="mt-4">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Search or Type City / Address:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. Bhubaneswar, Cuttack, Mumbai..."
                value={manualCityInput}
                onChange={(e) => setManualCityInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={manualLoading || !manualCityInput.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <FaMagnifyingGlass size={12} />
              {manualLoading ? "..." : "Set"}
            </button>
          </div>
        </form>

        {/* Status Message Display */}
        {status && (
          <div
            className={`mt-3 flex items-center gap-2.5 rounded-2xl p-2.5 text-xs font-medium ${
              status.type === "success"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {status.type === "success" ? (
              <FaCheck className="shrink-0 text-emerald-600" size={13} />
            ) : (
              <FaCircleExclamation
                className="shrink-0 text-amber-600"
                size={13}
              />
            )}
            <span>{status.text}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            onClick={handleEnableLocation}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 py-3 px-5 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:opacity-75 text-sm"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Detecting Location...</span>
              </>
            ) : (
              <>
                <FaLocationDot size={15} />
                <span>Use Current Live Location</span>
              </>
            )}
          </button>

          <button
            onClick={handleUseDefault}
            disabled={loading}
            className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 text-xs sm:text-sm"
          >
            Use Default Location (Bhubaneswar)
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
