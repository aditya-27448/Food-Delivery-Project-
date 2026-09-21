import React from "react";
import { useDispatch } from "react-redux";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { removeCartItem, updateQuantity } from "../redux/userSlice";

function CartItemCard({ data }) {
  const dispatch = useDispatch();

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty <= 1) return;
    dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
  };

  return (
    <div className="flex items-center justify-between rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white/95 p-3 sm:p-4 shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)] gap-2">
      <div className="flex items-center gap-2.5 sm:gap-4 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl border border-emerald-100 object-cover shrink-0"
        />
        <div className="min-w-0">
          <h1 className="font-semibold text-xs sm:text-base text-slate-800 truncate">{data.name}</h1>
          <p className="text-[11px] sm:text-sm text-slate-500">
            ₹{data.price} × {data.quantity}
          </p>
          <p className="font-bold text-xs sm:text-base text-emerald-600">
            ₹ {data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          className="rounded-full bg-emerald-50 p-1.5 sm:p-2 text-emerald-600 transition hover:bg-emerald-100"
          onClick={() => handleDecrease(data.id, data.quantity)}
        >
          <FaMinus className="text-[10px] sm:text-[12px]" />
        </button>

        <span className="min-w-4 sm:min-w-5 text-center text-xs sm:text-base font-semibold text-slate-700">
          {data.quantity}
        </span>

        <button
          className="rounded-full bg-emerald-50 p-1.5 sm:p-2 text-emerald-600 transition hover:bg-emerald-100"
          onClick={() => handleIncrease(data.id, data.quantity)}
        >
          <FaPlus className="text-[10px] sm:text-[12px]" />
        </button>

        <button
          className="rounded-full bg-rose-50 p-1.5 sm:p-2 text-rose-600 transition hover:bg-rose-100 ml-0.5 sm:ml-1"
          onClick={() => dispatch(removeCartItem(data.id))}
        >
          <FaTrashAlt className="text-xs sm:text-base" />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
