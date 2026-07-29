import React from "react";

function CategoryCard({ name, image, onClick }) {
  return (
    <div
      className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-3xl border border-emerald-100 shrink-0 overflow-hidden bg-white shadow-[0_10px_30px_rgba(16,185,129,0.08)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.14)] transition-all duration-300 relative cursor-pointer"
      onClick={onClick}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-600/90 via-emerald-600/70 to-transparent px-3 py-3 text-center backdrop-blur-sm">
        <span className="text-sm font-semibold text-white">{name}</span>
      </div>
    </div>
  );
}

export default CategoryCard;
