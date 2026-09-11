import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav.jsx";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard.jsx";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard.jsx";
import { useNavigate } from "react-router-dom";
import MobileModal from "./modals/MobileModal.jsx";

function UserDashboard() {
  const cateScrollRef = useRef();
  const navigate = useNavigate();
  const [showLeftCatButton, setShowLeftCatButton] = useState(false);
  const [showRightCatButton, setShowRightCatButton] = useState(false);
  const { currentCity, shopsInMyCity, itemsInMyCity, searchItems, userData } =
    useSelector((state) => state.user);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const shopScrollRef = useRef();

  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const handleFilterByCategory = (category) => {
    if (category == "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity.filter((i) => i.category === category);
      setUpdatedItemsList(filteredList);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
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

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] overflow-y-auto pt-[100px] text-slate-800">
      <Nav />

      {/* Show mobile number modal if user doesn't have one */}
      {userData && !userData.mobile && <MobileModal />}

      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white/90 shadow-[0_10px_30px_rgba(16,185,129,0.08)] rounded-3xl border border-emerald-100 mt-4">
          <h1 className="inline-block border-b border-emerald-100 pb-2 text-2xl font-bold tracking-tight text-slate-800 after:mt-2 after:block after:h-1 after:w-full after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-[''] sm:text-3xl">
            Search Result
          </h1>

          <div className="w-full h-auto grid grid-cols-1 gap-y-8 gap-x-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="inline-block text-2xl font-bold tracking-tight text-slate-800 after:mt-2 after:block after:h-1 after:w-24 after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-[''] sm:text-3xl">
          Inspiration for your first order
        </h1>
        <div className="w-full relative">
          {showLeftCatButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="inline-block text-2xl font-bold tracking-tight text-slate-800 after:mt-2 after:block after:h-1 after:w-24 after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-[''] sm:text-3xl">
          Best Shop In {currentCity}
        </h1>
        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white p-2 rounded-full shadow-lg hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="inline-block text-2xl font-bold tracking-tight text-slate-800 after:mt-2 after:block after:h-1 after:w-24 after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:to-lime-500 after:content-[''] sm:text-3xl">
          Suggested Food Items In {currentCity}
        </h1>

        <div className="w-full h-auto grid grid-cols-1 gap-y-8 gap-x-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {updatedItemsList?.map((item, index) => (
            <FoodCard data={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
