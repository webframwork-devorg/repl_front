import React from "react";

function SubCard({ imageUrl }) {
  return (
    <div
      //w-[210px] h-[280px]
      className="w-[240px] h-[320px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-[#2C2C2C]"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

export default SubCard;
