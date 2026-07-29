import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverURL } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

function CreateEditShop() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user,
  );
  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || "",
  );
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [shopState, setShopState] = useState(
    myShopData?.state || currentState || "",
  );
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!myShopData) {
      setCity(currentCity || "");
      setShopState(currentState || "");
      setAddress(currentAddress || "");
    }
  }, [currentCity, currentState, currentAddress]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!backendImage && !myShopData?.image) {
      alert("Please upload a shop image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", shopState);
      formData.append("address", address);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverURL}/api/shop/create-edit`,
        formData,
        { withCredentials: true },
      );

      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="absolute left-[20px] top-[20px] z-[10] mb-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoMdArrowRoundBack size={35} className="text-emerald-600" />
      </div>

      <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white/95 p-8 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-emerald-50 p-4">
            <FaUtensils className="h-16 w-16 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Shop Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onChange={handleImage}
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt=""
                  className="h-48 w-full rounded-2xl border border-emerald-100 object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                type="text"
                placeholder="Enter City"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                State
              </label>
              <input
                type="text"
                placeholder="Enter State"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onChange={(e) => setShopState(e.target.value)}
                value={shopState}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter shop address"
              className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </div>

          <button
            className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-3 font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-200 hover:shadow-[0_10px_24px_rgba(16,185,129,0.3)]"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;
