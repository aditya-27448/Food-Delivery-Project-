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
    <div className="flex items-center justify-between rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt=""
          className="h-20 w-20 rounded-2xl border border-emerald-100 object-cover"
        />
        <div>
          <h1 className="font-semibold text-slate-800">{data.name}</h1>
          <p className="text-sm text-slate-500">
            {data.price} × {data.quantity}
          </p>
          <p className="font-bold text-emerald-600">
            ₹ {data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="rounded-full bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
          onClick={() => handleDecrease(data.id, data.quantity)}
        >
          <FaMinus size={12} />
        </button>

        <span className="min-w-5 text-center font-semibold text-slate-700">
          {data.quantity}
        </span>

        <button
          className="rounded-full bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
          onClick={() => handleIncrease(data.id, data.quantity)}
        >
          <FaPlus size={12} />
        </button>

        <button
          className="rounded-full bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
          onClick={() => dispatch(removeCartItem(data.id))}
        >
          <FaTrashAlt size={16} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
