import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location.lat && location.lon) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location]);

  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apikey = import.meta.env.VITE_GEOAPIKEY;
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector(
    (state) => state.user,
  );
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const finalAmount = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    getAddressByLatLng(latitude, longitude);
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`,
      );
      dispatch(setAddress(result?.data?.results[0].formatted));
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}`,
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat: lat, lon: lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!addressInput.trim()) {
      showError("Delivery address is required");
      return;
    }
    if (!location?.lat || !location?.lon) {
      showError("Please select a valid delivery location");
      return;
    }

    try {
      const result = await axios.post(
        `${serverURL}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount: finalAmount,
          cartItems,
        },
        { withCredentials: true },
      );
      if (paymentMethod == "cod") {
        dispatch(addMyOrder(result.data));
        dispatch(clearCart());
        navigate("/order-placed", { replace: true });
      } else {
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      showError(error?.response?.data?.message || "Unable to place order");
      console.log(error);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZOR_APIKEY,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Food Bus",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverURL}/api/order/verify-payment`,
            { razorpay_payment_id: response.razorpay_payment_id, orderId },
            { withCredentials: true },
          );
          dispatch(addMyOrder(result.data));
          dispatch(clearCart());
          navigate("/order-placed", { replace: true });
        } catch (error) {
          console.error("Place Order Error:");
          console.error(error);

          return res.status(500).json({
            message: error.message,
          });
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-3 sm:p-6 pt-14 sm:pt-6">
      <div
        className="absolute left-3 top-3 sm:left-5 sm:top-5 z-10 cursor-pointer rounded-full bg-white/80 p-1.5 shadow-sm sm:shadow-none"
        onClick={() => navigate("/cart")}
      >
        <IoMdArrowRoundBack className="text-emerald-600 text-2xl sm:text-3xl" />
      </div>

      <div className="w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white/95 p-3.5 sm:p-6 shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)] space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Checkout
        </h1>

        <section>
          <h2 className="mb-2 flex items-center gap-1.5 text-base sm:text-lg font-semibold text-slate-800">
            <IoLocationSharp className="text-emerald-600" /> Delivery Location
          </h2>

          <div className="mb-2.5 flex gap-1.5 sm:gap-2">
            <input
              type="text"
              placeholder="Enter your delivery address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="flex-1 rounded-xl sm:rounded-2xl border border-emerald-100 bg-white px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              className="flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-3 py-1.5 sm:py-2 text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
              onClick={getLatLngByAddress}
            >
              <FaSearch className="text-sm sm:text-base" />
            </button>
            <button
              className="flex items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 px-3 py-1.5 sm:py-2 text-emerald-600 shadow-sm"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation className="text-sm sm:text-base" />
            </button>
          </div>

          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-emerald-100">
            <div className="flex h-44 sm:h-64 w-full items-center justify-center">
              <MapContainer
                className="h-full w-full"
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2.5 text-base sm:text-lg font-semibold text-slate-800">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 gap-2.5 sm:gap-4 sm:grid-cols-2">
            <div
              className={`flex items-center gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition cursor-pointer ${
                paymentMethod === "cod"
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_8px_20px_rgba(16,185,129,0.12)]"
                  : "border-emerald-100 bg-white hover:border-emerald-200"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-100 shrink-0">
                <MdDeliveryDining className="text-emerald-600 text-xl sm:text-2xl" />
              </span>
              <div>
                <p className="font-medium text-xs sm:text-sm text-slate-800">
                  Cash On Delivery
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition cursor-pointer ${
                paymentMethod === "online"
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_8px_20px_rgba(16,185,129,0.12)]"
                  : "border-emerald-100 bg-white hover:border-emerald-200"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-lime-100 shrink-0">
                <FaMobileAlt className="text-emerald-600 text-lg sm:text-xl" />
              </span>
              <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-lime-100 shrink-0">
                <CiCreditCard1 className="text-emerald-600 text-xl sm:text-2xl" />
              </span>
              <div>
                <p className="font-medium text-xs sm:text-sm text-slate-800">
                  UPI / Card Online
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Pay Securely Online
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2.5 text-base sm:text-lg font-semibold text-slate-800">
            Order Summary
          </h2>

          <div className="space-y-2 rounded-xl sm:rounded-2xl border border-emerald-100 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] p-3 sm:p-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs sm:text-sm text-slate-700"
              >
                <span className="truncate pr-2">
                  {item.name} x {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  ₹ {item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr className="my-2 border-emerald-100" />

            <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-800">
              <span>SubTotal</span>
              <span>₹ {totalAmount}</span>
            </div>

            <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-700">
              <span>Delivery Fee</span>
              <span>{deliveryFee == 0 ? "Free" : `₹ ${deliveryFee}`}</span>
            </div>

            <hr className="my-2 border-emerald-100" />

            <div className="flex justify-between pt-1 text-sm sm:text-base font-semibold text-emerald-600">
              <span>Total Amount</span>
              <span>₹ {finalAmount}</span>
            </div>
          </div>
        </section>

        <button
          className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
          onClick={handlePlaceOrder}
        >
          {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
