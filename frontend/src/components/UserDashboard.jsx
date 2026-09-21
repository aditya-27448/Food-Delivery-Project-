import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav.jsx";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard.jsx";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { FaLocationDot, FaStoreSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import FoodCard from "./FoodCard.jsx";
import { useNavigate } from "react-router-dom";
import MobileModal from "./modals/MobileModal.jsx";
import LocationModal from "./modals/LocationModal.jsx";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function UserDashboard() {
  const cateScrollRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLeftCatButton, setShowLeftCatButton] = useState(false);
  const [showRightCatButton, setShowRightCatButton] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const {
    currentCity,
    currentAddress,
    shopsInMyCity,
    itemsInMyCity,
    searchItems,
    userData,
  } = useSelector((state) => state.user);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const shopScrollRef = useRef();

  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const handleFilterByCategory = (category) => {
    if (category == "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter(
        (i) => i.category === category,
      );
      setUpdatedItemsList(filteredList || []);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity || []);
  }, [itemsInMyCity]);

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth,
      );
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -800 : 800,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const cateScrollListener = () =>
      updateButton(cateScrollRef, setShowLeftCatButton, setShowRightCatButton);
    const shopScrollListener = () =>
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton,
      );

    if (cateScrollRef.current) {
      updateButton(cateScrollRef, setShowLeftCatButton, setShowRightCatButton);
      cateScrollRef.current.addEventListener("scroll", cateScrollListener);
    }

    if (shopScrollRef.current) {
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton,
      );
      shopScrollRef.current.addEventListener("scroll", shopScrollListener);
    }

    return () => {
      if (cateScrollRef.current)
        cateScrollRef.current.removeEventListener("scroll", cateScrollListener);
      if (shopScrollRef.current)
        shopScrollRef.current.removeEventListener("scroll", shopScrollListener);
    };
  }, []);

  const handleSwitchToBhubaneswar = () => {
    dispatch(setCurrentCity("Bhubaneswar"));
    dispatch(setCurrentState("Odisha"));
    dispatch(setCurrentAddress("Bhubaneswar, Odisha, India"));
    dispatch(setLocation({ lat: 20.2961, lon: 85.8245 }));
    dispatch(setAddress("Bhubaneswar, Odisha, India"));
  };

  const hasNoShops = Array.isArray(shopsInMyCity) && shopsInMyCity.length === 0;

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 sm:gap-6 items-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] overflow-y-auto pt-[74px] sm:pt-[100px] text-slate-800 pb-10">
      <Nav />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Show mobile number modal if user doesn't have one */}
      {userData && !userData.mobile && <MobileModal />}

      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-4 items-start p-3 sm:p-5 bg-white/90 shadow-[0_10px_30px_rgba(16,185,129,0.08)] rounded-2xl sm:rounded-3xl border border-emerald-100 mt-2 sm:mt-4">
          <h1 className="inline-block border-b border-emerald-100 pb-2 text-lg sm:text-3xl font-bold tracking-tight text-slate-800 after:mt-1.5 after:block after:h-1 after:w-full after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-['']">
            Search Result
          </h1>

          <div className="w-full h-auto grid grid-cols-2 gap-2.5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="w-full max-w-6xl flex flex-col gap-3 sm:gap-5 items-start px-3 sm:px-4">
        <h1 className="inline-block text-lg sm:text-3xl font-bold tracking-tight text-slate-800 after:mt-1.5 after:block after:h-1 after:w-16 sm:after:w-24 after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-['']">
          Inspiration for your first order
        </h1>
        <div className="w-full relative">
          {showLeftCatButton && (
            <button
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-2.5 sm:gap-4 pb-2 scrollbar-none"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>

          {showRightCatButton && (
            <button
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>

      {/* If no restaurants in current address or city: Show Friendly Note */}
      {hasNoShops ? (
        <div className="w-full max-w-3xl mx-auto my-4 sm:my-6 px-3 sm:px-4">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 p-6 sm:p-10 shadow-[0_15px_40px_rgba(16,185,129,0.08)] backdrop-blur-md text-center flex flex-col items-center">
            <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/30 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-100/40 to-lime-100/30 blur-2xl" />

            <div className="relative mb-4 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 via-emerald-50 to-emerald-100 text-emerald-600 shadow-inner">
              <FaStoreSlash className="text-3xl sm:text-4xl text-emerald-700" />
              <div className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white font-black text-xs shadow-md border-2 border-white">
                !
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 mb-3">
              <span>📍 Currently Unavailable</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-800">
              We are currently not available in {currentCity}
            </h2>

            <p className="mt-3 max-w-lg text-xs sm:text-sm text-slate-600 leading-relaxed">
              We don't have any partner restaurants or shops delivering in{" "}
              <strong className="text-slate-800 font-bold">
                {currentCity}
              </strong>
              {currentAddress && currentAddress !== currentCity ? (
                <span className="block mt-1 font-medium text-slate-500 text-xs truncate max-w-md mx-auto">
                  ({currentAddress})
                </span>
              ) : null}{" "}
              yet. We are expanding rapidly and hope to arrive in your city
              soon!
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <button
                data-location-trigger
                onClick={() => setIsLocationModalOpen((prev) => !prev)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <FaLocationDot size={14} />
                Change Delivery Location
              </button>

              {currentCity?.toLowerCase() !== "bhubaneswar" && (
                <button
                  onClick={handleSwitchToBhubaneswar}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-3 text-xs sm:text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                >
                  Switch to Bhubaneswar
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Best Shop In City */}
          <div className="w-full max-w-6xl flex flex-col gap-3 sm:gap-5 items-start px-3 sm:px-4">
            <h1 className="inline-block text-lg sm:text-3xl font-bold tracking-tight text-slate-800 after:mt-1.5 after:block after:h-1 after:w-16 sm:after:w-24 after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-['']">
              Best Shop In {currentCity}
            </h1>
            <div className="w-full relative">
              {showLeftShopButton && (
                <button
                  className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
                  onClick={() => scrollHandler(shopScrollRef, "left")}
                >
                  <FaChevronCircleLeft />
                </button>
              )}

              <div
                className="w-full flex overflow-x-auto gap-2.5 sm:gap-4 pb-2 scrollbar-none"
                ref={shopScrollRef}
              >
                {shopsInMyCity?.map((shop, index) => (
                  <CategoryCard
                    name={shop.name}
                    image={shop.image}
                    key={index}
                    onClick={() => navigate(`/shop/${shop._id}`)}
                  />
                ))}
              </div>

              {showRightShopButton && (
                <button
                  className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
                  onClick={() => scrollHandler(shopScrollRef, "right")}
                >
                  <FaChevronCircleRight />
                </button>
              )}
            </div>
          </div>

          {/* Suggested Food Items In City */}
          <div className="w-full max-w-6xl flex flex-col gap-3 sm:gap-5 items-start px-3 sm:px-4">
            <h1 className="inline-block text-lg sm:text-3xl font-bold tracking-tight text-slate-800 after:mt-1.5 after:block after:h-1 after:w-16 sm:after:w-24 after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-['']">
              Suggested Food Items In {currentCity}
            </h1>

            <div className="w-full h-auto grid grid-cols-2 gap-2.5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {updatedItemsList?.map((item, index) => (
                <FoodCard data={item} key={index} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;
