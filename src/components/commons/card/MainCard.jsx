import React from "react";

function MainCard({ image, title, tags = [],  onClick }) {
  const displayedTags = tags.slice(0, 2);

  return (
    <div
      onClick={onClick}
      className="relative w-[240px] h-[320px] rounded-2xl overflow-hidden shadow bg-[#2C2C2C] flex-shrink-0"
      style={{
        backgroundImage: `url(${image?.trim()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-3">
        <div className="text-white font-extrabold text-[16px] leading-snug">
          {title}
        </div>
        <div className="text-[#b3b3b3] text-[13px] mt-1">
          {displayedTags.map((tag, index) => (
            <span key={index} className="mr-1">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainCard;
