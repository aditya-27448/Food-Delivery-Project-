import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center gap-5">
          <div
            className="cursor-pointer rounded-full border border-emerald-100 bg-white/90 p-2 shadow-sm transition hover:shadow-md"
            onClick={() => navigate("/")}
          >
            <IoMdArrowRoundBack size={28} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Your Cart</h1>
        </div>

        {cartItems?.length == 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-white/95 p-8 text-center shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <p className="text-lg text-slate-600">Your Cart Is Empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems?.map((item, index) => (
                <CartItemCard data={item} key={index} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
              <h1 className="text-lg font-semibold text-slate-800">
                Total Amount
              </h1>
              <span className="text-xl font-bold text-emerald-600">
                ₹ {totalAmount}
              </span>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-3 text-lg font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
                onClick={() => navigate("/checkout")}
              >
                Proceed To Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
