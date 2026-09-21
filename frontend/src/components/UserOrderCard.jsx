import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({}); //itemId:rating

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-Gb", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
      const result = await axios.post(
        `${serverURL}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true },
      );
      setSelectedRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white/95 p-3.5 sm:p-5 shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
      <div className="flex justify-between border-b border-emerald-50 pb-2.5 sm:pb-3">
        <div>
          <p className="font-semibold text-xs sm:text-base text-slate-800">
            Order #{data?._id?.slice(-6) || "N/A"}
          </p>
          <p className="text-[11px] sm:text-sm text-slate-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right">
          {data.paymentMethod == "cod" ? (
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              {data.paymentMethod?.toUpperCase()}
            </p>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Payment: {data.payment ? "True" : "False"}
            </p>
          )}

          <p className="font-semibold text-xs sm:text-sm capitalize text-emerald-600">
            {data?.shopOrders?.[0]?.status}
          </p>
        </div>
      </div>

      {data.shopOrders.map((shopOrder, index) => (
        <div
          className="space-y-2.5 sm:space-y-3 rounded-xl sm:rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-2.5 sm:p-3"
          key={index}
        >
          <p className="font-semibold text-xs sm:text-base text-slate-800">{shopOrder.shop.name}</p>

          <div className="flex space-x-2.5 sm:space-x-4 overflow-x-auto pb-1.5 scrollbar-none">
            {shopOrder.shopOrderItems.map((item, index) => (
              <div
                key={index}
                className="w-32 sm:w-40 shrink-0 rounded-xl sm:rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm"
              >
                {!item?.item ? (
                  <div className="flex h-full min-h-32 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2 text-center text-xs font-medium text-red-500">
                    This food item has been removed by the restaurant.
                  </div>
                ) : (
                  <>
                    <img
                      src={item.item.image}
                      alt={item.name}
                      className="h-20 sm:h-24 w-full rounded-lg sm:rounded-xl object-cover"
                    />

                    <p className="mt-1.5 truncate text-xs sm:text-sm font-semibold text-slate-800" title={item.name}>
                      {item.name}
                    </p>

                    <div className="mt-1">
                      <p className="text-[10px] sm:text-xs text-slate-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>

                      <p className="text-[10px] sm:text-xs font-semibold text-slate-700">
                        ₹ {item.price * item.quantity}
                      </p>

                      {shopOrder.status === "delivered" && (
                        <div className="mt-1 flex space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={`text-sm sm:text-lg ${selectedRating[item.item._id] >= star
                                  ? "text-emerald-500"
                                  : "text-slate-300"
                                }`}
                              onClick={() => handleRating(item.item._id, star)}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-emerald-50 pt-2 text-xs sm:text-sm">
            <p className="font-semibold text-slate-800">
              Subtotal: ₹{shopOrder.subtotal}
            </p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-sm font-medium capitalize text-emerald-600">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-emerald-50 pt-2">
        <p className="font-semibold text-xs sm:text-base text-slate-800">
          Total: ₹ {data.totalAmount}
        </p>
        <button
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
