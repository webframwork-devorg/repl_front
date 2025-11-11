// HeartButton.jsx (이름을 좀 더 명확하게 변경했습니다)
import React from "react";
import EmptyHeartIcon from "@/assets/images/emptyHeart.svg";
import HeartIcon from "@/assets/images/heart.svg";

/**
 * @param {object} props
 * @param {boolean} props.isLiked - 현재 좋아요 상태
 * @param {function} props.onClick - 클릭 시 호출될 함수
 */

function HeartButton({ isLiked, onClick }) {
  // isLiked 값에 따라 아이콘을 결정합니다.
  const heartIcon = isLiked ? HeartIcon : EmptyHeartIcon;

  return (
    <button
      onClick={onClick}
    >
      <img src={heartIcon} className="w-5 h-5" />
    </button>
  );
}

export default HeartButton;