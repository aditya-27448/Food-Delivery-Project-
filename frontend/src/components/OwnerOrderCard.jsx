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
  // console.log(data.payment);
  return (
    <div className="bg-white rounded-lg shadow space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data.user.fullName}
        </h2>
        <p className="text-sm text-gray-500">{data?.user?.email} </p>
        <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <FaMobileAlt /> <span>{data?.user?.mobile}</span>
        </p>
        {data.paymentMethod == "online" ? (
          <p className="gap-2 text-sm text-gray-600">
            <span>Payment: </span>
            {data.payment ? "True" : "False"}
          </p>
        ) : (
          <p className="gap-2 text-sm text-gray-600">
            <span>Payment Method: </span>
            {data.paymentMethod}
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-2 text-gray-600 text-sm">
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
            className="shrink-0 w-40 border rounded-lg p-2 bg-white"
          >
            <img
              src={item.item.image}
              alt=""
              className="w-full h-24 object-cover rounded"
            />
            <p className="text-sm font-semibold mt-1">{item.name}</p>
            <hr />
            <div className="flex justify-between">
              <p className="text-xs text-gray-500 text-left">
                Qty: {item.quantity} x ₹ {item.price}
              </p>
              <p className="text-xs text-gray-500 text-right">
                ₹ {item.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto border-t border-gray-100">
        <span className="text-sm">
          Status:{" "}
          <span className="font-semibold capitalize text-[#ff4d2d]">
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
          className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]"
        >
          <option value="">change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out For Delivery</option>
        </select>
      </div>

      {data.shopOrders.status == "out of delivery" && (
        <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">
          {data.shopOrders.assignedDeliveryBoy ? (
            <p>Assigned Delivery Boy: </p>
          ) : (
            <p>Available Delivery Boys: </p>
          )}
          {(availableBoys?.length ?? 0) > 0 ? (
            availableBoys.map((b, index) => (
              <div className=" text-gray-300" key={index}>
                {b.fullName}-{b.mobile}
              </div>
            ))
          ) : data.shopOrders.assignedDeliveryBoy ? (
            <div>
              Name: {data.shopOrders.assignedDeliveryBoy.fullName} -{" "}
              {data.shopOrders.assignedDeliveryBoy.mobile}
            </div>
          ) : (
            <div>Waiting for delivery boy to accept</div>
          )}
        </div>
      )}

      <div className="text-right font-bold text-gray-800 text-sm">
        Total: ₹ {data.shopOrders.subtotal}
      </div>
    </div>
  );
}

export default OwnerOrderCard;
