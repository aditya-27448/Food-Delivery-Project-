import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverURL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

function TrackOrderPage() {
  const { socket } = useSelector((state) => state.user);
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const [liveLocation, setLiveLocation] = useState({});
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = ({ deliveryBoyId, latitude, longitude }) => {
      setLiveLocation((prev) => ({
        ...prev,
        [deliveryBoyId]: { lat: latitude, lon: longitude },
      }));
    };

    socket.on("updateDeliveryLocation", handleLocationUpdate);

    return () => {
      socket.off("updateDeliveryLocation", handleLocationUpdate);
    };
  }, [socket]);

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div
          className="flex cursor-pointer items-center gap-3 rounded-full border border-emerald-100 bg-white/90 px-3 py-2 shadow-sm transition hover:shadow-md"
          onClick={() => navigate("/")}
        >
          <IoMdArrowRoundBack size={28} className="text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-800">Track Order</h1>
        </div>

        {!currentOrder?.shopOrders?.length ? (
          <div className="rounded-3xl border border-emerald-100 bg-white/95 p-8 text-center shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
            <p className="text-lg text-slate-600">No order details found.</p>
          </div>
        ) : (
          currentOrder.shopOrders.map((shopOrder, index) => {
            const deliveryBoyLocation = liveLocation[
              shopOrder.assignedDeliveryBoy?._id
            ] || {
              lat:
                shopOrder.assignedDeliveryBoy?.location?.coordinates?.[1] ?? 0,
              lon:
                shopOrder.assignedDeliveryBoy?.location?.coordinates?.[0] ?? 0,
            };

            const customerLocation = {
              lat: currentOrder?.deliveryAddress?.latitude ?? 0,
              lon: currentOrder?.deliveryAddress?.longitude ?? 0,
            };

            return (
              <div
                className="space-y-4 rounded-3xl border border-emerald-100 bg-white/95 p-5 shadow-[0_10px_30px_rgba(16,185,129,0.08)]"
                key={index}
              >
                <div>
                  <p className="mb-2 text-lg font-bold text-emerald-600">
                    {shopOrder.shop.name}
                  </p>

                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">Items:</span>{" "}
                    {shopOrder.shopOrderItems.map((i) => i.name).join(", ")}
                  </p>

                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">
                      Subtotal:
                    </span>{" "}
                    {shopOrder.subtotal}
                  </p>

                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">
                      Delivery Address:
                    </span>{" "}
                    {currentOrder?.deliveryAddress?.text}
                  </p>
                </div>

                {shopOrder.status !== "delivered" ? (
                  <>
                    {shopOrder.assignedDeliveryBoy ? (
                      <div className="rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-4 text-sm text-slate-700">
                        <p className="font-semibold text-slate-800">
                          <span className="text-emerald-600">
                            Delivery Boy:
                          </span>{" "}
                          {shopOrder.assignedDeliveryBoy.fullName}
                        </p>
                        <p className="font-semibold text-slate-700">
                          {shopOrder.assignedDeliveryBoy.mobile}
                        </p>
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                        Delivery Boy is not assigned
                      </p>
                    )}
                  </>
                ) : (
                  <p className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-lg font-semibold text-emerald-700">
                    Delivered
                  </p>
                )}

                {shopOrder.assignedDeliveryBoy &&
                  shopOrder.status !== "delivered" && (
                    <div className="h-[400px] w-full overflow-hidden rounded-3xl border border-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
                      <DeliveryBoyTracking
                        data={{
                          deliveryBoyLocation,
                          customerLocation,
                        }}
                      />
                    </div>
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TrackOrderPage;
