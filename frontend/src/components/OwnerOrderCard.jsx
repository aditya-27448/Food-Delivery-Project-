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
    <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          {data.user.fullName}
        </h2>
        <p className="text-sm text-slate-500">{data?.user?.email}</p>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
          <FaMobileAlt className="text-emerald-600" />
          <span>{data?.user?.mobile}</span>
        </p>
        {data.paymentMethod == "online" ? (
          <p className="text-sm text-slate-600">
            <span>Payment: </span>
            {data.payment ? "True" : "False"}
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            <span>Payment Method: </span>
            {data.paymentMethod}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-2 text-sm text-slate-600">
        <p>{data?.deliveryAddress?.text}</p>
        <p>
          Lat: {data?.deliveryAddress?.latitude}, Lon:{" "}
          {data?.deliveryAddress?.longitude}
        </p>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {data.shopOrders.shopOrderItems.map((item, index) => (
          <div
            key={index}
            className="w-40 shrink-0 rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-2 shadow-sm"
          >
            {!item?.item ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-500">
                This food item has been removed.
              </div>
            ) :
              <>
                <img
                  src={item.item.image}
                  alt=""
                  className="h-24 w-full rounded-xl object-cover"
                />
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {item.name}
                </p>
                <div className="mt-2 flex justify-between">
                  <p className="text-left text-xs text-slate-500">
                    Qty: {item.quantity} x ₹ {item.price}
                  </p>
                  <p className="text-right text-xs text-slate-500">
                    ₹ {item.price * item.quantity}
                  </p>
                </div>
              </>}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-emerald-50 pt-3">
        <span className="text-sm text-slate-700">
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
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <option value="">Change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out For Delivery</option>
        </select>
      </div>

      {data.shopOrders.status == "out of delivery" && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm">
          {data.shopOrders.assignedDeliveryBoy ? (
            <p className="text-emerald-700">Assigned Delivery Boy:</p>
          ) : (
            <p className="text-emerald-700">Available Delivery Boys:</p>
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

      <div className="text-right text-sm font-bold text-slate-800">
        Total: ₹ {data.shopOrders.subtotal}
      </div>
    </div>
  );
}

export default OwnerOrderCard;
