import React from "react";
import HeartButton from "./HeartButton"; // 1단계에서 만든 자식 재사용
import PlusButtonIcon from "@/assets/images/plus.svg";

/**
 * 하트 버튼과 추가 버튼을 묶어서 보여주는 컨테이너 컴포넌트
 * 이 컴포넌트는 상태나 로직을 가지지 않습니다.
 *
 * @param {object} props
 * @param {boolean} props.isLiked - 현재 좋아요 상태
 * @param {function} props.onHeartClick - 하트 버튼 클릭 시 실행될 함수
 * @param {function} props.onPlusClick - 추가 버튼 클릭 시 실행될 함수
 */
function HeartPlusButton({ isLiked, onHeartClick, onPlusClick }) {
  return (
    <div className="flex items-center gap-3"> {/* 버튼들을 감싸는 div */}
      {/*
        1. 하트 버튼
        - isLiked 상태를 부모로부터 받아 HeartButton에 전달
        - onHeartClick 함수를 부모로부터 받아 HeartButton에 전달
      */}
      <HeartButton isLiked={isLiked} onClick={onHeartClick} />

      {/*
        2. 추가 버튼
        - onPlusClick 함수를 부모로부터 받아 이 button의 onClick에 연결
      */}
      <button onClick={onPlusClick} className="">
        <img src={PlusButtonIcon} className="w-5 h-5"/>
      </button>
    </div>
  );
}

export default HeartPlusButton;