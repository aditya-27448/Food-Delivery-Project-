import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import OwnerOrderCard from "../components/OwnerOrderCard";
import UserOrderCard from "../components/UserOrderCard";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/userSlice";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data.shopOrders.owner._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    });
    socket?.on("statusChange", ({ orderId, shopId, status, userId }) => {
      if (userId == userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      }
    });

    return () => {
      socket?.off("newOrder");
      socket?.off("statusChange");
    };
  }, [socket]);

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4 ">
      <div className="w-full max-w-200 p-4">
        {/* Back Button */}
        <div className="flex items-center gap-5 mb-6 ">
          <div className="z-2.5" onClick={() => navigate("/")}>
            <IoMdArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-2xl font-bold text-start">My Orders</h1>
        </div>

        <div className="space-y-6">
          {myOrders?.map((order, index) =>
            userData.role == "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : userData.role == "owner" ? (
              <OwnerOrderCard data={order} key={index} />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
