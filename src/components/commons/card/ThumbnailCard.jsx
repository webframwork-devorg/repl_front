import React from "react";

function ThumbnailCard({ image, title }) {

  return (
    <div
      className="relative w-full h-[450px] overflow-hidden shadow bg-[#2C2C2C] flex-shrink-0"
      style={{
        backgroundImage: `url(${image?.trim()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-3 text-white font-extrabold text-[20px] leading-snug">
          {title}
        </div>
    </div>
  );
}

export default ThumbnailCard;
