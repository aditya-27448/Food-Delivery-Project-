import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

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

  const handleSearchItems = async (query) => {
    try {
      const result = await axios.get(
        `${serverURL}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true },
      );
      dispatch(setSearchItems(result.data));
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearchItems(query);
    } else {
      dispatch(setSearchItems(null));
    }
  }, [query]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[80px] border-b border-gray-200 bg-white shadow-[0_8px_25px_rgba(17,24,39,0.03)]">
      <div className="mx-auto flex h-[80px] w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {userData.role === "user" && showSearch && (
          <div className="fixed top-[80px] left-[5%] flex h-[70px] w-[90%] items-center gap-5 rounded-2xl border border-emerald-100 bg-white shadow-[0_10px_30px_rgba(16,185,129,0.10)] md:hidden">
            <div
              className="flex w-[35%] cursor-pointer items-center gap-2 overflow-hidden border-r border-gray-200 px-3 hover:bg-emerald-50/50 transition rounded-l-2xl"
              onClick={() => setIsLocationModalOpen(true)}
              title="Click to enable or change location"
            >
              <FaLocationDot size={25} className="text-emerald-600 shrink-0" />
              <div className="w-[80%] truncate text-gray-700 font-medium">
                {currentCity}
              </div>
            </div>

            <div className="flex w-[65%] items-center gap-2 pr-3">
              <FaSearch size={22} className="text-emerald-600 shrink-0" />
              <input
                type="text"
                placeholder="Search delicious food..."
                className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        <h1 className="ml-1 whitespace-nowrap bg-gradient-to-r from-emerald-500 via-emerald-500 to-lime-500 bg-clip-text text-3xl font-black tracking-tight text-transparent">
          Food Bus
        </h1>

        {userData.role === "user" ? (
          <div className="hidden h-[56px] max-w-xl flex-1 items-center gap-4 rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(16,185,129,0.08)] md:flex">
            <div
              className="flex w-48 cursor-pointer items-center gap-2 overflow-hidden border-r border-gray-200 px-4 py-2 hover:bg-emerald-50/60 transition rounded-l-2xl group"
              onClick={() => setIsLocationModalOpen(true)}
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

        <div className="flex shrink-0 items-center gap-4">
          {userData.role === "user" &&
            (showSearch ? (
              <ImCross
                size={25}
                className="cursor-pointer text-emerald-600 md:hidden"
                onClick={() => setShowSearch(false)}
              />
            ) : (
              <FaSearch
                size={25}
                className="cursor-pointer text-emerald-600 md:hidden"
                onClick={() => setShowSearch(true)}
              />
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
                    <FaPlus size={18} />
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
                <LuReceiptIndianRupee size={20} />
              </button>
            </>
          ) : (
            <>
              {userData.role === "user" && (
                <div
                  className="relative cursor-pointer rounded-full border border-emerald-100 bg-emerald-50 p-2"
                  onClick={() => navigate("/cart")}
                >
                  <FaShoppingCart size={24} className="text-emerald-600" />

                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
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

          <div className="relative">
            <div
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 text-lg font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
              onClick={() => setShowInfo((prev) => !prev)}
            >
              {userData?.fullName?.charAt(0).toUpperCase()}
            </div>

            {showInfo && (
              <div className="absolute right-0 top-[55px] z-[9999] flex w-[190px] flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_18px_45px_rgba(16,185,129,0.12)]">
                <div className="text-[17px] font-semibold text-gray-800">
                  {userData.fullName}
                </div>

                {userData.role === "user" && (
                  <div
                    className="cursor-pointer font-semibold text-emerald-600 md:hidden"
                    onClick={() => {
                      navigate("/my-orders");
                      setShowInfo(false);
                    }}
                  >
                    My Orders
                  </div>
                )}

                <div
                  className="cursor-pointer font-semibold text-emerald-600"
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
