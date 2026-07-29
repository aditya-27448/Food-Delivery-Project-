import React from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./OwnerItemCard";

function OwnerDashboard() {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] px-4 py-24 text-slate-800 sm:px-6">
      <Nav />

      {!myShopData && (
        <div className="flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_10px_30px_rgba(16,185,129,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(16,185,129,0.14)]">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="mb-4 h-16 w-16 text-emerald-600 sm:h-20 sm:w-20" />
              <h2 className="mb-2 text-xl font-bold text-slate-800 sm:text-2xl">
                Add Your Restaurant
              </h2>
              <p className="mb-4 text-sm text-slate-600 sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>

              <button
                className="rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-5 py-2 font-medium text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-colors duration-200 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="flex w-full flex-col items-center gap-6">
          <h1 className="mt-8 flex items-center gap-3 text-center text-2xl font-semibold text-slate-800 sm:text-3xl">
            <FaUtensils className="h-14 w-14 text-emerald-600" />
            Welcome to {myShopData.name}
          </h1>

          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_10px_30px_rgba(16,185,129,0.08)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(16,185,129,0.14)]">
            <div
              className="absolute right-4 top-4 cursor-pointer rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 p-2 text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-colors"
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={20} />
            </div>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="h-48 w-full object-cover sm:h-64"
            />

            <div className="p-4 sm:p-6">
              <h1 className="mb-2 text-xl font-bold text-slate-800 sm:text-2xl">
                {myShopData.name}
              </h1>
              <p className="text-slate-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="mb-2 text-slate-500">{myShopData.address}</p>
            </div>
          </div>

          {(!myShopData?.items || myShopData.items.length === 0) && (
            <div className="flex items-center justify-center p-4 sm:p-6">
              <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_10px_30px_rgba(16,185,129,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(16,185,129,0.14)]">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="mb-4 h-16 w-16 text-emerald-600 sm:h-20 sm:w-20" />
                  <h2 className="mb-2 text-xl font-bold text-slate-800 sm:text-2xl">
                    Add Your Food Item
                  </h2>
                  <p className="mb-4 text-sm text-slate-600 sm:text-base">
                    Share your delicious creations with our customers by adding
                    them to the menu.
                  </p>

                  <button
                    className="rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-5 py-2 font-medium text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-colors duration-200 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="flex w-full max-w-3xl flex-col items-center gap-4">
              {myShopData.items.map((item, index) => (
                <OwnerItemCard data={item} key={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
