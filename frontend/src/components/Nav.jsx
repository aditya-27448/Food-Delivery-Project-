import { useEffect, useRef, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { serverURL } from "../App";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

import LocationModal from "./modals/LocationModal.jsx";

function Nav() {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user,
  );
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!showInfo) return;

    const handleOutsideClick = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setShowInfo(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showInfo]);

  useEffect(() => {
    const asked = localStorage.getItem("locationPermissionAsked");
    if (!asked && userData?.role === "user") {
      setIsLocationModalOpen(true);
    }
  }, [userData?.role]);

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const trimmedQuery = query.trim();
    const controller = new AbortController();

    if (!trimmedQuery) {
      dispatch(setSearchItems(null));
      return () => controller.abort();
    }

    const searchItems = async () => {
      try {
        const result = await axios.get(
          `${serverURL}/api/item/search-items?query=${encodeURIComponent(trimmedQuery)}&city=${encodeURIComponent(currentCity)}`,
          { withCredentials: true, signal: controller.signal },
        );
        dispatch(setSearchItems(result.data));
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.log(error);
        }
      }
    };

    searchItems();
    return () => controller.abort();
  }, [dispatch, query, currentCity]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[64px] sm:h-[80px] border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
      <div className="mx-auto flex h-[64px] sm:h-[80px] w-full max-w-7xl items-center justify-between gap-3 sm:gap-6 px-3 sm:px-6 lg:px-8">
        {userData.role === "user" && showSearch && (
          <div className="fixed top-[64px] left-3 right-3 flex h-[52px] items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-3 shadow-[0_10px_30px_rgba(16,185,129,0.14)] md:hidden z-50">
            <div
              data-location-trigger
              className="flex w-[38%] cursor-pointer items-center gap-1.5 overflow-hidden border-r border-gray-200 pr-2 hover:bg-emerald-50/50 transition"
              onClick={() => {
                setShowInfo(false);
                setIsLocationModalOpen((prev) => !prev);
              }}
              title="Click to enable or change location"
            >
              <FaLocationDot size={18} className="text-emerald-600 shrink-0" />
              <div className="w-full truncate text-xs text-gray-700 font-medium">
                {currentCity}
              </div>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <FaSearch size={16} className="text-emerald-600 shrink-0" />
              <input
                type="text"
                placeholder="Search food..."
                className="w-full bg-transparent text-xs sm:text-sm text-gray-700 outline-none placeholder:text-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        <h1
          className="cursor-pointer whitespace-nowrap bg-gradient-to-r from-emerald-500 via-emerald-500 to-lime-500 bg-clip-text text-xl sm:text-3xl font-black tracking-tight text-transparent"
          onClick={() => navigate("/")}
        >
          Food Bus
        </h1>

        {userData.role === "user" ? (
          <div className="hidden h-[50px] sm:h-[56px] max-w-xl flex-1 items-center gap-4 rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(16,185,129,0.08)] md:flex">
            <div
              data-location-trigger
              className="flex w-48 cursor-pointer items-center gap-2 overflow-hidden border-r border-gray-200 px-4 py-2 hover:bg-emerald-50/60 transition rounded-l-2xl group"
              onClick={() => {
                setShowInfo(false);
                setIsLocationModalOpen((prev) => !prev);
              }}
              title="Click to enable or change location"
            >
              <FaLocationDot
                size={22}
                className="text-emerald-600 shrink-0 group-hover:scale-110 transition-transform"
              />
              <div className="truncate text-gray-700 font-medium group-hover:text-emerald-700">
                {currentCity}
              </div>
            </div>

            <div className="flex flex-1 items-center gap-2 pr-4">
              <FaSearch size={20} className="text-emerald-600" />
              <input
                type="text"
                placeholder="Search delicious food..."
                className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="hidden h-[56px] max-w-xl flex-1 md:block" />
        )}

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
          {userData.role === "user" &&
            (showSearch ? (
              <ImCross
                size={18}
                className="cursor-pointer text-emerald-600 md:hidden p-1"
                onClick={() => setShowSearch(false)}
              />
            ) : (
              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  data-location-trigger
                  className="rounded-full border border-emerald-100 bg-emerald-50 p-2 text-emerald-600"
                  onClick={() => setIsLocationModalOpen((prev) => !prev)}
                  aria-label="Change delivery location"
                  title="Change delivery location"
                >
                  <FaLocationDot size={18} />
                </button>
                <FaSearch
                  size={20}
                  className="cursor-pointer text-emerald-600"
                  onClick={() => setShowSearch(true)}
                />
              </div>
            ))}

          {userData.role === "owner" ? (
            <>
              {myShopData && (
                <>
                  <button
                    className="hidden cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-3 py-2 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] md:flex"
                    onClick={() => navigate("/add-item")}
                  >
                    <FaPlus size={18} />
                    <span>Add Food Item</span>
                  </button>

                  <button
                    className="flex cursor-pointer items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 p-2 text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] md:hidden"
                    onClick={() => navigate("/add-item")}
                  >
                    <FaPlus size={16} />
                  </button>
                </>
              )}

              <button
                className="hidden items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 font-medium text-emerald-600 md:flex"
                onClick={() => navigate("/my-orders")}
              >
                <LuReceiptIndianRupee size={20} />
                <span>My Orders</span>
              </button>

              <button
                className="flex items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-2 text-emerald-600 md:hidden"
                onClick={() => navigate("/my-orders")}
              >
                <LuReceiptIndianRupee size={18} />
              </button>
            </>
          ) : (
            <>
              {userData.role === "user" && (
                <div
                  className="relative cursor-pointer rounded-full border border-emerald-100 bg-emerald-50 p-2"
                  onClick={() => navigate("/cart")}
                >
                  <FaShoppingCart className="text-emerald-600 text-lg sm:text-xl" />

                  <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-600 text-[10px] sm:text-[11px] font-bold text-white">
                    {cartItems.length}
                  </span>
                </div>
              )}

              <button
                className="hidden rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600 md:block"
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </button>
            </>
          )}

          <div className="relative" ref={profileRef}>
            <div
              className="flex h-8 w-8 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 text-sm sm:text-lg font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
              onClick={() => {
                setIsLocationModalOpen(false);
                setShowInfo((prev) => !prev);
              }}
            >
              {userData?.fullName?.charAt(0).toUpperCase()}
            </div>

            {showInfo && (
              <div className="absolute right-0 top-[48px] sm:top-[55px] z-[9999] flex w-[170px] sm:w-[190px] flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_18px_45px_rgba(16,185,129,0.12)]">
                <div className="text-sm sm:text-[17px] font-semibold text-gray-800">
                  {userData.fullName}
                </div>

                {userData.role === "user" && (
                  <div
                    className="cursor-pointer text-sm font-semibold text-emerald-600 md:hidden"
                    onClick={() => {
                      navigate("/my-orders");
                      setShowInfo(false);
                    }}
                  >
                    My Orders
                  </div>
                )}

                <div
                  className="cursor-pointer text-sm font-semibold text-emerald-600"
                  onClick={handleLogOut}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

export default Nav;
