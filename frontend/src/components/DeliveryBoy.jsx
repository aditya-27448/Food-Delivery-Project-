import { useEffect, useState } from "react";
import Nav from "./Nav.jsx";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking.jsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClockLoader } from "react-spinners";

function DeliveryBoy() {
  const { userData, socket } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [orderDelivered, setOrderDelivered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") {
      return;
    }
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setDeliveryBoyLocation({
            lat: latitude,
            lon: longitude,
          });

          socket.emit("updateLocation", {
            latitude,
            longitude,
            userId: userData._id,
          });
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        },
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [socket, userData]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0,
  );

  const getAssignment = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/order/get-current-order`,
        { withCredentials: true },
      );
      setCurrentOrder(result.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCurrentOrder(null);
      } else {
        console.log(error);
      }
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverURL}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true },
      );
      await getCurrentOrder();
    } catch (error) {
      console.log("Accept order error", error);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/order/send-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true },
      );
      setLoading(false);
      setShowOtpBox(true);
      console.log("otp", result.data);
    } catch (error) {
      setLoading(false);
      console.log("Accept order error", error);
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    try {
      const result = await axios.post(
        `${serverURL}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true },
      );
      setOrderDelivered(true);
      console.log("otp", result.data);
      setMessage(result.data.message);
    } catch (error) {
      console.log("Accept order error", error);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/order/get-today-deliveries`,
        { withCredentials: true },
      );
      setTodayDeliveries(result.data);
      console.log("Todays Deliveries", result.data);
    } catch (error) {
      console.log("fetch todays order error :", error);
    }
  };

  const handleBack = async () => {
    setCurrentOrder(null);
    setOtp("");
    setShowOtpBox(false);
    setOrderDelivered(false);

    await getAssignment();
  };

  useEffect(() => {
    socket?.on("newAssignment", (data) => {
      if (data.sentTo == userData._id) {
        setAvailableAssignments((prev) => [...prev, data]);
      }
    });
    return () => {
      socket?.off("newAssignment");
    };
  }, [socket]);

  useEffect(() => {
    getAssignment();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] overflow-y-auto">
      <Nav />
      <div className="mt-20 w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.08)] p-5 flex flex-col justify-start items-center w-[90%] border border-emerald-100 text-center gap-2">
          <h1 className="text-xl font-bold text-emerald-600">
            Welcome, {userData.fullName}
          </h1>
          <p className="text-emerald-600">
            <span className="font-semibold">Latitude:</span>{" "}
            {deliveryBoyLocation?.lat ?? "Loading..."},{" "}
            <span className="font-semibold">Longitude:</span>{" "}
            {deliveryBoyLocation?.lon ?? "Loading..."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.08)] p-5 w-[90%] mb-6 border border-emerald-100">
          <h1 className="text-lg font-bold mb-3 text-emerald-600">
            Today Deliveries
          </h1>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>

          <div className="max-w-sm mx-auto mt-6 p-6 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] rounded-2xl shadow-sm text-center border border-emerald-100">
            <h1 className="text-xl font-semibold text-slate-800 mb-2">
              Today's Earning
            </h1>
            <span className="text-3xl font-bold text-emerald-600">
              ₹ {totalEarning}
            </span>
          </div>
        </div>

        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(16,185,129,0.08)] w-[90%] border border-emerald-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              Available Orders
            </h1>

            <div className="space-y-4">
              {availableAssignments.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border border-emerald-100 rounded-lg p-4 flex justify-between items-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)]"
                    key={index}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {a.shopName}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {a.deliveryAddress.text}
                      </p>
                      <p className="text-sm text-slate-500">
                        {a.items.length} Items | {a.subtotal}
                      </p>
                    </div>
                    <button
                      className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-4 py-1 rounded-lg text-sm shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(16,185,129,0.08)] w-[90%] border border-emerald-100">
            <h2 className="text-lg font-bold mb-3 text-slate-800">
              📦 Current Order
            </h2>
            <div className="border border-emerald-100 rounded-lg p-4 mb-3 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)]">
              <p className="font-semibold text-sm text-slate-800">
                {currentOrder?.shopOrder.shop.name}
              </p>
              <p className="text-sm text-slate-600">
                {currentOrder?.deliveryAddress.text}
              </p>
              <p className="text-sm text-slate-500">
                {currentOrder.shopOrder.shopOrderItems.length} items |{" "}
                {currentOrder?.shopOrder.subtotal}
              </p>
            </div>

            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData.location.coordinates[1],
                  lon: userData.location.coordinates[0],
                },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude,
                },
              }}
            />

            {orderDelivered ? (
              <div className="mt-4 flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold text-emerald-600">
                  ✅ Order Delivered Successfully
                </h1>

                <button
                  onClick={handleBack}
                  className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-6 py-2 rounded-xl shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
                >
                  Back
                </button>
              </div>
            ) : !showOtpBox ? (
              <button
                className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-semibold py-2 px-4 rounded-xl shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)] active:scale-95 transition-all duration-200"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ClockLoader size={20} color="white" />
                ) : (
                  "Mark As Delivered"
                )}
              </button>
            ) : (
              <div className="mt-4 p-4 border border-emerald-100 rounded-xl bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)]">
                <p className="text-sm font-semibold mb-2 text-slate-800">
                  Enter OTP sent to{" "}
                  <span className="text-emerald-600">
                    {currentOrder.user.fullName}
                  </span>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border border-emerald-200 px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-slate-700"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
                <button
                  className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white py-2 rounded-lg shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition-all"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;