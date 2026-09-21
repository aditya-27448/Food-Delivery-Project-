import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverURL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapPin } from "react-icons/fa";
import { FaStore } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from "../components/FoodCard";

function Shop() {
  const { shopId } = useParams();
  const navigation = useNavigate();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);

  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true },
      );
      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="relative min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)]">
      <button
        className="absolute left-3 top-3 sm:left-5 sm:top-5 z-20 flex items-center justify-center rounded-full border border-white/20 bg-white/90 p-2 sm:px-3 sm:py-2 text-emerald-700 shadow-lg backdrop-blur transition hover:bg-white"
        onClick={() => navigation("/")}
      >
        <FaArrowLeft className="text-sm sm:text-base" />
      </button>

      {shop && (
        <div className="relative h-44 sm:h-72 lg:h-96 w-full">
          <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950/80 via-emerald-800/60 to-emerald-900/40 px-4 text-center">
            <FaStore className="mb-1.5 text-2xl sm:text-4xl text-white drop-shadow-md" />

            <h1 className="text-xl font-extrabold text-white drop-shadow-lg sm:text-3xl md:text-5xl">
              {shop.name}
            </h1>

            <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2.5 backdrop-blur-sm max-w-[90%]">
              <FaMapPin className="text-rose-400 text-xs sm:text-lg shrink-0" />
              <p className="truncate text-xs font-medium text-gray-100 sm:text-base md:text-lg">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
        <h2 className="mb-5 sm:mb-10 flex items-center justify-center gap-2 text-xl font-bold text-slate-800 sm:text-3xl">
          <FaUtensils className="text-emerald-600" /> Our Menu
        </h2>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white/90 p-6 sm:p-8 text-center shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <p className="text-sm sm:text-lg text-slate-600">No Items Available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
