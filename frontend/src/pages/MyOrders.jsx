import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import OwnerOrderCard from "../components/OwnerOrderCard";
import UserOrderCard from "../components/UserOrderCard";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/userSlice";
import axios from "axios";
import { serverURL } from "../App";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/order/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();

    const refreshInterval = setInterval(fetchOrders, 5000);
    return () => clearInterval(refreshInterval);
  }, [dispatch]);

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
  }, [socket, dispatch, userData?._id, myOrders]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] px-3 py-6 sm:px-6 sm:py-10 text-slate-800">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
          <div
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-emerald-100 bg-white/90 shadow-sm transition hover:scale-105 hover:shadow-md cursor-pointer"
            onClick={() => navigate("/")}
          >
            <IoMdArrowRoundBack className="text-emerald-600 text-lg sm:text-2xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            My Orders
          </h1>
        </div>

        {myOrders?.length ? (
          <div className="space-y-3.5 sm:space-y-6">
            {myOrders.map((order, index) =>
              userData?.role === "user" ? (
                <UserOrderCard data={order} key={index} />
              ) : userData?.role === "owner" ? (
                <OwnerOrderCard data={order} key={index} />
              ) : null,
            )}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white/95 p-6 sm:p-8 text-center shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <p className="text-sm sm:text-lg text-slate-600">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
