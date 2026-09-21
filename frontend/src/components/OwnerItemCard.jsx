import axios from "axios";
import React from "react";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function OwnerItemCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const result = await axios.get(
        `${serverURL}/api/item/delete/${data._id}`,
        { withCredentials: true },
      );
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-2 flex w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
      <div className="w-24 sm:w-36 shrink-0 bg-[linear-gradient(135deg,#f8fafc_0%,#f0fdf4_100%)]">
        <img src={data.image} alt={data.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-emerald-600 truncate">
            {data.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            <span className="font-medium text-slate-700">Category: </span>
            {data.category}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 capitalize">
            <span className="font-medium text-slate-700">Type: </span>
            {data.foodType}
          </p>
        </div>

        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <div className="text-xs sm:text-sm font-semibold text-slate-800">
            <span className="text-slate-500">Price: </span>₹{data.price}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="cursor-pointer rounded-full bg-emerald-50 p-1.5 sm:p-2 text-emerald-600 transition hover:bg-emerald-100"
              onClick={() => navigate(`/edit-item/${data._id}`)}
              title="Edit item"
            >
              <FaPen className="text-xs sm:text-base" />
            </div>

            <div
              className="cursor-pointer rounded-full bg-emerald-50 p-1.5 sm:p-2 text-rose-600 transition hover:bg-rose-100"
              onClick={handleDelete}
              title="Delete item"
            >
              <FaRegTrashAlt className="text-xs sm:text-base" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
