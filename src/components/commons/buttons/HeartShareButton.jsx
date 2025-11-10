// HeartShareButton.jsx (요청하신 컴포넌트)
import React from "react";
import HeartButton from "./HeartButton"; // 1단계에서 만든 자식 재사용
import ShareButtonIcon from "@/assets/images/share.svg";

/**
 * 하트 버튼과 공유 버튼을 묶어서 보여주는 컨테이너 컴포넌트
 * 이 컴포넌트는 상태나 로직을 가지지 않습니다.
 *
 * @param {object} props
 * @param {boolean} props.isLiked - 현재 좋아요 상태
 * @param {function} props.onHeartClick - 하트 버튼 클릭 시 실행될 함수
 * @param {function} props.onShareClick - 공유 버튼 클릭 시 실행될 함수
 */
function HeartShareButton({ isLiked, onHeartClick, onShareClick }) {
  return (
    <div className="flex items-center gap-1"> {/* 버튼들을 감싸는 div */}
      {/*
        1. 하트 버튼
        - isLiked 상태를 부모로부터 받아 HeartButton에 전달
        - onHeartClick 함수를 부모로부터 받아 HeartButton에 전달
      */}
      <HeartButton isLiked={isLiked} onClick={onHeartClick} />

      {/*
        2. 공유 버튼
        - onShareClick 함수를 부모로부터 받아 이 button의 onClick에 연결
      */}
      <button onClick={onShareClick} className="p-2">
        <img src={ShareButtonIcon} className="w-5 h-5"/>
      </button>
    </div>
  );
}

export default HeartShareButton;