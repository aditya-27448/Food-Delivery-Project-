import React, { useState } from "react";

import { FaLeaf, FaPlus } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { FaStar, FaRegStar, FaMinus, FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);
  const { cartItems } = useSelector((state) => state.user);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-xs sm:text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-xs sm:text-lg" />
        ),
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(16,185,129,0.14)] flex flex-col">
      <div className="relative flex h-28 sm:h-42.5 w-full items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)]">
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 rounded-full bg-white/90 p-1 sm:p-2 shadow-sm backdrop-blur-sm">
          {data.foodType == "veg" ? (
            <FaLeaf className="text-emerald-600 text-xs sm:text-lg" />
          ) : (
            <GiChickenLeg className="text-rose-500 text-xs sm:text-lg" />
          )}
        </div>

        <img
          src={data.image}
          alt={data.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <h1 className="truncate text-xs sm:text-base font-semibold text-slate-800" title={data.name}>
          {data.name}
        </h1>

        <div className="mt-1 flex items-center gap-0.5 sm:gap-1">
          <div className="flex items-center gap-0.5">{renderStars(data.rating?.average || 0)}</div>
          <span className="text-[10px] sm:text-sm text-slate-500 ml-0.5">
            ({data.rating?.count || 0})
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between p-2.5 sm:p-4 pt-0 sm:pt-0">
        <span className="text-xs sm:text-lg font-bold text-slate-800">₹ {data.price}</span>

        <div className="flex items-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-50 shadow-sm">
          <button
            className="px-1.5 py-1 sm:px-2 sm:py-1 transition hover:bg-emerald-100 text-emerald-600"
            onClick={handleDecrease}
            aria-label="Decrease quantity"
          >
            <FaMinus className="text-[10px] sm:text-[12px]" />
          </button>

          <span className="min-w-4 sm:min-w-6 text-center text-xs sm:text-sm font-semibold text-slate-700">
            {quantity}
          </span>

          <button
            className="px-1.5 py-1 sm:px-2 sm:py-1 transition hover:bg-emerald-100 text-emerald-600"
            onClick={handleIncrease}
            aria-label="Increase quantity"
          >
            <FaPlus className="text-[10px] sm:text-[12px]" />
          </button>

          <button
            className={`px-2 py-1.5 sm:px-3 sm:py-2 text-white transition-colors ${
              cartItems.some((i) => i.id == data._id)
                ? "bg-slate-800"
                : "bg-gradient-to-r from-emerald-500 to-lime-500"
            }`}
            onClick={() => {
              quantity > 0
                ? dispatch(
                    addToCart({
                      id: data._id,
                      name: data.name,
                      price: data.price,
                      image: data.image,
                      shop: data.shop,
                      quantity,
                      foodType: data.foodType,
                    }),
                  )
                : null;
            }}
            aria-label="Add to cart"
          >
            <FaCartShopping className="text-xs sm:text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
