import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function OrderPlaced() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] px-4 text-center">
      <div className="mb-6 rounded-full bg-emerald-50 p-4 shadow-sm">
        <FaCircleCheck className="text-emerald-600" size={100} />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-slate-800">Order Placed!</h1>

      <p className="mb-6 max-w-md text-slate-600">
        Thank you for your purchase. Your order has been confirmed and is being
        prepared. We appreciate your support and hope you enjoy your meal!
      </p>

      <button
        className="rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-3 text-lg font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
        onClick={() => navigate("/my-orders")}
      >
        Back to My Orders
      </button>
    </div>
  );
}

export default OrderPlaced;
