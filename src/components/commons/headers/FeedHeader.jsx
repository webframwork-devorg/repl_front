import React from "react";
import Hamburger from "@/assets/images/hamburger.svg";
import { useNavigate } from "react-router-dom";

function FeedHeader() {

  const navigate = useNavigate();

  const onFeedClick = () => {
    navigate("/");
  }

  const onHamburgerClick = () => {
    console.log("메뉴 열기");
  }

  return (
    <header className="flex justify-between items-center w-full">
      <div class="text-2xl font-semibold text-white" onClick={onFeedClick}>피드</div>
      <div onClick={onHamburgerClick}>
        <img src={Hamburger} />
      </div>
    </header>
  );
}

export default FeedHeader;
