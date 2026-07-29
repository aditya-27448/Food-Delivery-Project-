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
        className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-white/90 px-3 py-2 text-emerald-700 shadow-lg backdrop-blur transition hover:bg-white"
        onClick={() => navigation("/")}
      >
        <FaArrowLeft />
      </button>

      {shop && (
        <div className="relative h-72 w-full md:h-80 lg:h-96">
          <img src={shop.image} alt="" className="h-full w-full object-cover" />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950/80 via-emerald-800/60 to-emerald-900/40 px-4 text-center">
            <FaStore className="mb-3 text-4xl text-white drop-shadow-md" />

            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg md:text-5xl">
              {shop.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <FaMapPin size={20} className="text-rose-400" />
              <p className="text-base font-medium text-gray-100 md:text-lg">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-10 flex items-center justify-center gap-3 text-3xl font-bold text-slate-800">
          <FaUtensils className="text-emerald-600" /> Our Menu
        </h2>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-8 gap-x-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 text-center shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <p className="text-lg text-slate-600">No Items Available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
