import React from "react";

function SubCard({ image }) {
  return (
    <div
      //w-[210px] h-[280px]
      className="w-[175px] h-[280px] rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-[#2C2C2C]"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

export default SubCard;
