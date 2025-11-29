import React from "react";
import { useNavigate } from "react-router-dom";

function FeedHeader() {
  const navigate = useNavigate();

  const onFeedClick = () => {
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center w-full">
      <div className="text-2xl font-semibold text-white" onClick={onFeedClick}>
        피드
      </div>
    </header>
  );
}

export default FeedHeader;
