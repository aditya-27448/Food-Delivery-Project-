import React, { useState } from "react";

import { FaLeaf, FaPlus } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { FaStar, FaRegStar, FaMinus, FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);
  const { cartItems } = useSelector((state) => state.user);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        ),
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };
  return (
    <div className=" w-62.5 rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ">
      <div className="relative w-full h-42.5 flex justify-center items-center bg-white ">
        <div className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md bg-white">
          {data.foodType == "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <GiChickenLeg className="text-red-600 text-lg" />
          )}
        </div>
        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      {/* Rating */}
      <div className="flex flex-1 flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span>{data.rating?.count || 0}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mt-auto p-4">
        <span className=" font-bold text-gray-900 text-lg">{data.price}</span>
        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <button
            className="px-2 py-1 hover:bg-gray-100 transition"
            onClick={handleDecrease}
          >
            <FaMinus size={12} />
          </button>
          <span>{quantity}</span>
          <button
            className="px-2 py-1 hover:bg-gray-100 transition"
            onClick={handleIncrease}
          >
            <FaPlus size={12} />
          </button>
          <button
            className={`${cartItems.some((i) => i.id == data._id) ? "bg-gray-800" : "bg-[#ff4d2d]"}  text-white px-3 py-2 transition-colors`}
            onClick={() => {
              quantity > 0
                ? dispatch(
                    addToCart({
                      id: data._id,
                      name: data.name,
                      price: data.price,
                      image: data.image,
                      shop: data.shop,
                      quantity,
                      foodType: data.foodType,
                    }),
                  )
                : null;
            }}
          >
            <FaCartShopping />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
