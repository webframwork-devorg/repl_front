import React from "react";
import Hamburger from "@/assets/hamburger.svg";

function FeedHeader() {
  return (
    <header>
      <div class="text-2xl font-semibold text-white">피드</div>
      <div>
        <img src={Hamburger} />
      </div>
    </header>
  );
}

export default FeedHeader;
