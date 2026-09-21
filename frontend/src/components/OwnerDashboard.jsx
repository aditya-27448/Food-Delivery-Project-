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
    <div className="min-h-screen w-full bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] px-3 pt-20 sm:pt-28 pb-12 text-slate-800 sm:px-6">
      <Nav />

      {!myShopData && (
        <div className="flex items-center justify-center p-2 sm:p-6">
          <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="mb-3 h-12 w-12 text-emerald-600 sm:h-20 sm:w-20" />
              <h2 className="mb-2 text-lg font-bold text-slate-800 sm:text-2xl">
                Add Your Restaurant
              </h2>
              <p className="mb-4 text-xs text-slate-600 sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>

              <button
                className="rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-5 py-2 text-sm font-medium text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
          <h1 className="mt-2 sm:mt-6 flex items-center justify-center gap-2 text-center text-lg font-bold text-slate-800 sm:text-3xl">
            <FaUtensils className="h-6 w-6 sm:h-10 sm:w-10 text-emerald-600" />
            Welcome to {myShopData.name}
          </h1>

          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <div
              className="absolute right-3 top-3 cursor-pointer rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 p-2 text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-colors"
              onClick={() => navigate("/create-edit-shop")}
              title="Edit shop details"
            >
              <FaPen className="text-xs sm:text-lg" />
            </div>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="h-36 sm:h-64 w-full object-cover"
            />

            <div className="p-3.5 sm:p-6">
              <h1 className="mb-1 text-lg font-bold text-slate-800 sm:text-2xl">
                {myShopData.name}
              </h1>
              <p className="text-xs sm:text-base text-slate-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-xs sm:text-base text-slate-500">{myShopData.address}</p>
            </div>
          </div>

          {(!myShopData?.items || myShopData.items.length === 0) && (
            <div className="flex items-center justify-center p-2 sm:p-6">
              <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="mb-3 h-12 w-12 text-emerald-600 sm:h-20 sm:w-20" />
                  <h2 className="mb-2 text-lg font-bold text-slate-800 sm:text-2xl">
                    Add Your Food Item
                  </h2>
                  <p className="mb-4 text-xs text-slate-600 sm:text-base">
                    Share your delicious creations with our customers by adding
                    them to the menu.
                  </p>

                  <button
                    className="rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-5 py-2 text-sm font-medium text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="flex w-full max-w-3xl flex-col items-center gap-3 sm:gap-4">
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
