import React from "react";
import MainCard from "@/components/commons/card/MainCard";
import SubCard from "@/components/commons/card/SubCard";

function CardList({ username, count, mainCard, subCards = [] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex px-[5px] justify-between text-[13px] font-semibold text-[#828282]">
        <span>@{username}</span>
        <span>{count}개</span>
      </div>
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
        <MainCard {...mainCard} />
        {subCards.map((card, idx) => (
          <SubCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}

export default CardList;
