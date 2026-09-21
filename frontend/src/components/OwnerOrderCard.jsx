import axios from "axios";
import React, { useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

function OwnerOrderCard({ data }) {
  const dispatch = useDispatch();
  const [availableBoys, setAvailableBoys] = useState([]);

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverURL}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true },
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result.data.availableBoys);
      console.log(result.data);
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      console.log(error.response?.data?.message);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white/95 p-3.5 sm:p-5 shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
      <div>
        <h2 className="text-sm sm:text-lg font-semibold text-slate-800">
          {data?.user?.fullName || "Customer unavailable"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">{data?.user?.email}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
          <FaMobileAlt className="text-emerald-600 shrink-0" />
          <span>{data?.user?.mobile}</span>
        </p>
        {data.paymentMethod == "online" ? (
          <p className="text-xs sm:text-sm text-slate-600">
            <span>Payment: </span>
            {data.payment ? "True" : "False"}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-slate-600">
            <span>Payment Method: </span>
            {data.paymentMethod}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-1 text-xs sm:text-sm text-slate-600">
        <p className="line-clamp-2">{data?.deliveryAddress?.text}</p>
        <p className="text-[10px] sm:text-xs text-slate-400">
          Lat: {data?.deliveryAddress?.latitude}, Lon:{" "}
          {data?.deliveryAddress?.longitude}
        </p>
      </div>

      <div className="flex space-x-2.5 sm:space-x-4 overflow-x-auto pb-1.5 scrollbar-none">
        {data.shopOrders.shopOrderItems.map((item, index) => (
          <div
            key={index}
            className="w-32 sm:w-40 shrink-0 rounded-xl sm:rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-2 shadow-sm"
          >
            {!item?.item ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-center text-xs text-red-500">
                This food item has been removed.
              </div>
            ) : (
              <>
                <img
                  src={item.item.image}
                  alt={item.name}
                  className="h-20 sm:h-24 w-full rounded-lg sm:rounded-xl object-cover"
                />
                <p
                  className="mt-1 truncate text-xs sm:text-sm font-semibold text-slate-800"
                  title={item.name}
                >
                  {item.name}
                </p>
                <div className="mt-1.5 flex justify-between text-[10px] sm:text-xs text-slate-500">
                  <p className="text-left">
                    Qty: {item.quantity} x ₹{item.price}
                  </p>
                  <p className="text-right font-semibold text-slate-700">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-emerald-50 pt-2.5">
        <span className="text-xs sm:text-sm text-slate-700">
          Status:{" "}
          <span className="font-semibold capitalize text-emerald-600">
            {data.shopOrders.status}
          </span>
        </span>

        <select
          onChange={(e) =>
            handleUpdateStatus(
              data._id,
              data.shopOrders.shop._id,
              e.target.value,
            )
          }
          className="rounded-lg sm:rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs sm:text-sm text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <option value="">Change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out For Delivery</option>
        </select>
      </div>

      {data.shopOrders.status == "out of delivery" && (
        <div className="rounded-xl sm:rounded-2xl border border-emerald-100 bg-emerald-50 p-2.5 sm:p-3 text-xs sm:text-sm">
          {data.shopOrders.assignedDeliveryBoy ? (
            <p className="font-semibold text-emerald-700">
              Assigned Delivery Boy:
            </p>
          ) : (
            <p className="font-semibold text-emerald-700">
              Available Delivery Boys:
            </p>
          )}
          {(availableBoys?.length ?? 0) > 0 ? (
            availableBoys.map((b, index) => (
              <div className="mt-1 text-slate-600" key={index}>
                {b.fullName} - {b.mobile}
              </div>
            ))
          ) : data.shopOrders.assignedDeliveryBoy ? (
            <div className="mt-1 text-slate-600">
              Name: {data.shopOrders.assignedDeliveryBoy.fullName} -{" "}
              {data.shopOrders.assignedDeliveryBoy.mobile}
            </div>
          ) : (
            <div className="mt-1 text-slate-600">
              Waiting for delivery boy to accept
            </div>
          )}
        </div>
      )}

      <div className="text-right text-xs sm:text-sm font-bold text-slate-800">
        Total: ₹ {data.shopOrders.subtotal}
      </div>
    </div>
  );
}

export default OwnerOrderCard;
