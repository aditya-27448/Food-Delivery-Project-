import React from "react";

function CategoryCard({ name, image, onClick }) {
  return (
    <div
      className="w-[92px] h-[92px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px] rounded-2xl sm:rounded-3xl border border-emerald-100 shrink-0 overflow-hidden bg-white shadow-[0_4px_16px_rgba(16,185,129,0.06)] sm:shadow-[0_10px_30px_rgba(16,185,129,0.08)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.14)] transition-all duration-300 relative cursor-pointer group"
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/85 via-emerald-900/60 to-transparent px-1.5 py-1.5 sm:px-3 sm:py-3 text-center backdrop-blur-[1px]">
        <span className="text-[11px] sm:text-sm font-semibold text-white truncate block line-clamp-1">{name}</span>
      </div>
    </div>
  );
}

export default CategoryCard;
