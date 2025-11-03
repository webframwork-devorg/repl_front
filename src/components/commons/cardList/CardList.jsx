import React from "react";
import MainCard from "@/components/commons/card/MainCard";
import SubCard from "@/components/commons/card/SubCard";

function CardList({ username, count, mainCard, subCards = [], onClick }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-start items-center gap-[7px] text-[13px] font-semibold text-[#828282]">
        <span>@{username}</span>
        <div className="w-[1.5px] h-[12px] bg-[#828282]" />
        <span>{count}개</span>
      </div>
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
        <MainCard {...mainCard} onClick={onClick} />{" "}
        {subCards.map((card, idx) => (
          <SubCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}

export default CardList;
